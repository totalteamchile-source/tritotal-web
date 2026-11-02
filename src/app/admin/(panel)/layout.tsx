import { requireRol } from "@/lib/server/auth";
import { resources } from "@/lib/admin/resources";
import { AdminNav } from "./AdminNav";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const perfil = await requireRol();
  const items = [
    { href: "/admin", label: "Resumen" },
    ...resources.filter((r) => r.roles.includes(perfil.rol)).map((r) => ({ href: `/admin/${r.slug}`, label: r.title })),
    ...(perfil.rol === "admin"
      ? [
          { href: "/admin/contenido", label: "Textos del sitio" },
          { href: "/admin/usuarios", label: "Usuarios del panel" },
        ]
      : []),
    { href: "/admin/cuenta", label: "Mi cuenta" },
  ];
  return (
    <div className="lg:flex">
      <AdminNav items={items} email={perfil.email} rol={perfil.rol} />
      <main className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:py-10">{children}</main>
    </div>
  );
}
