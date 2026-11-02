import { requireRol } from "@/lib/server/auth";
import { CuentaForm } from "./CuentaForm";

export const metadata = { title: "Mi cuenta" };

export default async function CuentaPage() {
  const perfil = await requireRol();
  return (
    <div className="max-w-md">
      <h1 className="font-display text-4xl font-extrabold uppercase">Mi cuenta</h1>
      <p className="mb-8 mt-1 text-mist">{perfil.email}</p>
      <CuentaForm />
    </div>
  );
}
