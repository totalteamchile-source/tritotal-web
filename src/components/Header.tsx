"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav } from "@/config/site";
import { Logo } from "./Logo";
import { CartButton } from "./shop/CartButton";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        scrolled || open ? "bg-ink/95 backdrop-blur border-b border-white/10" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-8">
        <Link href="/" aria-label="Tritotal Team, inicio" className="shrink-0">
          <Logo variant="secundario" height={34} />
        </Link>

        <nav aria-label="Principal" className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {nav.slice(1).map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`relative whitespace-nowrap px-3 py-2 font-display text-[15px] font-semibold uppercase tracking-wider transition-colors hover:text-white ${
                    isActive(item.href) ? "text-white" : "text-mist"
                  }`}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <span className="absolute inset-x-3 -bottom-0.5 h-0.5 bg-sport" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <CartButton />
          <Link
            href="/inscripcion"
            className="hidden rounded-sm bg-sport px-5 py-2.5 font-display text-sm font-bold uppercase tracking-wider text-ink transition hover:bg-sport-600 sm:inline-block"
          >
            Únete
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="menu-movil"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 xl:hidden"
          >
            <span className={`h-0.5 w-6 bg-white transition ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`h-0.5 w-6 bg-white transition ${open ? "opacity-0" : ""}`} />
            <span className={`h-0.5 w-6 bg-white transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      <div
        id="menu-movil"
        hidden={!open}
        className="h-[calc(100dvh-4rem)] overflow-y-auto border-t border-white/10 bg-ink px-4 pb-10 pt-4 xl:hidden"
      >
        <ul className="flex flex-col">
          {nav.map((item) => (
            <li key={item.href} className="border-b border-white/5">
              <Link
                href={item.href}
                className={`flex items-center justify-between py-4 font-display text-2xl font-bold uppercase tracking-wide ${
                  isActive(item.href) ? "text-sport" : "text-white"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/inscripcion"
          className="mt-8 block rounded-sm bg-sport py-4 text-ink text-center font-display text-lg font-bold uppercase tracking-wider"
        >
          Únete a Tritotal Team
        </Link>
      </div>
    </header>
  );
}
