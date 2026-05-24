export type InvoiceProvider = "celima" | "saint-gobain" | "unknown";

export interface InvoiceLineItem {
  item: string;
  cantidad: number;
  unidad: string;
  codigo: string;
  descripcion: string;
  valorUnitario: number;
  descuento: number;
  precioUnitario: number;
  valorVenta: number;
}

export interface ParsedInvoice {
  provider: InvoiceProvider;
  numeroFactura: string;
  rucEmisor: string;
  proveedor: string;
  fechaEmision: string | null;
  fechaVencimiento: string | null;
  moneda: string;
  totalPagar: number | null;
  items: InvoiceLineItem[];
}

export interface InvoiceParser {
  provider: InvoiceProvider;
  canParse(text: string): boolean;
  parse(text: string): ParsedInvoice;
}
