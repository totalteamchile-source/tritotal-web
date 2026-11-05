import { NextResponse, type NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabase";
import { rateLimited } from "@/lib/server/rateLimit";
import { BUCKET_DIGITAL, ESTADOS_PAGADOS } from "@/lib/server/descargas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

/** Mensaje simple en HTML para quien abre el enlace desde el correo. */
function aviso(status: number, titulo: string, texto: string, pedidoId?: string) {
  const volver = pedidoId ? `<p><a href="/tienda/pedido/${pedidoId}">Ver mi pedido</a></p>` : "";
  return new NextResponse(
    `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${titulo}</title>` +
      `<body style="font-family:system-ui,sans-serif;background:#05090b;color:#fff;padding:48px 20px;max-width:560px;margin:auto;line-height:1.5">` +
      `<h1 style="font-size:24px">${titulo}</h1><p style="color:#a9bcc1">${texto}</p>${volver}</body>`,
    { status, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store", "x-robots-tag": "noindex" } },
  );
}

/**
 * Entrega un PDF comprado. Solo funciona si el pedido está pagado y contiene ese producto.
 * El archivo vive en un bucket privado; se redirige a un enlace firmado que vence en 2 minutos.
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ pedido: string; producto: string }> }) {
  const { pedido, producto } = await params;
  if (!UUID.test(pedido) || !UUID.test(producto)) return aviso(404, "Enlace no válido", "Revisa que el enlace esté completo.");
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (rateLimited("descarga:" + ip, 30)) return aviso(429, "Demasiadas descargas", "Espera unos minutos e intenta de nuevo.");

  const db = supabaseAdmin();
  if (!db) return aviso(503, "Descarga no disponible", "La tienda aún no está habilitada.");

  const { data: p } = await db.from("pedidos").select("id,estado,items").eq("id", pedido).maybeSingle<{ id: string; estado: string; items: { producto_id: string; digital?: boolean }[] }>();
  if (!p || !p.items.some((i) => i.producto_id === producto && i.digital)) return aviso(404, "Enlace no válido", "No encontramos esta compra.");
  if (!ESTADOS_PAGADOS.includes(p.estado))
    return aviso(403, "Pago pendiente", "La descarga se habilita cuando se confirma el pago. Si ya pagaste, espera unos minutos y vuelve a intentar.", p.id);

  const { data: prod } = await db.from("productos").select("nombre,archivo").eq("id", producto).maybeSingle<{ nombre: string; archivo: string | null }>();
  if (!prod?.archivo)
    return aviso(404, "Archivo en preparación", "Tu pago está confirmado, pero el archivo aún no está cargado. Te lo enviaremos por correo; también puedes escribirnos por WhatsApp.", p.id);

  const nombre = prod.nombre.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^\w]+/g, "-").replace(/^-|-$/g, "") + ".pdf";
  const { data: signed, error } = await db.storage.from(BUCKET_DIGITAL).createSignedUrl(prod.archivo, 120, { download: nombre });
  if (error || !signed) {
    console.error("[descargas]", error?.message);
    return aviso(500, "No pudimos preparar la descarga", "Intenta de nuevo en unos minutos.", p.id);
  }
  return NextResponse.redirect(signed.signedUrl, { status: 303, headers: { "cache-control": "no-store" } });
}
