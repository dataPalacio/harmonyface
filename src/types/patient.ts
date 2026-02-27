export type Address = {
  street?: string;
  number?: string;
  district?: string;
  city?: string;
  state?: string;
  zipCode?: string;
};

export type MedicalHistory = {
  allergies: string[];
  medications: string[];
  conditions: string[];
  previousProcedures: string[];
};

export type Patient = {
  id: string;
  fullName: string;
  cpf?: string;
  birthDate?: string;
  gender?: string;
  phone?: string;
  email?: string;
  profilePhotoUrl?: string;
  address?: Address;
  medicalHistory?: MedicalHistory;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};
