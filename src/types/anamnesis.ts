export type AllergyRecord = {
  substance: string;
  severity?: string;
  notes?: string;
};

export type Anamnesis = {
  id: string;
  patientId: string;
  allergies: AllergyRecord[];
  currentMedications: string[];
  previousProcedures: string[];
  medicalConditions: string[];
  expectations?: string;
  expectationsStructured?: Record<string, unknown>;
  fitzpatrickSkinType?: string;
  createdAt: string;
  updatedAt: string;
};

export type UpsertAnamnesisInput = {
  patientId: string;
  allergies?: AllergyRecord[];
  currentMedications?: string[];
  previousProcedures?: string[];
  medicalConditions?: string[];
  expectations?: string;
  expectationsStructured?: Record<string, unknown>;
  fitzpatrickSkinType?: string;
};
