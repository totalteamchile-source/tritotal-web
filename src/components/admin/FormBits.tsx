"use client";

import { useActionState, startTransition, type FormEvent, type ReactNode } from "react";

type State = { error?: string; ok?: string } | undefined;

/**
 * Como useActionState, pero sin que React borre el formulario al terminar
 * (así no se pierde lo escrito si hay un error de validación).
 */
export function useKeepForm(action: (prev: State, fd: FormData) => Promise<State>) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => formAction(fd));
  };
  return { state, pending, onSubmit };
}

export const inputCls =
  "w-full rounded-sm border border-white/15 bg-ink px-3 py-2.5 text-white placeholder:text-mist/40 focus:border-sport focus:outline-none focus:ring-1 focus:ring-sport disabled:opacity-60";

export function SubmitButton({ children, pending, pendingLabel = "Guardando…", className = "" }: { children: ReactNode; pending: boolean; pendingLabel?: string; className?: string }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className={`rounded-sm bg-sport px-6 py-2.5 font-display font-bold uppercase tracking-wider text-ink transition hover:bg-sport-600 disabled:opacity-60 ${className}`}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}

export function FormMessage({ state }: { state?: { error?: string; ok?: string } }) {
  if (!state?.error && !state?.ok) return null;
  return (
    <p
      role={state.error ? "alert" : "status"}
      className={`rounded-sm border p-3 text-sm ${state.error ? "border-red-400/50 bg-red-500/10 text-red-300" : "border-sport/50 bg-sport/10 text-sport"}`}
    >
      {state.error ?? state.ok}
    </p>
  );
}

/** Botón de eliminar con confirmación. */
export function DeleteButton({ action, label = "Eliminar", confirmText }: { action: () => Promise<void>; label?: string; confirmText: string }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmText)) e.preventDefault();
      }}
    >
      <button type="submit" className="rounded-sm border border-red-400/40 px-4 py-2.5 text-sm text-red-300 hover:bg-red-500/10">
        {label}
      </button>
    </form>
  );
}
