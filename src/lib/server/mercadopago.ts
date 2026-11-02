import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { env } from "./env";

/**
 * Integración con Mercado Pago (Checkout Pro).
 * El cliente paga en la página segura de Mercado Pago: este sitio nunca recibe datos de tarjetas.
 * Requiere MERCADOPAGO_ACCESS_TOKEN (credenciales de producción de la cuenta del equipo).
 */
const API = process.env.MERCADOPAGO_API_URL || "https://api.mercadopago.com"; // se puede cambiar solo para pruebas

async function mp<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(API + path, {
    ...init,
    headers: { Authorization: `Bearer ${env.mpAccessToken}`, "Content-Type": "application/json", ...(init?.headers ?? {}) },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Mercado Pago ${res.status}: ${await res.text()}`);
  return res.json() as Promise<T>;
}

export async function crearPreferencia(opts: {
  pedidoId: string;
  numero: string;
  items: { id: string; title: string; quantity: number; unit_price: number }[];
  payer: { name: string; email: string };
  baseUrl: string;
}) {
  const back = `${opts.baseUrl}/tienda/pedido/${opts.pedidoId}`;
  const pref = await mp<{ id: string; init_point: string }>("/checkout/preferences", {
    method: "POST",
    headers: { "X-Idempotency-Key": opts.pedidoId },
    body: JSON.stringify({
      items: opts.items.map((i) => ({ ...i, currency_id: "CLP" })),
      payer: opts.payer,
      external_reference: opts.pedidoId,
      back_urls: { success: back, failure: back, pending: back },
      auto_return: "approved",
      notification_url: `${opts.baseUrl}/api/pagos/mercadopago`,
      statement_descriptor: "TRITOTAL TEAM",
      metadata: { numero: opts.numero },
    }),
  });
  return pref.init_point;
}

export type MpPayment = {
  id: number;
  status: "approved" | "pending" | "in_process" | "rejected" | "cancelled" | "refunded" | "charged_back" | string;
  external_reference: string | null;
  transaction_amount: number;
  currency_id: string;
};

export const obtenerPago = (id: string) => mp<MpPayment>(`/v1/payments/${encodeURIComponent(id)}`);

/** Busca el último pago asociado a un pedido (por si el aviso de Mercado Pago aún no llega). */
export async function buscarPagoDePedido(pedidoId: string) {
  const r = await mp<{ results: MpPayment[] }>(
    `/v1/payments/search?external_reference=${encodeURIComponent(pedidoId)}&sort=date_created&criteria=desc&limit=1`,
  );
  return r.results[0] ?? null;
}

/**
 * Verifica la firma del aviso (webhook) si se configuró MERCADOPAGO_WEBHOOK_SECRET.
 * Formato: x-signature "ts=...,v1=..." sobre "id:{data.id};request-id:{x-request-id};ts:{ts};"
 */
export function firmaValida(signature: string | null, requestId: string | null, dataId: string) {
  if (!env.mpWebhookSecret) return true;
  if (!signature) return false;
  const parts = Object.fromEntries(signature.split(",").map((p) => p.trim().split("=") as [string, string]));
  if (!parts.ts || !parts.v1) return false;
  const manifest = `id:${dataId.toLowerCase()};${requestId ? `request-id:${requestId};` : ""}ts:${parts.ts};`;
  const expected = createHmac("sha256", env.mpWebhookSecret).update(manifest).digest("hex");
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(parts.v1));
  } catch {
    return false;
  }
}
