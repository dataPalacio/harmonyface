/**
 * Analytics and Reporting Types
 * Types for KPIs, metrics, and report generation
 */

// ============ DASHBOARD KPIS ============

export interface DashboardKPIs {
  patientsToday: number;
  patientsThisWeek: number;
  patientsThisMonth: number;
  patientsTotal: number;

  revenueToday: number;
  revenueThisWeek: number;
  revenueThisMonth: number;
  revenueThisYear: number;

  appointmentsToday: number;
  appointmentsTomorrow: number;
  appointmentsThisWeek: number;
  appointmentsThisMonth: number;

  noShowRate: number; // percentage 0-100
  returnRate: number; // percentage 0-100
  averageTicket: number; // average revenue per session
  occupancyRate: number; // percentage 0-100

  topProcedures: ProcedureMetric[];
  recentSessions: SessionSummary[];
  upcomingAppointments: AppointmentSummary[];
  lowStockAlerts: StockAlert[];
  expiringProducts: StockAlert[];
}

export interface ProcedureMetric {
  procedureId: string;
  procedureName: string;
  count: number;
  revenue: number;
  percentage: number;
}

export interface SessionSummary {
  id: string;
  date: string;
  patientName: string;
  procedures: string[];
  revenue: number;
  complianceScore?: number;
}

export interface AppointmentSummary {
  id: string;
  scheduledAt: string;
  patientName: string;
  procedureName: string;
  status: string;
  durationMin: number;
}

export interface StockAlert {
  id: string;
  productName: string;
  quantityAvailable: number;
  minStockAlert?: number;
  expiryDate?: string;
  daysUntilExpiry?: number;
  severity: 'critical' | 'warning' | 'info';
}

// ============ TIME SERIES DATA ============

export interface TimeSeriesDataPoint {
  date: string; // ISO date string
  value: number;
  label?: string;
}

export interface RevenueChartData {
  daily: TimeSeriesDataPoint[];
  weekly: TimeSeriesDataPoint[];
  monthly: TimeSeriesDataPoint[];
  yearly: TimeSeriesDataPoint[];
}

export interface ProcedureDistribution {
  name: string;
  value: number;
  color?: string;
  percentage: number;
}

// ============ REPORT GENERATION ============

export interface ReportFilter {
  startDate: string;
  endDate: string;
  patientId?: string;
  procedureId?: string;
  status?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface ReportConfig {
  title: string;
  type: 'financial' | 'clinical' | 'inventory' | 'patients' | 'compliance';
  format: 'pdf' | 'csv' | 'excel';
  filters: ReportFilter;
  includeCharts?: boolean;
  includeDetails?: boolean;
  groupBy?: 'day' | 'week' | 'month' | 'procedure' | 'patient';
}

export interface FinancialReport {
  period: {
    start: string;
    end: string;
  };
  summary: {
    totalRevenue: number;
    totalExpenses: number;
    netIncome: number;
    transactionCount: number;
    averageTicket: number;
  };
  byProcedure: {
    procedureName: string;
    count: number;
    revenue: number;
    percentage: number;
  }[];
  byPaymentMethod: {
    method: string;
    count: number;
    amount: number;
    percentage: number;
  }[];
  byStatus: {
    status: string;
    count: number;
    amount: number;
  }[];
  timeline: TimeSeriesDataPoint[];
  topPatients: {
    patientId: string;
    patientName: string;
    totalSpent: number;
    sessionCount: number;
  }[];
}

export interface ClinicalReport {
  period: {
    start: string;
    end: string;
  };
  summary: {
    totalSessions: number;
    uniquePatients: number;
    totalProcedures: number;
    averageComplianceScore: number;
  };
  byProcedure: {
    procedureName: string;
    count: number;
    percentage: number;
    averageComplianceScore: number;
  }[];
  complicationRate: {
    total: number;
    withComplications: number;
    rate: number; // percentage
    commonComplications: string[];
  };
  complianceFlags: {
    critical: number;
    warning: number;
    info: number;
  };
}

export interface InventoryReport {
  summary: {
    totalProducts: number;
    totalValue: number;
    lowStockCount: number;
    expiringCount: number;
  };
  products: {
    productName: string;
    manufacturer: string;
    quantityAvailable: number;
    value: number;
    status: 'normal' | 'low' | 'critical' | 'expiring' | 'expired';
  }[];
  movements: {
    date: string;
    productName: string;
    type: 'in' | 'out';
    quantity: number;
    reason?: string;
  }[];
  expiringProducts: StockAlert[];
}

export interface PatientReport {
  summary: {
    totalPatients: number;
    newPatientsThisMonth: number;
    activePatients: number; // had session in last 6 months
    averageAge: number;
  };
  demographics: {
    ageGroup: string;
    count: number;
    percentage: number;
  }[];
  byGender: {
    gender: string;
    count: number;
    percentage: number;
  }[];
  topPatients: {
    patientId: string;
    patientName: string;
    sessionCount: number;
    totalSpent: number;
    lastVisit: string;
  }[];
}

// ============ EXPORT OPTIONS ============

export interface ExportOptions {
  filename: string;
  format: 'pdf' | 'csv' | 'excel';
  includeHeaders?: boolean;
  includeTimestamp?: boolean;
  orientation?: 'portrait' | 'landscape';
  pageSize?: 'A4' | 'letter';
}

export interface ExportResult {
  success: boolean;
  filename?: string;
  url?: string;
  error?: string;
  sizeBytes?: number;
}
