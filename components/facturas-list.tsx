"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Calendar,
  Download,
  FileSpreadsheet,
  FileText,
  RefreshCw,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import { EmptyState } from "@/components/empty-state";
import { GlassCard } from "@/components/glass-card";
import { InvoicesDataView } from "@/components/invoices-data-view";
import { LoadingState } from "@/components/loading-state";
import { PageHeader } from "@/components/ui/page-header";
import { UploadDropzone } from "@/components/upload-dropzone";
import { isEmisionInRange } from "@/lib/date-emision";
import {
  buildFacturasListQuery,
  type FacturasListFilterState,
  type FacturasListMode,
} from "@/lib/facturas-list-state";
import { buildReportQuery } from "@/lib/reports/filters";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import type { Factura } from "@/lib/types/database";

interface FacturasListProps {
  initialFacturas: Factura[];
  initialFilters: FacturasListFilterState;
  initialListQuery: string;
}

export function FacturasList({
  initialFacturas,
  initialFilters,
  initialListQuery,
}: FacturasListProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [facturas, setFacturas] = useState(initialFacturas);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [filterMode, setFilterMode] = useState<FacturasListMode>(initialFilters.mode);
  const [emisionDesde, setEmisionDesde] = useState(initialFilters.emisionDesde);
  const [emisionHasta, setEmisionHasta] = useState(initialFilters.emisionHasta);
  const [listQuery, setListQuery] = useState(initialListQuery);
  const filterStateRef = useRef({
    mode: initialFilters.mode,
    desde: initialFilters.emisionDesde,
    hasta: initialFilters.emisionHasta,
  });

  useEffect(() => {
    filterStateRef.current = {
      mode: filterMode,
      desde: emisionDesde,
      hasta: emisionHasta,
    };
  }, [filterMode, emisionDesde, emisionHasta]);

  const replaceListUrl = useCallback(
    (mode: FacturasListMode, desde: string, hasta: string) => {
      const state: FacturasListFilterState = {
        mode,
        emisionDesde: desde,
        emisionHasta: hasta,
      };
      const query = buildFacturasListQuery(state);
      setListQuery(query);
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
      return query;
    },
    [pathname, router],
  );

  const loadFacturas = useCallback(
    async (
      mode: FacturasListMode,
      desde: string,
      hasta: string,
      options?: { background?: boolean },
    ) => {
      if (!options?.background) {
        setIsLoading(true);
      }

      try {
        const query =
          mode === "emision"
            ? `emisionDesde=${desde}&emisionHasta=${hasta}`
            : "uploadedToday=true";

        replaceListUrl(mode, desde, hasta);

        const response = await fetch(`/api/facturas?${query}`, { cache: "no-store" });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error ?? "No se pudieron cargar las facturas");
        }

        setFacturas(data.facturas ?? []);
        setFilterMode(mode);
        setEmisionDesde(desde);
        setEmisionHasta(hasta);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "No se pudieron cargar las facturas",
        );
      } finally {
        if (!options?.background) {
          setIsLoading(false);
        }
      }
    },
    [replaceListUrl],
  );

  useEffect(() => {
    if (pathname !== "/facturas") return;
    const { mode, desde, hasta } = filterStateRef.current;
    void loadFacturas(mode, desde, hasta, { background: true });
  }, [pathname, loadFacturas]);

  const handleUploadComplete = useCallback(
    (factura: { id: string; fecha_emision?: string | null }) => {
      void loadFacturas("uploadedToday", emisionDesde, emisionHasta);

      if (
        filterMode === "emision" &&
        factura.fecha_emision &&
        !isEmisionInRange(factura.fecha_emision, emisionDesde, emisionHasta)
      ) {
        toast.info(
          "La factura se guardó correctamente. Su fecha de emisión está fuera del rango filtrado; usa «Subidas hoy» para verla.",
        );
      }
    },
    [emisionDesde, emisionHasta, filterMode, loadFacturas],
  );

  async function handleExport() {
    setIsExporting(true);
    try {
      const query =
        filterMode === "emision"
          ? `emisionDesde=${emisionDesde}&emisionHasta=${emisionHasta}`
          : "uploadedToday=true";
      const response = await fetch(`/api/facturas/export?${query}`);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "No se pudo exportar");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download =
        response.headers.get("Content-Disposition")?.match(/filename="(.+)"/)?.[1] ??
        "facturas.xlsx";
      anchor.click();
      URL.revokeObjectURL(url);
      toast.success("Excel exportado correctamente");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al exportar");
    } finally {
      setIsExporting(false);
    }
  }

  const filterLabel =
    filterMode === "uploadedToday"
      ? "Subidas hoy"
      : `Emisión ${emisionDesde.split("-").reverse().join("/")} – ${emisionHasta.split("-").reverse().join("/")}`;

  const listQuerySuffix = listQuery ? `?${listQuery}` : "";

  const handleFacturaDeleted = useCallback((id: string) => {
    setFacturas((current) => current.filter((factura) => factura.id !== id));
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Facturas"
        description="Sube PDFs, consulta el historial y exporta a Excel con filtros por fecha de emisión."
      >
        <Button
          variant="outline"
          size="sm"
          className="h-9 rounded-xl"
          onClick={() => void loadFacturas(filterMode, emisionDesde, emisionHasta)}
          disabled={isLoading}
        >
          <RefreshCw className={cn("mr-2 h-4 w-4", isLoading && "animate-spin")} />
          Actualizar
        </Button>
        <Link
          href={`/reportes?${buildReportQuery("detalle_lineas", {
            uploadedToday: filterMode === "uploadedToday",
            emisionDesde,
            emisionHasta,
            proveedor: null,
          })}`}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-9 rounded-xl")}
        >
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Reportes
        </Link>
        <Button
          size="sm"
          className="h-9 rounded-xl bg-emerald-600 font-semibold text-white shadow-sm hover:bg-emerald-700"
          onClick={() => void handleExport()}
          disabled={isExporting || facturas.length === 0}
        >
          {isExporting ? (
            <Download className="mr-2 h-4 w-4 animate-pulse" />
          ) : (
            <FileSpreadsheet className="mr-2 h-4 w-4" />
          )}
          Exportar Excel
        </Button>
      </PageHeader>

      <UploadDropzone onUploadComplete={handleUploadComplete} />

      <GlassCard padding="none" className="overflow-hidden">
        <CardHeader className="border-b border-border/60 bg-muted/30 px-5 py-4 sm:px-6">
          <CardTitle className="font-heading text-lg">Historial de facturas</CardTitle>
          <CardDescription className="flex flex-wrap items-center gap-2 pt-1">
            <Badge
              variant="outline"
              className="rounded-full border-primary/20 bg-primary/5 px-3 font-semibold text-primary"
            >
              {filterLabel}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {facturas.length} factura{facturas.length !== 1 ? "s" : ""}
            </span>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5 p-4 sm:p-6">
          <Card className="border-border/80 bg-muted/25 py-0 shadow-none">
            <CardHeader className="px-4 pb-2 pt-4 sm:px-5">
              <CardTitle className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <Calendar className="h-4 w-4 text-primary" />
                Filtro por fecha de emisión
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-5 sm:px-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
                <div className="grid flex-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="emision-desde" className="text-xs font-semibold uppercase text-muted-foreground">
                      Desde
                    </Label>
                    <DatePicker
                      id="emision-desde"
                      value={emisionDesde}
                      onChange={setEmisionDesde}
                      placeholder="Fecha inicial"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emision-hasta" className="text-xs font-semibold uppercase text-muted-foreground">
                      Hasta
                    </Label>
                    <DatePicker
                      id="emision-hasta"
                      value={emisionHasta}
                      onChange={setEmisionHasta}
                      placeholder="Fecha final"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
                  <Button
                    type="button"
                    className="h-11 rounded-xl font-semibold shadow-sm"
                    onClick={() => void loadFacturas("emision", emisionDesde, emisionHasta)}
                    disabled={isLoading}
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Filtrar
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 rounded-xl font-semibold"
                    onClick={() => void loadFacturas("uploadedToday", emisionDesde, emisionHasta)}
                    disabled={isLoading}
                  >
                    Subidas hoy
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {isLoading ? (
            <LoadingState />
          ) : facturas.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="Sin resultados"
              description={
                filterMode === "emision"
                  ? "No hay facturas con emisión en ese rango. Prueba «Subidas hoy» o amplía las fechas."
                  : "No hay facturas subidas hoy. Sube un PDF o filtra por fecha de emisión."
              }
            />
          ) : (
            <InvoicesDataView
              facturas={facturas}
              showEstado
              listQuery={listQuerySuffix}
              resetKey={`${filterMode}-${emisionDesde}-${emisionHasta}`}
              onDeleted={handleFacturaDeleted}
            />
          )}
        </CardContent>
      </GlassCard>
    </div>
  );
}
