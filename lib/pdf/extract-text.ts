import { extractText, getDocumentProxy } from "unpdf";

function toUint8Array(buffer: ArrayBuffer | Uint8Array | Buffer): Uint8Array {
  if (buffer instanceof Buffer) {
    return Uint8Array.from(buffer);
  }
  if (buffer instanceof Uint8Array) {
    return Uint8Array.from(buffer);
  }
  return new Uint8Array(buffer.slice(0));
}

export async function extractPdfText(
  buffer: ArrayBuffer | Uint8Array | Buffer,
): Promise<string> {
  const data = toUint8Array(buffer);
  const pdf = await getDocumentProxy(data);
  const { text } = await extractText(pdf, { mergePages: true });
  return text.replace(/\s+/g, " ").trim();
}
