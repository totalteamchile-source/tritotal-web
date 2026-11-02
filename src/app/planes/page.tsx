import type { Metadata } from "next";
import Link from "next/link";
import { billingLabel, formatCLP, plans } from "@/content/plans";
import { PageHero, Section } from "@/components/ui";
import { whatsappLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Planes y membresías",
  description: "Planes de entrenamiento de triatlón, natación, ciclismo y running de Tritotal Team.",
};

export default function PlanesPage() {
  return (
    <>
      <PageHero eyebrow="Planes y membresías" title={<>Elige tu <span className="text-sport">plan</span></>} intro="Planes mensuales, trimestrales y otras modalidades. Los precios se publicarán una vez confirmados." />
      <Section>
        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((p) => (
            <article
              key={p.id}
              className={`relative flex flex-col rounded-sm border p-7 ${p.highlighted ? "border-sport bg-gradient-to-b from-petrol-800 to-petrol-950" : "border-white/10 bg-petrol-950"}`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-petrol-300">{billingLabel[p.billing]}</p>
              <h2 className="mt-2 font-display text-3xl font-extrabold uppercase">{p.name}</h2>
              <p className="mt-3 text-mist">{p.description}</p>

              <div className="my-6 border-y border-white/10 py-5">
                {p.price !== null ? (
                  <p className="font-display text-5xl font-extrabold">
                    {formatCLP(p.price)}
                    <span className="ml-1 text-base font-medium text-mist">/{p.billing === "trimestral" ? "trimestre" : "mes"}</span>
                  </p>
                ) : (
                  <p className="font-display text-3xl font-bold text-petrol-300">Precio por confirmar</p>
                )}
              </div>

              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="font-semibold uppercase tracking-wider text-sport">Disciplinas</dt>
                  <dd className="mt-1">{p.disciplines.join(" · ")}</dd>
                </div>
                <div>
                  <dt className="font-semibold uppercase tracking-wider text-sport">Frecuencia</dt>
                  <dd className="mt-1 text-mist">{p.frequency ?? "Por definir"}</dd>
                </div>
                <div>
                  <dt className="font-semibold uppercase tracking-wider text-sport">Beneficios</dt>
                  <dd className="mt-1 text-mist">
                    {p.benefits.length ? (
                      <ul className="space-y-1">{p.benefits.map((b) => <li key={b}>✓ {b}</li>)}</ul>
                    ) : (
                      "Por definir"
                    )}
                  </dd>
                </div>
              </dl>

              <div className="mt-auto flex flex-col gap-3 pt-8">
                <Link
                  href={`/inscripcion?plan=${encodeURIComponent(p.id)}`}
                  className="rounded-sm bg-sport py-3.5 text-ink text-center font-display font-bold uppercase tracking-wider hover:bg-sport-600"
                >
                  Inscribirme
                </Link>
                <a
                  href={whatsappLink(`Hola, quiero información sobre el ${p.name} de Tritotal Team.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 text-center text-sm text-mist underline-offset-4 hover:text-white hover:underline"
                >
                  Consultar por WhatsApp
                </a>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-10 text-center text-sm text-mist">
          ¿Buscas otra modalidad? <a className="text-sport hover:underline" href={whatsappLink()} target="_blank" rel="noopener noreferrer">Conversemos</a>.
        </p>
      </Section>
    </>
  );
}
