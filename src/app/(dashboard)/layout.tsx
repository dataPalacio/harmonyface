import Link from 'next/link';
import type { ReactNode } from 'react';
import { LogoutForm } from '@/components/auth/logout-form';

const links = [
  { href: '/patients', label: 'Pacientes' },
  { href: '/appointments', label: 'Agenda' },
  { href: '/treatments', label: 'Tratamentos' },
  { href: '/inventory', label: 'Estoque' },
  { href: '/financial', label: 'Financeiro' },
  { href: '/reports', label: 'Relatórios' },
  { href: '/ai-assistant', label: 'Assistente IA' },
  { href: '/settings', label: 'Configurações' }
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[240px_1fr]">
      <aside className="border-r bg-white p-4">
        <h1 className="mb-4 text-lg font-semibold">HarmoniFace</h1>
        <nav className="space-y-2">
          {links.map((link) => (
            <Link className="block rounded-md px-2 py-1 hover:bg-slate-100" href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mt-6 border-t pt-4">
          <LogoutForm />
        </div>
      </aside>
      <main className="bg-slate-50 p-6">{children}</main>
    </div>
  );
}
