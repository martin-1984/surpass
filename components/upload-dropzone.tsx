"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { CloudUpload, FileText, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface UploadDropzoneProps {
  onUploadComplete?: () => void;
  /** Query del listado actual, p. ej. `?emisionDesde=...` para conservar filtros al ver detalle. */
  listQuery?: string;
}

export function UploadDropzone({ onUploadComplete, listQuery = "" }: UploadDropzoneProps) {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = useCallback(
    async (file: File) => {
      if (file.type !== "application/pdf") {
        toast.error("Solo se permiten archivos PDF");
        return;
      }

      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/facturas/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error ?? "Error al subir la factura");
        }

        toast.success(
          data.replaced
            ? "Factura actualizada: se reemplazó el registro anterior del mismo proveedor y número"
            : "Factura procesada correctamente",
        );
        onUploadComplete?.();
        router.push(`/facturas/${data.factura.id}${listQuery}`);
        router.refresh();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Error al subir la factura",
        );
      } finally {
        setIsUploading(false);
      }
    },
    [listQuery, onUploadComplete, router],
  );

  const handleFiles = useCallback(
    (files: FileList | null) => {
      const file = files?.[0];
      if (file) void uploadFile(file);
    },
    [uploadFile],
  );

  return (
    <Card
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        handleFiles(event.dataTransfer.files);
      }}
      className={cn(
        "surface-card relative overflow-hidden border-2 border-dashed transition-all duration-300 animate-fade-in",
        isDragging
          ? "border-primary bg-primary/[0.04] shadow-2xl shadow-primary/5 scale-[0.99]"
          : "border-border/80 hover:border-primary/50 hover:bg-muted/15 hover:shadow-md",
        isUploading && "pointer-events-none opacity-80",
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-primary/[0.03] transition-opacity duration-300",
          isDragging ? "opacity-100" : "opacity-0",
        )}
      />

      <CardHeader className="relative items-center text-center pt-8">
        <div
          className={cn(
            "flex h-16 w-16 items-center justify-center rounded-2xl ring-1 ring-inset transition-all duration-500",
            isDragging
              ? "bg-primary/15 ring-primary/30 scale-110"
              : "bg-muted/70 ring-border/80 animate-pulse-soft",
          )}
        >
          {isUploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          ) : isDragging ? (
            <CloudUpload className="h-8 w-8 text-primary" />
          ) : (
            <Sparkles className="h-8 w-8 text-primary/80" />
          )}
        </div>
        <CardTitle className="font-heading text-lg font-bold tracking-tight mt-3">
          {isUploading
            ? "Procesando PDF..."
            : isDragging
              ? "Suelta el archivo aquí"
              : "Arrastra tu factura PDF"}
        </CardTitle>
        <CardDescription className="max-w-sm text-xs sm:text-sm font-medium text-muted-foreground/80">
          Cerámica Lima (F004) y Saint-Gobain (FV01). Extracción automática de líneas de detalle.
        </CardDescription>
      </CardHeader>

      <CardContent className="relative flex justify-center pb-8 pt-2">
        <Button
          type="button"
          variant="outline"
          disabled={isUploading}
          className="h-11 border-border/80 bg-background/50 hover:bg-background rounded-xl px-5 transition-all duration-300 font-semibold"
          onClick={() => document.getElementById("pdf-upload-input")?.click()}
        >
          <FileText className="mr-2 h-4 w-4 text-muted-foreground transition-transform duration-300 group-hover:scale-105" />
          Seleccionar archivo
        </Button>
        <input
          id="pdf-upload-input"
          type="file"
          accept="application/pdf"
          className="hidden"
          disabled={isUploading}
          onChange={(event) => handleFiles(event.target.files)}
        />
      </CardContent>
    </Card>
  );
}
