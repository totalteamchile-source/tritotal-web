import "server-only";

/**
 * Variables de entorno del servidor. Ninguna es obligatoria para que el sitio
 * funcione: si falta alguna, la función asociada queda desactivada y se informa
 * en la respuesta (nunca se simula).
 */
export const env = {
  supabaseUrl: process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  resendApiKey: process.env.RESEND_API_KEY || "",
  mailFrom: process.env.MAIL_FROM || "",
  adminEmail: process.env.ADMIN_EMAIL || "",
};

export const isDbConfigured = () => Boolean(env.supabaseUrl && env.supabaseServiceKey);
export const isMailConfigured = () => Boolean(env.resendApiKey && env.mailFrom);
