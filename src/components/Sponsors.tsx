import Image from "next/image";
import type { Sponsor } from "@/content/sponsors";

/** Franja de auspiciadores. No se muestra nada si no hay ninguno. */
export function Sponsors({ sponsors }: { sponsors: Sponsor[] }) {
  if (!sponsors.length) return null;
  return (
    <section aria-labelledby="auspiciadores" className="border-t border-white/10 bg-ink py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="auspiciadores" className="text-center font-display text-sm font-bold uppercase tracking-[0.3em] text-sport">
          Nos auspician
        </h2>
        <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
          {sponsors.map((s) => {
            const content = s.logo ? (
              <Image src={s.logo} alt={s.name} width={240} height={80} className="h-16 w-auto max-w-[240px] sm:h-20 object-contain opacity-80 transition hover:opacity-100" />
            ) : (
              <span className="font-display text-2xl font-bold uppercase text-white/70 transition hover:text-white">{s.name}</span>
            );
            return (
              <li key={s.name}>
                {s.url ? (
                  <a href={s.url} target="_blank" rel="noopener noreferrer sponsored" title={s.name}>{content}</a>
                ) : (
                  content
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
