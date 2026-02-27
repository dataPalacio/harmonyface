import { listPatients, getPatientById } from '@/lib/services/patients-service';
import { getAnamnesisByPatientId } from '@/lib/services/anamnesis-service';
import { listSessionsByPatient } from '@/lib/services/sessions-service';
import { listClinicalPhotosByPatient } from '@/lib/services/clinical-photos-service';
import { PatientSearchSelector } from '@/components/patients/patient-search-selector';
import { ClinicalTimeline } from '@/components/medical-records/clinical-timeline';
import { 
  User, 
  ChevronLeft, 
  Stethoscope, 
  FileText, 
  Camera, 
  Calendar,
  AlertCircle,
  Clock,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default async function MedicalRecordsPage({
  searchParams,
}: {
  searchParams: { patientId?: string };
}) {
  const selectedPatientId = searchParams.patientId;

  if (!selectedPatientId) {
    const patients = await listPatients();
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Prontuário Digital</h1>
          <p className="text-slate-500 mt-1">Selecione um paciente para visualizar o histórico clínico completo.</p>
        </div>
        <div className="max-w-4xl">
          <PatientSearchSelector patients={patients} />
        </div>
      </div>
    );
  }

  const [patient, anamnesis, sessions, photos] = await Promise.all([
    getPatientById(selectedPatientId),
    getAnamnesisByPatientId(selectedPatientId),
    listSessionsByPatient(selectedPatientId),
    listClinicalPhotosByPatient(selectedPatientId),
  ]);

  if (!patient) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-red-100 shadow-sm">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-900">Paciente não encontrado</h3>
        <p className="text-slate-500 mt-2">O paciente solicitado não existe ou foi removido.</p>
        <Link 
          href="/medical-records" 
          className="inline-flex items-center gap-2 mt-6 text-indigo-600 font-medium hover:underline"
        >
          <ChevronLeft className="h-4 w-4" /> Voltar para seleção
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header com Navegação e Resumo */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <Link 
            href="/medical-records" 
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors text-sm font-medium"
          >
            <ChevronLeft className="h-4 w-4" /> Voltar para busca
          </Link>
          <Link
            href={`/patients/${patient.id}`}
            className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition shadow-sm border border-indigo-100"
          >
            <ExternalLink className="h-3 w-3" /> Editar Cadastro
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg border-4 border-white">
              <User className="h-10 w-10" />
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{patient.fullName}</h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                <span className="font-medium bg-slate-100 px-2 py-0.5 rounded text-slate-700">CPF: {patient.cpf || 'Não informado'}</span>
                {patient.birthDate && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {format(new Date(patient.birthDate), "dd/MM/yyyy")}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
             <div className="bg-white border rounded-xl p-3 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Sessões</p>
                <p className="text-xl font-bold text-slate-900 mt-0.5">{sessions.length}</p>
             </div>
             <div className="bg-white border rounded-xl p-3 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Fotos Registradas</p>
                <p className="text-xl font-bold text-slate-900 mt-0.5">{photos.length}</p>
             </div>
             <div className="hidden sm:block bg-white border rounded-xl p-3 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</p>
                <p className="text-xl font-bold text-emerald-600 mt-0.5 flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Ativo
                </p>
             </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
        {/* Coluna Principal: Linha do Tempo */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b pb-4">
            <Clock className="h-6 w-6 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900">Cronologia de Tratamento</h2>
          </div>
          <ClinicalTimeline sessions={sessions} photos={photos} />
        </div>

        {/* Coluna Lateral: Resumo Clínico e Anamnese */}
        <div className="space-y-6">
          {/* Alertas Rápidos */}
          {(anamnesis?.allergies?.length ?? 0) > 0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-3">
              <div className="flex items-center gap-2 text-amber-800">
                <AlertCircle className="h-5 w-5" />
                <h3 className="font-bold">Alertas de Alergia</h3>
              </div>
              <ul className="flex flex-wrap gap-2">
                {anamnesis?.allergies.map((allergy, i) => (
                  <li key={i} className="bg-white border border-amber-200 text-amber-700 px-2 py-1 rounded text-xs font-bold uppercase">
                    {allergy.substance}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Resumo de Anamnese */}
          <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
            <div className="border-b bg-slate-50/50 p-4">
              <h3 className="font-bold flex items-center gap-2 text-slate-900">
                <FileText className="h-4 w-4 text-indigo-600" />
                Resumo Clínico (Anamnese)
              </h3>
            </div>
            <div className="p-4 space-y-4">
              {anamnesis ? (
                <>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase text-slate-400">Expectativas do Paciente</p>
                    <p className="text-sm text-slate-700 italic border-l-2 border-slate-200 pl-3">
                      "{anamnesis.expectations || 'Não informadas'}"
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase text-slate-400">Tipo de Pele (Fitzpatrick)</p>
                    <p className="text-sm text-slate-900 font-medium">
                      Classe {anamnesis.fitzpatrickSkinType || 'Não definida'}
                    </p>
                  </div>

                  <div className="pt-2">
                    <Link 
                      href={`/patients/${patient.id}/anamnesis`}
                      className="text-xs text-indigo-600 font-bold hover:underline flex items-center justify-end gap-1"
                    >
                      Ver Anamnese Completa <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-slate-500 italic">Anamnese não preenchida.</p>
                  <Link 
                    href={`/patients/${patient.id}/anamnesis`}
                    className="inline-block mt-3 text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-md font-bold"
                  >
                    Iniciar Agora
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Atalhos Rápidos */}
          <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
            <div className="border-b bg-slate-50/50 p-4">
              <h3 className="font-bold flex items-center gap-2 text-slate-900">
                <Stethoscope className="h-4 w-4 text-indigo-600" />
                Ações Clínicas
              </h3>
            </div>
            <div className="p-4 grid gap-2">
              <button className="w-full justify-start rounded-lg border border-slate-200 p-2.5 text-left text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-3">
                 <div className="h-8 w-8 rounded-md bg-indigo-50 flex items-center justify-center text-indigo-600">
                   <Clock className="h-4 w-4" />
                 </div>
                 Nova Sessão
              </button>
              <button className="w-full justify-start rounded-lg border border-slate-200 p-2.5 text-left text-sm font-medium hover:bg-slate-50 transition-colors flex items-center gap-3">
                 <div className="h-8 w-8 rounded-md bg-purple-50 flex items-center justify-center text-purple-600">
                   <Camera className="h-4 w-4" />
                 </div>
                 Capturar Fotos
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
