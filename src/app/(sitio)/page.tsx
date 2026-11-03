import Link from "next/link";
import { disciplines, programs } from "@/content/trainings";
import { heroPhotos, disciplinePhotos, featuredPhotos } from "@/content/gallery";
import { disciplineIcon, SwimIcon, BikeIcon, RunIcon, TeamIcon, CalendarIcon, TrophyIcon, PinIcon } from "@/components/Icons";
import { ButtonLink, Eyebrow, PhotoSlot, Section, SectionTitle, ArrowIcon } from "@/components/ui";
import { whatsappLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/Icons";
import { Logo } from "@/components/Logo";
import { getHero } from "@/lib/data";
import type { ReactNode } from "react";

export const revalidate = 300;

const DEFAULT_SUB = "Entrenamos personas, formamos deportistas y construimos una comunidad apasionada por el triatlón.";

/**
 * Frase de portada editable desde el panel. Cada oración va en su línea:
 * la primera en blanco y las siguientes alternan turquesa y contorno.
 */
const DEFAULT_TITLE = "Nadar, pedalear y correr: tres desafíos, una sola voluntad.";
/** Cada frase (o lo que va tras «:») va en su propia línea. */
const splitTitle = (t: string) => t.split(/(?<=[.!?:])\s+/).filter(Boolean);

function HeroTitle({ text }: { text: string | null }) {
  const parts = splitTitle(text || DEFAULT_TITLE);
  const out: ReactNode[] = [];
  parts.forEach((p, i) => {
    const cls = i === 0 ? "" : i % 2 === 1 ? "text-sport" : "text-outline";
    out.push(<span key={i} className={`block ${cls}`}>{p}</span>);
  });
  return <>{out}</>;
}

const quickLinks = [
  { href: "/entrenamientos#natacion", label: "Natación", Icon: SwimIcon },
  { href: "/entrenamientos#ciclismo", label: "Ciclismo", Icon: BikeIcon },
  { href: "/entrenamientos#running", label: "Running", Icon: RunIcon },
  { href: "/deportistas", label: "Equipo", Icon: TeamIcon },
  { href: "/planes", label: "Planes", Icon: CalendarIcon },
  { href: "/competencias", label: "Competencias", Icon: TrophyIcon },
];

/** Lugares donde compite el equipo (según lo informado por Tritotal Team). */
const destinations = [
  { name: "Pucón", race: "Ironman 70.3 Pucón" },
  { name: "Puerto Varas", race: "Triatlón" },
  { name: "Coquimbo", race: "Atriaman" },
  { name: "Valdivia", race: "Ironman e Ironman 70.3" },
];

const pillars = [
  { n: "01", title: "Disciplina", text: "Cada sesión tiene un propósito dentro de tu planificación." },
  { n: "02", title: "Superación", text: "Objetivos medibles para avanzar temporada a temporada." },
  { n: "03", title: "Comunidad", text: "Entrenar acompañado hace que los kilómetros pesen menos." },
  { n: "04", title: "Competitividad", text: "Preparación específica para llegar a tu carrera en tu mejor forma." },
];

export default async function Home() {
  const hero = await getHero();
  return (
    <>
      {/* PORTADA */}
      <section className="relative flex min-h-[100svh] flex-col overflow-hidden bg-ink">
        {/* Tríptico de disciplinas */}
        <div className="absolute inset-0 grid grid-cols-1 gap-1 sm:grid-cols-3 lg:-mx-[6%] lg:-skew-x-6">
          {disciplines.map((d, i) => (
            <PhotoSlot
              key={d.id}
              src={heroPhotos[d.id]}
              alt={`Deportista Tritotal Team en ${d.name.toLowerCase()}`}
              discipline={d.id}
              label={d.name}
              priority={i === 0}
              className={`slow-zoom h-full lg:[&>*]:skew-x-6 ${i < 2 ? "hidden sm:block" : ""}`}
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/40 to-transparent" />

        <div className="hero-in relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-4 pb-16 pt-28 sm:px-6 lg:justify-center lg:px-8 lg:pb-24">
          <Logo variant="principal" height={110} className="mb-6 !h-[72px] !w-auto sm:mb-8 sm:!h-[110px]" />
          <Eyebrow>Natación · Ciclismo · Running</Eyebrow>
          <h1 className={`max-w-5xl font-display font-extrabold uppercase leading-[0.86] tracking-tight ${splitTitle(hero.titulo || DEFAULT_TITLE).length > 2 || (hero.titulo || DEFAULT_TITLE).length > 40 ? "text-[clamp(2.4rem,6.5vw,6rem)]" : "text-[clamp(3rem,10vw,8.5rem)]"}`}>
            <HeroTitle text={hero.titulo} />
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-mist sm:text-xl">
            {hero.subtitulo ?? DEFAULT_SUB}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <ButtonLink href="/inscripcion">
              Únete a Tritotal Team <ArrowIcon className="h-5 w-5" />
            </ButtonLink>
            <ButtonLink href="/entrenamientos" variant="outline">
              Conoce nuestros entrenamientos
            </ButtonLink>
            <ButtonLink href={whatsappLink("Hola, quiero hablar con el entrenador de Tritotal Team.")} variant="whatsapp" external>
              <WhatsAppIcon className="h-5 w-5" /> Habla con el entrenador
            </ButtonLink>
          </div>
        </div>

        {/* Distancias */}
        <div className="relative border-t border-white/10 bg-ink/70 backdrop-blur">
          <div className="mx-auto grid max-w-7xl grid-cols-3 divide-x divide-white/10 px-4 sm:px-6 lg:px-8">
            {[
              ["3,8 km", "Nado"],
              ["180 km", "Bici"],
              ["42,2 km", "Trote"],
            ].map(([v, l]) => (
              <div key={l} className="py-4 text-center sm:py-6">
                <p className="font-display text-2xl font-bold sm:text-4xl">{v}</p>
                <p className="text-[11px] uppercase tracking-[0.25em] text-mist">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACCESOS RÁPIDOS */}
      <nav aria-label="Accesos rápidos" className="border-b border-white/10 bg-petrol-950">
        <ul className="mx-auto grid max-w-7xl grid-cols-3 px-4 sm:px-6 md:grid-cols-6 lg:px-8">
          {quickLinks.map(({ href, label, Icon }) => (
            <li key={href}>
              <Link href={href} className="group flex flex-col items-center gap-2 px-2 py-6 text-center transition hover:bg-white/5">
                <Icon className="h-9 w-9 text-sport transition group-hover:scale-110" />
                <span className="font-display text-xs font-bold uppercase tracking-widest sm:text-sm">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* DÓNDE COMPETIMOS */}
      <section className="bg-ink py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle eyebrow="Dónde competimos" title={<>Vive el <span className="text-sport">triatlón</span></>} />
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {destinations.map((d) => (
              <Link
                key={d.name}
                href="/competencias"
                className="group relative flex min-h-36 flex-col justify-end overflow-hidden rounded-sm border border-white/10 bg-gradient-to-br from-petrol-700 via-petrol-900 to-ink p-5 transition hover:border-sport/60 lg:-skew-x-6"
              >
                <span className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-sport/10 blur-2xl transition group-hover:bg-sport/25" aria-hidden />
                <span className="lg:skew-x-6">
                  <span className="flex items-center gap-2 font-display text-2xl font-extrabold uppercase sm:text-3xl">
                    <PinIcon className="h-6 w-6 shrink-0 text-sport" />
                    {d.name}
                  </span>
                  <span className="mt-1 block text-sm text-mist">{d.race}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* DISCIPLINAS */}
      <Section className="bg-lanes">
        <SectionTitle
          eyebrow="Entrenamientos"
          title={<>Tres disciplinas.<br />Un solo objetivo.</>}
          intro="Planificamos natación, ciclismo y running como un todo, para que llegues a la línea de partida preparado."
        />
        <div className="grid gap-5 md:grid-cols-3">
          {disciplines.map((d) => {
            const Icon = disciplineIcon[d.id];
            return (
              <Link
                key={d.id}
                href={`/entrenamientos#${d.id}`}
                className="reveal group relative flex flex-col overflow-hidden rounded-sm border border-white/10 bg-petrol-950 transition hover:border-sport/60"
              >
                <PhotoSlot src={disciplinePhotos[d.id].src} position={disciplinePhotos[d.id].position} alt={`${d.name} – Tritotal Team`} discipline={d.id} label={d.name} className="aspect-[4/3] transition duration-500 group-hover:scale-[1.03]" />
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-3">
                    <Icon className="h-8 w-8 text-sport" />
                    <h3 className="font-display text-3xl font-bold uppercase">{d.name}</h3>
                  </div>
                  <p className="mt-3 text-mist">{d.tagline}</p>
                  <ul className="mt-5 space-y-2 text-sm">
                    {d.focus.map((f) => (
                      <li key={f} className="flex gap-2"><span className="mt-2 h-1 w-3 shrink-0 bg-sport" />{f}</li>
                    ))}
                  </ul>
                  <span className="mt-6 inline-flex items-center gap-2 font-display font-semibold uppercase tracking-wider text-sport">
                    Ver más <ArrowIcon className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </Section>

      {/* PREPARACIÓN ESPECÍFICA */}
      <Section className="bg-petrol-950">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          <SectionTitle
            eyebrow="Preparación específica"
            title={<>Del primer triatlón al <span className="text-sport">Full Ironman</span></>}
            intro="Preparación orientada a tu competencia objetivo, con una progresión pensada para tu experiencia."
          />
          <ol className="divide-y divide-white/10 border-y border-white/10">
            {programs.map((p, i) => (
              <li key={p.name} className="reveal flex gap-6 py-6">
                <span className="font-display text-4xl font-extrabold text-petrol-500">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="font-display text-2xl font-bold uppercase">{p.name}</h3>
                  <p className="mt-1 text-mist">{p.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* PILARES */}
      <Section>
        <SectionTitle eyebrow="Cómo entrenamos" title="Lo que nos mueve" />
        <div className="grid gap-px overflow-hidden rounded-sm bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p) => (
            <div key={p.n} className="reveal bg-ink p-8">
              <p className="font-display text-sm font-bold text-sport">{p.n}</p>
              <h3 className="mt-3 font-display text-3xl font-bold uppercase">{p.title}</h3>
              <p className="mt-3 text-mist">{p.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-4">
          <ButtonLink href="/nosotros" variant="outline">Conoce al equipo</ButtonLink>
          <ButtonLink href="/planes" variant="ghost">Ver planes <ArrowIcon className="h-5 w-5" /></ButtonLink>
        </div>
      </Section>

      {/* EN COMPETENCIA */}
      <section className="bg-petrol-950 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle eyebrow="En competencia" title={<>Entrenamos para <span className="text-sport">este momento</span></>} />
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:grid-rows-2">
            {featuredPhotos.map((src, i) => (
              <div key={src} className={`reveal relative overflow-hidden ${i === 0 ? "col-span-2 row-span-2 aspect-square md:aspect-auto" : "aspect-square"}`}>
                <PhotoSlot src={src} alt="Deportista de Tritotal Team en competencia" className="h-full w-full transition duration-700 hover:scale-105" sizes={i === 0 ? "(min-width:768px) 50vw, 100vw" : "(min-width:768px) 25vw, 50vw"} />
              </div>
            ))}
          </div>
          <div className="mt-8">
            <ButtonLink href="/galeria" variant="outline">Ver galería <ArrowIcon className="h-5 w-5" /></ButtonLink>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="relative overflow-hidden bg-sport text-ink">
        <div className="bg-lanes absolute inset-0 opacity-60" />
        <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-8 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-20">
          <h2 className="max-w-2xl font-display text-4xl font-extrabold uppercase leading-[0.95] sm:text-6xl">
            Tu próxima meta empieza hoy.
          </h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/inscripcion" variant="dark">
              Inscríbete
            </ButtonLink>
            <ButtonLink href={whatsappLink()} external variant="outlineDark">
              <WhatsAppIcon className="h-5 w-5" /> Escríbenos
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
