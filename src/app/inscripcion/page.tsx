import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero, Section } from "@/components/ui";
import { RegistrationForm } from "./RegistrationForm";

export const metadata: Metadata = {
  title: "Inscripción",
  description: "Inscríbete en Tritotal Team: entrenamiento de triatlón, natación, ciclismo y running.",
};

export default function InscripcionPage() {
  return (
    <>
      <PageHero eyebrow="Inscripción" title={<>Únete a <span className="text-sport">Tritotal Team</span></>} intro="Completa tus datos y te contactaremos para coordinar tu ingreso al equipo." />
      <Section>
        <Suspense>
          <RegistrationForm />
        </Suspense>
      </Section>
    </>
  );
}
