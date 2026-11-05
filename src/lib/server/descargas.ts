import "server-only";
import { site } from "@/config/site";

export const BUCKET_DIGITAL = "productos-digitales";
export const ESTADOS_PAGADOS = ["pagado", "preparando", "entregado"];

/** Enlace de descarga de un producto digital. El id del pedido es secreto y solo lo conoce el comprador. */
export const enlaceDescarga = (pedidoId: string, productoId: string) =>
  `${site.url}/api/descargas/${pedidoId}/${productoId}`;
