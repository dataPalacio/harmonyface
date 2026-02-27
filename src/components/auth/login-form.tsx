'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { loginAction } from '@/app/(auth)/login/actions';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="w-full rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-70"
      disabled={pending}
      type="submit"
    >
      {pending ? 'Entrando...' : 'Entrar'}
    </button>
  );
}

export function LoginForm() {
  const [state, formAction] = useFormState(loginAction, {});

  return (
    <section className="w-full rounded-xl border bg-white p-6 shadow-sm">
      <h1 className="mb-2 text-xl font-semibold">Entrar no HarmoniFace</h1>
      <p className="mb-6 text-sm text-slate-600">Use sua conta autenticada no Supabase Auth.</p>
      <form action={formAction} className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="email">
            Email
          </label>
          <input
            className="w-full rounded-md border px-3 py-2"
            id="email"
            name="email"
            required
            type="email"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="password">
            Senha
          </label>
          <input
            className="w-full rounded-md border px-3 py-2"
            id="password"
            name="password"
            required
            type="password"
          />
        </div>
        {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
        <SubmitButton />
      </form>
    </section>
  );
}
