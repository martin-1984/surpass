import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: React.ReactNode;
  hint?: string;
  icon: LucideIcon;
  accent?: "primary" | "emerald" | "violet";
  className?: string;
}

const accentStyles = {
  primary: "bg-primary/10 text-primary ring-primary/20",
  emerald: "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20",
  violet: "bg-violet-500/10 text-violet-600 ring-violet-500/20",
};

export function StatCard({
  title,
  value,
  hint,
  icon: Icon,
  accent = "primary",
  className,
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "surface-card py-0 transition-all duration-200 hover:border-primary/20 hover:shadow-md",
        className,
      )}
    >
      <CardContent className="flex items-start justify-between gap-4 p-5 sm:p-6">
        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
            {title}
          </p>
          <div className="font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            {value}
          </div>
          {hint ? <p className="text-sm text-muted-foreground">{hint}</p> : null}
        </div>
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-full ring-1 ring-inset",
            accentStyles[accent],
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}
