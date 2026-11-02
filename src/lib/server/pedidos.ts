import "server-only";
import { supabaseAdmin } from "./supabase";
import { sendMail, escapeHtml } from "./mail";
import { env } from "./env";
import { site } from "@/config/site";
import type { MpPayment } from "./mercadopago";

const clp = (n: number) => new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(n);

type Pedido = {
  id: string; numero: string; estado: string; nombre: string; email: string; telefono: string;
  entrega: string; direccion: string | null; comuna: string | null; notas: string | null;
  items: { nombre: string; talla: string; cantidad: number; precio: number }[]; total: number;
};

export function resumenPedidoHtml(p: Pedido) {
  const rows = p.items
    .map((i) => `<tr><td>${escapeHtml(i.nombre)} (${escapeHtml(i.talla)})</td><td align="center">${i.cantidad}</td><td align="right">${clp(i.precio * i.cantidad)}</td></tr>`)
    .join("");
  return `<table cellpadding="6" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">
    ${rows}<tr><td colspan="2"><b>Total</b></td><td align="right"><b>${clp(p.total)}</b></td></tr></table>
    <p style="font-family:Arial,sans-serif;font-size:14px">Entrega: ${p.entrega === "retiro" ? "Retiro (se coordina por WhatsApp)" : `Despacho a ${escapeHtml(p.direccion ?? "")}, ${escapeHtml(p.comuna ?? "")}`}</p>`;
}

/**
 * Aplica el resultado de un pago de Mercado Pago a su pedido.
 * Es idempotente: si el pedido ya estaba pagado no vuelve a descontar stock ni enviar correos.
 */
export async function aplicarPago(pago: MpPayment) {
  const db = supabaseAdmin();
  if (!db || !pago.external_reference) return;
  const { data: p } = await db.from("pedidos").select("*").eq("id", pago.external_reference).maybeSingle();
  if (!p) return;
  const pedido = p as Pedido & { pagado_en: string | null };

  if (pago.status === "approved") {
    if (pago.currency_id !== "CLP" || Math.round(pago.transaction_amount) !== pedido.total) {
      console.error("[pagos] monto no coincide", pedido.numero, pago.transaction_amount, pedido.total);
      await db.from("pedidos").update({ pago_id: String(pago.id), pago_estado: "monto_no_coincide" }).eq("id", pedido.id);
      return;
    }
    // Solo el primer aviso aprobado cambia el estado (evita doble descuento de stock).
    const { data: upd } = await db
      .from("pedidos")
      .update({ estado: "pagado", pago_id: String(pago.id), pago_estado: pago.status, pagado_en: new Date().toISOString() })
      .eq("id", pedido.id)
      .eq("estado", "pendiente_pago")
      .select("id");
    if (!upd?.length) return;
    await db.rpc("descontar_stock", { p_pedido: pedido.id });
    const html = resumenPedidoHtml(pedido);
    await Promise.all([
      sendMail(env.adminEmail, `Nueva compra ${pedido.numero}: ${pedido.nombre}`, `<h2>Pedido pagado ${pedido.numero}</h2><p>${escapeHtml(pedido.nombre)} · ${escapeHtml(pedido.telefono)} · ${escapeHtml(pedido.email)}</p>${html}`, pedido.email),
      sendMail(pedido.email, `Tu compra en ${site.name} (${pedido.numero})`, `<p>¡Gracias, ${escapeHtml(pedido.nombre.split(" ")[0])}! Recibimos el pago de tu pedido <b>${pedido.numero}</b>. Te contactaremos para coordinar la entrega.</p>${html}`),
    ]);
  } else if (["rejected", "cancelled"].includes(pago.status)) {
    await db.from("pedidos").update({ estado: "rechazado", pago_id: String(pago.id), pago_estado: pago.status }).eq("id", pedido.id).eq("estado", "pendiente_pago");
  } else {
    await db.from("pedidos").update({ pago_id: String(pago.id), pago_estado: pago.status }).eq("id", pedido.id).eq("estado", "pendiente_pago");
  }
}
