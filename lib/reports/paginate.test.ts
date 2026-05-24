import { describe, expect, it } from "vitest";
import { paginateReport } from "./paginate";
import type { ReportResult } from "./types";

const sampleReport: ReportResult = {
  type: "facturas",
  title: "Test",
  periodLabel: "Periodo",
  columns: [{ key: "id", label: "ID" }],
  rows: Array.from({ length: 30 }, (_, i) => ({ id: String(i + 1) })),
  footer: { id: "Total" },
  totalRows: 30,
};

describe("paginateReport", () => {
  it("devuelve la primera página con footer en la última", () => {
    const { report, pagination } = paginateReport(sampleReport, {
      page: 1,
      pageSize: 10,
    });

    expect(report.rows).toHaveLength(10);
    expect(report.footer).toBeUndefined();
    expect(pagination.totalPages).toBe(3);
    expect(pagination.totalRows).toBe(30);
  });

  it("incluye footer solo en la última página", () => {
    const { report } = paginateReport(sampleReport, { page: 3, pageSize: 10 });
    expect(report.rows).toHaveLength(10);
    expect(report.footer?.id).toBe("Total");
  });

  it("ajusta la página si excede el total", () => {
    const { pagination } = paginateReport(sampleReport, { page: 99, pageSize: 10 });
    expect(pagination.page).toBe(3);
  });
});
