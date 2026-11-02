"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, type FormEvent } from "react";
import { useCart } from "@/components/shop/CartProvider";
import { formatCLP } from "@/content/plans";
import { MAX_POR_ITEM } from "@/lib/shop";

const input =
  "w-full rounded-sm border border-white/15 bg-petrol-950 px-4 py-3 text-white placeholder:text-mist/50 focus:border-sport focus:outline-none focus:ring-1 focus:ring-sport";

export function Checkout() {
  const { items, total, ready, setQty, remove } = useCart();
  const [entrega, setEntrega] = useState<"retiro" | "despacho">("retiro");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);

  if (!ready) return null;
  if (!items.length)
    return (
      <div className="mt-10 rounded-sm border border-white/10 bg-petrol-950 p-10 text-center">
        <p className="text-lg text-mist">Tu carrito está vacío.</p>
        <Link href="/tienda" className="mt-6 inline-block rounded-sm bg-sport px-6 py-3 font-display font-bold uppercase tracking-wider text-ink">Ver productos</Link>
      </div>
    );

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;
    const fd = new FormData(e.currentTarget);
    const body = {
      nombre: String(fd.get("nombre") ?? ""),
      email: String(fd.get("email") ?? ""),
      telefono: String(fd.get("telefono") ?? ""),
      entrega,
      direccion: String(fd.get("direccion") ?? "") || undefined,
      comuna: String(fd.get("comuna") ?? "") || undefined,
      notas: String(fd.get("notas") ?? "") || undefined,
      items: items.map(({ producto_id, talla, cantidad }) => ({ producto_id, talla, cantidad })),
    };
    if (!fd.get("terminos")) return setErrors({ terminos: "Debes aceptar los términos y el tratamiento de datos." });
    setSending(true);
    setErrors({});
    try {
      const res = await fetch("/api/pedidos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) {
        window.location.href = json.redirect;
        return;
      }
      setErrors(json.errors ?? { form: json.error ?? "No pudimos procesar tu pedido. Intenta de nuevo." });
    } catch {
      setErrors({ form: "Sin conexión. Revisa tu internet e intenta de nuevo." });
    }
    setSending(false);
  }

  return (
    <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
      <div>
        <ul className="divide-y divide-white/10 border-y border-white/10">
          {items.map((i) => (
            <li key={i.producto_id + i.talla} className="flex gap-4 py-5">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-sm bg-petrol-900">
                {i.imagen_url && <Image src={i.imagen_url} alt="" fill sizes="96px" className="object-cover" />}
              </div>
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between gap-3">
                  <div>
                    <Link href={`/tienda/${i.producto_id}`} className="font-display text-xl font-bold uppercase hover:text-sport">{i.nombre}</Link>
                    <p className="text-sm text-mist">Talla: {i.talla}</p>
                  </div>
                  <p className="font-semibold">{formatCLP(i.precio * i.cantidad)}</p>
                </div>
                <div className="mt-auto flex items-center gap-4 pt-3">
                  <div className="flex items-center rounded-sm border border-white/20">
                    <button type="button" onClick={() => setQty(i.producto_id, i.talla, i.cantidad - 1)} className="h-9 w-9" aria-label="Menos">−</button>
                    <span className="w-8 text-center text-sm">{i.cantidad}</span>
                    <button type="button" onClick={() => setQty(i.producto_id, i.talla, Math.min(MAX_POR_ITEM, i.cantidad + 1))} className="h-9 w-9" aria-label="Más">+</button>
                  </div>
                  <button type="button" onClick={() => remove(i.producto_id, i.talla)} className="text-sm text-mist underline-offset-4 hover:text-white hover:underline">Quitar</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-5 flex justify-between font-display text-2xl font-bold uppercase">
          <span>Total</span>
          <span className="text-sport">{formatCLP(total)}</span>
        </div>
        <p className="mt-2 text-sm text-mist">El total final se confirma con los precios vigentes al pagar.</p>
      </div>

      <form onSubmit={onSubmit} noValidate className="space-y-5 rounded-sm border border-white/10 bg-petrol-950/60 p-6">
        <h2 className="font-display text-2xl font-bold uppercase">Tus datos</h2>
        <div>
          <label htmlFor="nombre" className="mb-1.5 block text-sm font-semibold">Nombre completo</label>
          <input id="nombre" name="nombre" autoComplete="name" className={input} />
          {errors.nombre && <p className="mt-1 text-sm text-red-300">{errors.nombre}</p>}
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-semibold">Correo</label>
          <input id="email" name="email" type="email" autoComplete="email" className={input} />
          {errors.email && <p className="mt-1 text-sm text-red-300">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="telefono" className="mb-1.5 block text-sm font-semibold">Teléfono</label>
          <input id="telefono" name="telefono" type="tel" autoComplete="tel" placeholder="+56 9 ..." className={input} />
          {errors.telefono && <p className="mt-1 text-sm text-red-300">{errors.telefono}</p>}
        </div>

        <fieldset>
          <legend className="mb-2 text-sm font-semibold">Entrega</legend>
          <div className="grid grid-cols-2 gap-2">
            {(["retiro", "despacho"] as const).map((op) => (
              <button
                key={op}
                type="button"
                aria-pressed={entrega === op}
                onClick={() => setEntrega(op)}
                className={`rounded-sm border px-4 py-3 text-sm font-semibold ${entrega === op ? "border-sport bg-sport text-ink" : "border-white/20"}`}
              >
                {op === "retiro" ? "Retiro" : "Despacho"}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-mist">
            {entrega === "retiro"
              ? "Coordinamos el retiro contigo por WhatsApp."
              : "El costo de despacho no está incluido: lo coordinamos contigo por WhatsApp antes de enviar."}
          </p>
        </fieldset>
        {entrega === "despacho" && (
          <div className="grid gap-3 sm:grid-cols-[2fr_1fr]">
            <div>
              <input name="direccion" placeholder="Dirección" autoComplete="street-address" className={input} aria-label="Dirección" />
              {errors.direccion && <p className="mt-1 text-sm text-red-300">{errors.direccion}</p>}
            </div>
            <input name="comuna" placeholder="Comuna" className={input} aria-label="Comuna" />
          </div>
        )}
        <textarea name="notas" rows={2} placeholder="Comentarios (opcional)" className={input} aria-label="Comentarios" />

        <label className="flex items-start gap-3 text-sm">
          <input type="checkbox" name="terminos" className="mt-1 h-5 w-5 accent-[var(--color-sport)]" />
          <span>
            Acepto los <Link href="/terminos" target="_blank" className="text-sport underline">términos y condiciones</Link> y el{" "}
            <Link href="/privacidad" target="_blank" className="text-sport underline">tratamiento de mis datos</Link>.
          </span>
        </label>
        {errors.terminos && <p className="text-sm text-red-300">{errors.terminos}</p>}
        {(errors.form || errors.items) && <p role="alert" className="rounded-sm border border-red-400/50 bg-red-500/10 p-3 text-sm text-red-300">{errors.form ?? errors.items}</p>}

        <button type="submit" disabled={sending} className="w-full rounded-sm bg-sport py-4 font-display text-lg font-bold uppercase tracking-wider text-ink hover:bg-sport-600 disabled:opacity-60">
          {sending ? "Procesando…" : `Ir a pagar ${formatCLP(total)}`}
        </button>
        <p className="text-center text-xs text-mist">Pagas en la página segura de Mercado Pago. Nunca vemos los datos de tu tarjeta.</p>
      </form>
    </div>
  );
}
