import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: React.ReactNode;
  hint?: string;
  icon: LucideIcon;
  accent?: "cyan" | "violet" | "amber" | "emerald";
  className?: string;
}

const accentOrb = {
  cyan: "from-cyan-500/20 to-cyan-600/5",
  violet: "from-violet-500/20 to-violet-600/5",
  amber: "from-amber-500/20 to-amber-600/5",
  emerald: "from-emerald-500/20 to-emerald-600/5",
};

const accentIcon = {
  cyan: "from-cyan-500/20 to-cyan-600/5 text-cyan-400 ring-cyan-500/30",
  violet: "from-violet-500/20 to-violet-600/5 text-violet-400 ring-violet-500/30",
  amber: "from-amber-500/20 to-amber-600/5 text-amber-400 ring-amber-500/30",
  emerald: "from-emerald-500/20 to-emerald-600/5 text-emerald-400 ring-emerald-500/30",
};

export function StatCard({
  title,
  value,
  hint,
  icon: Icon,
  accent = "cyan",
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/10 bg-card/60 p-5 shadow-lg backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:shadow-xl hover:shadow-cyan-500/5",
        className,
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br opacity-60 blur-2xl transition-opacity group-hover:opacity-100",
          accentOrb[accent],
        )}
      />
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {title}
          </p>
          <p className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            {value}
          </p>
          {hint ? (
            <p className="text-xs text-muted-foreground">{hint}</p>
          ) : null}
        </div>
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ring-1 ring-inset",
            accentIcon[accent],
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
