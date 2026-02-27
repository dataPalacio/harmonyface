/**
 * Financial Dashboard Page
 * Displays financial records, summary statistics, and management interface
 */

import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/auth-client';
import { FinancialForm } from '@/components/financial/financial-form';
import { FinancialList } from '@/components/financial/financial-list';
import type { FinancialRecordType, PaymentMethod, PaymentStatus } from '@/types/financial';

interface PageProps {
  searchParams: { patientId?: string };
}

interface PatientRow {
  id: string;
  first_name: string | null;
  last_name: string | null;
}

interface FinancialRecordRow {
  id: string;
  patient_id: string;
  record_type: string;
  estimate_number: string | null;
  invoice_number: string | null;
  receipt_number: string | null;
  description: string;
  total_amount: number;
  tax_amount: number | null;
  discount_amount: number | null;
  net_amount: number;
  payment_status: string;
  payment_method: string | null;
  payment_date: string | null;
  due_date: string | null;
  notes: string | null;
  document_url: string | null;
  created_at: string;
  updated_at: string;
}

function toFinancialRecordType(value: string): FinancialRecordType {
  if (value === 'estimate' || value === 'invoice' || value === 'receipt' || value === 'payment') {
    return value;
  }

  return 'estimate';
}

function toPaymentStatus(value: string): PaymentStatus {
  if (
    value === 'pending' ||
    value === 'partial' ||
    value === 'paid' ||
    value === 'overdue' ||
    value === 'cancelled'
  ) {
    return value;
  }

  return 'pending';
}

function toPaymentMethod(value: string | null): PaymentMethod | undefined {
  if (
    value === 'cash' ||
    value === 'credit_card' ||
    value === 'debit_card' ||
    value === 'transfer' ||
    value === 'pix' ||
    value === 'check'
  ) {
    return value;
  }

  return undefined;
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
    const typedPatients = (patients ?? []) as PatientRow[];

    const patientId = searchParams.patientId;

    if (!patientId) {
      return (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Gestão Financeira</h1>
          <p className="text-gray-600">Selecione um paciente para visualizar registros financeiros:</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {typedPatients.map((patient) => (
              <a
                key={patient.id}
                href={`/financial?patientId=${patient.id}`}
                className="p-4 border rounded hover:bg-blue-50 hover:border-blue-400 cursor-pointer transition"
              >
                <p className="font-semibold">
                  {patient.first_name || ''} {patient.last_name || ''}
                </p>
                <p className="text-sm text-gray-600">ID: {patient.id.slice(0, 8)}...</p>
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
    const typedRecords = (records ?? []) as FinancialRecordRow[];

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
      totalRevenue: typedRecords
        .filter((record) => record.payment_status === 'paid')
        .reduce((sum, record) => sum + record.net_amount, 0),
      pendingPayments: typedRecords
        .filter((record) => record.payment_status === 'pending')
        .reduce((sum, record) => sum + record.net_amount, 0),
      paidPayments: 0,
      overduePayments: typedRecords
        .filter((record) => record.payment_status === 'overdue')
        .reduce((sum, record) => sum + record.net_amount, 0),
      lastMonthRevenue: 0,
      conversionRate: 0,
    };

    const normalizedRecords = typedRecords.map((record) => ({
      id: record.id,
      patientId: record.patient_id,
      recordType: toFinancialRecordType(record.record_type),
      estimateNumber: record.estimate_number ?? undefined,
      invoiceNumber: record.invoice_number ?? undefined,
      receiptNumber: record.receipt_number ?? undefined,
      description: record.description,
      totalAmount: record.total_amount,
      taxAmount: record.tax_amount ?? undefined,
      discountAmount: record.discount_amount ?? undefined,
      netAmount: record.net_amount,
      paymentStatus: toPaymentStatus(record.payment_status),
      paymentMethod: toPaymentMethod(record.payment_method),
      paymentDate: record.payment_date ?? undefined,
      dueDate: record.due_date ?? undefined,
      notes: record.notes ?? undefined,
      documentUrl: record.document_url ?? undefined,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
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
