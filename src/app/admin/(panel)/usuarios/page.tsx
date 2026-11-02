import { requireRol } from "@/lib/server/auth";
import { supabaseAdmin } from "@/lib/server/supabase";
import { DeleteButton } from "@/components/admin/FormBits";
import { deleteUsuario } from "../../actions";
import { NuevoUsuarioForm } from "./NuevoUsuarioForm";

export const metadata = { title: "Usuarios del panel" };

export default async function UsuariosPage() {
  const yo = await requireRol(["admin"]);
  const { data } = await supabaseAdmin()!.from("perfiles").select("*").order("creado_en");
  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-4xl font-extrabold uppercase">Usuarios del panel</h1>
      <p className="mt-1 text-mist">
        <b className="text-white">Admin</b>: acceso total. <b className="text-white">Entrenador</b>: deportistas, horarios, competencias, resultados, fotos, videos y noticias (sin precios, inscripciones ni usuarios).
      </p>

      <ul className="mt-8 divide-y divide-white/10 rounded-sm border border-white/10 bg-ink">
        {(data ?? []).map((u) => (
          <li key={u.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <p className="font-semibold">{u.nombre ?? u.email}</p>
              <p className="text-sm text-mist">{u.email} · <span className="uppercase text-sport">{u.rol}</span></p>
            </div>
            {u.id !== yo.id && (
              <DeleteButton action={deleteUsuario.bind(null, u.id)} label="Quitar acceso" confirmText={`¿Quitar el acceso de ${u.email}?`} />
            )}
          </li>
        ))}
      </ul>

      <h2 className="mb-4 mt-12 font-display text-2xl font-bold uppercase">Agregar usuario</h2>
      <NuevoUsuarioForm />
    </div>
  );
}
