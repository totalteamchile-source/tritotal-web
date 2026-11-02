import { requireRol } from "@/lib/server/auth";
import { supabaseAdmin } from "@/lib/server/supabase";
import { ContenidoForm } from "./ContenidoForm";
import { about } from "@/content/about";

/** Textos oficiales que se muestran mientras no se editen aquí. */
const defaults: Record<string, string> = {
  historia: about.history ?? "",
  mision: about.mission ?? "",
  vision: about.vision ?? "",
  filosofia: about.philosophy ?? "",
  comunidad: about.community ?? "",
};

export const metadata = { title: "Textos del sitio" };

export default async function ContenidoPage() {
  await requireRol(["admin"]);
  const { data } = await supabaseAdmin()!.from("contenido").select("clave,valor");
  const saved = Object.fromEntries((data ?? []).map((r) => [r.clave, r.valor ?? ""]));
  const values: Record<string, string> = { ...defaults };
  for (const [k, v] of Object.entries(saved)) if (v) values[k] = String(v);
  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-4xl font-extrabold uppercase">Textos del sitio</h1>
      <p className="mb-8 mt-1 text-mist">Los textos de Nosotros vienen precargados con la versión oficial; cámbialos aquí cuando quieras.</p>
      <ContenidoForm values={values} />
    </div>
  );
}
