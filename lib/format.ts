export function formatCurrency(
  value: number | null | undefined,
  currency = "PEN",
) {
  if (value == null) return "—";
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  const [day, month, year] = value.split("/");
  if (!day || !month || !year) return value;
  return `${day}/${month}/${year}`;
}

export function providerLabel(provider: string) {
  switch (provider) {
    case "celima":
      return "Cerámica Lima";
    case "saint-gobain":
      return "Saint-Gobain";
    default:
      return provider;
  }
}
