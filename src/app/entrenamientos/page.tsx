import type { Metadata } from "next";
import { disciplines, programs } from "@/content/trainings";
import { heroPhotos } from "@/content/gallery";
import { weeklySchedule } from "@/content/events";
import { disciplineIcon } from "@/components/Icons";
import { ButtonLink, PageHero, Pending, PhotoSlot, Section, SectionTitle } from "@/components/ui";

export const metadata: Metadata = {
  title: "Entrenamientos",
  description: "Entrenamiento de natación, ciclismo y running. Preparación para triatlón, Ironman 70.3, Full Ironman y running.",
};

const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"] as const;

export default function EntrenamientosPage() {
  return (
    <>
      <PageHero eyebrow="Entrenamientos" title={<>Nadar. Pedalear. <span className="text-sport">Correr.</span></>} intro="Entrenamiento estructurado en las tres disciplinas, con preparación específica para tu competencia." />

      {disciplines.map((d, i) => {
        const Icon = disciplineIcon[d.id];
        return (
          <Section key={d.id} id={d.id} className={i % 2 ? "bg-petrol-950" : ""}>
            <div className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
              <PhotoSlot src={heroPhotos[d.id]} alt={d.name} discipline={d.id} label={d.name} className="aspect-[4/3] rounded-sm" />
              <div>
                <Icon className="mb-4 h-12 w-12 text-sport" />
                <h2 className="font-display text-5xl font-extrabold uppercase sm:text-6xl">{d.name}</h2>
                <p className="mt-3 text-xl text-mist">{d.tagline}</p>
                <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                  {d.focus.map((f) => (
                    <li key={f} className="border-l-2 border-sport bg-white/[0.03] px-4 py-3 font-medium">{f}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Section>
        );
      })}

      <Section id="preparacion">
        <SectionTitle eyebrow="Preparación específica" title="Competencias objetivo" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {programs.map((p) => (
            <div key={p.name} className="flex flex-col rounded-sm border border-white/10 bg-petrol-950 p-6">
              <h3 className="font-display text-2xl font-bold uppercase">{p.name}</h3>
              <p className="mt-3 flex-1 text-mist">{p.detail}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="calendario" className="bg-petrol-950">
        <SectionTitle eyebrow="Calendario" title="Horarios semanales" intro="Natación, ciclismo, running, entrenamientos especiales y actividades del equipo." />
        {weeklySchedule.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-7">
            {days.map((day) => {
              const items = weeklySchedule.filter((s) => s.day === day);
              return (
                <div key={day} className="rounded-sm border border-white/10 bg-ink p-4">
                  <p className="font-display text-lg font-bold uppercase text-sport">{day}</p>
                  {items.length ? (
                    <ul className="mt-3 space-y-3 text-sm">
                      {items.map((s, k) => (
                        <li key={k}>
                          <p className="font-semibold">{s.time} · {s.discipline}</p>
                          <p className="text-mist">{s.title}{s.place ? ` — ${s.place}` : ""}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 text-sm text-mist/60">Sin sesiones</p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <Pending label="Horarios por publicar" hint="Se administrarán desde el panel (Etapa 5). Por ahora: src/content/events.ts" />
        )}
        <div className="mt-10 flex flex-wrap gap-4">
          <ButtonLink href="/planes">Ver planes</ButtonLink>
          <ButtonLink href="/inscripcion" variant="outline">Inscríbete</ButtonLink>
        </div>
      </Section>
    </>
  );
}
