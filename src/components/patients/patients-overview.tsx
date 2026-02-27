'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search, ArrowDownAZ, ArrowUpZA, UserPlus, Phone, Mail, User } from 'lucide-react';
import type { Patient } from '@/types/patient';
import { deletePatientAction, createPatientAction } from '@/app/(dashboard)/patients/actions';
import { CreatePatientSchema, type CreatePatientInput } from '@/lib/validations/patient-schema';

type PatientsOverviewProps = {
  patients: Patient[];
};

type SortOrder = 'asc' | 'desc';

export function PatientsOverview({ patients }: PatientsOverviewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreatePatientInput>({
    resolver: zodResolver(CreatePatientSchema),
    defaultValues: {
      fullName: '',
      cpf: '',
      birthDate: '',
      phone: '',
      email: '',
      notes: '',
    },
  });

  const onSubmit = async (data: CreatePatientInput) => {
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const result = await createPatientAction(data);
      if (result?.error) {
        setErrorMsg(result.error);
      } else if (result?.success) {
        reset();
      }
    } catch {
      setErrorMsg('Erro inesperado ao salvar paciente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredAndSortedPatients = useMemo(() => {
    const term = searchTerm.toLowerCase();
    
    // Filtro por nome, CPF, telefone ou email
    const filtered = patients.filter((p) => {
      return (
        p.fullName.toLowerCase().includes(term) ||
        (p.cpf && p.cpf.includes(term)) ||
        (p.phone && p.phone.includes(term)) ||
        (p.email && p.email.toLowerCase().includes(term))
      );
    });

    // Ordenação A-Z ou Z-A
    filtered.sort((a, b) => {
      const nameA = a.fullName.toLowerCase();
      const nameB = b.fullName.toLowerCase();
      if (nameA < nameB) return sortOrder === 'asc' ? -1 : 1;
      if (nameA > nameB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [patients, searchTerm, sortOrder]);

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pacientes</h1>
          <p className="text-muted-foreground mt-1">Gerencie os cadastros e acesse os prontuários</p>
        </div>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-[350px_1fr] items-start">
        {/* Formulário de Novo Paciente */}
        <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
          <div className="border-b bg-slate-50/50 p-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-indigo-600" />
              Novo Paciente
            </h2>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
            {errorMsg && (
              <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
                {errorMsg}
              </div>
            )}
            
            <div className="space-y-1">
              <label className="text-sm font-medium">Nome completo *</label>
              <input 
                {...register('fullName')} 
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" 
                placeholder="Ex: Maria Silva" 
              />
              {errors.fullName && <p className="text-xs text-red-600">{errors.fullName.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">CPF</label>
              <input 
                {...register('cpf')} 
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" 
                placeholder="000.000.000-00" 
              />
              {errors.cpf && <p className="text-xs text-red-600">{errors.cpf.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Data Nasc.</label>
                <input 
                  {...register('birthDate')} 
                  type="date" 
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-700" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Telefone</label>
                <input 
                  {...register('phone')} 
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" 
                  placeholder="(11) 90000-0000" 
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Email</label>
              <input 
                {...register('email')} 
                type="email"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" 
                placeholder="maria@exemplo.com" 
              />
              {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Observações</label>
              <textarea 
                {...register('notes')} 
                className="min-h-20 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" 
                placeholder="Alergias, condições pré-existentes..." 
              />
            </div>

            <button 
              disabled={isSubmitting}
              className="w-full rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition disabled:opacity-50 mt-2" 
              type="submit"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar Paciente'}
            </button>
          </form>
        </div>

        {/* Lista de Pacientes com Filtros */}
        <div className="rounded-lg border bg-white shadow-sm flex flex-col h-full overflow-hidden">
          <div className="border-b bg-slate-50/50 p-4 space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-5 w-5 text-indigo-600" />
              Base de Pacientes
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Buscar por nome, CPF, telefone ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-md border border-slate-300 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div className="flex border rounded-md overflow-hidden flex-shrink-0">
                <button
                  onClick={() => setSortOrder('asc')}
                  className={`px-3 py-2 flex items-center gap-1.5 text-sm font-medium transition-colors ${
                    sortOrder === 'asc' ? 'bg-indigo-50 text-indigo-700' : 'bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                  title="Ordenar A-Z"
                >
                  <ArrowDownAZ className="h-4 w-4" /> A-Z
                </button>
                <div className="bg-slate-200 w-[1px]" />
                <button
                  onClick={() => setSortOrder('desc')}
                  className={`px-3 py-2 flex items-center gap-1.5 text-sm font-medium transition-colors ${
                    sortOrder === 'desc' ? 'bg-indigo-50 text-indigo-700' : 'bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                  title="Ordenar Z-A"
                >
                  <ArrowUpZA className="h-4 w-4" /> Z-A
                </button>
              </div>
            </div>
          </div>

          <div className="p-0 overflow-y-auto max-h-[600px] flex-1">
            {filteredAndSortedPatients.length === 0 ? (
              <div className="p-8 text-center bg-slate-50/30 rounded-lg m-4 border border-dashed border-slate-300">
                <p className="text-slate-500">Nenhum paciente encontrado com esses filtros.</p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {filteredAndSortedPatients.map((patient) => (
                  <li className="p-4 hover:bg-slate-50 transition-colors group" key={patient.id}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <p className="font-semibold text-slate-900 group-hover:text-indigo-700 transition">
                          {patient.fullName}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                          {patient.phone ? (
                            <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {patient.phone}</span>
                          ) : (
                            <span className="text-slate-400 italic">Sem telefone</span>
                          )}
                          {patient.email ? (
                            <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {patient.email}</span>
                          ) : null}
                          {patient.cpf ? (
                            <span className="text-slate-500 font-mono text-xs">CPF: {patient.cpf}</span>
                          ) : null}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link 
                          className="rounded-md border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-100 transition" 
                          href={`/patients/${patient.id}`}
                        >
                          Prontuário
                        </Link>
                        <form action={deletePatientAction}>
                          <input name="id" type="hidden" value={patient.id} />
                          <button 
                            className="rounded-md px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition" 
                            type="submit"
                          >
                            Excluir
                          </button>
                        </form>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
