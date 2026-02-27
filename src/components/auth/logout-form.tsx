import { logoutAction } from '@/app/(auth)/login/actions';

export function LogoutForm() {
  return (
    <form action={logoutAction}>
      <button className="w-full rounded-md border px-2 py-1 text-left text-sm hover:bg-slate-100" type="submit">
        Sair
      </button>
    </form>
  );
}
