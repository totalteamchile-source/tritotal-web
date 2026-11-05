"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/shop/CartProvider";
import { MAX_POR_ITEM, stockDe, type Producto } from "@/lib/shop";
import { whatsappLink } from "@/lib/whatsapp";
import { formatCLP } from "@/content/plans";
import { WhatsAppIcon } from "@/components/Icons";

/** `canOrder` es falso cuando la tienda en línea aún no está habilitada: se compra por WhatsApp. */
export function AddToCart({ p, canOrder = true }: { p: Producto; canOrder?: boolean }) {
  const { add, items } = useCart();
  const disponibles = p.variantes.filter((v) => v.stock === null || v.stock > 0);
  const [talla, setTalla] = useState(disponibles.length === 1 ? disponibles[0].talla : "");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");

  const enCarrito = items.filter((i) => i.producto_id === p.id && i.talla === talla).reduce((a, i) => a + i.cantidad, 0);
  const max = talla ? Math.min(MAX_POR_ITEM, stockDe(p, talla) - enCarrito) : MAX_POR_ITEM;
  const soloUnica = p.variantes.length === 1;

  const enCarritoDigital = p.digital && items.some((i) => i.producto_id === p.id);

  if (!canOrder)
    return (
      <div className="mt-8 space-y-3">
        <a
          href={whatsappLink(`Hola, quiero comprar «${p.nombre}» (${formatCLP(p.precio)}) de la tienda de Tritotal Team.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-sm bg-[#25D366] px-8 py-4 font-display text-lg font-bold uppercase tracking-wider text-ink"
        >
          <WhatsAppIcon className="h-5 w-5" /> Comprar por WhatsApp
        </a>
        <p className="text-sm text-mist">Coordinamos el pago contigo y te enviamos {p.digital ? "el PDF por correo" : "el detalle de la entrega"}.</p>
      </div>
    );

  if (p.digital)
    return (
      <div className="mt-8 space-y-4">
        <p className="text-sm text-mist">Formato PDF. Recibes el enlace de descarga apenas se confirma el pago.</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          {!enCarritoDigital && !added && (
            <button type="button" onClick={() => { add({ producto_id: p.id, talla: p.variantes[0]?.talla ?? "PDF", cantidad: 1, nombre: p.nombre, precio: p.precio, imagen_url: p.imagen_url, digital: true }); setAdded(true); }} className="rounded-sm bg-sport px-8 py-4 font-display text-lg font-bold uppercase tracking-wider text-ink hover:bg-sport-600">
              Agregar al carrito
            </button>
          )}
          {(enCarritoDigital || added) && (
            <Link href="/tienda/carrito" className="rounded-sm bg-sport px-8 py-4 text-center font-display text-lg font-bold uppercase tracking-wider text-ink hover:bg-sport-600">
              Ir al carrito y pagar →
            </Link>
          )}
        </div>
        {(enCarritoDigital || added) && <p role="status" className="text-sm text-sport">✓ Está en tu carrito</p>}
      </div>
    );

  if (!disponibles.length) return <p className="mt-8 rounded-sm border border-white/15 p-4 text-mist">Producto agotado por ahora.</p>;

  function onAdd() {
    if (!talla) return setError("Elige una talla.");
    if (qty > max) return setError(max <= 0 ? "Ya tienes en el carrito todo el stock disponible." : `Quedan ${max} disponibles.`);
    add({ producto_id: p.id, talla, cantidad: qty, nombre: p.nombre, precio: p.precio, imagen_url: p.imagen_url });
    setError("");
    setAdded(true);
  }

  return (
    <div className="mt-8 space-y-6">
      {!soloUnica && (
        <fieldset>
          <legend className="mb-3 text-sm font-semibold uppercase tracking-wider">Talla</legend>
          <div className="flex flex-wrap gap-2">
            {p.variantes.map((v) => {
              const out = v.stock !== null && v.stock <= 0;
              return (
                <button
                  key={v.talla}
                  type="button"
                  disabled={out}
                  aria-pressed={talla === v.talla}
                  onClick={() => { setTalla(v.talla); setAdded(false); setError(""); }}
                  className={`min-w-14 rounded-sm border px-4 py-2.5 font-semibold transition disabled:cursor-not-allowed disabled:opacity-30 disabled:line-through ${
                    talla === v.talla ? "border-sport bg-sport text-ink" : "border-white/25 hover:border-white"
                  }`}
                >
                  {v.talla}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      <div className="flex items-center gap-4">
        <span className="text-sm font-semibold uppercase tracking-wider">Cantidad</span>
        <div className="flex items-center rounded-sm border border-white/25">
          <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-11 w-11 text-xl" aria-label="Menos">−</button>
          <span className="w-10 text-center font-semibold" aria-live="polite">{qty}</span>
          <button type="button" onClick={() => setQty((q) => Math.min(MAX_POR_ITEM, q + 1))} className="h-11 w-11 text-xl" aria-label="Más">+</button>
        </div>
      </div>

      {error && <p role="alert" className="text-sm text-red-300">{error}</p>}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={onAdd} className="rounded-sm bg-sport px-8 py-4 font-display text-lg font-bold uppercase tracking-wider text-ink hover:bg-sport-600">
          Agregar al carrito
        </button>
        {added && (
          <Link href="/tienda/carrito" className="rounded-sm border border-white/60 px-8 py-4 text-center font-display text-lg font-bold uppercase tracking-wider hover:bg-white hover:text-ink">
            Ir al carrito →
          </Link>
        )}
      </div>
      {added && <p role="status" className="text-sm text-sport">✓ Agregado al carrito</p>}
    </div>
  );
}
