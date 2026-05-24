import { NextRequest, NextResponse } from "next/server";
import { buildReport, reportNeedsItems } from "@/lib/reports/build-report";
import { paginateReport, parseReportPagination } from "@/lib/reports/paginate";
import { reportToCsvBuffer } from "@/lib/reports/export-csv";
import { reportToExcelBuffer } from "@/lib/reports/export-excel";
import { reportToPdfBuffer } from "@/lib/reports/export-pdf";
import { buildReportFilename } from "@/lib/reports/filename";
import { parseReportQuery } from "@/lib/reports/filters";
import { isReportExportFormat, isReportType } from "@/lib/reports/validate";
import { getStorageAdapter } from "@/lib/storage";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const { filters, type, format: formatParam } = parseReportQuery(searchParams);

    if (!isReportType(type)) {
      return NextResponse.json(
        { error: "Parámetro type inválido o faltante" },
        { status: 400 },
      );
    }

    const format = isReportExportFormat(formatParam) ? formatParam : "json";

    const storage = getStorageAdapter();
    const facturas = await storage.listFacturas();
    const facturasWithItems = reportNeedsItems(type)
      ? await storage.listFacturasWithItems()
      : undefined;

    const fullReport = buildReport({
      type,
      filters,
      facturas,
      facturasWithItems,
    });

    if (fullReport.totalRows === 0 && format !== "json") {
      return NextResponse.json(
        { error: "No hay datos para el reporte con los filtros seleccionados" },
        { status: 404 },
      );
    }

    if (format === "json") {
      const paginationParams = parseReportPagination(searchParams);
      const { report, pagination } = paginateReport(fullReport, paginationParams);
      return NextResponse.json(
        {
          report,
          pagination,
        },
        { headers: { "Cache-Control": "no-store" } },
      );
    }

    const exportReport =
      format === "pdf" && fullReport.rows.length > 500
        ? { ...fullReport, rows: fullReport.rows.slice(0, 500) }
        : fullReport;

    const filename = buildReportFilename(type, format);
    const headers: Record<string, string> = {
      "Cache-Control": "no-store",
      "Content-Disposition": `attachment; filename="${filename}"`,
    };

    if (format === "xlsx") {
      const buffer = reportToExcelBuffer(exportReport);
      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          ...headers,
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
      });
    }

    if (format === "csv") {
      const buffer = reportToCsvBuffer(exportReport);
      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          ...headers,
          "Content-Type": "text/csv; charset=utf-8",
        },
      });
    }

    const buffer = reportToPdfBuffer(exportReport);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        ...headers,
        "Content-Type": "application/pdf",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al generar reporte" },
      { status: 500 },
    );
  }
}
