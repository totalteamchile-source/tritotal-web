"use client";

import { contentKeys } from "@/lib/admin/resources";
import { saveContenido } from "../../actions";
import { FormMessage, SubmitButton, inputCls, useKeepForm } from "@/components/admin/FormBits";

export function ContenidoForm({ values }: { values: Record<string, string> }) {
  const { state, pending, onSubmit } = useKeepForm(saveContenido);
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {contentKeys.map((k) => (
        <div key={k.clave}>
          <label htmlFor={k.clave} className="mb-1.5 block text-sm font-semibold">{k.label}</label>
          {k.type === "textarea" ? (
            <textarea id={k.clave} name={k.clave} rows={5} defaultValue={values[k.clave]} className={inputCls} />
          ) : (
            <input id={k.clave} name={k.clave} defaultValue={values[k.clave]} className={inputCls} />
          )}
        </div>
      ))}
      <FormMessage state={state} />
      <SubmitButton pending={pending}>Guardar y publicar</SubmitButton>
    </form>
  );
}
