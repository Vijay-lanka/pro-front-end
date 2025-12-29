declare module "pdf-parse" {
  interface PDFParseResult {
    text: string;
    numpages: number;
    numrender: number;
    info: unknown;
    metadata: unknown;
    version: string;
  }

  function pdf(
    data: Buffer | Uint8Array,
    options?: unknown
  ): Promise<PDFParseResult>;

  export = pdf;
}
