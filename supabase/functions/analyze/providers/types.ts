export interface InputImage {
  role: "garment" | "label" | "machine";
  mediaType: "image/jpeg" | "image/png" | "image/webp";
  data: string; // base64, no data: prefix
}

export interface ProviderRequest { images: InputImage[]; modelNumber?: string }

/** Raw model output, matching SCHEMA. Untrusted: index.ts validates it. */
export type RawAnalysis = Record<string, unknown>;

export type AiErrorCode = "refused" | "rate_limited" | "misconfigured" | "bad_request" | "upstream" | "bad_output";
export class AiError extends Error {
  constructor(public code: AiErrorCode, message?: string) { super(message ?? code); }
}

/** To add a provider: implement this, then register it in providers/index.ts. */
export interface AiProvider {
  readonly name: string;
  analyze(req: ProviderRequest): Promise<RawAnalysis>;
}
