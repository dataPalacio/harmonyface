export type StructuredClinicalNotes = {
  paciente?: string;
  idade?: number;
  procedimentosRealizados?: Array<{
    tipo: string;
    regiao: string[];
    produto?: string;
    lote?: string;
    quantidade?: string;
    intercorrencias?: string;
  }>;
  retorno?: string;
  procedimentosSugeridos?: Array<{
    tipo: string;
    produto?: string;
    regiao: string[];
    motivo?: string;
  }>;
};

export type Session = {
  id: string;
  patientId: string;
  date: string;
  clinicalNotesRaw?: string;
  clinicalNotesStructured?: StructuredClinicalNotes;
  clinicalSummary?: string;
  complianceScore?: number;
  complianceFlags?: string[];
  consentSigned: boolean;
};
