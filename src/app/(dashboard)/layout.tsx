import Link from 'next/link';
import type { ReactNode } from 'react';
import { Suspense } from 'react';
import { LogoutForm } from '@/components/auth/logout-form';
import {
  Users,
  Calendar,
  Sparkles,
  Package,
  DollarSign,
  BarChart3,
  Bot,
  Settings,
} from 'lucide-react';

const links = [
  { href: '/patients', label: 'Pacientes', icon: Users },
  { href: '/appointments', label: 'Agenda', icon: Calendar },
  { href: '/treatments', label: 'Tratamentos', icon: Sparkles },
  { href: '/inventory', label: 'Estoque', icon: Package },
  { href: '/financial', label: 'Financeiro', icon: DollarSign },
  { href: '/reports', label: 'Relatórios', icon: BarChart3 },
  { href: '/ai-assistant', label: 'Assistente IA', icon: Bot },
  { href: '/settings', label: 'Configurações', icon: Settings },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[240px_1fr]">
      <aside className="border-r bg-white p-4 flex flex-col">
        <div className="mb-6">
          <h1 className="text-lg font-bold text-slate-900">HarmoniFace</h1>
          <p className="text-xs text-slate-500 mt-0.5">CRM Clínico</p>
        </div>
        <nav className="space-y-1 flex-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                prefetch={true}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <Icon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t pt-4 mt-4">
          <LogoutForm />
        </div>
      </aside>
      <main className="bg-slate-50 p-6 overflow-auto">
        <Suspense
          fallback={
            <div className="animate-pulse space-y-4">
              <div className="h-8 w-48 rounded-md bg-slate-200" />
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-24 rounded-lg bg-slate-200" />
                ))}
              </div>
              <div className="h-64 rounded-lg bg-slate-200" />
            </div>
          }
        >
          {children}
        </Suspense>
      </main>
    </div>
  );
}
