/**
 * Reports API
 * Generate financial, clinical, inventory, and patient reports
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import {
  generateFinancialReport,
  generateClinicalReport,
  generateInventoryReport,
  generatePatientReport,
} from '@/lib/services/report-service';
import {
  exportToCSV,
  generateFinancialReportPDF,
  generateClinicalReportPDF,
} from '@/lib/services/export-service';
import type { ReportFilter } from '@/types/analytics';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type, format, filters } = body as {
      type: 'financial' | 'clinical' | 'inventory' | 'patients';
      format: 'json' | 'csv' | 'pdf';
      filters: ReportFilter;
    };

    if (!type || !format) {
      return NextResponse.json({ error: 'Missing required fields: type, format' }, { status: 400 });
    }

    // Validate date range
    if (!filters?.startDate || !filters?.endDate) {
      return NextResponse.json({ error: 'Missing date range in filters' }, { status: 400 });
    }

    let report: any;

    // Generate report based on type
    switch (type) {
      case 'financial':
        report = await generateFinancialReport(filters);
        break;
      case 'clinical':
        report = await generateClinicalReport(filters);
        break;
      case 'inventory':
        report = await generateInventoryReport();
        break;
      case 'patients':
        report = await generatePatientReport(filters);
        break;
      default:
        return NextResponse.json({ error: 'Invalid report type' }, { status: 400 });
    }

    // Return in requested format
    switch (format) {
      case 'json':
        return NextResponse.json({ data: report });

      case 'csv':
        // Convert report to flat array for CSV
        let csvData: any[] = [];
        if (type === 'financial') {
          csvData = report.byProcedure;
        } else if (type === 'clinical') {
          csvData = report.byProcedure;
        } else if (type === 'inventory') {
          csvData = report.products;
        } else if (type === 'patients') {
          csvData = report.topPatients;
        }

        const csvResult = exportToCSV(csvData, {
          filename: `${type}_report_${new Date().toISOString().split('T')[0]}`,
          format: 'csv',
          includeHeaders: true,
          includeTimestamp: true,
        });

        if (!csvResult.success) {
          return NextResponse.json({ error: csvResult.error }, { status: 500 });
        }

        return NextResponse.json({ data: csvResult });

      case 'pdf':
        let pdfHTML: string;
        if (type === 'financial') {
          pdfHTML = generateFinancialReportPDF(report);
        } else if (type === 'clinical') {
          pdfHTML = generateClinicalReportPDF(report);
        } else {
          return NextResponse.json({ error: 'PDF export not supported for this report type' }, { status: 400 });
        }

        return new NextResponse(pdfHTML, {
          headers: {
            'Content-Type': 'text/html',
            'Content-Disposition': `inline; filename="${type}_report.html"`,
          },
        });

      default:
        return NextResponse.json({ error: 'Invalid format' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
