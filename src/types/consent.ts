export type Consent = {
  id: string;
  patientId: string;
  templateName: string;
  termsText: string;
  signatureName: string;
  signedAt: string;
  documentUrl?: string;
  createdAt: string;
};

export type ConsentInput = {
  patientId: string;
  templateName: string;
  termsText: string;
  signatureName: string;
};
