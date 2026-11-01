import { ButtonLink, PageHero, Section } from "@/components/ui";

export default function NotFound() {
  return (
    <>
      <PageHero eyebrow="Error 404" title="Página no encontrada" />
      <Section><ButtonLink href="/">Volver al inicio</ButtonLink></Section>
    </>
  );
}
