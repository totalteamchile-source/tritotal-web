import type { Metadata } from "next";
import Image from "next/image";
import { getGallery } from "@/lib/data";
import { photoMeta } from "@/content/photoMeta";
import { PageHero, Pending, PhotoSlot, Section, SectionTitle } from "@/components/ui";

export const metadata: Metadata = {
  title: "Galería y comunidad",
  description: "Fotos, videos y noticias del equipo Tritotal Team: entrenamientos, competencias y actividades.",
};

export const revalidate = 300; // también se refresca al instante al editar en el panel

const categories = ["Equipo", "Entrenamientos", "Competencias", "Actividades sociales"] as const;

export default async function GaleriaPage() {
  const { photos, videos, news } = await getGallery();
  return (
    <>
      <PageHero eyebrow="Galería y comunidad" title={<>Vive el <span className="text-sport">equipo</span></>} intro="Fotos del equipo, entrenamientos, competencias, actividades sociales, videos y noticias." />

      <Section>
        {categories.map((cat) => {
          const items = photos.filter((p) => p.category === cat);
          return (
            <div key={cat} className="mb-16 last:mb-0">
              <h2 className="mb-6 font-display text-3xl font-bold uppercase">{cat}</h2>
              {items.length ? (
                // Fotos completas, sin recortar: cada una conserva su formato (vertical u horizontal).
                <div className="columns-2 gap-2 md:columns-3">
                  {items.map((p) => {
                    const m = photoMeta[p.src];
                    return (
                      <div key={p.src} className="mb-2 break-inside-avoid overflow-hidden bg-petrol-900">
                        <Image
                          src={p.src}
                          alt={p.alt}
                          width={m?.w ?? 1200}
                          height={m?.h ?? 900}
                          sizes="(min-width:1024px) 25vw, (min-width:768px) 33vw, 50vw"
                          className="h-auto w-full transition duration-500 hover:scale-[1.03]"
                        />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <PhotoSlot key={i} alt="" label="Foto pendiente" className="aspect-square" />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </Section>

      <Section className="bg-petrol-950">
        <SectionTitle eyebrow="Videos" title="Videos" />
        {videos.length ? (
          <div className="grid gap-6 md:grid-cols-2">
            {videos.map((v) => (
              <div key={v.youtubeId} className="aspect-video overflow-hidden rounded-sm">
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube-nocookie.com/embed/${v.youtubeId}`}
                  title={v.title}
                  loading="lazy"
                  allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ))}
          </div>
        ) : (
          <Pending label="Videos por agregar" hint="Se agregan desde el panel de administración." />
        )}
      </Section>

      <Section>
        <SectionTitle eyebrow="Noticias" title="Noticias del equipo" />
        {news.length ? (
          <div className="grid gap-6 md:grid-cols-3">
            {news.map((n) => (
              <article key={n.title} className="border-t-2 border-sport pt-5">
                {n.image && (
                  <div className="relative mb-4 aspect-video overflow-hidden">
                    <Image src={n.image} alt="" fill sizes="(min-width:768px) 33vw, 100vw" className="object-cover" />
                  </div>
                )}
                <p className="text-sm text-mist">{n.date}</p>
                <h3 className="mt-2 font-display text-2xl font-bold uppercase">{n.title}</h3>
                <p className="mt-2 whitespace-pre-line text-mist">{n.summary}</p>
              </article>
            ))}
          </div>
        ) : (
          <Pending label="Noticias por publicar" />
        )}
      </Section>
    </>
  );
}
