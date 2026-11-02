import "server-only";

/**
 * Variables de entorno del servidor. Ninguna es obligatoria para que el sitio
 * funcione: si falta alguna, la función asociada queda desactivada y se informa
 * en la respuesta (nunca se simula).
 */
export const env = {
  supabaseUrl: process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  resendApiKey: process.env.RESEND_API_KEY || "",
  mailFrom: process.env.MAIL_FROM || "",
  adminEmail: process.env.ADMIN_EMAIL || "totalteamchile@gmail.com",
};

export const isDbConfigured = () => Boolean(env.supabaseUrl && env.supabaseServiceKey);
export const isMailConfigured = () => Boolean(env.resendApiKey && env.mailFrom);
export const isAuthConfigured = () => Boolean(env.supabaseUrl && env.supabaseAnonKey && env.supabaseServiceKey);
