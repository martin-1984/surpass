import type { FacturasFilterParams } from "@/lib/facturas-filter";
import { todayInputDate } from "@/lib/date-emision";

export type FacturasListMode = "uploadedToday" | "emision";

export interface FacturasListFilterState {
  mode: FacturasListMode;
  emisionDesde: string;
  emisionHasta: string;
}

const LIST_QUERY_KEYS = ["uploadedToday", "emisionDesde", "emisionHasta"] as const;

export function defaultFacturasListState(): FacturasListFilterState {
  const today = todayInputDate();
  return {
    mode: "uploadedToday",
    emisionDesde: today,
    emisionHasta: today,
  };
}

export function parseFacturasListState(
  searchParams: URLSearchParams,
): FacturasListFilterState {
  const emisionDesde = searchParams.get("emisionDesde");
  const emisionHasta = searchParams.get("emisionHasta");

  if (emisionDesde && emisionHasta) {
    return {
      mode: "emision",
      emisionDesde,
      emisionHasta,
    };
  }

  const defaults = defaultFacturasListState();
  return {
    mode: "uploadedToday",
    emisionDesde: defaults.emisionDesde,
    emisionHasta: defaults.emisionHasta,
  };
}

export function listStateToFilterParams(state: FacturasListFilterState): FacturasFilterParams {
  if (state.mode === "emision") {
    return {
      emisionDesde: state.emisionDesde,
      emisionHasta: state.emisionHasta,
    };
  }
  return { uploadedToday: true };
}

export function buildFacturasListQuery(state: FacturasListFilterState): string {
  if (state.mode === "emision") {
    return new URLSearchParams({
      emisionDesde: state.emisionDesde,
      emisionHasta: state.emisionHasta,
    }).toString();
  }
  return "uploadedToday=true";
}

/** Query string para enlaces al detalle (preserva filtros del listado). */
export function buildFacturasReturnQuery(searchParams: URLSearchParams): string {
  const listState = parseFacturasListState(searchParams);
  return buildFacturasListQuery(listState);
}

export function buildFacturasReturnHref(searchParams: URLSearchParams): string {
  const query = buildFacturasReturnQuery(searchParams);
  return `/facturas?${query}`;
}

export function pickListSearchParams(searchParams: URLSearchParams): URLSearchParams {
  const picked = new URLSearchParams();
  for (const key of LIST_QUERY_KEYS) {
    const value = searchParams.get(key);
    if (value) picked.set(key, value);
  }
  if (!picked.has("emisionDesde") && !picked.has("uploadedToday")) {
    picked.set("uploadedToday", "true");
  }
  return picked;
}
