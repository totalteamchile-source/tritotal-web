"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { plans } from "@/content/plans";
import { registrationSchema, formDataToObject, fieldErrors, type Registration } from "@/lib/registration";
import { whatsappLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/Icons";

const disciplinesOpts = ["Natación", "Ciclismo", "Running", "Triatlón completo"];
const competitionsOpts = ["Triatlón (sprint / olímpico)", "Ironman 70.3", "Full Ironman", "10K", "21K", "42K", "Aún no lo sé"];
const experienceOpts = ["Sin experiencia", "Principiante (menos de 1 año)", "Intermedio (1 a 3 años)", "Avanzado (más de 3 años)"];

const input =
  "w-full rounded-sm border border-white/15 bg-petrol-950 px-4 py-3 text-white placeholder:text-mist/50 focus:border-sport focus:outline-none focus:ring-1 focus:ring-sport";

function Field({ label, name, error, children, optional }: { label: string; name: string; error?: string; children: ReactNode; optional?: boolean }) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-semibold">
        {label} {optional && <span className="font-normal text-mist">(opcional)</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-sm text-red-400" role="alert">{error}</p>}
    </div>
  );
}

function summary(d: Registration, folio?: string) {
  const planName = plans.find((p) => p.id === d.plan)?.name ?? "Por definir";
  return [
    folio
      ? `Hola, acabo de inscribirme en la web de Tritotal Team (folio ${folio}).`
      : "Hola, quiero inscribirme en Tritotal Team.",
    `Nombre: ${d.nombre}`,
    `Disciplina de interés: ${d.disciplinas.join(", ") || "-"}`,
    `Competencias: ${d.competencias.join(", ") || "-"}`,
    `Plan: ${planName}`,
  ].join("\n");
}

type Done = { data: Registration; folio?: string; offline?: boolean };

export function RegistrationForm() {
  const params = useSearchParams();
  const initialPlan = params.get("plan") ?? "";
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<Done | null>(null);
  const doneRef = useRef<HTMLDivElement>(null);

  // Al confirmar, llevar la vista al mensaje de confirmación.
  useEffect(() => {
    if (done) doneRef.current?.scrollIntoView({ block: "center" });
  }, [done]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;
    const raw = formDataToObject(new FormData(e.currentTarget));
    const parsed = registrationSchema.safeParse(raw);
    if (!parsed.success) {
      const err = fieldErrors(parsed.error);
      setErrors(err);
      document.getElementById(Object.keys(err)[0])?.focus();
      return;
    }
    setErrors({});
    setSending(true);
    try {
      const res = await fetch("/api/inscripciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(raw),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) {
        setDone({ data: parsed.data, folio: json.folio });
      } else if (json.notConfigured) {
        // Base de datos aún no configurada: se completa por WhatsApp.
        setDone({ data: parsed.data, offline: true });
      } else if (json.errors) {
        setErrors(json.errors);
        return;
      } else {
        setErrors({ form: json.error ?? "No pudimos enviar tu inscripción. Intenta de nuevo o escríbenos por WhatsApp." });
        return;
      }
    } catch {
      setErrors({ form: "Sin conexión. Revisa tu internet e intenta de nuevo." });
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <div ref={doneRef} className="mx-auto max-w-2xl rounded-sm border border-sport/50 bg-petrol-950 p-8 text-center sm:p-12">
        <p className="font-display text-sm font-bold uppercase tracking-[0.3em] text-sport">
          {done.offline ? "Último paso" : "Inscripción recibida"}
        </p>
        <h2 className="mt-3 font-display text-4xl font-extrabold uppercase">¡Gracias, {done.data.nombre.split(" ")[0]}!</h2>
        {done.folio && (
          <p className="mt-4 text-lg">
            Tu folio es <span className="font-display text-2xl font-bold tracking-wider text-sport">{done.folio}</span>
          </p>
        )}
        <p className="mt-4 text-mist">
          {done.offline
            ? "Envíanos tu solicitud por WhatsApp para completar la inscripción. El equipo te responderá para coordinar tu ingreso."
            : "Guardamos tus datos y el equipo te contactará para coordinar tu ingreso. Si quieres adelantar la conversación, escríbenos por WhatsApp."}
        </p>
        <a
          href={whatsappLink(summary(done.data, done.folio))}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 rounded-sm bg-[#25D366] px-6 py-4 font-display font-bold uppercase tracking-wider text-ink hover:bg-[#1fbe5a]"
        >
          <WhatsAppIcon className="h-5 w-5" /> {done.offline ? "Enviar por WhatsApp" : "Escribir por WhatsApp"}
        </a>
        <p className="mt-6"><Link href="/" className="text-sm text-mist hover:text-white">Volver al inicio</Link></p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative mx-auto grid max-w-3xl gap-10">
      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="mb-5 font-display text-2xl font-bold uppercase text-sport">Datos personales</legend>
        <div className="sm:col-span-2">
          <Field label="Nombre completo" name="nombre" error={errors.nombre}>
            <input id="nombre" name="nombre" autoComplete="name" className={input} />
          </Field>
        </div>
        <Field label="Fecha de nacimiento" name="nacimiento" error={errors.nacimiento}>
          <input id="nacimiento" name="nacimiento" type="date" className={input} />
        </Field>
        <Field label="RUT" name="rut" error={errors.rut} optional>
          <input id="rut" name="rut" placeholder="12.345.678-9" className={input} />
        </Field>
        <Field label="Correo electrónico" name="email" error={errors.email}>
          <input id="email" name="email" type="email" autoComplete="email" className={input} />
        </Field>
        <Field label="Teléfono" name="telefono" error={errors.telefono}>
          <input id="telefono" name="telefono" type="tel" autoComplete="tel" placeholder="+56 9 ..." className={input} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Contacto de emergencia" name="emergencia" error={errors.emergencia}>
            <div className="grid gap-3 sm:grid-cols-2">
              <input id="emergencia" name="emergencia_nombre" placeholder="Nombre" className={input} aria-label="Nombre contacto de emergencia" />
              <input name="emergencia_tel" type="tel" placeholder="Teléfono" className={input} aria-label="Teléfono contacto de emergencia" />
            </div>
          </Field>
        </div>
      </fieldset>

      <fieldset className="grid gap-5">
        <legend className="mb-5 font-display text-2xl font-bold uppercase text-sport">Perfil deportivo</legend>
        <Field label="Experiencia deportiva" name="experiencia" error={errors.experiencia}>
          <select id="experiencia" name="experiencia" defaultValue="" className={input}>
            <option value="" disabled>Selecciona…</option>
            {experienceOpts.map((o) => <option key={o}>{o}</option>)}
          </select>
        </Field>
        <Field label="Disciplina de interés" name="disciplinas" error={errors.disciplinas}>
          <div className="flex flex-wrap gap-2" id="disciplinas" tabIndex={-1}>
            {disciplinesOpts.map((o) => (
              <label key={o} className="cursor-pointer">
                <input type="checkbox" name="disciplinas" value={o} className="peer sr-only" />
                <span className="inline-block rounded-full border border-white/20 px-4 py-2 text-sm transition peer-checked:border-sport peer-checked:bg-sport peer-checked:text-ink peer-focus-visible:ring-2 peer-focus-visible:ring-white">{o}</span>
              </label>
            ))}
          </div>
        </Field>
        <Field label="Competencias que deseas preparar" name="competencias" optional>
          <div className="flex flex-wrap gap-2">
            {competitionsOpts.map((o) => (
              <label key={o} className="cursor-pointer">
                <input type="checkbox" name="competencias" value={o} className="peer sr-only" />
                <span className="inline-block rounded-full border border-white/20 px-4 py-2 text-sm transition peer-checked:border-sport peer-checked:bg-sport peer-checked:text-ink peer-focus-visible:ring-2 peer-focus-visible:ring-white">{o}</span>
              </label>
            ))}
          </div>
        </Field>
        <Field label="Objetivos deportivos" name="objetivos" optional>
          <textarea id="objetivos" name="objetivos" rows={4} className={input} placeholder="Cuéntanos qué quieres lograr" />
        </Field>
        <Field label="Plan seleccionado" name="plan" optional>
          <select id="plan" name="plan" defaultValue={initialPlan} className={input}>
            <option value="">Aún no lo decido</option>
            {plans.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </Field>
      </fieldset>

      <div>
        <label className="flex items-start gap-3 text-sm">
          <input id="terminos" type="checkbox" name="terminos" value="si" className="mt-1 h-5 w-5 accent-[var(--color-sport)]" />
          <span>
            Acepto los <Link href="/terminos" target="_blank" className="text-sport underline">términos y condiciones</Link> y el{" "}
            <Link href="/privacidad" target="_blank" className="text-sport underline">tratamiento de mis datos personales</Link>.
          </span>
        </label>
        {errors.terminos && <p className="mt-1 text-sm text-red-400" role="alert">{errors.terminos}</p>}
      </div>

      {/* Campo trampa anti-spam (invisible para personas) */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>No completar <input name="sitio_web" tabIndex={-1} autoComplete="off" /></label>
      </div>

      {errors.form && (
        <p role="alert" className="rounded-sm border border-red-400/50 bg-red-500/10 p-4 text-sm text-red-300">{errors.form}</p>
      )}

      <button
        type="submit"
        disabled={sending}
        className="rounded-sm bg-sport py-4 text-ink font-display text-lg font-bold uppercase tracking-wider transition hover:bg-sport-600 disabled:opacity-60 sm:justify-self-start sm:px-12"
      >
        {sending ? "Enviando…" : "Enviar inscripción"}
      </button>
    </form>
  );
}
