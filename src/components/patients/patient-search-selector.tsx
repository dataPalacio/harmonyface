'use client';

import { useState, useMemo } from 'react';
import { Search, ArrowDownAZ, ArrowUpZA, User, Phone, Mail, FileText } from 'lucide-react';
import Link from 'next/link';
import type { Patient } from '@/types/patient';

type PatientSearchSelectorProps = {
  patients: Patient[];
  onSelect?: (patient: Patient) => void;
  baseUrl?: string; // Default to /medical-records?patientId=
};

export function PatientSearchSelector({ patients, onSelect, baseUrl = '/medical-records' }: PatientSearchSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filteredAndSortedPatients = useMemo(() => {
    const term = searchTerm.toLowerCase();
    
    const filtered = patients.filter((p) => {
      return (
        p.fullName.toLowerCase().includes(term) ||
        (p.cpf && p.cpf.includes(term)) ||
        (p.phone && p.phone.includes(term)) ||
        (p.email && p.email.toLowerCase().includes(term))
      );
    });

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
    <div className="rounded-lg border bg-white shadow-sm flex flex-col h-full overflow-hidden">
      <div className="border-b bg-slate-50/50 p-4 space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-900">
          <User className="h-5 w-5 text-indigo-600" />
          Selecionar Paciente para Prontuário
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Buscar por nome, CPF, telefone ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-md border border-slate-300 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none"
            />
          </div>
          <div className="flex border rounded-md overflow-hidden flex-shrink-0">
            <button
              onClick={() => setSortOrder('asc')}
              className={`px-3 py-2 flex items-center gap-1.5 text-sm font-medium transition-colors ${
                sortOrder === 'asc' ? 'bg-indigo-50 text-indigo-700' : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <ArrowDownAZ className="h-4 w-4" /> A-Z
            </button>
            <div className="bg-slate-200 w-[1px]" />
            <button
              onClick={() => setSortOrder('desc')}
              className={`px-3 py-2 flex items-center gap-1.5 text-sm font-medium transition-colors ${
                sortOrder === 'desc' ? 'bg-indigo-50 text-indigo-700' : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <ArrowUpZA className="h-4 w-4" /> Z-A
            </button>
          </div>
        </div>
      </div>

      <div className="p-0 overflow-y-auto max-h-[600px] flex-1">
        {filteredAndSortedPatients.length === 0 ? (
          <div className="p-12 text-center bg-slate-50/30 rounded-lg m-4 border border-dashed border-slate-300">
            <p className="text-slate-500">Nenhum paciente encontrado.</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {filteredAndSortedPatients.map((patient) => (
              <li className="p-4 hover:bg-slate-50 transition-colors group cursor-pointer" key={patient.id}>
                <Link 
                  href={`${baseUrl}?patientId=${patient.id}`}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full text-left"
                >
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-900 group-hover:text-indigo-700 transition">
                      {patient.fullName}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                      {patient.phone && (
                        <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {patient.phone}</span>
                      )}
                      {patient.email && (
                        <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {patient.email}</span>
                      )}
                      {patient.cpf && (
                        <span className="text-slate-500 font-mono text-xs">CPF: {patient.cpf}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-700 transition-colors">
                      <FileText className="h-3.5 w-3.5" />
                      Ver Prontuário
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
