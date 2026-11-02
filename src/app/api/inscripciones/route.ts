import { NextResponse, type NextRequest } from "next/server";
import { randomBytes } from "node:crypto";
import { registrationSchema, fieldErrors } from "@/lib/registration";
import { getPlans } from "@/lib/data";
import { site } from "@/config/site";
import { env } from "@/lib/server/env";
import { supabaseAdmin } from "@/lib/server/supabase";
import { sendMail, escapeHtml } from "@/lib/server/mail";
import { rateLimited } from "@/lib/server/rateLimit";

export const runtime = "nodejs";

/** Folio legible, ej: TT-7K3QX9 (sin caracteres ambiguos). */
function newFolio() {
  const abc = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(6);
  return "TT-" + Array.from(bytes, (b) => abc[b % abc.length]).join("");
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "Demasiados envíos. Intenta en unos minutos." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Solicitud no válida." }, { status: 400 });
  }

  const parsed = registrationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: fieldErrors(parsed.error) }, { status: 422 });
  }
  const d = parsed.data;
  // Honeypot: respondemos OK sin guardar.
  if (d.sitio_web) return NextResponse.json({ ok: true, folio: newFolio(), saved: false });

  const db = supabaseAdmin();
  if (!db) {
    return NextResponse.json(
      { ok: false, notConfigured: true, error: "El registro en línea aún no está habilitado." },
      { status: 503 },
    );
  }

  const plans = await getPlans();
  const planId = d.plan && plans.some((p) => p.id === d.plan) ? d.plan : null;
  const folio = newFolio();
  const { error } = await db.from("inscripciones").insert({
    folio,
    nombre: d.nombre,
    fecha_nacimiento: d.nacimiento,
    rut: d.rut ?? null,
    email: d.email,
    telefono: d.telefono,
    emergencia_nombre: d.emergencia_nombre,
    emergencia_telefono: d.emergencia_tel,
    experiencia: d.experiencia,
    disciplinas: d.disciplinas,
    competencias: d.competencias,
    objetivos: d.objetivos ?? null,
    plan_id: planId,
    acepta_terminos: true,
  });
  if (error) {
    console.error("[inscripciones] error al guardar", error.message);
    return NextResponse.json({ ok: false, error: "No pudimos guardar tu inscripción. Intenta de nuevo." }, { status: 500 });
  }

  const planName = plans.find((p) => p.id === planId)?.name ?? "Por definir";
  const rows: [string, string][] = [
    ["Folio", folio],
    ["Nombre", d.nombre],
    ["Fecha de nacimiento", d.nacimiento],
    ["RUT", d.rut ?? "-"],
    ["Correo", d.email],
    ["Teléfono", d.telefono],
    ["Contacto de emergencia", `${d.emergencia_nombre} (${d.emergencia_tel})`],
    ["Experiencia", d.experiencia],
    ["Disciplinas", d.disciplinas.join(", ")],
    ["Competencias", d.competencias.join(", ") || "-"],
    ["Objetivos", d.objetivos ?? "-"],
    ["Plan", planName],
  ];
  const table = `<table cellpadding="6" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">${rows
    .map(([k, v]) => `<tr><td style="color:#555"><b>${k}</b></td><td>${escapeHtml(v)}</td></tr>`)
    .join("")}</table>`;

  // Notificaciones (si el correo está configurado). No bloquean la inscripción.
  await Promise.all([
    sendMail(env.adminEmail, `Nueva inscripción ${folio}: ${d.nombre}`, `<h2>Nueva inscripción</h2>${table}`, d.email),
    sendMail(
      d.email,
      `Recibimos tu inscripción en ${site.name} (${folio})`,
      `<p>Hola ${escapeHtml(d.nombre.split(" ")[0])},</p>
       <p>Recibimos tu solicitud de inscripción en ${site.name}. Tu folio es <b>${folio}</b>.
       El equipo te contactará para coordinar tu ingreso.</p>
       <p>Si quieres adelantar la conversación, escríbenos por WhatsApp: <a href="https://wa.me/${site.whatsapp.number}">${site.whatsapp.display}</a>.</p>
       ${table}`,
    ),
  ]);

  return NextResponse.json({ ok: true, folio, saved: true });
}
