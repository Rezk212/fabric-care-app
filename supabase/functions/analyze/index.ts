// Supabase Edge Function: analyze garment / care label / washing machine photos with Claude.
// The Anthropic key lives only here, as the ANTHROPIC_API_KEY secret. It never reaches the app.
import Anthropic from "npm:@anthropic-ai/sdk";

const MODEL = Deno.env.get("ANTHROPIC_MODEL") ?? "claude-opus-5-5";
const MAX_IMAGES = 3;
const MAX_IMAGE_B64_CHARS = 2_500_000; // ~1.8 MB decoded per image
const ROLES = ["garment", "label", "machine"] as const;
const MEDIA_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

const FABRICS = [
  "cotton", "linen", "wool", "silk", "polyester", "nylon", "denim",
  "cashmere", "viscose", "synthetic_blend", "unknown",
] as const;

const SCHEMA = {
  type: "object",
  properties: {
    fabric: { type: "string", enum: [...FABRICS] },
    confidence: { type: "number", description: "0 to 1: how sure you are about the fabric." },
    care_symbols: {
      type: "array",
      items: { type: "string" },
      description: "Care label symbols you can read, as short English phrases, e.g. 'wash 30C', 'do not tumble dry'.",
    },
    machine_brand: { type: ["string", "null"] },
    machine_model: { type: ["string", "null"] },
    notes: {
      type: "array",
      items: { type: "string" },
      description: "Short practical warnings for this garment, in English.",
    },
  },
  required: ["fabric", "confidence", "care_symbols", "machine_brand", "machine_model", "notes"],
  additionalProperties: false,
} as const;

const SYSTEM = `You identify fabrics and read laundry care labels from photos for a laundry-care app.
Photos may include: a garment, its care label, and a washing machine (panel or rating plate).
- Report the fabric only from evidence in the photos (label text, texture, visible weave). If you cannot tell, use "unknown" with low confidence. Never guess a fabric to look helpful.
- Care labels override visual guesses. Read symbols and text exactly.
- For the machine, report brand and model only if they are legible in a photo or given by the user; otherwise null.
- Do not recommend wash programs. The app derives those from your fabric and symbols.`;

interface InputImage { role: typeof ROLES[number]; mediaType: typeof MEDIA_TYPES[number]; data: string }

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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  let body: unknown;
  try { body = await req.json(); } catch { return json({ error: "invalid_json" }, 400); }
  const input = parseInput(body);
  if (typeof input === "string") return json({ error: "invalid_input", message: input }, 400);

  const client = new Anthropic({ apiKey: Deno.env.get("ANTHROPIC_API_KEY") });

  const content: Anthropic.Beta.BetaContentBlockParam[] = [];
  for (const img of input.images) {
    content.push({ type: "text", text: `Photo role: ${img.role}` });
    content.push({ type: "image", source: { type: "base64", media_type: img.mediaType, data: img.data } });
  }
  content.push({
    type: "text",
    text: input.modelNumber
      ? `The user typed this machine model number: ${input.modelNumber}. Identify the fabric and read the label.`
      : "Identify the fabric and read the label.",
  });

  try {
    const response = await client.beta.messages.create({
      model: MODEL,
      max_tokens: 2000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: SYSTEM,
      output_config: { effort: "low", format: { type: "json_schema", schema: SCHEMA } },
      messages: [{ role: "user", content }],
    });

    if (response.stop_reason === "refusal") return json({ error: "refused" }, 422);
    if (response.stop_reason === "max_tokens") return json({ error: "truncated" }, 502);

    const text = response.content.find((b) => b.type === "text");
    if (!text || text.type !== "text") return json({ error: "no_output" }, 502);

    let parsed: Record<string, unknown>;
    try { parsed = JSON.parse(text.text); } catch { return json({ error: "bad_model_output" }, 502); }

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
    if (err instanceof Anthropic.RateLimitError) return json({ error: "rate_limited" }, 429);
    if (err instanceof Anthropic.AuthenticationError) return json({ error: "server_misconfigured" }, 500);
    if (err instanceof Anthropic.BadRequestError) return json({ error: "bad_request", message: err.message }, 400);
    if (err instanceof Anthropic.APIConnectionError) return json({ error: "upstream_unreachable" }, 502);
    console.error("analyze failed", err);
    return json({ error: "internal" }, 500);
  }
});
