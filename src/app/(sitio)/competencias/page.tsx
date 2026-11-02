import type { Metadata } from "next";
import { getCompetitions, getResults } from "@/lib/data";
import { PageHero, Pending, Section, SectionTitle, ButtonLink } from "@/components/ui";

export const metadata: Metadata = {
  title: "Competencias y resultados",
  description: "Calendario de competencias, participación, resultados y logros de los deportistas de Tritotal Team.",
};

export const revalidate = 300; // también se refresca al instante al editar en el panel

const fmt = (iso: string) =>
  new Date(iso + "T12:00:00").toLocaleDateString("es-CL", { day: "2-digit", month: "short", year: "numeric" });

/** "07 nov 2026" o "07–08 nov 2026" si dura más de un día. */
const fmtRange = (from: string, to?: string) => {
  if (!to || to === from) return fmt(from);
  if (from.slice(0, 7) === to.slice(0, 7)) return `${from.slice(8)}–${fmt(to)}`;
  return `${fmt(from)} – ${fmt(to)}`;
};

export default async function CompetenciasPage() {
  const [competitions, results] = await Promise.all([getCompetitions(), getResults()]);
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = competitions.filter((c) => (c.endDate ?? c.date) >= today).sort((a, b) => a.date.localeCompare(b.date));
  const past = competitions.filter((c) => (c.endDate ?? c.date) < today).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <PageHero eyebrow="Competencias" title={<>Cada carrera <span className="text-sport">cuenta</span></>} intro="Calendario de competencias, participación del equipo, resultados, marcas personales y logros." />

      <Section id="calendario">
        <SectionTitle eyebrow="Calendario" title="Próximas competencias de triatlón" />
        {upcoming.length ? (
          <>
            <ul className="divide-y divide-white/10 border-y border-white/10">
              {upcoming.map((c) => (
                <li key={c.name + c.date} className="grid gap-3 py-5 sm:grid-cols-[11rem_1fr_auto] sm:items-center">
                  <p className="font-display text-xl font-bold text-sport">{fmtRange(c.date, c.endDate)}</p>
                  <div>
                    <p className="font-display text-2xl font-bold uppercase">{c.name}</p>
                    <p className="text-sm text-mist">{c.place}{c.distance ? ` · ${c.distance}` : ""}</p>
                  </div>
                  {c.url ? (
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-fit items-center gap-2 rounded-sm border border-sport/60 px-4 py-2 font-display text-sm font-bold uppercase tracking-wider text-sport transition hover:bg-sport hover:text-ink"
                    >
                      Ver carrera <span aria-hidden>↗</span>
                    </a>
                  ) : null}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-mist">
              Fechas según el{" "}
              <a href="https://www.trichile.cl/calendario_nacional" target="_blank" rel="noopener noreferrer" className="underline hover:text-sport">
                calendario nacional de trichile.cl
              </a>
              . Pueden cambiar: confirma siempre en el sitio oficial de cada carrera.
            </p>
          </>
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
                <p className="text-sm text-sport">{fmtRange(c.date, c.endDate)}</p>
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
