import Link from "next/link";
import { requireRol } from "@/lib/server/auth";
import { supabaseAdmin } from "@/lib/server/supabase";

export const metadata = { title: "Resumen" };

async function count(table: string, filter?: (q: any) => any) { // eslint-disable-line @typescript-eslint/no-explicit-any
  let q = supabaseAdmin()!.from(table).select("id", { count: "exact", head: true });
  if (filter) q = filter(q);
  const { count } = await q;
  return count ?? 0;
}

export default async function Dashboard({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const perfil = await requireRol();
  const sp = await searchParams;
  const hace30 = new Date(Date.now() - 30 * 864e5).toISOString();

  const [total, activos, nuevas, pendientes] = await Promise.all([
    count("deportistas"),
    count("deportistas", (q) => q.eq("estado", "activo")),
    perfil.rol === "admin" ? count("inscripciones", (q) => q.gte("creado_en", hace30)) : Promise.resolve(null),
    perfil.rol === "admin" ? count("inscripciones", (q) => q.eq("estado", "pendiente")) : Promise.resolve(null),
  ]);

  const cards = [
    { label: "Deportistas inscritos", value: total, href: "/admin/deportistas" },
    { label: "Deportistas activos", value: activos, href: "/admin/deportistas" },
    ...(nuevas !== null ? [{ label: "Nuevas inscripciones (30 días)", value: nuevas, href: "/admin/inscripciones" }] : []),
    ...(pendientes !== null ? [{ label: "Inscripciones por revisar", value: pendientes, href: "/admin/inscripciones", alert: pendientes > 0 }] : []),
  ];

  return (
    <div className="max-w-6xl">
      {sp["sin-permiso"] && (
        <p className="mb-6 rounded-sm border border-yellow-400/40 bg-yellow-400/10 p-3 text-sm text-yellow-200">No tienes permiso para esa sección.</p>
      )}
      <h1 className="font-display text-4xl font-extrabold uppercase">Resumen</h1>
      <p className="mt-1 text-mist">Hola{perfil.nombre ? `, ${perfil.nombre}` : ""}. Este es el estado del equipo.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className={`rounded-sm border bg-ink p-5 transition hover:border-sport/60 ${"alert" in c && c.alert ? "border-sport/60" : "border-white/10"}`}>
            <p className="font-display text-5xl font-extrabold">{c.value}</p>
            <p className="mt-1 text-sm text-mist">{c.label}</p>
          </Link>
        ))}
      </div>

      {perfil.rol === "admin" && (
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {["Mensualidades pagadas", "Mensualidades pendientes", "Ingresos del período"].map((l) => (
            <div key={l} className="rounded-sm border border-dashed border-white/15 p-5">
              <p className="font-display text-2xl font-bold text-mist/60">—</p>
              <p className="mt-1 text-sm text-mist/70">{l}</p>
              <p className="mt-2 text-xs text-mist/50">Disponible al activar el módulo de pagos.</p>
            </div>
          ))}
        </div>
      )}

      <h2 className="mt-12 font-display text-2xl font-bold uppercase">Accesos rápidos</h2>
      <div className="mt-4 flex flex-wrap gap-3">
        {[
          ["/admin/horarios/nuevo", "Publicar horario"],
          ["/admin/competencias/nuevo", "Publicar competencia"],
          ["/admin/resultados/nuevo", "Registrar resultado"],
          ["/admin/fotos/nuevo", "Subir foto"],
          ["/admin/noticias/nuevo", "Publicar noticia"],
          ...(perfil.rol === "admin" ? [["/admin/deportistas/nuevo", "Registrar deportista"], ["/admin/planes", "Editar planes y precios"]] : []),
        ].map(([href, label]) => (
          <Link key={href} href={href} className="rounded-sm border border-white/15 px-4 py-2 text-sm hover:border-sport hover:text-sport">
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
