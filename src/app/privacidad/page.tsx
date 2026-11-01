import type { Metadata } from "next";
import { PageHero, Pending, Section } from "@/components/ui";

export const metadata: Metadata = { title: "Tratamiento de datos personales", robots: { index: false } };

export default function PrivacidadPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Tratamiento de datos personales" />
      <Section>
        <Pending
          label="Texto pendiente"
          hint="Política de tratamiento de datos (Ley 19.628 y su actualización) a redactar y aprobar por Tritotal Team. Editar src/app/privacidad/page.tsx"
        />
      </Section>
    </>
  );
}
