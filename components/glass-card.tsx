import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingMap = {
  none: "",
  sm: "p-4",
  md: "p-5 sm:p-6",
  lg: "p-6 sm:p-8",
};

export function GlassCard({
  children,
  className,
  padding = "md",
}: GlassCardProps) {
  if (padding === "none") {
    return (
      <Card className={cn("gap-0 glass-panel py-0 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/15 rounded-2xl", className)}>
        {children}
      </Card>
    );
  }

  return (
    <Card className={cn("glass-panel shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/15 rounded-2xl", className)}>
      <CardContent className={cn("pt-0", paddingMap[padding])}>{children}</CardContent>
    </Card>
  );
}
