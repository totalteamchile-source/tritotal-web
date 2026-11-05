"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getResource, contentKeys, type Field } from "@/lib/admin/resources";
import { requireRol, supabaseAuth } from "@/lib/server/auth";
import { supabaseAdmin } from "@/lib/server/supabase";
import { isAuthConfigured } from "@/lib/server/env";
import { parseVariantes } from "@/lib/shop";

export type FormState = { error?: string; ok?: string } | undefined;

const MAX_IMG = 4 * 1024 * 1024; // Vercel limita el cuerpo de la solicitud a ~4,5 MB
const IMG_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

function db() {
  const c = supabaseAdmin();
  if (!c) throw new Error("Supabase no está configurado.");
  return c;
}

/** Extrae el ID de un enlace de YouTube (o devuelve el texto si ya es un ID). */
function youtubeId(v: string) {
  const m = v.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
  return m ? m[1] : v.trim();
}

async function uploadImage(file: File) {
  if (!IMG_TYPES.includes(file.type)) throw new Error("La imagen debe ser JPG, PNG, WEBP o AVIF.");
  if (file.size > MAX_IMG) throw new Error("La imagen supera 4 MB. Redúcela antes de subirla.");
  const ext = file.type.split("/")[1].replace("jpeg", "jpg");
  const path = `${new Date().getFullYear()}/${randomUUID()}.${ext}`;
  const { error } = await db().storage.from("medios").upload(path, file, { contentType: file.type });
  if (error) throw new Error("No se pudo subir la imagen: " + error.message);
  return db().storage.from("medios").getPublicUrl(path).data.publicUrl;
}

const MAX_PDF = 4 * 1024 * 1024;

/** Sube un PDF al bucket PRIVADO de productos digitales y devuelve su ruta (no una URL). */
async function uploadPdf(file: File) {
  if (file.type !== "application/pdf") throw new Error("El archivo debe ser un PDF.");
  if (file.size > MAX_PDF) throw new Error("El PDF supera 4 MB. Comprímelo antes de subirlo o súbelo desde Supabase → Storage → productos-digitales.");
  const path = `${randomUUID()}.pdf`;
  const { error } = await db().storage.from("productos-digitales").upload(path, file, { contentType: "application/pdf" });
  if (error) throw new Error("No se pudo subir el PDF: " + error.message + " (¿ejecutaste la migración 0009?)");
  return path;
}

async function readField(f: Field, fd: FormData): Promise<unknown> {
  const raw = fd.get(f.name);
  const str = typeof raw === "string" ? raw.trim() : "";
  switch (f.type) {
    case "number": {
      if (!str) return null;
      const n = Number(str.replace(/[.\s$]/g, ""));
      if (!Number.isFinite(n) || n < 0) throw new Error(`«${f.label}» debe ser un número.`);
      return Math.round(n);
    }
    case "checkbox":
      return fd.get(f.name) === "on";
    case "multiselect":
      return fd.getAll(f.name).map(String);
    case "list":
      return str.split("\n").map((s) => s.trim()).filter(Boolean);
    case "variants": {
      const v = parseVariantes(str);
      return v.length ? v : null;
    }
    case "image": {
      const file = fd.get(`${f.name}__file`);
      if (fd.get(`${f.name}__remove`) === "on") return null;
      if (file instanceof File && file.size > 0) return uploadImage(file);
      return str || null;
    }
    case "pdf": {
      const file = fd.get(`${f.name}__file`);
      if (fd.get(`${f.name}__remove`) === "on") return null;
      if (file instanceof File && file.size > 0) return uploadPdf(file);
      return str || null;
    }
    default:
      return str || null;
  }
}

export async function saveRecord(slug: string, id: string | null, _prev: FormState, fd: FormData): Promise<FormState> {
  const res = getResource(slug);
  if (!res) return { error: "Sección no encontrada." };
  await requireRol(res.roles);
  if (!id && res.canCreate === false) return { error: "No se pueden crear registros aquí." };

  const row: Record<string, unknown> = {};
  try {
    for (const f of res.fields) {
      if (f.readonly) continue;
      let v = await readField(f, fd);
      if (f.name === "youtube_id" && typeof v === "string") v = youtubeId(v);
      if (v === null && f.default !== undefined) v = f.default;
      const empty = v === null || v === "" || (Array.isArray(v) && v.length === 0);
      if (f.required && empty) return { error: `Completa «${f.label}».` };
      if (f.type === "select" && v && f.options && !f.options.includes(v as string)) return { error: `«${f.label}» no válido.` };
      row[f.name] = v;
    }
  } catch (e) {
    return { error: (e as Error).message };
  }

  const q = id ? db().from(res.table).update(row).eq("id", id) : db().from(res.table).insert(row);
  const { error } = await q;
  if (error) return { error: "No se pudo guardar: " + error.message };

  res.revalidate.forEach((p) => revalidatePath(p));
  if (slug === "productos") revalidatePath("/tienda/[id]", "page");
  revalidatePath(`/admin/${slug}`);
  revalidatePath("/admin");
  redirect(`/admin/${slug}?ok=1`);
}

export async function deleteRecord(slug: string, id: string) {
  const res = getResource(slug);
  if (!res) return;
  await requireRol(res.roles);
  await db().from(res.table).delete().eq("id", id);
  res.revalidate.forEach((p) => revalidatePath(p));
  revalidatePath(`/admin/${slug}`);
  revalidatePath("/admin");
  redirect(`/admin/${slug}?eliminado=1`);
}

/** Crea un deportista a partir de una inscripción y la marca como aceptada. */
export async function inscripcionADeportista(id: string) {
  await requireRol(["admin"]);
  const { data: i } = await db().from("inscripciones").select("*").eq("id", id).single();
  if (!i) redirect("/admin/inscripciones");
  const { data: existing } = await db().from("deportistas").select("id").eq("inscripcion_id", id).maybeSingle();
  let depId = existing?.id as string | undefined;
  if (!depId) {
    const planOk = i.plan_id && /^[0-9a-f-]{36}$/.test(i.plan_id) ? i.plan_id : null;
    const { data: d, error } = await db()
      .from("deportistas")
      .insert({
        nombre: i.nombre,
        rut: i.rut,
        email: i.email,
        telefono: i.telefono,
        fecha_nacimiento: i.fecha_nacimiento,
        emergencia_nombre: i.emergencia_nombre,
        emergencia_telefono: i.emergencia_telefono,
        plan_id: planOk,
        inscripcion_id: i.id,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    depId = d.id;
  }
  await db().from("inscripciones").update({ estado: "aceptada" }).eq("id", id);
  revalidatePath("/admin", "layout");
  redirect(`/admin/deportistas/${depId}`);
}

export async function saveContenido(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireRol(["admin"]);
  const rows = contentKeys.map((k) => ({ clave: k.clave, valor: String(fd.get(k.clave) ?? "").trim() || null }));
  const { error } = await db().from("contenido").upsert(rows);
  if (error) return { error: "No se pudo guardar: " + error.message };
  revalidatePath("/", "layout");
  return { ok: "Cambios guardados y publicados." };
}

export async function createUsuario(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireRol(["admin"]);
  const email = String(fd.get("email") ?? "").trim().toLowerCase();
  const nombre = String(fd.get("nombre") ?? "").trim() || null;
  const rol = String(fd.get("rol"));
  const password = String(fd.get("password") ?? "");
  if (!/^\S+@\S+\.\S+$/.test(email)) return { error: "Correo no válido." };
  if (!["admin", "entrenador"].includes(rol)) return { error: "Rol no válido." };
  if (password.length < 10) return { error: "La contraseña temporal debe tener al menos 10 caracteres." };

  const { data, error } = await db().auth.admin.createUser({ email, password, email_confirm: true });
  if (error || !data.user) return { error: "No se pudo crear el usuario: " + (error?.message ?? "") };
  const { error: e2 } = await db().from("perfiles").insert({ id: data.user.id, email, nombre, rol });
  if (e2) return { error: "Usuario creado, pero no se pudo asignar el rol: " + e2.message };
  revalidatePath("/admin/usuarios");
  return { ok: `Usuario ${email} creado. Entrégale la contraseña temporal por un medio privado.` };
}

export async function deleteUsuario(id: string) {
  const yo = await requireRol(["admin"]);
  if (id === yo.id) redirect("/admin/usuarios");
  await db().auth.admin.deleteUser(id);
  revalidatePath("/admin/usuarios");
  redirect("/admin/usuarios");
}

export async function cambiarClave(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireRol();
  const password = String(fd.get("password") ?? "");
  if (password.length < 10) return { error: "La contraseña debe tener al menos 10 caracteres." };
  if (password !== String(fd.get("password2") ?? "")) return { error: "Las contraseñas no coinciden." };
  const auth = await supabaseAuth();
  const { error } = await auth.auth.updateUser({ password });
  if (error) return { error: "No se pudo cambiar la contraseña: " + error.message };
  return { ok: "Contraseña actualizada." };
}

export async function login(_prev: FormState, fd: FormData): Promise<FormState> {
  if (!isAuthConfigured()) return { error: "El panel aún no está configurado: faltan claves de Supabase en Vercel." };
  const email = String(fd.get("email") ?? "").trim();
  const password = String(fd.get("password") ?? "");
  const auth = await supabaseAuth();
  const { error } = await auth.auth.signInWithPassword({ email, password });
  if (error) return { error: "Correo o contraseña incorrectos." };
  redirect("/admin");
}

export async function logout() {
  const auth = await supabaseAuth();
  await auth.auth.signOut();
  redirect("/admin/login");
}
