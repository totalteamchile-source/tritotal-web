import { Logo } from "@/components/Logo";
import { getPerfil } from "@/lib/server/auth";
import { redirect } from "next/navigation";
import { isAuthConfigured } from "@/lib/server/env";
import { LoginForm } from "./LoginForm";
import { logout } from "../actions";
import { supabaseAuth } from "@/lib/server/auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Ingresar" };

export default async function LoginPage() {
  const configured = isAuthConfigured();
  let sinPermiso = false;
  if (configured) {
    if (await getPerfil()) redirect("/admin");
    const { data } = await (await supabaseAuth()).auth.getUser();
    sinPermiso = Boolean(data.user);
  }

  return (
    <main className="bg-lanes flex min-h-dvh items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center"><Logo variant="principal" height={80} /></div>
        <div className="rounded-sm border border-white/10 bg-ink p-7">
          <h1 className="mb-6 font-display text-2xl font-bold uppercase">Panel de administración</h1>
          {!configured && (
            <p className="mb-5 rounded-sm border border-yellow-400/40 bg-yellow-400/10 p-3 text-sm text-yellow-200">
              Falta configurar Supabase (SUPABASE_URL, SUPABASE_ANON_KEY y SUPABASE_SERVICE_ROLE_KEY).
            </p>
          )}
          {sinPermiso ? (
            <div className="space-y-4 text-sm">
              <p className="text-mist">Tu usuario no tiene permisos para el panel. Pide acceso al administrador.</p>
              <form action={logout}><button className="text-sport underline">Cerrar sesión</button></form>
            </div>
          ) : (
            <LoginForm />
          )}
        </div>
      </div>
    </main>
  );
}
