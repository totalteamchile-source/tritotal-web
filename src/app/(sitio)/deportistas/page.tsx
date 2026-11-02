import type { Metadata } from "next";
import { getPublicAthletes } from "@/lib/data";
import { ButtonLink, PageHero, Pending, PhotoSlot, Section } from "@/components/ui";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Nuestros deportistas",
  description: "Conoce a los deportistas de Tritotal Team: triatletas, ciclistas, nadadores y corredores.",
};

export default async function DeportistasPage() {
  const athletes = await getPublicAthletes();
  return (
    <>
      <PageHero eyebrow="Nuestros deportistas" title={<>La fuerza del <span className="text-sport">equipo</span></>} intro="Personas que entrenan, compiten y se superan cada temporada con Tritotal Team." />
      <Section>
        {athletes.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {athletes.map((a) => (
              <article key={a.id} className="reveal group overflow-hidden rounded-sm border border-white/10 bg-petrol-950 transition hover:border-sport/60">
                <div className="relative">
                  <PhotoSlot src={a.foto_url} alt={a.nombre} label="Foto pendiente" className="aspect-[4/5]" sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/70 to-transparent p-5 pt-16">
                    <h2 className="font-display text-3xl font-extrabold uppercase leading-none">{a.nombre}</h2>
                    {a.especialidad && <p className="mt-1 text-sm font-semibold uppercase tracking-widest text-sport">{a.especialidad}</p>}
                  </div>
                </div>
                {a.logros?.length > 0 && (
                  <ul className="space-y-2 p-5 text-sm">
                    {a.logros.map((l) => (
                      <li key={l} className="flex gap-2"><span className="mt-2 h-1 w-3 shrink-0 bg-sport" />{l}</li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        ) : (
          <Pending label="Deportistas por publicar" hint="Se publican desde el panel → Deportistas → «Mostrar en Nuestros deportistas»." />
        )}
        <div className="mt-14 flex flex-col items-start gap-4 rounded-sm border border-white/10 bg-petrol-950 p-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-3xl font-bold uppercase">¿Quieres ser parte del equipo?</p>
          <ButtonLink href="/inscripcion">Únete a Tritotal Team</ButtonLink>
        </div>
      </Section>
    </>
  );
}
