import Link from "next/link";
import { PhotoSlot } from "@/components/ui";
import { formatCLP } from "@/content/plans";
import { agotado, type Producto } from "@/lib/shop";

export function ProductCard({ p }: { p: Producto }) {
  const out = agotado(p);
  return (
    <Link href={`/tienda/${p.id}`} className="group block overflow-hidden rounded-sm border border-white/10 bg-petrol-950 transition hover:border-sport/60">
      <div className="relative">
        <PhotoSlot src={p.imagen_url} alt={p.nombre} label="Foto pendiente" className="aspect-square transition group-hover:opacity-90" sizes="(min-width:1024px) 25vw, 50vw" />
        {out && <span className="absolute left-3 top-3 rounded-full bg-ink/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider">Agotado</span>}
      </div>
      <div className="p-4">
        <p className="text-xs uppercase tracking-widest text-mist">{p.categoria}</p>
        <h3 className="mt-1 font-display text-xl font-bold uppercase leading-tight">{p.nombre}</h3>
        <p className="mt-2 font-display text-2xl font-bold text-sport">{formatCLP(p.precio)}</p>
      </div>
    </Link>
  );
}
