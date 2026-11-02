import { z } from "zod";
import { isValidRut } from "./rut";

/** Esquema compartido por el formulario (cliente) y la API (servidor). */
export const registrationSchema = z.object({
  nombre: z.string().trim().min(3, "Ingresa tu nombre completo.").max(120),
  nacimiento: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Ingresa tu fecha de nacimiento.")
    .refine((v) => {
      const d = new Date(v);
      const y = d.getFullYear();
      return !Number.isNaN(d.getTime()) && y > 1920 && d < new Date();
    }, "Fecha no válida."),
  rut: z
    .string()
    .trim()
    .max(15)
    .optional()
    .transform((v) => v || undefined)
    .refine((v) => !v || isValidRut(v), "RUT no válido."),
  email: z.string().trim().toLowerCase().email("Correo no válido.").max(160),
  telefono: z.string().trim().refine((v) => v.replace(/\D/g, "").length >= 8, "Teléfono no válido.").pipe(z.string().max(25)),
  emergencia_nombre: z.string().trim().min(2, "Ingresa nombre y teléfono de contacto de emergencia.").max(120),
  emergencia_tel: z
    .string()
    .trim()
    .refine((v) => v.replace(/\D/g, "").length >= 8, "Ingresa nombre y teléfono de contacto de emergencia.")
    .pipe(z.string().max(25)),
  experiencia: z.string().min(1, "Selecciona tu experiencia.").max(60),
  disciplinas: z.array(z.string().max(40)).min(1, "Selecciona al menos una disciplina.").max(6),
  competencias: z.array(z.string().max(40)).max(10).default([]),
  objetivos: z.string().trim().max(2000).optional().transform((v) => v || undefined),
  plan: z.string().max(60).optional().transform((v) => v || undefined),
  terminos: z.literal("si", { error: "Debes aceptar los términos y el tratamiento de datos." }),
  // Campo trampa anti-spam: debe venir vacío.
  sitio_web: z.string().max(0).optional(),
});

export type RegistrationInput = z.input<typeof registrationSchema>;
export type Registration = z.output<typeof registrationSchema>;

/** Convierte un FormData del formulario al objeto que valida el esquema. */
export function formDataToObject(fd: FormData) {
  const obj: Record<string, unknown> = { disciplinas: [], competencias: [] };
  fd.forEach((v, k) => {
    if (k === "disciplinas" || k === "competencias") (obj[k] as string[]).push(String(v));
    else obj[k] = String(v);
  });
  return obj;
}

/** Primer mensaje de error por campo. */
export function fieldErrors(error: z.ZodError) {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    const mapped = key === "emergencia_nombre" || key === "emergencia_tel" ? "emergencia" : key;
    out[mapped] ??= issue.message;
  }
  return out;
}
