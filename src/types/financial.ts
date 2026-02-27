/**
 * Financial Module Types
 * Handles financial records, invoices, receipts, estimates, and payments
 */

export type FinancialRecordType = 'estimate' | 'invoice' | 'receipt' | 'payment';
export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'overdue' | 'cancelled';
export type PaymentMethod = 'cash' | 'credit_card' | 'debit_card' | 'transfer' | 'pix' | 'check';

export interface FinancialRecord {
  id: string;
  patientId: string;
  recordType: FinancialRecordType;
  estimateNumber?: string;
  invoiceNumber?: string;
  receiptNumber?: string;
  description: string;
  totalAmount: number;
  taxAmount?: number;
  discountAmount?: number;
  netAmount: number;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  paymentDate?: string; // ISO 8601
  dueDate?: string; // ISO 8601
  notes?: string;
  documentUrl?: string; // PDF storage URL
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

export interface FinancialRecordInput {
  patientId: string;
  recordType: FinancialRecordType;
  estimateNumber?: string;
  invoiceNumber?: string;
  receiptNumber?: string;
  description: string;
  totalAmount: number;
  taxAmount?: number;
  discountAmount?: number;
  netAmount?: number; // auto-calculated
  paymentStatus?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  paymentDate?: string;
  dueDate?: string;
  notes?: string;
  documentUrl?: string;
}

export interface Invoice extends FinancialRecord {
  recordType: 'invoice';
  invoiceNumber: string;
  dueDate: string;
}

export interface Receipt extends FinancialRecord {
  recordType: 'receipt';
  receiptNumber: string;
  paymentDate: string;
}

export interface Estimate extends FinancialRecord {
  recordType: 'estimate';
  estimateNumber: string;
}

export interface Payment {
  id: string;
  financialRecordId: string;
  patientId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentDate: string; // ISO 8601
  notes?: string;
  createdAt: string; // ISO 8601
}

export interface PaymentInput {
  financialRecordId: string;
  patientId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentDate?: string;
  notes?: string;
}

export interface FinancialSummary {
  totalRevenue: number;
  pendingPayments: number;
  paidPayments: number;
  overduePayments: number;
  lastMonthRevenue: number;
  conversionRate: number; // estimates to invoices
}
