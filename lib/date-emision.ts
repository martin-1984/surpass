/** Convierte DD/MM/YYYY a Date (medianoche local). */
export function parseEmisionDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const parts = value.split("/");
  if (parts.length !== 3) return null;
  const day = Number(parts[0]);
  const month = Number(parts[1]);
  const year = Number(parts[2]);
  if (!day || !month || !year) return null;
  return new Date(year, month - 1, day);
}

/** YYYY-MM-DD en zona local. */
export function toInputDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function todayInputDate(): string {
  return toInputDate(new Date());
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function endOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
}

export function parseInputDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function isEmisionInRange(
  fechaEmision: string | null | undefined,
  desde: string,
  hasta: string,
): boolean {
  const emision = parseEmisionDate(fechaEmision);
  const from = parseInputDate(desde);
  const to = parseInputDate(hasta);
  if (!emision || !from || !to) return false;
  return emision >= startOfDay(from) && emision <= endOfDay(to);
}

export function isUploadedToday(createdAt: string): boolean {
  const created = new Date(createdAt);
  const today = new Date();
  return (
    created.getFullYear() === today.getFullYear() &&
    created.getMonth() === today.getMonth() &&
    created.getDate() === today.getDate()
  );
}
