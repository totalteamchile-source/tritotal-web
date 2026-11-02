"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";
import { plans } from "@/content/plans";
import { isValidRut } from "@/lib/rut";
import { whatsappLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/Icons";

type Data = Record<string, string | string[]>;

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

function summary(d: Data) {
  const planName = plans.find((p) => p.id === d.plan)?.name ?? "Por definir";
  const lines = [
    "Hola, acabo de enviar mi inscripción en la web de Tritotal Team.",
    `Nombre: ${d.nombre}`,
    `Disciplina de interés: ${(d.disciplinas as string[]).join(", ") || "-"}`,
    `Competencias: ${(d.competencias as string[]).join(", ") || "-"}`,
    `Plan: ${planName}`,
  ];
  return lines.join("\n");
}

export function RegistrationForm() {
  const params = useSearchParams();
  const initialPlan = params.get("plan") ?? "";
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState<Data | null>(null);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const d: Data = {};
    fd.forEach((v, k) => {
      if (k === "disciplinas" || k === "competencias") d[k] = [...((d[k] as string[]) ?? []), String(v)];
      else d[k] = String(v).trim();
    });
    d.disciplinas ??= [];
    d.competencias ??= [];

    const err: Record<string, string> = {};
    if (!d.nombre) err.nombre = "Ingresa tu nombre completo.";
    if (!d.nacimiento) err.nacimiento = "Ingresa tu fecha de nacimiento.";
    if (d.rut && !isValidRut(d.rut as string)) err.rut = "RUT no válido.";
    if (!/^\S+@\S+\.\S+$/.test(d.email as string)) err.email = "Correo no válido.";
    if ((d.telefono as string).replace(/\D/g, "").length < 8) err.telefono = "Teléfono no válido.";
    if (!d.emergencia_nombre || (d.emergencia_tel as string).replace(/\D/g, "").length < 8)
      err.emergencia = "Ingresa nombre y teléfono de contacto de emergencia.";
    if (!d.experiencia) err.experiencia = "Selecciona tu experiencia.";
    if (!(d.disciplinas as string[]).length) err.disciplinas = "Selecciona al menos una disciplina.";
    if (!d.terminos) err.terminos = "Debes aceptar los términos y el tratamiento de datos.";

    setErrors(err);
    if (Object.keys(err).length) {
      document.getElementById(Object.keys(err)[0])?.focus();
      return;
    }
    // ETAPA 3: aquí se enviará a /api/inscripciones (Supabase) y se notificará al administrador.
    setDone(d);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (done) {
    return (
      <div className="mx-auto max-w-2xl rounded-sm border border-sport/50 bg-petrol-950 p-8 text-center sm:p-12">
        <p className="font-display text-sm font-bold uppercase tracking-[0.3em] text-sport">Solicitud recibida</p>
        <h2 className="mt-3 font-display text-4xl font-extrabold uppercase">¡Gracias, {String(done.nombre).split(" ")[0]}!</h2>
        <p className="mt-4 text-mist">
          Para completar tu inscripción, envíanos el resumen por WhatsApp y el equipo te responderá para coordinar tu ingreso.
        </p>
        <a
          href={whatsappLink(summary(done))}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2 rounded-sm bg-[#25D366] px-6 py-4 font-display font-bold uppercase tracking-wider text-ink hover:bg-[#1fbe5a]"
        >
          <WhatsAppIcon className="h-5 w-5" /> Enviar por WhatsApp
        </a>
        <p className="mt-6"><Link href="/" className="text-sm text-mist hover:text-white">Volver al inicio</Link></p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="mx-auto grid max-w-3xl gap-10">
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

      <button type="submit" className="rounded-sm bg-sport py-4 text-ink font-display text-lg font-bold uppercase tracking-wider transition hover:bg-sport-600 sm:justify-self-start sm:px-12">
        Enviar inscripción
      </button>
    </form>
  );
}
