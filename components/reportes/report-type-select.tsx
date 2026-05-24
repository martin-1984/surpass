"use client";

import { cn } from "@/lib/utils";
import { REPORT_META, REPORT_TYPES, type ReportType } from "@/lib/reports/types";

interface ReportTypeSelectProps {
  value: ReportType;
  onChange: (type: ReportType) => void;
}

export function ReportTypeSelect({ value, onChange }: ReportTypeSelectProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {REPORT_TYPES.map((type) => {
        const meta = REPORT_META[type];
        const selected = value === type;
        return (
          <button
            key={type}
            type="button"
            onClick={() => onChange(type)}
            className={cn(
              "rounded-2xl border p-4 text-left transition-all duration-200",
              selected
                ? "border-primary bg-primary/5 shadow-md ring-1 ring-primary/20"
                : "border-border/80 bg-card/60 hover:border-primary/25 hover:bg-card",
            )}
          >
            <p className="font-heading text-sm font-bold text-foreground">{meta.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {meta.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}
