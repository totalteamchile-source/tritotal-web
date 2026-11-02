import type { Metadata } from "next";
import { getAbout } from "@/lib/data";
import { aboutPhotos } from "@/content/gallery";
import { PageHero, Pending, PhotoSlot, Section, SectionTitle, ButtonLink } from "@/components/ui";

export const metadata: Metadata = {
  title: "Nosotros",
  description: "Historia, misión, visión, filosofía de entrenamiento y equipo técnico de Tritotal Team.",
};

export const revalidate = 300; // también se refresca al instante al editar en el panel

const HINT = "Se completa desde el panel de administración.";

function Block({ title, value }: { title: string; value: string | null }) {
  return (
    <div className="border-t border-white/10 pt-6">
      <h3 className="font-display text-2xl font-bold uppercase text-sport">{title}</h3>
      <div className="mt-3 text-lg leading-relaxed text-mist">
        {value ? <p className="whitespace-pre-line">{value}</p> : <Pending hint={HINT} />}
      </div>
    </div>
  );
}

export default async function NosotrosPage() {
  const about = await getAbout();
  return (
    <>
      <PageHero eyebrow="Nosotros" title={<>Somos <span className="text-sport">Tritotal Team</span></>} intro="Un equipo de triatlón y entrenamiento de resistencia: natación, ciclismo y running." />

      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionTitle eyebrow="Historia" title="Nuestra historia" />
            {about.history ? <p className="whitespace-pre-line text-lg leading-relaxed text-mist">{about.history}</p> : <Pending hint={HINT} />}
          </div>
          <PhotoSlot src={aboutPhotos.historia} alt="Deportista de Tritotal Team llegando a la meta del Ironman 70.3 Valdivia" label="Foto del equipo" className="aspect-[4/5] max-h-[560px] w-full rounded-sm" position="center 30%" />
        </div>
      </Section>

      <Section className="bg-petrol-950">
        <div className="grid gap-10 md:grid-cols-3">
          <Block title="Misión" value={about.mission} />
          <Block title="Visión" value={about.vision} />
          <Block title="Filosofía de entrenamiento" value={about.philosophy} />
        </div>
      </Section>

      <Section>
        <SectionTitle eyebrow="Valores" title="Valores deportivos" />
        {about.values.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {about.values.map((v) => (
              <div key={v.name} className="border-l-2 border-sport bg-petrol-950 p-6">
                <h3 className="font-display text-2xl font-bold uppercase">{v.name}</h3>
                <p className="mt-2 text-mist">{v.text}</p>
              </div>
            ))}
          </div>
        ) : (
          <Pending hint={HINT} />
        )}
      </Section>

      <Section className="bg-petrol-950">
        <SectionTitle eyebrow="Equipo técnico" title="Entrenadores" />
        {about.coaches.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {about.coaches.map((c) => (
              <article key={c.name} className="overflow-hidden rounded-sm border border-white/10 bg-ink">
                <PhotoSlot src={c.photo} alt={c.name} label="Foto" className="aspect-square" />
                <div className="p-6">
                  <h3 className="font-display text-2xl font-bold uppercase">{c.name}</h3>
                  <p className="text-sm uppercase tracking-widest text-sport">{c.role}</p>
                  {c.bio && <p className="mt-3 text-mist">{c.bio}</p>}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <Pending label="Entrenadores por agregar" hint={HINT} />
        )}
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionTitle eyebrow="Comunidad" title="Comunidad de deportistas" />
            {about.community ? <p className="text-lg leading-relaxed text-mist">{about.community}</p> : <Pending hint={HINT} />}
            <div className="mt-8"><ButtonLink href="/inscripcion">Únete a Tritotal Team</ButtonLink></div>
          </div>
          <PhotoSlot src={aboutPhotos.comunidad} alt="Deportista de Tritotal Team con su medalla del Ironman 70.3 Valdivia" label="Foto de la comunidad" className="aspect-[4/5] max-h-[560px] w-full rounded-sm" position="center 35%" />
        </div>
      </Section>
    </>
  );
}
