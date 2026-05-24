"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { CloudUpload, FileText, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UploadDropzoneProps {
  onUploadComplete?: () => void;
}

export function UploadDropzone({ onUploadComplete }: UploadDropzoneProps) {
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

        toast.success("Factura procesada correctamente");
        onUploadComplete?.();
        router.push(`/facturas/${data.factura.id}`);
        router.refresh();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Error al subir la factura",
        );
      } finally {
        setIsUploading(false);
      }
    },
    [onUploadComplete, router],
  );

  const handleFiles = useCallback(
    (files: FileList | null) => {
      const file = files?.[0];
      if (file) void uploadFile(file);
    },
    [uploadFile],
  );

  return (
    <div
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
        "relative flex flex-col items-center justify-center gap-5 overflow-hidden rounded-2xl border-2 border-dashed p-8 transition-all duration-300 sm:p-12",
        isDragging
          ? "border-cyan-400 bg-cyan-500/10 shadow-lg shadow-cyan-500/10"
          : "border-white/15 bg-card/30 hover:border-cyan-500/30 hover:bg-card/50",
        isUploading && "pointer-events-none opacity-80",
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-violet-500/5 transition-opacity",
          isDragging ? "opacity-100" : "opacity-0",
        )}
      />

      <div
        className={cn(
          "relative flex h-16 w-16 items-center justify-center rounded-2xl ring-1 ring-inset transition-all duration-300",
          isDragging
            ? "bg-cyan-500/20 ring-cyan-400/40"
            : "bg-muted/50 ring-white/10",
        )}
      >
        {isUploading ? (
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
        ) : isDragging ? (
          <CloudUpload className="h-8 w-8 text-cyan-400" />
        ) : (
          <Sparkles className="h-8 w-8 text-cyan-400/80" />
        )}
      </div>

      <div className="relative space-y-2 text-center">
        <p className="font-heading text-lg font-semibold">
          {isUploading
            ? "Procesando PDF..."
            : isDragging
              ? "Suelta el archivo aquí"
              : "Arrastra tu factura PDF"}
        </p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Cerámica Lima (F004) y Saint-Gobain (FV01). Extracción automática de
          líneas.
        </p>
      </div>

      <Button
        type="button"
        variant="secondary"
        disabled={isUploading}
        className="relative border-white/10 bg-white/5 hover:bg-white/10"
        onClick={() => document.getElementById("pdf-upload-input")?.click()}
      >
        <FileText className="mr-2 h-4 w-4" />
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
    </div>
  );
}
