import type { Metadata } from "next";
import { competitions, results } from "@/content/events";
import { PageHero, Pending, Section, SectionTitle, ButtonLink } from "@/components/ui";

export const metadata: Metadata = {
  title: "Competencias y resultados",
  description: "Calendario de competencias, participación, resultados y logros de los deportistas de Tritotal Team.",
};

const fmt = (iso: string) =>
  new Date(iso + "T12:00:00").toLocaleDateString("es-CL", { day: "2-digit", month: "short", year: "numeric" });

export default function CompetenciasPage() {
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = competitions.filter((c) => c.date >= today).sort((a, b) => a.date.localeCompare(b.date));
  const past = competitions.filter((c) => c.date < today).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <PageHero eyebrow="Competencias" title={<>Cada carrera <span className="text-sport">cuenta</span></>} intro="Calendario de competencias, participación del equipo, resultados, marcas personales y logros." />

      <Section id="calendario">
        <SectionTitle eyebrow="Calendario" title="Próximas competencias" />
        {upcoming.length ? (
          <ul className="divide-y divide-white/10 border-y border-white/10">
            {upcoming.map((c) => (
              <li key={c.name + c.date} className="grid gap-2 py-5 sm:grid-cols-[10rem_1fr_auto] sm:items-center">
                <p className="font-display text-xl font-bold text-sport">{fmt(c.date)}</p>
                <div>
                  <p className="font-display text-2xl font-bold uppercase">{c.name}</p>
                  <p className="text-sm text-mist">{c.place}{c.distance ? ` · ${c.distance}` : ""}</p>
                </div>
                {c.athletes?.length ? <p className="text-sm text-mist">{c.athletes.length} deportistas</p> : null}
              </li>
            ))}
          </ul>
        ) : (
          <Pending label="Sin competencias publicadas" hint="Se publicarán desde el panel de administración." />
        )}
      </Section>

      <Section id="resultados" className="bg-petrol-950">
        <SectionTitle eyebrow="Resultados" title="Resultados y marcas" />
        {results.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-white/20 font-display uppercase tracking-wider text-sport">
                <tr><th className="py-3 pr-4">Fecha</th><th className="pr-4">Competencia</th><th className="pr-4">Deportista</th><th className="pr-4">Categoría</th><th className="pr-4">Tiempo</th><th>Lugar</th></tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {results.map((r, i) => (
                  <tr key={i}>
                    <td className="py-3 pr-4 text-mist">{fmt(r.date)}</td>
                    <td className="pr-4">{r.competition}</td>
                    <td className="pr-4 font-semibold">{r.athlete}</td>
                    <td className="pr-4 text-mist">{r.category ?? "—"}</td>
                    <td className="pr-4">{r.time ?? "—"}</td>
                    <td>{r.position ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Pending label="Resultados por publicar" hint="Se registrarán desde el panel de administración." />
        )}
      </Section>

      {past.length > 0 && (
        <Section>
          <SectionTitle eyebrow="Historial" title="Competencias anteriores" />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {past.map((c) => (
              <li key={c.name + c.date} className="rounded-sm border border-white/10 p-5">
                <p className="text-sm text-sport">{fmt(c.date)}</p>
                <p className="font-display text-xl font-bold uppercase">{c.name}</p>
                <p className="text-sm text-mist">{c.place}</p>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section>
        <div className="flex flex-col items-start gap-6 rounded-sm border border-white/10 bg-petrol-950 p-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-3xl font-bold uppercase">¿Preparas tu próxima carrera?</p>
          <ButtonLink href="/inscripcion">Entrena con nosotros</ButtonLink>
        </div>
      </Section>
    </>
  );
}
