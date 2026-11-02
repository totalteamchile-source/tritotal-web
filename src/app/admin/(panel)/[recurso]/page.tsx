import Link from "next/link";
import { notFound } from "next/navigation";
import { getResource, DIAS, type Field } from "@/lib/admin/resources";
import { loadRelations } from "@/lib/admin/data";
import { requireRol } from "@/lib/server/auth";
import { supabaseAdmin } from "@/lib/server/supabase";

const PAGE = 50;

function Cell({ f, v, rel }: { f?: Field; v: unknown; rel: Record<string, { id: string; label: string }[]> }) {
  if (v === null || v === undefined || v === "") return <span className="text-mist/40">—</span>;
  if (!f && typeof v === "string" && /^\d{4}-\d{2}-\d{2}T/.test(v)) return <>{new Date(v).toLocaleDateString("es-CL")}</>;
  if (f?.type === "checkbox") return <span className={v ? "text-sport" : "text-mist/50"}>{v ? "Sí" : "No"}</span>;
  if (f?.type === "image")
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={String(v)} alt="" className="h-12 w-12 rounded-sm object-cover" />;
  if (f?.type === "relation") return <>{rel[f.name]?.find((o) => o.id === v)?.label ?? "—"}</>;
  if (f?.name === "precio") return <>{new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(Number(v))}</>;
  if (f?.type === "date") return <>{new Date(String(v) + "T12:00:00").toLocaleDateString("es-CL")}</>;
  if (f?.name === "estado") {
    const color: Record<string, string> = { pendiente: "bg-sport text-ink", activo: "bg-emerald-400/20 text-emerald-300", aceptada: "bg-emerald-400/20 text-emerald-300", rechazada: "bg-red-400/20 text-red-300", inactivo: "bg-white/10 text-mist" };
    return <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${color[String(v)] ?? "bg-white/10"}`}>{String(v)}</span>;
  }
  return <>{Array.isArray(v) ? v.join(", ") : String(v)}</>;
}

export default async function ListPage({ params, searchParams }: { params: Promise<{ recurso: string }>; searchParams: Promise<Record<string, string>> }) {
  const { recurso } = await params;
  const sp = await searchParams;
  const res = getResource(recurso);
  if (!res) notFound();
  await requireRol(res.roles);

  const page = Math.max(1, Number(sp.p) || 1);
  const q = (sp.q ?? "").trim();
  const searchable = res.fields.some((f) => f.name === "nombre") ? "nombre" : res.fields.find((f) => f.type === "text")?.name;

  let query = supabaseAdmin()!.from(res.table).select("*", { count: "exact" });
  for (const o of res.orderBy) query = query.order(o.column, { ascending: o.ascending });
  if (q && searchable) query = query.ilike(searchable, `%${q.replace(/[%_]/g, "")}%`);
  if (sp.estado) query = query.eq("estado", sp.estado);
  const { data, count, error } = await query.range((page - 1) * PAGE, page * PAGE - 1);

  let rows = (data ?? []) as Record<string, unknown>[];
  if (res.slug === "horarios") rows = rows.sort((a, b) => DIAS.indexOf(a.dia as never) - DIAS.indexOf(b.dia as never) || String(a.hora).localeCompare(String(b.hora)));
  const rel = await loadRelations(res);
  const estadoField = res.fields.find((f) => f.name === "estado");
  const pages = Math.ceil((count ?? 0) / PAGE);

  return (
    <div className="max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-extrabold uppercase">{res.title}</h1>
          {res.description && <p className="mt-1 text-mist">{res.description}</p>}
        </div>
        {res.canCreate !== false && (
          <Link href={`/admin/${res.slug}/nuevo`} className="rounded-sm bg-sport px-5 py-2.5 font-display font-bold uppercase tracking-wider text-ink hover:bg-sport-600">
            + Agregar {res.singular}
          </Link>
        )}
      </div>

      {(sp.ok || sp.eliminado) && (
        <p role="status" className="mt-6 rounded-sm border border-sport/50 bg-sport/10 p-3 text-sm text-sport">
          {sp.ok ? "Cambios guardados." : "Registro eliminado."}
          {res.revalidate.length > 0 && " El sitio ya muestra la información actualizada."}
        </p>
      )}
      {error && <p className="mt-6 rounded-sm border border-red-400/50 bg-red-500/10 p-3 text-sm text-red-300">Error al cargar: {error.message}</p>}

      {(searchable || estadoField) && (
        <form className="mt-6 flex flex-wrap gap-3">
          {searchable && <input name="q" defaultValue={q} placeholder="Buscar…" className="w-full max-w-xs rounded-sm border border-white/15 bg-ink px-3 py-2 text-sm" />}
          {estadoField && (
            <select name="estado" defaultValue={sp.estado ?? ""} className="rounded-sm border border-white/15 bg-ink px-3 py-2 text-sm">
              <option value="">Todos los estados</option>
              {estadoField.options?.map((o) => <option key={o}>{o}</option>)}
            </select>
          )}
          <button className="rounded-sm border border-white/20 px-4 py-2 text-sm hover:bg-white/5">Filtrar</button>
        </form>
      )}

      <div className="mt-6 overflow-x-auto rounded-sm border border-white/10 bg-ink">
        {rows.length ? (
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="border-b border-white/10 text-xs uppercase tracking-wider text-mist">
              <tr>
                {res.columns.map((c) => (
                  <th key={c} className="px-4 py-3 font-semibold">{res.fields.find((f) => f.name === c)?.label ?? (c === "creado_en" ? "Fecha" : c)}</th>
                ))}
                <th />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rows.map((r) => (
                <tr key={String(r.id)} className="hover:bg-white/[0.03]">
                  {res.columns.map((c) => (
                    <td key={c} className="px-4 py-3">
                      <Cell f={res.fields.find((f) => f.name === c && f.name !== "creado_en")} v={r[c]} rel={rel} />
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/${res.slug}/${r.id}`} className="text-sport hover:underline">Abrir</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="p-8 text-center text-mist">
            {q || sp.estado ? "No hay resultados para ese filtro." : `Aún no hay ${res.title.toLowerCase()}.`}
          </p>
        )}
      </div>

      {pages > 1 && (
        <div className="mt-4 flex items-center gap-4 text-sm">
          {page > 1 && <Link href={`?${new URLSearchParams({ ...sp, p: String(page - 1) })}`} className="text-sport">← Anterior</Link>}
          <span className="text-mist">Página {page} de {pages}</span>
          {page < pages && <Link href={`?${new URLSearchParams({ ...sp, p: String(page + 1) })}`} className="text-sport">Siguiente →</Link>}
        </div>
      )}
    </div>
  );
}
