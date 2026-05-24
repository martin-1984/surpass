"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
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
import { EmptyState } from "@/components/empty-state";
import { GlassCard } from "@/components/glass-card";
import { InvoiceMobileList } from "@/components/invoice-mobile-list";
import { LoadingState } from "@/components/loading-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/page-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UploadDropzone } from "@/components/upload-dropzone";
import { todayInputDate } from "@/lib/date-emision";
import { formatCurrency, formatDate, providerLabel } from "@/lib/format";
import type { Factura } from "@/lib/types/database";

type FilterMode = "uploadedToday" | "emision";

interface FacturasListProps {
  initialFacturas: Factura[];
  initialMode?: FilterMode;
}

function buildQuery(mode: FilterMode, emisionDesde: string, emisionHasta: string) {
  if (mode === "emision") {
    return `emisionDesde=${emisionDesde}&emisionHasta=${emisionHasta}`;
  }
  return "uploadedToday=true";
}

export function FacturasList({
  initialFacturas,
  initialMode = "uploadedToday",
}: FacturasListProps) {
  const [facturas, setFacturas] = useState(initialFacturas);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [filterMode, setFilterMode] = useState<FilterMode>(initialMode);
  const [emisionDesde, setEmisionDesde] = useState(todayInputDate());
  const [emisionHasta, setEmisionHasta] = useState(todayInputDate());

  const loadFacturas = useCallback(
    async (mode: FilterMode = filterMode) => {
      setIsLoading(true);
      try {
        const query = buildQuery(mode, emisionDesde, emisionHasta);
        const response = await fetch(`/api/facturas?${query}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error ?? "No se pudieron cargar las facturas");
        }

        setFacturas(data.facturas ?? []);
        setFilterMode(mode);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "No se pudieron cargar las facturas",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [emisionDesde, emisionHasta, filterMode],
  );

  async function handleExport() {
    setIsExporting(true);
    try {
      const query = buildQuery(filterMode, emisionDesde, emisionHasta);
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

  return (
    <div className="space-y-8">
      <PageHeader
        title="Facturas"
        description="Sube PDFs y consulta el historial con filtros por fecha de emisión."
      >
        <Button
          variant="outline"
          size="sm"
          className="border-white/10 bg-transparent"
          onClick={() => void loadFacturas(filterMode)}
          disabled={isLoading}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Actualizar
        </Button>
        <Button
          size="sm"
          className="bg-gradient-to-r from-emerald-600 to-emerald-500 shadow-md shadow-emerald-500/20"
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

      <UploadDropzone onUploadComplete={() => void loadFacturas("uploadedToday")} />

      <GlassCard padding="none" className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="font-heading text-lg font-semibold">Historial</h2>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <Badge
                variant="secondary"
                className="border border-cyan-500/20 bg-cyan-500/10 text-cyan-300"
              >
                {filterLabel}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {facturas.length} factura(s)
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4 p-4 sm:p-6">
          <div className="rounded-xl border border-white/10 bg-muted/20 p-4 sm:p-5">
            <div className="mb-4 flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Calendar className="h-4 w-4 text-cyan-400" />
              Filtro por fecha de emisión
            </div>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
              <div className="grid flex-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="emision-desde">Desde</Label>
                  <Input
                    id="emision-desde"
                    type="date"
                    className="h-11 bg-background/50"
                    value={emisionDesde}
                    onChange={(e) => setEmisionDesde(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emision-hasta">Hasta</Label>
                  <Input
                    id="emision-hasta"
                    type="date"
                    className="h-11 bg-background/50"
                    value={emisionHasta}
                    onChange={(e) => setEmisionHasta(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
                <Button
                  type="button"
                  className="h-11 bg-gradient-to-r from-cyan-500 to-cyan-600 shadow-md shadow-cyan-500/20"
                  onClick={() => void loadFacturas("emision")}
                  disabled={isLoading}
                >
                  <Search className="mr-2 h-4 w-4" />
                  Filtrar
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 border-white/10"
                  onClick={() => void loadFacturas("uploadedToday")}
                  disabled={isLoading}
                >
                  Subidas hoy
                </Button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <LoadingState />
          ) : facturas.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="Sin resultados"
              description="No hay facturas para el filtro seleccionado. Prueba otro rango de fechas."
            />
          ) : (
            <>
              <InvoiceMobileList facturas={facturas} showEstado />
              <div className="table-scroll hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-transparent">
                      <TableHead>Factura</TableHead>
                      <TableHead>Proveedor</TableHead>
                      <TableHead>Emisión</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {facturas.map((factura) => (
                      <TableRow
                        key={factura.id}
                        className="border-white/5 transition-colors hover:bg-white/5"
                      >
                        <TableCell className="font-medium">
                          <Link
                            href={`/facturas/${factura.id}`}
                            className="text-cyan-400 hover:text-cyan-300 hover:underline"
                          >
                            {factura.numero_factura}
                          </Link>
                        </TableCell>
                        <TableCell>{providerLabel(factura.proveedor)}</TableCell>
                        <TableCell>{formatDate(factura.fecha_emision)}</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(factura.total_pagar, factura.moneda)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              factura.estado === "parsed" ? "default" : "secondary"
                            }
                            className={
                              factura.estado === "parsed"
                                ? "bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30"
                                : ""
                            }
                          >
                            {factura.estado === "parsed" ? "Procesada" : "Pendiente"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
