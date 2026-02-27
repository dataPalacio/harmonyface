import { notFound } from 'next/navigation';
import { getPatientById } from '@/lib/services/patients-service';
import { listClinicalPhotosByPatient } from '@/lib/services/clinical-photos-service';
import { PhotosGallery } from '@/components/patients/photos-gallery';

export default async function PhotosPage({ params }: { params: { id: string } }) {
  const patient = await getPatientById(params.id);

  if (!patient) {
    notFound();
  }

  const photos = await listClinicalPhotosByPatient(params.id);

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Fotos clínicas — {patient.fullName}</h1>
      <PhotosGallery initialPhotos={photos} patientId={params.id} />
    </section>
  );
}
