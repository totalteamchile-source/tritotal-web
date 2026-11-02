import { Header } from "@/components/Header";
import { CartProvider } from "@/components/shop/CartProvider";
import { Footer } from "@/components/Footer";
import { ButtonLink, PageHero, Section } from "@/components/ui";

export default function NotFound() {
  return (
    <CartProvider>
      <Header />
      <main>
        <PageHero eyebrow="Error 404" title="Página no encontrada" />
        <Section><ButtonLink href="/">Volver al inicio</ButtonLink></Section>
      </main>
      <Footer />
    </CartProvider>
  );
}
