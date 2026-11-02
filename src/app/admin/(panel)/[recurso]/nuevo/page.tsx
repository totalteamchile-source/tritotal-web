import { notFound } from "next/navigation";
import { getResource } from "@/lib/admin/resources";
import { loadRelations } from "@/lib/admin/data";
import { requireRol } from "@/lib/server/auth";
import { ResourceForm } from "@/components/admin/ResourceForm";
import { saveRecord } from "../../../actions";

export default async function NewPage({ params }: { params: Promise<{ recurso: string }> }) {
  const { recurso } = await params;
  const res = getResource(recurso);
  if (!res || res.canCreate === false) notFound();
  await requireRol(res.roles);
  const today = new Date().toISOString().slice(0, 10);
  const defaults: Record<string, unknown> = {};
  for (const f of res.fields) if (f.type === "date" && f.required) defaults[f.name] = today;

  return (
    <div className="max-w-3xl">
      <h1 className="mb-8 font-display text-4xl font-extrabold uppercase">Agregar {res.singular}</h1>
      <ResourceForm
        fields={res.fields}
        values={defaults}
        relations={await loadRelations(res)}
        action={saveRecord.bind(null, res.slug, null)}
        cancelHref={`/admin/${res.slug}`}
      />
    </div>
  );
}
