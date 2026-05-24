import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function LoadingState({
  className,
  label = "Cargando...",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 py-16 text-muted-foreground animate-fade-in",
        className,
      )}
    >
      <div className="relative flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-4 border-primary/10 border-t-primary animate-spin" />
        <div className="absolute h-6 w-6 rounded-full border-4 border-primary/5 border-b-[#4F4EC3]/40 animate-spin [animation-direction:reverse] [animation-duration:1.5s]" />
      </div>
      <p className="text-sm font-semibold text-muted-foreground/80 tracking-wide animate-pulse">{label}</p>
    </div>
  );
}
