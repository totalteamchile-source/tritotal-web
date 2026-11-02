"use client";

import { useState } from "react";
import type { Competition, CompetitionType } from "@/content/events";

const fmt = (iso: string) =>
  new Date(iso + "T12:00:00").toLocaleDateString("es-CL", { day: "2-digit", month: "short", year: "numeric" });

/** "07 nov 2026" o "07–08 nov 2026" si dura más de un día. */
export const fmtRange = (from: string, to?: string) => {
  if (!to || to === from) return fmt(from);
  if (from.slice(0, 7) === to.slice(0, 7)) return `${from.slice(8)}–${fmt(to)}`;
  return `${fmt(from)} – ${fmt(to)}`;
};

const monthLabel = (iso: string) =>
  new Date(iso + "T12:00:00").toLocaleDateString("es-CL", { month: "long", year: "numeric" });

const sources: Record<CompetitionType, { label: string; href: string }> = {
  Triatlón: { label: "calendario nacional de trichile.cl", href: "https://www.trichile.cl/calendario_nacional" },
  Running: { label: "calendario de corre.cl", href: "https://www.corre.cl/calendario" },
};

export function CalendarTabs({ races }: { races: Competition[] }) {
  const tabs: CompetitionType[] = ["Triatlón", "Running"];
  const [tab, setTab] = useState<CompetitionType>("Triatlón");
  const list = races.filter((r) => (r.type ?? "Triatlón") === tab);

  const months: { key: string; items: Competition[] }[] = [];
  for (const r of list) {
    const key = r.date.slice(0, 7);
    const last = months[months.length - 1];
    if (last?.key === key) last.items.push(r);
    else months.push({ key, items: [r] });
  }

  return (
    <div>
      <div role="tablist" aria-label="Tipo de competencia" className="mb-8 inline-flex rounded-sm border border-white/15 p-1">
        {tabs.map((t) => {
          const n = races.filter((r) => (r.type ?? "Triatlón") === t).length;
          const active = t === tab;
          return (
            <button
              key={t}
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t)}
              className={`rounded-sm px-5 py-2 font-display text-sm font-bold uppercase tracking-wider transition ${
                active ? "bg-sport text-ink" : "text-mist hover:text-white"
              }`}
            >
              {t} <span className={active ? "text-ink/70" : "text-white/40"}>({n})</span>
            </button>
          );
        })}
      </div>

      {list.length === 0 ? (
        <p className="rounded-sm border border-dashed border-white/15 p-6 text-sm text-mist">
          No hay carreras de {tab.toLowerCase()} publicadas por ahora.
        </p>
      ) : (
        <div className="space-y-10">
          {months.map((m) => (
            <div key={m.key}>
              <h3 className="mb-2 font-display text-sm font-bold uppercase tracking-[0.25em] text-white/50">{monthLabel(m.items[0].date)}</h3>
              <ul className="divide-y divide-white/10 border-y border-white/10">
                {m.items.map((c) => (
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
            </div>
          ))}
        </div>
      )}

      <p className="mt-6 text-xs text-mist">
        Fechas según el{" "}
        <a href={sources[tab].href} target="_blank" rel="noopener noreferrer" className="underline hover:text-sport">
          {sources[tab].label}
        </a>
        . Pueden cambiar: confirma siempre en el sitio oficial de cada carrera.
      </p>
    </div>
  );
}
