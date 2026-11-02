import { NextResponse, type NextRequest } from "next/server";
import { isMpConfigured } from "@/lib/server/env";
import { obtenerPago, firmaValida } from "@/lib/server/mercadopago";
import { aplicarPago } from "@/lib/server/pedidos";

export const runtime = "nodejs";

/**
 * Aviso (webhook) de Mercado Pago. No se confía en el contenido del aviso:
 * se consulta el pago directamente a la API de Mercado Pago antes de marcar el pedido.
 */
export async function POST(req: NextRequest) {
  if (!isMpConfigured()) return NextResponse.json({ ok: false }, { status: 503 });
  const body = await req.json().catch(() => ({}));
  const type = body?.type ?? req.nextUrl.searchParams.get("type") ?? req.nextUrl.searchParams.get("topic");
  const id = String(body?.data?.id ?? req.nextUrl.searchParams.get("data.id") ?? req.nextUrl.searchParams.get("id") ?? "");
  if (type !== "payment" || !/^\d+$/.test(id)) return NextResponse.json({ ok: true, ignored: true });

  if (!firmaValida(req.headers.get("x-signature"), req.headers.get("x-request-id"), req.nextUrl.searchParams.get("data.id") ?? id)) {
    return NextResponse.json({ ok: false, error: "firma inválida" }, { status: 401 });
  }
  try {
    await aplicarPago(await obtenerPago(id));
  } catch (e) {
    console.error("[webhook mp]", (e as Error).message);
    return NextResponse.json({ ok: false }, { status: 500 }); // Mercado Pago reintentará
  }
  return NextResponse.json({ ok: true });
}
