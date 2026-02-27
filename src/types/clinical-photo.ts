export type PhotoType = 'before' | 'after';

export type ClinicalPhoto = {
  id: string;
  patientId: string;
  sessionId?: string;
  procedureName?: string;
  capturedAt: string;
  photoType: PhotoType;
  filePath: string;
  fileUrl: string;
  consented: boolean;
  createdAt: string;
};

export type ClinicalPhotoInput = {
  patientId: string;
  sessionId?: string;
  procedureName?: string;
  capturedAt: string;
  photoType: PhotoType;
  filePath: string;
  fileUrl: string;
  consented?: boolean;
};
