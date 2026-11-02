/** Tipos y utilidades de la tienda (compartidos entre cliente y servidor). */

export type Variante = { talla: string; stock: number | null };

export type Producto = {
  id: string;
  nombre: string;
  descripcion: string | null;
  categoria: string;
  precio: number;
  imagen_url: string | null;
  variantes: Variante[];
};

export type CartItem = {
  producto_id: string;
  talla: string;
  cantidad: number;
  // Solo para mostrar; el servidor recalcula precios y nombres.
  nombre: string;
  precio: number;
  imagen_url: string | null;
};

export const MAX_POR_ITEM = 10;

export function stockDe(p: Pick<Producto, "variantes">, talla: string) {
  const v = p.variantes.find((x) => x.talla === talla);
  if (!v) return 0;
  return v.stock === null ? Infinity : v.stock;
}

export const agotado = (p: Pick<Producto, "variantes">) => p.variantes.every((v) => v.stock !== null && v.stock <= 0);

/** "S: 5\nM: 3\nÚnica" → [{talla:"S",stock:5},…]. Sin número = sin control de stock. */
export function parseVariantes(text: string): Variante[] {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const m = l.match(/^(.+?)\s*[:=]\s*(\d+)\s*$/);
      return m ? { talla: m[1].trim(), stock: Number(m[2]) } : { talla: l, stock: null };
    });
}

export const variantesATexto = (v: Variante[] | null | undefined) =>
  (v ?? []).map((x) => (x.stock === null ? x.talla : `${x.talla}: ${x.stock}`)).join("\n");

export const estadoPedidoLabel: Record<string, string> = {
  pendiente_pago: "Pendiente de pago",
  pagado: "Pagado",
  preparando: "En preparación",
  entregado: "Entregado",
  cancelado: "Cancelado",
  rechazado: "Pago rechazado",
};
