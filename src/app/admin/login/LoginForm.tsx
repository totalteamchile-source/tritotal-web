"use client";

import { login } from "../actions";
import { FormMessage, SubmitButton, inputCls, useKeepForm } from "@/components/admin/FormBits";

export function LoginForm() {
  const { state, pending, onSubmit } = useKeepForm(login);
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-semibold">Correo</label>
        <input id="email" name="email" type="email" autoComplete="username" required className={inputCls} />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-semibold">Contraseña</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className={inputCls} />
      </div>
      <FormMessage state={state} />
      <SubmitButton pending={pending} pendingLabel="Ingresando…" className="w-full">Ingresar</SubmitButton>
    </form>
  );
}
