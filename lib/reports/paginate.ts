import type { ReportResult } from "./types";

export const DEFAULT_REPORT_PAGE_SIZE = 10;
export const REPORT_PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;
export const MAX_REPORT_PAGE_SIZE = 100;

export interface ReportPaginationParams {
  page: number;
  pageSize: number;
}

export interface ReportPaginationMeta extends ReportPaginationParams {
  totalRows: number;
  totalPages: number;
}

export function parseReportPagination(
  searchParams: URLSearchParams,
): ReportPaginationParams {
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const rawSize =
    Number(searchParams.get("pageSize")) || DEFAULT_REPORT_PAGE_SIZE;
  const pageSize = Math.min(
    MAX_REPORT_PAGE_SIZE,
    Math.max(1, Number.isFinite(rawSize) ? rawSize : DEFAULT_REPORT_PAGE_SIZE),
  );
  return { page, pageSize };
}

export function paginateReport(
  report: ReportResult,
  { page, pageSize }: ReportPaginationParams,
): { report: ReportResult; pagination: ReportPaginationMeta } {
  const totalRows = report.totalRows;
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const rows = report.rows.slice(start, start + pageSize);
  const isLastPage = safePage === totalPages;

  return {
    report: {
      ...report,
      rows,
      footer: report.footer && isLastPage && rows.length > 0 ? report.footer : undefined,
    },
    pagination: {
      page: safePage,
      pageSize,
      totalRows,
      totalPages,
    },
  };
}
