"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DeleteFacturaButtonProps {
  facturaId: string;
  label?: string;
  returnHref?: string;
  onDeleted?: () => void;
  iconOnly?: boolean;
  className?: string;
}

export function DeleteFacturaButton({
  facturaId,
  label,
  returnHref,
  onDeleted,
  iconOnly = false,
  className,
}: DeleteFacturaButtonProps) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/facturas/${facturaId}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "No se pudo eliminar la factura");
      }

      toast.success("Factura eliminada");
      onDeleted?.();

      if (returnHref) {
        router.push(returnHref);
        router.refresh();
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "No se pudo eliminar la factura",
      );
    } finally {
      setIsDeleting(false);
      setConfirming(false);
    }
  }

  function stopNavigation(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  if (confirming) {
    return (
      <div
        className={cn("flex flex-wrap items-center gap-2", className)}
        onClick={stopNavigation}
      >
        <span className="text-xs font-medium text-muted-foreground">
          ¿Eliminar{label ? ` ${label}` : ""}?
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 rounded-lg"
          disabled={isDeleting}
          onClick={() => setConfirming(false)}
        >
          Cancelar
        </Button>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          className="h-8 rounded-lg"
          disabled={isDeleting}
          onClick={() => void handleDelete()}
        >
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Confirmar"
          )}
        </Button>
      </div>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      size={iconOnly ? "icon-sm" : "sm"}
      className={cn(
        iconOnly
          ? "rounded-xl text-destructive hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
          : "rounded-xl border-destructive/25 text-destructive hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive",
        className,
      )}
      onClick={(event) => {
        stopNavigation(event);
        setConfirming(true);
      }}
      aria-label={label ? `Eliminar factura ${label}` : "Eliminar factura"}
    >
      <Trash2 className={iconOnly ? "h-4 w-4" : "mr-2 h-4 w-4"} />
      {!iconOnly ? "Eliminar" : null}
    </Button>
  );
}
