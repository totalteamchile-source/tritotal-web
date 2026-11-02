import { requireRol } from "@/lib/server/auth";
import { supabaseAdmin } from "@/lib/server/supabase";
import { ContenidoForm } from "./ContenidoForm";

export const metadata = { title: "Textos del sitio" };

export default async function ContenidoPage() {
  await requireRol(["admin"]);
  const { data } = await supabaseAdmin()!.from("contenido").select("clave,valor");
  const values = Object.fromEntries((data ?? []).map((r) => [r.clave, r.valor ?? ""]));
  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-4xl font-extrabold uppercase">Textos del sitio</h1>
      <p className="mb-8 mt-1 text-mist">Lo que dejes vacío aparece en el sitio como «contenido pendiente».</p>
      <ContenidoForm values={values} />
    </div>
  );
}
