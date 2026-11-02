import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero, Section } from "@/components/ui";
import { RegistrationForm } from "./RegistrationForm";
import { getPlans } from "@/lib/data";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Inscripción",
  description: "Inscríbete en Tritotal Team: entrenamiento de triatlón, natación, ciclismo y running.",
};

export default async function InscripcionPage() {
  const plans = (await getPlans()).map((p) => ({ id: p.id, name: p.name }));
  return (
    <>
      <PageHero eyebrow="Inscripción" title={<>Únete a <span className="text-sport">Tritotal Team</span></>} intro="Completa tus datos y te contactaremos para coordinar tu ingreso al equipo." />
      <Section>
        <Suspense>
          <RegistrationForm plans={plans} />
        </Suspense>
      </Section>
    </>
  );
}
