import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function LoadingState({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground",
        className,
      )}
    >
      <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      <p className="text-sm">Cargando...</p>
    </div>
  );
}
