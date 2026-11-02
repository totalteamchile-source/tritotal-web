import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { env, isAuthConfigured } from "./env";
import { supabaseAdmin } from "./supabase";

export type Rol = "admin" | "entrenador";
export type Perfil = { id: string; email: string; nombre: string | null; rol: Rol };

/** Cliente de Supabase con la sesión del usuario (cookies). Solo para autenticación. */
export async function supabaseAuth() {
  const store = await cookies();
  return createServerClient(env.supabaseUrl, env.supabaseAnonKey, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          // Llamado desde un Server Component: el middleware renueva la sesión.
        }
      },
    },
  });
}

/**
 * Usuario actual del panel con su rol, o null.
 * El correo definido en ADMIN_EMAIL obtiene rol admin automáticamente la primera vez.
 */
export const getPerfil = cache(async (): Promise<Perfil | null> => {
  if (!isAuthConfigured()) return null;
  const auth = await supabaseAuth();
  const { data } = await auth.auth.getUser();
  const user = data.user;
  if (!user?.email) return null;

  const db = supabaseAdmin()!;
  const { data: perfil } = await db.from("perfiles").select("id,email,nombre,rol").eq("id", user.id).maybeSingle();
  if (perfil) return perfil as Perfil;

  // Solo con correo confirmado, para que nadie pueda reclamar el rol registrándose con ese correo.
  if (env.adminEmail && user.email_confirmed_at && user.email.toLowerCase() === env.adminEmail.toLowerCase()) {
    const nuevo: Perfil = { id: user.id, email: user.email, nombre: null, rol: "admin" };
    await db.from("perfiles").insert(nuevo);
    return nuevo;
  }
  return null;
});

/** Exige sesión con alguno de los roles indicados; si no, redirige al login. */
export async function requireRol(roles: Rol[] = ["admin", "entrenador"]) {
  const perfil = await getPerfil();
  if (!perfil) redirect("/admin/login");
  if (!roles.includes(perfil.rol)) redirect("/admin?sin-permiso=1");
  return perfil;
}
