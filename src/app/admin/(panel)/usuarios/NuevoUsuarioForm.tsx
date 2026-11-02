"use client";

import { createUsuario } from "../../actions";
import { FormMessage, SubmitButton, inputCls, useKeepForm } from "@/components/admin/FormBits";

export function NuevoUsuarioForm() {
  const { state, pending, onSubmit } = useKeepForm(createUsuario);
  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-sm border border-white/10 bg-ink p-5 sm:grid-cols-2">
      <div>
        <label htmlFor="nombre" className="mb-1.5 block text-sm font-semibold">Nombre</label>
        <input id="nombre" name="nombre" className={inputCls} />
      </div>
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-semibold">Correo *</label>
        <input id="email" name="email" type="email" required className={inputCls} />
      </div>
      <div>
        <label htmlFor="rol" className="mb-1.5 block text-sm font-semibold">Rol *</label>
        <select id="rol" name="rol" defaultValue="entrenador" className={inputCls}>
          <option value="entrenador">Entrenador</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-semibold">Contraseña temporal *</label>
        <input id="password" name="password" type="text" minLength={10} required autoComplete="off" className={inputCls} />
        <p className="mt-1 text-xs text-mist/70">Mínimo 10 caracteres. La persona puede cambiarla en «Mi cuenta».</p>
      </div>
      <div className="sm:col-span-2 space-y-3">
        <FormMessage state={state} />
        <SubmitButton pending={pending}>Crear usuario</SubmitButton>
      </div>
    </form>
  );
}
