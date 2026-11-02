import type { Metadata } from "next";
import { getProducts } from "@/lib/data";
import { PageHero, Pending, Section } from "@/components/ui";
import { ProductCard } from "@/components/shop/ProductCard";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Tienda",
  description: "Poleras, gorros y accesorios oficiales de Tritotal Team.",
};

export default async function TiendaPage() {
  const products = await getProducts();
  const cats = [...new Set(products.map((p) => p.categoria))];
  return (
    <>
      <PageHero eyebrow="Tienda oficial" title={<>Viste los colores del <span className="text-sport">equipo</span></>} intro="Poleras, gorros y accesorios Tritotal Team." />
      <Section>
        {products.length ? (
          cats.map((c) => (
            <div key={c} className="mb-14 last:mb-0">
              {cats.length > 1 && <h2 className="mb-6 font-display text-3xl font-bold uppercase">{c}</h2>}
              <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
                {products.filter((p) => p.categoria === c).map((p) => <ProductCard key={p.id} p={p} />)}
              </div>
            </div>
          ))
        ) : (
          <Pending label="Productos por publicar" hint="Se agregan desde el panel de administración → Productos." />
        )}
      </Section>
    </>
  );
}
