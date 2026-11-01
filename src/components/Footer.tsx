import Link from "next/link";
import { nav, site } from "@/config/site";
import { whatsappLink } from "@/lib/whatsapp";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-petrol-950">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <Logo variant="principal" height={56} />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-mist">
            Natación, ciclismo y running. Preparación para triatlón, Ironman 70.3 y Full Ironman.
          </p>
        </div>

        <nav aria-label="Pie de página">
          <p className="mb-4 font-display text-sm font-bold uppercase tracking-widest text-sport">Sitio</p>
          <ul className="grid grid-cols-2 gap-2 text-sm text-mist">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="hover:text-white">{n.label}</Link>
              </li>
            ))}
            <li><Link href="/inscripcion" className="hover:text-white">Inscripción</Link></li>
          </ul>
        </nav>

        <div>
          <p className="mb-4 font-display text-sm font-bold uppercase tracking-widest text-sport">Contacto</p>
          <ul className="space-y-2 text-sm text-mist">
            <li>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                WhatsApp {site.whatsapp.display}
              </a>
            </li>
            {site.instagram && (
              <li><a href={site.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white">Instagram</a></li>
            )}
            {site.email && (
              <li><a href={`mailto:${site.email}`} className="hover:text-white">{site.email}</a></li>
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-mist/70 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Tritotal Team</p>
          <p className="flex gap-4">
            <Link href="/terminos" className="hover:text-white">Términos y condiciones</Link>
            <Link href="/privacidad" className="hover:text-white">Datos personales</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
