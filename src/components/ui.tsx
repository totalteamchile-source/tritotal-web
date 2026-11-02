import Link from "next/link";
import Image from "next/image";
import { photoMeta } from "@/content/photoMeta";
import type { ReactNode } from "react";
import { ArrowIcon, disciplineIcon } from "./Icons";

type BtnVariant = "primary" | "outline" | "whatsapp" | "ghost" | "dark" | "outlineDark";

const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-sm px-6 py-3.5 font-display text-base font-bold uppercase tracking-wider transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";
const btnVariants: Record<BtnVariant, string> = {
  primary: "bg-sport text-ink hover:bg-sport-600",
  outline: "border border-white/60 text-white hover:bg-white hover:text-ink",
  whatsapp: "bg-[#25D366] text-ink hover:bg-[#1fbe5a]",
  ghost: "text-white hover:text-sport",
  dark: "bg-ink text-white hover:bg-petrol-900",
  outlineDark: "border border-ink text-ink hover:bg-ink hover:text-white",
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  external,
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: BtnVariant;
  external?: boolean;
  className?: string;
}) {
  const cls = `${btnBase} ${btnVariants[variant]} ${className}`;
  if (external)
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="mb-3 flex items-center gap-3 font-display text-sm font-semibold uppercase tracking-[0.3em] text-sport">
      <span className="h-px w-8 bg-sport" />
      {children}
    </p>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  intro,
  align = "left",
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
}) {
  return (
    <div className={`reveal mb-10 max-w-3xl lg:mb-14 ${align === "center" ? "mx-auto text-center [&>p:first-child]:justify-center" : ""}`}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">
        {title}
      </h2>
      {intro && <p className="mt-5 text-lg leading-relaxed text-mist">{intro}</p>}
    </div>
  );
}

export function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`scroll-mt-20 py-20 lg:py-28 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

/** Encabezado para páginas interiores */
export function PageHero({ eyebrow, title, intro }: { eyebrow: string; title: ReactNode; intro?: ReactNode }) {
  return (
    <section className="bg-lanes relative overflow-hidden bg-gradient-to-b from-petrol-900 to-ink pb-16 pt-32 lg:pb-24 lg:pt-44">
      <div className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full bg-sport/10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="max-w-4xl font-display text-5xl font-extrabold uppercase leading-[0.9] tracking-tight sm:text-6xl lg:text-8xl">
          {title}
        </h1>
        {intro && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-mist">{intro}</p>}
      </div>
    </section>
  );
}

/** Marca visible de contenido pendiente de completar por el equipo */
export function Pending({ label = "Contenido pendiente", hint }: { label?: string; hint?: string }) {
  return (
    <div className="rounded border border-dashed border-petrol-500/60 bg-petrol-900/40 p-5 text-sm text-petrol-300">
      <p className="font-display font-semibold uppercase tracking-wider">{label}</p>
      {hint && <p className="mt-1 text-xs text-petrol-300/70">{hint}</p>}
    </div>
  );
}

/**
 * Espacio para fotografía. Si hay `src`, muestra la foto; si no,
 * un panel de marca con el pictograma de la disciplina.
 */
export function PhotoSlot({
  src,
  alt,
  discipline,
  label,
  className = "",
  priority,
  sizes = "(min-width: 1024px) 33vw, 100vw",
  position,
}: {
  position?: string;
  src?: string | null;
  alt: string;
  discipline?: "natacion" | "ciclismo" | "running";
  label?: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const Icon = discipline ? disciplineIcon[discipline] : null;
  return (
    <div className={`relative overflow-hidden bg-petrol-900 ${className}`}>
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" style={{ objectPosition: position ?? (src ? photoMeta[src]?.focus : undefined) ?? "50% 35%" }} />
      ) : (
        <div className="bg-lanes absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-petrol-800 via-petrol-900 to-ink text-petrol-300">
          {Icon && <Icon className="h-16 w-16 opacity-70" />}
          <span className="text-[11px] uppercase tracking-[0.25em] opacity-60">{label ?? "Foto pendiente"}</span>
        </div>
      )}
    </div>
  );
}

export { ArrowIcon };
