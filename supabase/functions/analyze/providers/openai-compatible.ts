import { SCHEMA, SYSTEM, userText } from "../prompt.ts";
import { AiError, type AiProvider, type ProviderRequest, type RawAnalysis } from "./types.ts";

export interface OpenAiCompatibleOptions {
  /** e.g. https://api.openai.com/v1 — any server exposing POST {baseUrl}/chat/completions. */
  baseUrl: string;
  apiKey: string;
  model: string;
  /** "schema": strict JSON-schema output. "object": plain JSON mode with the schema in the prompt (wider support). */
  jsonMode?: "schema" | "object";
  fetch?: typeof fetch;
}

export function openAiCompatibleProvider(opts: OpenAiCompatibleOptions): AiProvider {
  const doFetch = opts.fetch ?? fetch;
  const mode = opts.jsonMode ?? "schema";
  return {
    name: "openai-compatible",
    async analyze(req: ProviderRequest): Promise<RawAnalysis> {
      const userContent: unknown[] = [];
      for (const img of req.images) {
        userContent.push({ type: "text", text: `Photo role: ${img.role}` });
        userContent.push({ type: "image_url", image_url: { url: `data:${img.mediaType};base64,${img.data}` } });
      }
      userContent.push({ type: "text", text: userText(req.modelNumber) });

      const system = mode === "object"
        ? `${SYSTEM}\nRespond with a single JSON object matching this JSON Schema:\n${JSON.stringify(SCHEMA)}`
        : SYSTEM;

      let res: Response;
      try {
        res = await doFetch(`${opts.baseUrl.replace(/\/$/, "")}/chat/completions`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${opts.apiKey}` },
          body: JSON.stringify({
            model: opts.model,
            messages: [{ role: "system", content: system }, { role: "user", content: userContent }],
            response_format: mode === "schema"
              ? { type: "json_schema", json_schema: { name: "garment_analysis", strict: true, schema: SCHEMA } }
              : { type: "json_object" },
          }),
        });
      } catch (err) {
        throw new AiError("upstream", String(err));
      }

      if (res.status === 401 || res.status === 403) throw new AiError("misconfigured");
      if (res.status === 429) throw new AiError("rate_limited");
      if (res.status === 400) throw new AiError("bad_request", await res.text().catch(() => ""));
      if (!res.ok) throw new AiError("upstream", `status ${res.status}`);

      const body = await res.json().catch(() => null) as
        | { choices?: { message?: { content?: string; refusal?: string | null }; finish_reason?: string }[] }
        | null;
      const choice = body?.choices?.[0];
      if (choice?.message?.refusal || choice?.finish_reason === "content_filter") throw new AiError("refused");
      const text = choice?.message?.content;
      if (typeof text !== "string") throw new AiError("bad_output", "no content");
      try { return JSON.parse(text); } catch { throw new AiError("bad_output", "not json"); }
    },
  };
}
