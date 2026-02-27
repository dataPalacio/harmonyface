'use client';

import { CalendarDays, Clock, FileText, ImageIcon, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import type { Session } from '@/types/session';
import type { ClinicalPhoto } from '@/types/clinical-photo';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type ClinicalTimelineProps = {
  sessions: Session[];
  photos: ClinicalPhoto[];
};

export function ClinicalTimeline({ sessions, photos }: ClinicalTimelineProps) {
  const [expandedSessions, setExpandedSessions] = useState<Record<string, boolean>>(
    sessions.length > 0 ? { [sessions[0].id]: true } : {}
  );

  const toggleSession = (id: string) => {
    setExpandedSessions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-dashed border-slate-300">
        <div className="rounded-full bg-slate-50 p-4 mb-4">
          <CalendarDays className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900">Nenhum atendimento registrado</h3>
        <p className="text-slate-500 max-w-sm mt-1">
          Ainda não há sessões ou registros clínicos para este paciente.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-indigo-200 before:via-slate-200 before:to-transparent">
      {sessions.map((session) => {
        const isExpanded = expandedSessions[session.id];
        const sessionPhotos = photos.filter(p => p.sessionId === session.id);
        const sessionDate = new Date(session.date);

        return (
          <div key={session.id} className="relative pl-12 group">
            {/* Timeline pin */}
            <div className="absolute left-0 top-1.5 flex items-center justify-center">
              <div className="h-10 w-10 rounded-full border-4 border-slate-50 bg-indigo-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <CalendarDays className="h-5 w-5 text-white" />
              </div>
            </div>

            <div className={`rounded-xl border bg-white shadow-sm transition-all duration-300 ${isExpanded ? 'ring-1 ring-indigo-500/20' : 'hover:border-indigo-200'}`}>
              <button 
                onClick={() => toggleSession(session.id)}
                className="w-full text-left p-4 flex items-center justify-between"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                      {format(sessionDate, "EEEE", { locale: ptBR })}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 leading-none">
                      {format(sessionDate, "dd 'de' MMMM", { locale: ptBR })}
                    </h3>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5 bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                      <Clock className="h-3.5 w-3.5" />
                      {format(sessionDate, "HH:mm")}
                    </span>
                    {session.consentSigned && (
                      <span className="flex items-center gap-1 text-emerald-600 font-medium">
                        <CheckCircle2 className="h-4 w-4" />
                        Termo Assinado
                      </span>
                    )}
                  </div>
                </div>
                {isExpanded ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
              </button>

              {isExpanded && (
                <div className="px-4 pb-6 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                  {/* Procedimentos Realizados (Structured) */}
                  {session.clinicalNotesStructured?.procedimentosRealizados && session.clinicalNotesStructured.procedimentosRealizados.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-slate-900 border-l-2 border-indigo-500 pl-2">
                        Procedimentos Realizados
                      </h4>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {session.clinicalNotesStructured.procedimentosRealizados.map((proc, idx) => (
                          <div key={idx} className="bg-slate-50 rounded-lg p-3 text-sm border border-slate-100">
                            <p className="font-bold text-slate-900">{proc.tipo}</p>
                            <p className="text-slate-600 mt-1">
                              <span className="font-medium">Região:</span> {proc.regiao.join(', ')}
                            </p>
                            {proc.produto && (
                              <p className="text-slate-600">
                                <span className="font-medium">Produto:</span> {proc.produto} {proc.lote && `(Lote: ${proc.lote})`}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Notas Clínicas */}
                  {session.clinicalNotesRaw && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-slate-900 border-l-2 border-indigo-500 pl-2">
                        Evolução Clínica
                      </h4>
                      <div className="bg-amber-50/30 border border-amber-100 rounded-lg p-4 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {session.clinicalNotesRaw}
                      </div>
                    </div>
                  )}

                  {/* Galeria de Fotos da Sessão */}
                  {sessionPhotos.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-slate-900 border-l-2 border-indigo-500 pl-2 flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" />
                        Registro Fotográfico ({sessionPhotos.length})
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                        {sessionPhotos.map((photo) => (
                          <div key={photo.id} className="relative aspect-square rounded-lg overflow-hidden bg-slate-100 border group/photo">
                            <img 
                              src={photo.fileUrl} 
                              alt={`${photo.photoType} photo`}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover/photo:scale-110"
                            />
                            <div className="absolute bottom-1 right-1">
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight ${
                                photo.photoType === 'before' ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'
                              }`}>
                                {photo.photoType === 'before' ? 'Antes' : 'Depois'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
