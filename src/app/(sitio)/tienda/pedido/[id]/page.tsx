import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/server/supabase";
import { isMpConfigured } from "@/lib/server/env";
import { buscarPagoDePedido } from "@/lib/server/mercadopago";
import { aplicarPago } from "@/lib/server/pedidos";
import { estadoPedidoLabel } from "@/lib/shop";
import { formatCLP } from "@/content/plans";
import { whatsappLink } from "@/lib/whatsapp";
import { Section } from "@/components/ui";
import { WhatsAppIcon } from "@/components/Icons";
import { ClearCart } from "./ClearCart";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Tu pedido", robots: { index: false } };

type Item = { producto_id: string; nombre: string; talla: string; cantidad: number; precio: number; digital?: boolean };

// `extra` cambia la consulta para que Next no reutilice la respuesta anterior dentro del mismo render.
async function cargar(id: string, extra = "") {
  const { data } = await supabaseAdmin()!.from("pedidos").select("id,numero,estado,nombre,total,items,entrega,proveedor" + extra).eq("id", id).maybeSingle<{
    id: string; numero: string; estado: string; nombre: string; total: number; items: unknown; entrega: string; proveedor: string;
  }>();
  return data;
}

export default async function PedidoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id) || !supabaseAdmin()) notFound();
  let p = await cargar(id);
  if (!p) notFound();

  // Al volver de Mercado Pago, consultamos el pago por si el aviso aún no llega.
  if (p.estado === "pendiente_pago" && p.proveedor === "mercadopago" && isMpConfigured()) {
    try {
      const pago = await buscarPagoDePedido(id);
      if (pago) {
        await aplicarPago(pago);
        p = (await cargar(id, ",pago_estado")) ?? p;
      }
    } catch (e) {
      console.error("[pedido]", (e as Error).message);
    }
  }

  const pagado = ["pagado", "preparando", "entregado"].includes(p.estado);
  const items = p.items as Item[];
  const digitales = items.filter((i) => i.digital);
  const soloDigital = digitales.length === items.length;
  const porWhatsapp = p.proveedor === "whatsapp" && p.estado === "pendiente_pago";
  const msg = `Hola, hice el pedido ${p.numero} en la tienda de Tritotal Team por ${formatCLP(p.total)}.${porWhatsapp ? " ¿Cómo realizo el pago?" : ""}`;

  return (
    <Section className="pt-28 lg:pt-36">
      {(pagado || porWhatsapp) && <ClearCart />}
      <div className="mx-auto max-w-2xl rounded-sm border border-white/10 bg-petrol-950 p-8 sm:p-10">
        <p className="font-display text-sm font-bold uppercase tracking-[0.3em] text-sport">Pedido {p.numero}</p>
        <h1 className="mt-2 font-display text-4xl font-extrabold uppercase">
          {pagado ? "¡Gracias por tu compra!" : p.estado === "rechazado" ? "El pago no se completó" : porWhatsapp ? "Pedido recibido" : "Esperando confirmación del pago"}
        </h1>
        <p className="mt-3 text-mist">
          {pagado
            ? soloDigital
              ? "Recibimos tu pago. Descarga tu PDF aquí abajo; también te enviamos el enlace por correo."
              : digitales.length
                ? "Recibimos tu pago. Descarga tu PDF aquí abajo; para el resto del pedido te contactaremos para coordinar la entrega."
                : "Recibimos tu pago. Te contactaremos para coordinar la entrega."
            : p.estado === "rechazado"
              ? "Mercado Pago no aprobó el pago. Puedes intentarlo de nuevo desde tu carrito."
              : porWhatsapp
                ? soloDigital
                  ? "Escríbenos por WhatsApp para coordinar el pago. Al confirmarlo te enviamos el PDF."
                  : "Escríbenos por WhatsApp para coordinar el pago y la entrega."
                : "Si ya pagaste, la confirmación puede tardar unos minutos. Actualiza esta página en un momento."}
        </p>
        <p className="mt-4 inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider">{estadoPedidoLabel[p.estado] ?? p.estado}</p>

        <ul className="mt-8 divide-y divide-white/10 border-y border-white/10 text-sm">
          {items.map((i, k) => (
            <li key={k} className="flex justify-between gap-4 py-3">
              <span>{i.cantidad} × {i.nombre} ({i.digital ? "PDF" : i.talla})</span>
              <span>{formatCLP(i.precio * i.cantidad)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 flex justify-between font-display text-2xl font-bold"><span>Total</span><span className="text-sport">{formatCLP(p.total)}</span></p>

        {pagado && digitales.length > 0 && (
          <div className="mt-8 space-y-3">
            {digitales.map((i) => (
              <a
                key={i.producto_id}
                href={`/api/descargas/${p.id}/${i.producto_id}`}
                className="flex items-center justify-between gap-4 rounded-sm bg-sport px-6 py-4 font-display font-bold uppercase tracking-wider text-ink hover:bg-sport-600"
              >
                <span>Descargar {i.nombre}</span>
                <span aria-hidden>↓</span>
              </a>
            ))}
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a href={whatsappLink(msg)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#25D366] px-6 py-3.5 font-display font-bold uppercase tracking-wider text-ink">
            <WhatsAppIcon className="h-5 w-5" /> Escribir por WhatsApp
          </a>
          {p.estado === "rechazado" ? (
            <Link href="/tienda/carrito" className="rounded-sm border border-white/40 px-6 py-3.5 text-center font-display font-bold uppercase tracking-wider">Volver al carrito</Link>
          ) : (
            <Link href="/tienda" className="rounded-sm border border-white/40 px-6 py-3.5 text-center font-display font-bold uppercase tracking-wider">Seguir comprando</Link>
          )}
        </div>
      </div>
    </Section>
  );
}
