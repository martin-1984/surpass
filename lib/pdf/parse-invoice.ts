import { extractPdfText } from "./extract-text";
import { parseInvoiceText } from "./detect-provider";
import type { ParsedInvoice } from "./types";

export async function parseInvoicePdf(
  buffer: ArrayBuffer | Uint8Array,
): Promise<ParsedInvoice> {
  const text = await extractPdfText(buffer);
  return parseInvoiceText(text);
}
