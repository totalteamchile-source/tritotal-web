import type { Metadata } from "next";
import { PageHero, Pending, Section } from "@/components/ui";

export const metadata: Metadata = { title: "Términos y condiciones", robots: { index: false } };

export default function TerminosPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Términos y condiciones" />
      <Section>
        <Pending label="Texto pendiente" hint="El texto legal debe ser redactado y aprobado por Tritotal Team. Editar src/app/terminos/page.tsx" />
      </Section>
    </>
  );
}
