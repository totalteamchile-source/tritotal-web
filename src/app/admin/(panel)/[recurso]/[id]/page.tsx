import { notFound } from "next/navigation";
import { getResource } from "@/lib/admin/resources";
import { loadRelations } from "@/lib/admin/data";
import { requireRol } from "@/lib/server/auth";
import { supabaseAdmin } from "@/lib/server/supabase";
import { whatsappLinkTo } from "@/lib/whatsapp";
import { ResourceForm } from "@/components/admin/ResourceForm";
import { DeleteButton } from "@/components/admin/FormBits";
import { saveRecord, deleteRecord, inscripcionADeportista } from "../../../actions";

export default async function EditPage({ params }: { params: Promise<{ recurso: string; id: string }> }) {
  const { recurso, id } = await params;
  const res = getResource(recurso);
  if (!res || !/^[0-9a-f-]{36}$/.test(id)) notFound();
  const perfil = await requireRol(res.roles);
  const { data } = await supabaseAdmin()!.from(res.table).select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const row = data as Record<string, unknown>;
  const phone = typeof row.telefono === "string" ? row.telefono : null;

  return (
    <div className="max-w-3xl">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-wider text-sport">{res.title}</p>
          <h1 className="font-display text-4xl font-extrabold uppercase">{String(row.nombre ?? row.titulo ?? row.folio ?? `Editar ${res.singular}`)}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {phone && (
            <a href={whatsappLinkTo(phone, `Hola ${String(row.nombre ?? "").split(" ")[0]}, te escribimos de Tritotal Team.`)} target="_blank" rel="noopener noreferrer" className="rounded-sm bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-ink">
              WhatsApp
            </a>
          )}
          {res.slug === "inscripciones" && perfil.rol === "admin" && (
            <form action={inscripcionADeportista.bind(null, id)}>
              <button className="rounded-sm border border-sport px-4 py-2.5 text-sm font-semibold text-sport hover:bg-sport hover:text-ink">
                Aceptar y crear deportista
              </button>
            </form>
          )}
        </div>
      </div>

      <ResourceForm
        fields={res.fields}
        values={row}
        relations={await loadRelations(res)}
        action={saveRecord.bind(null, res.slug, id)}
        cancelHref={`/admin/${res.slug}`}
      />

      <div className="mt-12 border-t border-white/10 pt-6">
        <DeleteButton action={deleteRecord.bind(null, res.slug, id)} label={`Eliminar ${res.singular}`} confirmText={`¿Eliminar este registro? Esta acción no se puede deshacer.`} />
      </div>
    </div>
  );
}
