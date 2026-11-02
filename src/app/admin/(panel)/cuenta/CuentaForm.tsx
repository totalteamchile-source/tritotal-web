"use client";

import { cambiarClave } from "../../actions";
import { FormMessage, SubmitButton, inputCls, useKeepForm } from "@/components/admin/FormBits";

export function CuentaForm() {
  const { state, pending, onSubmit } = useKeepForm(cambiarClave);
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h2 className="font-display text-xl font-bold uppercase">Cambiar contraseña</h2>
      <input name="password" type="password" placeholder="Nueva contraseña (mín. 10)" autoComplete="new-password" className={inputCls} />
      <input name="password2" type="password" placeholder="Repetir contraseña" autoComplete="new-password" className={inputCls} />
      <FormMessage state={state} />
      <SubmitButton pending={pending}>Cambiar contraseña</SubmitButton>
    </form>
  );
}
