import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { CartProvider } from "@/components/shop/CartProvider";
import { Reveal } from "@/components/Reveal";

/** Layout del sitio público (el panel /admin usa el suyo). */
export default function SitioLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-sport focus:text-ink focus:px-4 focus:py-2">
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido">{children}</main>
      <Footer />
      <WhatsAppFloat />
      <Reveal />
    </CartProvider>
  );
}
