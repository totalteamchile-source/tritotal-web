import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/data";
import { formatCLP } from "@/content/plans";
import { PhotoSlot, Section } from "@/components/ui";
import { AddToCart } from "./AddToCart";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const p = await getProduct((await params).id);
  return p ? { title: p.nombre, description: p.descripcion ?? `${p.nombre} – Tienda Tritotal Team`, openGraph: p.imagen_url ? { images: [p.imagen_url] } : undefined } : {};
}

export default async function ProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const p = await getProduct((await params).id);
  if (!p) notFound();
  return (
    <Section className="pt-28 lg:pt-36">
      <Link href="/tienda" className="text-sm text-mist hover:text-white">← Volver a la tienda</Link>
      <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <PhotoSlot src={p.imagen_url} alt={p.nombre} label="Foto pendiente" priority className="aspect-square rounded-sm" sizes="(min-width:1024px) 50vw, 100vw" />
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-sport">{p.categoria}</p>
          <h1 className="mt-2 font-display text-5xl font-extrabold uppercase leading-none">{p.nombre}</h1>
          <p className="mt-5 font-display text-4xl font-bold">{formatCLP(p.precio)}</p>
          {p.descripcion && <p className="mt-6 whitespace-pre-line text-lg leading-relaxed text-mist">{p.descripcion}</p>}
          <AddToCart p={p} />
        </div>
      </div>
    </Section>
  );
}
