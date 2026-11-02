import "server-only";
import type { Resource } from "./resources";
import { supabaseAdmin } from "@/lib/server/supabase";

/** Opciones para los campos relacionados (ej. plan de un deportista). */
export async function loadRelations(res: Resource) {
  const db = supabaseAdmin()!;
  const out: Record<string, { id: string; label: string }[]> = {};
  for (const f of res.fields) {
    if (f.type !== "relation" || !f.relation) continue;
    const { data } = await db.from(f.relation.table).select(`id, ${f.relation.label}`).order(f.relation.label);
    out[f.name] = ((data ?? []) as unknown as Record<string, string>[]).map((r) => ({ id: r.id, label: r[f.relation!.label] }));
  }
  return out;
}
