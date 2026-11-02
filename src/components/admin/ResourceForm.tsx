"use client";

import Link from "next/link";
import type { Field } from "@/lib/admin/resources";
import type { FormState } from "@/app/admin/actions";
import { variantesATexto, type Variante } from "@/lib/shop";
import { FormMessage, SubmitButton, inputCls, useKeepForm } from "./FormBits";

type Props = {
  fields: Field[];
  values: Record<string, unknown>;
  relations: Record<string, { id: string; label: string }[]>;
  action: (prev: FormState, fd: FormData) => Promise<FormState>;
  cancelHref: string;
};

function asString(v: unknown) {
  if (v === null || v === undefined) return "";
  if (Array.isArray(v)) return v.join("\n");
  return String(v);
}

function FieldInput({ f, value, relations }: { f: Field; value: unknown; relations: Props["relations"] }) {
  const common = { id: f.name, name: f.name, disabled: f.readonly, placeholder: f.placeholder };
  switch (f.type) {
    case "textarea":
      return <textarea {...common} rows={5} defaultValue={asString(value)} className={inputCls} />;
    case "list":
      return <textarea {...common} rows={4} defaultValue={asString(value)} className={inputCls} />;
    case "variants":
      return <textarea {...common} rows={5} defaultValue={variantesATexto(value as Variante[]) || (value === undefined ? "S: 0\nM: 0\nL: 0\nXL: 0" : "")} className={`${inputCls} font-mono`} />;
    case "number":
      return <input {...common} inputMode="numeric" defaultValue={asString(value)} className={inputCls} />;
    case "date":
      return <input {...common} type="date" defaultValue={asString(value).slice(0, 10)} className={inputCls} />;
    case "select":
      return (
        <select {...common} defaultValue={asString(value)} className={inputCls}>
          {!f.required && <option value="">—</option>}
          {f.options?.map((o) => <option key={o}>{o}</option>)}
        </select>
      );
    case "relation": {
      const opts = relations[f.name] ?? [];
      return (
        <select {...common} defaultValue={asString(value)} className={inputCls}>
          <option value="">Sin asignar</option>
          {opts.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
        </select>
      );
    }
    case "multiselect": {
      const sel = Array.isArray(value) ? (value as string[]) : [];
      return (
        <div className="flex flex-wrap gap-2">
          {f.options?.map((o) => (
            <label key={o} className="cursor-pointer">
              <input type="checkbox" name={f.name} value={o} defaultChecked={sel.includes(o)} disabled={f.readonly} className="peer sr-only" />
              <span className="inline-block rounded-full border border-white/20 px-3 py-1.5 text-sm peer-checked:border-sport peer-checked:bg-sport peer-checked:text-ink">{o}</span>
            </label>
          ))}
        </div>
      );
    }
    case "checkbox":
      return (
        <label className="flex items-center gap-3">
          <input type="checkbox" name={f.name} defaultChecked={value === true || (value === undefined && f.name !== "destacado")} disabled={f.readonly} className="h-5 w-5 accent-[var(--color-sport)]" />
          <span className="text-sm text-mist">Sí</span>
        </label>
      );
    case "image": {
      const url = asString(value);
      return (
        <div className="space-y-3">
          {url && (
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-24 w-24 rounded-sm object-cover" />
              <label className="flex items-center gap-2 text-sm text-mist">
                <input type="checkbox" name={`${f.name}__remove`} className="accent-[var(--color-sport)]" /> Quitar imagen
              </label>
            </div>
          )}
          <input type="hidden" name={f.name} value={url} />
          <input
            type="file"
            name={`${f.name}__file`}
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="block w-full text-sm text-mist file:mr-4 file:rounded-sm file:border-0 file:bg-petrol-700 file:px-4 file:py-2 file:text-white"
          />
          <p className="text-xs text-mist/70">JPG, PNG o WEBP, hasta 4 MB.</p>
        </div>
      );
    }
    default:
      return <input {...common} defaultValue={asString(value)} className={inputCls} />;
  }
}

export function ResourceForm({ fields, values, relations, action, cancelHref }: Props) {
  const { state, pending, onSubmit } = useKeepForm(action);
  const editable = fields.filter((f) => !f.readonly);
  const readonly = fields.filter((f) => f.readonly);

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="grid gap-5 sm:grid-cols-2">
        {editable.map((f) => (
          <div key={f.name} className={f.wide || f.type === "textarea" || f.type === "list" || f.type === "image" ? "sm:col-span-2" : ""}>
            <label htmlFor={f.name} className="mb-1.5 block text-sm font-semibold">
              {f.label} {f.required && <span className="text-sport">*</span>}
            </label>
            <FieldInput f={f} value={values[f.name]} relations={relations} />
            {f.help && <p className="mt-1 text-xs text-mist/70">{f.help}</p>}
          </div>
        ))}
      </div>

      {readonly.length > 0 && (
        <dl className="grid gap-x-6 gap-y-4 rounded-sm border border-white/10 bg-ink/50 p-5 text-sm sm:grid-cols-2">
          {readonly.map((f) => {
            let v = values[f.name];
            if (f.type === "relation") v = relations[f.name]?.find((o) => o.id === v)?.label ?? (v ? "Plan eliminado" : null);
            if (f.name === "creado_en" && v) v = new Date(String(v)).toLocaleString("es-CL");
            if (f.type === "items" && Array.isArray(v))
              v = (v as { nombre: string; talla: string; cantidad: number; precio: number }[]).map(
                (i) => `${i.cantidad} × ${i.nombre} (${i.talla}) — $${(i.precio * i.cantidad).toLocaleString("es-CL")}`,
              );
            if (f.name === "total" && typeof v === "number") v = `$${v.toLocaleString("es-CL")}`;
            const s = Array.isArray(v) ? v.join(f.type === "items" ? "\n" : ", ") : asString(v);
            return (
              <div key={f.name} className={f.wide ? "sm:col-span-2" : ""}>
                <dt className="text-xs uppercase tracking-wider text-mist/70">{f.label}</dt>
                <dd className="mt-0.5 whitespace-pre-line">{s || "—"}</dd>
              </div>
            );
          })}
        </dl>
      )}

      <FormMessage state={state} />
      <div className="flex flex-wrap gap-3">
        <SubmitButton pending={pending}>Guardar</SubmitButton>
        <Link href={cancelHref} className="rounded-sm border border-white/20 px-6 py-2.5 font-display font-bold uppercase tracking-wider hover:bg-white/5">
          Volver
        </Link>
      </div>
    </form>
  );
}
