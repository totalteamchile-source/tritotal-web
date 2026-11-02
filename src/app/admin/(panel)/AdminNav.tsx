"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { logout } from "../actions";

export function AdminNav({ items, email, rol }: { items: { href: string; label: string }[]; email: string; rol: string }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [path]);
  const active = (h: string) => (h === "/admin" ? path === h : path.startsWith(h));

  return (
    <aside className="border-b border-white/10 bg-ink lg:sticky lg:top-0 lg:h-dvh lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
      <div className="flex h-16 items-center justify-between px-4 lg:h-20 lg:px-6">
        <Link href="/admin"><Logo variant="secundario" height={28} /></Link>
        <button onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-label="Menú" className="rounded-sm border border-white/20 px-3 py-1.5 text-sm lg:hidden">
          {open ? "Cerrar" : "Menú"}
        </button>
      </div>
      <div className={`${open ? "block" : "hidden"} px-3 pb-6 lg:flex lg:h-[calc(100dvh-5rem)] lg:flex-col lg:px-4`}>
        <nav className="flex-1 overflow-y-auto">
          <ul className="space-y-0.5">
            {items.map((i) => (
              <li key={i.href}>
                <Link
                  href={i.href}
                  className={`block rounded-sm px-3 py-2 text-sm ${active(i.href) ? "bg-sport/15 font-semibold text-sport" : "text-mist hover:bg-white/5 hover:text-white"}`}
                >
                  {i.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-6 border-t border-white/10 pt-4 text-xs text-mist">
          <p className="truncate">{email}</p>
          <p className="uppercase tracking-wider text-sport">{rol}</p>
          <div className="mt-3 flex gap-4">
            <Link href="/" target="_blank" className="hover:text-white">Ver sitio ↗</Link>
            <form action={logout}><button className="hover:text-white">Cerrar sesión</button></form>
          </div>
        </div>
      </div>
    </aside>
  );
}
