"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { FileSpreadsheet, FileText, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { ReportFiltersPanel } from "@/components/reportes/report-filters";
import { ReportPreviewTable } from "@/components/reportes/report-preview-table";
import { ReportTypeSelect } from "@/components/reportes/report-type-select";
import { EmptyState } from "@/components/empty-state";
import { GlassCard } from "@/components/glass-card";
import { LoadingState } from "@/components/loading-state";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { buildReportQuery, defaultReportFilters } from "@/lib/reports/filters";
import type { ReportFilters, ReportResult, ReportType } from "@/lib/reports/types";
import type { ReportExportFormat } from "@/lib/reports/types";
import { cn } from "@/lib/utils";

interface ReportesViewProps {
  proveedores: string[];
  añosDisponibles: number[];
  initialType?: ReportType;
  initialFilters?: ReportFilters;
}

export function ReportesView({
  proveedores,
  añosDisponibles,
  initialType = "resumen",
  initialFilters: initialFiltersProp,
}: ReportesViewProps) {
  const pathname = usePathname();
  const [reportType, setReportType] = useState<ReportType>(initialType);
  const [filters, setFilters] = useState<ReportFilters>(
    initialFiltersProp ?? defaultReportFilters(),
  );
  const [report, setReport] = useState<ReportResult | null>(null);
  const [totalRows, setTotalRows] = useState(0);
  const [truncated, setTruncated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState<ReportExportFormat | null>(null);

  const loadPreview = useCallback(async () => {
    setIsLoading(true);
    try {
      const query = buildReportQuery(reportType, filters);
      const response = await fetch(`/api/reports?${query}&format=json`, {
        cache: "no-store",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "No se pudo generar la vista previa");
      }

      setReport(data.report);
      setTotalRows(data.totalRows ?? 0);
      setTruncated(Boolean(data.truncated));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "No se pudo cargar el reporte",
      );
      setReport(null);
      setTotalRows(0);
    } finally {
      setIsLoading(false);
    }
  }, [reportType, filters]);

  useEffect(() => {
    void loadPreview();
  }, [loadPreview]);

  useEffect(() => {
    if (pathname !== "/reportes") return;
    void loadPreview();
  }, [pathname, loadPreview]);

  async function handleExport(format: ReportExportFormat) {
    setIsExporting(format);
    try {
      const query = buildReportQuery(reportType, filters);
      const response = await fetch(`/api/reports?${query}&format=${format}`);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "No se pudo exportar el reporte");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download =
        response.headers.get("Content-Disposition")?.match(/filename="(.+)"/)?.[1] ??
        `reporte.${format === "json" ? "json" : format}`;
      anchor.click();
      URL.revokeObjectURL(url);
      toast.success(`Reporte exportado en ${format.toUpperCase()}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error al exportar el reporte",
      );
    } finally {
      setIsExporting(null);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reportes"
        description="Genera reportes con filtros, vista previa y descarga en Excel, CSV o PDF."
      >
        <Button
          variant="outline"
          size="sm"
          className="h-9 rounded-xl"
          onClick={() => void loadPreview()}
          disabled={isLoading}
        >
          <RefreshCw className={cn("mr-2 h-4 w-4", isLoading && "animate-spin")} />
          Actualizar
        </Button>
        <Button
          size="sm"
          className="h-9 rounded-xl"
          disabled={isExporting !== null || isLoading || totalRows === 0}
          onClick={() => void handleExport("xlsx")}
        >
          {isExporting === "xlsx" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <FileSpreadsheet className="mr-2 h-4 w-4" />
          )}
          Excel
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-9 rounded-xl"
          disabled={isExporting !== null || isLoading || totalRows === 0}
          onClick={() => void handleExport("csv")}
        >
          {isExporting === "csv" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <FileText className="mr-2 h-4 w-4" />
          )}
          CSV
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-9 rounded-xl"
          disabled={isExporting !== null || isLoading || totalRows === 0}
          onClick={() => void handleExport("pdf")}
        >
          {isExporting === "pdf" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <FileText className="mr-2 h-4 w-4" />
          )}
          PDF
        </Button>
      </PageHeader>

      <GlassCard padding="md" className="space-y-4">
        <h2 className="font-heading text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Tipo de reporte
        </h2>
        <ReportTypeSelect value={reportType} onChange={setReportType} />
      </GlassCard>

      <ReportFiltersPanel
        filters={filters}
        reportType={reportType}
        proveedores={proveedores}
        añosDisponibles={añosDisponibles}
        isLoading={isLoading}
        onChange={setFilters}
      />

      <GlassCard padding="md">
        {isLoading ? (
          <LoadingState label="Generando vista previa..." />
        ) : report ? (
          <ReportPreviewTable
            report={report}
            truncated={truncated}
            totalRows={totalRows}
          />
        ) : (
          <EmptyState
            icon={FileText}
            title="Sin datos"
            description="Ajusta los filtros o sube facturas para generar reportes."
          />
        )}
      </GlassCard>
    </div>
  );
}
