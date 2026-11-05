import { NextResponse, type NextRequest } from "next/server";
import { randomBytes } from "node:crypto";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/server/supabase";
import { isMpConfigured } from "@/lib/server/env";
import { crearPreferencia } from "@/lib/server/mercadopago";
import { rateLimited } from "@/lib/server/rateLimit";
import { stockDe, MAX_POR_ITEM, type Producto } from "@/lib/shop";

export const runtime = "nodejs";

const schema = z
  .object({
    nombre: z.string().trim().min(3, "Ingresa tu nombre completo.").max(120),
    email: z.string().trim().toLowerCase().email("Correo no válido.").max(160),
    telefono: z.string().trim().refine((v) => v.replace(/\D/g, "").length >= 8, "Teléfono no válido.").pipe(z.string().max(25)),
    entrega: z.enum(["retiro", "despacho", "digital"], { error: "Elige cómo recibir tu pedido." }),
    direccion: z.string().trim().max(200).optional(),
    comuna: z.string().trim().max(80).optional(),
    notas: z.string().trim().max(500).optional(),
    items: z
      .array(z.object({ producto_id: z.string().uuid(), talla: z.string().max(40), cantidad: z.number().int().min(1).max(MAX_POR_ITEM) }))
      .min(1, "Tu carrito está vacío.")
      .max(30),
  });

const numero = () => "P-" + Array.from(randomBytes(6), (b) => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[b % 32]).join("");

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (rateLimited("pedido:" + ip, 10)) return NextResponse.json({ ok: false, error: "Demasiados intentos. Espera unos minutos." }, { status: 429 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const i of parsed.error.issues) errors[String(i.path[0] ?? "form")] ??= i.message;
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }
  const d = parsed.data;
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ ok: false, error: "La tienda aún no está habilitada." }, { status: 503 });

  // Precios, nombres y stock se toman SIEMPRE de la base de datos, nunca del navegador.
  const ids = [...new Set(d.items.map((i) => i.producto_id))];
  const { data: prods, error } = await db.from("productos").select("id,nombre,precio,variantes,activo,digital").in("id", ids);
  if (error) return NextResponse.json({ ok: false, error: "No pudimos procesar el pedido." }, { status: 500 });

  const items: { producto_id: string; nombre: string; talla: string; cantidad: number; precio: number; digital?: true }[] = [];
  for (const it of d.items) {
    const p = (prods ?? []).find((x) => x.id === it.producto_id) as (Producto & { activo: boolean }) | undefined;
    if (!p || !p.activo) return NextResponse.json({ ok: false, error: "Un producto de tu carrito ya no está disponible." }, { status: 409 });
    if (!p.variantes.some((v) => v.talla === it.talla)) return NextResponse.json({ ok: false, error: `La talla ${it.talla} de ${p.nombre} ya no está disponible.` }, { status: 409 });
    const pedidoTotalTalla = d.items.filter((x) => x.producto_id === it.producto_id && x.talla === it.talla).reduce((a, x) => a + x.cantidad, 0);
    if (stockDe(p, it.talla) < pedidoTotalTalla)
      return NextResponse.json({ ok: false, error: `No hay stock suficiente de ${p.nombre} talla ${it.talla}.` }, { status: 409 });
    if (p.digital) {
      // Un PDF se compra una vez: una sola unidad por pedido.
      if (items.some((x) => x.producto_id === p.id)) continue;
      items.push({ producto_id: p.id, nombre: p.nombre, talla: it.talla, cantidad: 1, precio: p.precio, digital: true });
    } else {
      items.push({ producto_id: p.id, nombre: p.nombre, talla: it.talla, cantidad: it.cantidad, precio: p.precio });
    }
  }
  // La forma de entrega se decide en el servidor: si todo es digital, no hay retiro ni despacho.
  const soloDigital = items.every((i) => i.digital);
  const entrega = soloDigital ? "digital" : d.entrega === "despacho" ? "despacho" : "retiro";
  if (!soloDigital && d.entrega === "digital") return NextResponse.json({ ok: false, errors: { entrega: "Elige cómo recibir tu pedido." } }, { status: 422 });
  if (entrega === "despacho" && !(d.direccion && d.comuna))
    return NextResponse.json({ ok: false, errors: { direccion: "Ingresa dirección y comuna para el despacho." } }, { status: 422 });
  const total = items.reduce((a, i) => a + i.precio * i.cantidad, 0);

  const pedido = {
    numero: numero(),
    nombre: d.nombre,
    email: d.email,
    telefono: d.telefono,
    entrega,
    direccion: entrega === "despacho" ? d.direccion : null,
    comuna: entrega === "despacho" ? d.comuna : null,
    notas: d.notas || null,
    items,
    total,
    proveedor: isMpConfigured() ? "mercadopago" : "whatsapp",
  };
  const { data: created, error: e2 } = await db.from("pedidos").insert(pedido).select("id,numero").single();
  if (e2 || !created) return NextResponse.json({ ok: false, error: "No pudimos crear el pedido." }, { status: 500 });

  if (!isMpConfigured()) {
    // Sin pasarela configurada: el pedido queda registrado y el pago se coordina por WhatsApp.
    return NextResponse.json({ ok: true, id: created.id, numero: created.numero, redirect: `/tienda/pedido/${created.id}` });
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
    const url = await crearPreferencia({
      pedidoId: created.id,
      numero: created.numero,
      items: items.map((i) => ({ id: i.producto_id, title: i.digital ? `${i.nombre} (PDF)` : `${i.nombre} (${i.talla})`, quantity: i.cantidad, unit_price: i.precio })),
      payer: { name: d.nombre, email: d.email },
      baseUrl,
    });
    return NextResponse.json({ ok: true, id: created.id, numero: created.numero, redirect: url });
  } catch (e) {
    console.error("[pedidos] Mercado Pago", (e as Error).message);
    await db.from("pedidos").update({ estado: "cancelado", pago_estado: "error_pasarela" }).eq("id", created.id);
    return NextResponse.json({ ok: false, error: "No pudimos conectar con Mercado Pago. Intenta de nuevo en unos minutos." }, { status: 502 });
  }
}
