import type { Metadata } from "next";
import Image from "next/image";
import { getGallery } from "@/lib/data";
import { PageHero, Pending, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Noticias",
  description: "Noticias de Tritotal Team: competencias, logros, actividades y novedades del equipo.",
};

export const revalidate = 300; // también se refresca al instante al publicar en el panel

const fmt = (iso: string) => {
  const d = new Date(iso + (iso.length === 10 ? "T12:00:00" : ""));
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" });
};

export default async function NoticiasPage() {
  const { news } = await getGallery();
  return (
    <>
      <PageHero eyebrow="Noticias" title={<>Noticias del <span className="text-sport">equipo</span></>} intro="Competencias, logros, actividades y novedades de Tritotal Team." />
      <Section>
        {news.length ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {news.map((n) => (
              <article key={n.title + n.date} className="overflow-hidden rounded-sm border border-white/10 bg-petrol-950">
                {n.image && (
                  <div className="relative aspect-video overflow-hidden">
                    <Image src={n.image} alt="" fill sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw" className="object-cover" />
                  </div>
                )}
                <div className="border-t-2 border-sport p-6">
                  <p className="text-sm text-sport">{fmt(n.date)}</p>
                  <h2 className="mt-2 font-display text-2xl font-bold uppercase">{n.title}</h2>
                  <p className="mt-3 whitespace-pre-line leading-relaxed text-mist">{n.summary}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <Pending label="Noticias por publicar" hint="Se publican desde el panel → Noticias." />
        )}
      </Section>
    </>
  );
}
