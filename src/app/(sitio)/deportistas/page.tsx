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
          <div className="grid gap-8">
            {athletes.map((a) => (
              <article key={a.id} className="reveal grid overflow-hidden rounded-sm border border-white/10 bg-petrol-950 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
                <PhotoSlot src={a.foto_url} alt={a.nombre} label="Foto pendiente" className="aspect-[4/5] md:aspect-auto md:min-h-[560px]" sizes="(min-width:768px) 40vw, 100vw" />
                <div className="p-6 sm:p-10">
                  {a.desde ? <p className="inline-block rounded-sm bg-sport px-3 py-1 font-display text-xs font-bold uppercase tracking-widest text-ink">Integrante desde {a.desde}</p> : null}
                  <h2 className="mt-4 font-display text-4xl font-extrabold uppercase leading-none sm:text-5xl">{a.nombre}</h2>
                  {a.especialidad && <p className="mt-2 text-sm font-semibold uppercase tracking-widest text-sport">{a.especialidad}</p>}

                  {a.historia && (
                    <div className="mt-8">
                      <h3 className="font-display text-sm font-bold uppercase tracking-[0.2em] text-white/60">Historia deportiva</h3>
                      <p className="mt-3 whitespace-pre-line leading-relaxed text-mist">{a.historia}</p>
                    </div>
                  )}

                  {a.logros?.length > 0 && (
                    <div className="mt-8">
                      <h3 className="font-display text-sm font-bold uppercase tracking-[0.2em] text-white/60">Trayectoria competitiva</h3>
                      <ul className="mt-3 space-y-2">
                        {a.logros.map((l) => (
                          <li key={l} className="flex gap-3 text-white"><span className="mt-2.5 h-0.5 w-3 shrink-0 bg-sport" aria-hidden />{l}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {a.distancia && (
                    <div className="mt-8 border-l-2 border-sport bg-ink/60 p-4">
                      <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-white/60">Distancia de especialización</p>
                      <p className="mt-1 font-display text-xl font-bold">{a.distancia}</p>
                    </div>
                  )}
                </div>
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
