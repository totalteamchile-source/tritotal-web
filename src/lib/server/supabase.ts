import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env, isDbConfigured } from "./env";

let client: SupabaseClient | null = null;

/** Cliente con la clave service_role. SOLO usar en el servidor. */
export function supabaseAdmin() {
  if (!isDbConfigured()) return null;
  client ??= createClient(env.supabaseUrl, env.supabaseServiceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}
