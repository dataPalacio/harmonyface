/**
 * Financial Dashboard Page
 * Displays financial records, summary statistics, and management interface
 */

import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/auth-client';
import { FinancialForm } from '@/components/financial/financial-form';
import { FinancialList } from '@/components/financial/financial-list';

interface PageProps {
  searchParams: { patientId?: string };
}

export default async function FinancialPage({ searchParams }: PageProps) {
  const supabase = await createServerSupabaseClient();

  // Get authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/auth/login');
  }

  try {
    // Fetch all patients for selector
    const { data: patients, error: patientsError } = await supabase
      .from('patients')
      .select('id, first_name, last_name')
      .order('first_name', { ascending: true });

    if (patientsError) throw patientsError;

    const patientId = searchParams.patientId;

    if (!patientId) {
      return (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Gestão Financeira</h1>
          <p className="text-gray-600">Selecione um paciente para visualizar registros financeiros:</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(patients || []).map((patient: Record<string, unknown>) => (
              <a
                key={patient.id}
                href={`/financial?patientId=${patient.id}`}
                className="p-4 border rounded hover:bg-blue-50 hover:border-blue-400 cursor-pointer transition"
              >
                <p className="font-semibold">
                  {(patient.first_name as string) || ''} {(patient.last_name as string) || ''}
                </p>
                <p className="text-sm text-gray-600">ID: {(patient.id as string).slice(0, 8)}...</p>
              </a>
            ))}
          </div>
        </div>
      );
    }

    // Fetch financial records for selected patient
    const { data: records, error: recordsError } = await supabase
      .from('financial_records')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });

    if (recordsError) throw recordsError;

    // Fetch patient info
    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .select('id, first_name, last_name')
      .eq('id', patientId)
      .single();

    if (patientError || !patient) {
      return <div className="text-red-600">Paciente não encontrado</div>;
    }

    // Calculate summary
    const summary = {
      totalRevenue: records
        .filter((r: Record<string, unknown>) => r.payment_status === 'paid')
        .reduce((sum: number, r: Record<string, unknown>) => sum + (r.net_amount as number), 0),
      pendingPayments: records
        .filter((r: Record<string, unknown>) => r.payment_status === 'pending')
        .reduce((sum: number, r: Record<string, unknown>) => sum + (r.net_amount as number), 0),
      paidPayments: 0,
      overduePayments: records
        .filter((r: Record<string, unknown>) => r.payment_status === 'overdue')
        .reduce((sum: number, r: Record<string, unknown>) => sum + (r.net_amount as number), 0),
      lastMonthRevenue: 0,
      conversionRate: 0,
    };

    const normalizedRecords = records.map((r: Record<string, unknown>) => ({
      id: r.id as string,
      patientId: r.patient_id as string,
      recordType: r.record_type as string,
      estimateNumber: r.estimate_number as string | undefined,
      invoiceNumber: r.invoice_number as string | undefined,
      receiptNumber: r.receipt_number as string | undefined,
      description: r.description as string,
      totalAmount: r.total_amount as number,
      taxAmount: r.tax_amount as number | undefined,
      discountAmount: r.discount_amount as number | undefined,
      netAmount: r.net_amount as number,
      paymentStatus: r.payment_status as string,
      paymentMethod: r.payment_method as string | undefined,
      paymentDate: r.payment_date as string | undefined,
      dueDate: r.due_date as string | undefined,
      notes: r.notes as string | undefined,
      documentUrl: r.document_url as string | undefined,
      createdAt: r.created_at as string,
      updatedAt: r.updated_at as string,
    }));

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">
            Financeiro: {(patient.first_name as string) || ''} {(patient.last_name as string) || ''}
          </h1>
          <a
            href="/financial"
            className="text-blue-600 hover:underline text-sm"
          >
            Trocar paciente
          </a>
        </div>

        <FinancialForm patientId={patientId} />
        <FinancialList
          records={normalizedRecords}
          summary={summary}
          onDelete={async (id: string) => {
            'use server';
            await fetch(`/api/financial/${id}`, { method: 'DELETE' });
          }}
        />
      </div>
    );
  } catch (error) {
    console.error('Financial page error:', error);
    return <div className="text-red-600">Erro ao carregar dados financeiros</div>;
  }
}
