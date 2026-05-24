import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  children,
  className,
}: EmptyStateProps) {
  return (
    <Card
      className={cn(
        "items-center border-dashed border-border/80 bg-muted/10 py-12 text-center shadow-none rounded-3xl animate-fade-in",
        className,
      )}
    >
      <CardContent className="flex flex-col items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/8 ring-1 ring-primary/15 animate-pulse-soft">
          <Icon className="h-7 w-7 text-primary" />
        </div>
        <div className="space-y-1.5">
          <p className="font-bold text-foreground text-base tracking-tight">{title}</p>
          {description ? (
            <p className="max-w-sm text-sm font-medium text-muted-foreground/80 leading-relaxed">{description}</p>
          ) : null}
        </div>
        {children}
      </CardContent>
    </Card>
  );
}
