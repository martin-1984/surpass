/** Clave estable para detectar la misma factura (proveedor + número). */
export function facturaIdentityKey(proveedor: string, numeroFactura: string) {
  const proveedorNorm = proveedor.trim().toLowerCase().replace(/\s+/g, " ");
  const numeroNorm = numeroFactura.trim().toUpperCase().replace(/\s+/g, "");
  return `${proveedorNorm}|${numeroNorm}`;
}

export function isSameFactura(
  a: { proveedor: string; numero_factura: string },
  proveedor: string,
  numeroFactura: string,
) {
  return facturaIdentityKey(a.proveedor, a.numero_factura) === facturaIdentityKey(proveedor, numeroFactura);
}
