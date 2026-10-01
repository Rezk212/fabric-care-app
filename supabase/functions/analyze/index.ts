// Supabase Edge Function: analyze garment / care label / washing machine photos.
// Which AI answers is a server setting (see providers/index.ts); the app never knows or cares.
import { FABRICS } from "./prompt.ts";
import { pickProvider } from "./providers/index.ts";
import { AiError, type InputImage } from "./providers/types.ts";

const MAX_IMAGES = 3;
const MAX_IMAGE_B64_CHARS = 2_500_000; // ~1.8 MB decoded per image
const ROLES = ["garment", "label", "machine"] as const;
const MEDIA_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

function parseInput(raw: unknown): { images: InputImage[]; modelNumber?: string } | string {
  if (typeof raw !== "object" || raw === null) return "Body must be a JSON object.";
  const { images, modelNumber } = raw as { images?: unknown; modelNumber?: unknown };
  if (!Array.isArray(images) || images.length === 0 || images.length > MAX_IMAGES) {
    return `Send between 1 and ${MAX_IMAGES} images.`;
  }
  const out: InputImage[] = [];
  for (const i of images) {
    const { role, mediaType, data } = (i ?? {}) as Partial<InputImage>;
    if (!ROLES.includes(role as never)) return "Invalid image role.";
    if (!MEDIA_TYPES.includes(mediaType as never)) return "Unsupported image type.";
    if (typeof data !== "string" || data.length === 0 || data.length > MAX_IMAGE_B64_CHARS) return "Image missing or too large.";
    out.push({ role: role!, mediaType: mediaType!, data });
  }
  const model = typeof modelNumber === "string" ? modelNumber.trim().slice(0, 60) : undefined;
  return { images: out, modelNumber: model || undefined };
}

const STATUS = {
  refused: 422, rate_limited: 429, misconfigured: 500, bad_request: 400, upstream: 502, bad_output: 502,
} as const;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  let body: unknown;
  try { body = await req.json(); } catch { return json({ error: "invalid_json" }, 400); }
  const input = parseInput(body);
  if (typeof input === "string") return json({ error: "invalid_input", message: input }, 400);

  try {
    const provider = pickProvider((n) => Deno.env.get(n));
    const parsed = await provider.analyze(input);

    // Model output is untrusted: coerce every field into the contract.
    const fabric = FABRICS.includes(parsed.fabric as never) ? parsed.fabric : "unknown";
    const confidence = Math.min(1, Math.max(0, Number(parsed.confidence) || 0));
    const strings = (v: unknown) => (Array.isArray(v) ? v.filter((x) => typeof x === "string").slice(0, 12) : []);
    return json({
      fabric,
      confidence,
      careSymbols: strings(parsed.care_symbols),
      machine: {
        brand: typeof parsed.machine_brand === "string" ? parsed.machine_brand : null,
        model: typeof parsed.machine_model === "string" ? parsed.machine_model : (input.modelNumber ?? null),
      },
      notes: strings(parsed.notes),
    });
  } catch (err) {
    if (err instanceof AiError) {
      if (err.code === "misconfigured" || err.code === "upstream" || err.code === "bad_output") console.error("analyze:", err.code, err.message);
      return json({ error: err.code }, STATUS[err.code]);
    }
    console.error("analyze failed", err);
    return json({ error: "internal" }, 500);
  }
});
