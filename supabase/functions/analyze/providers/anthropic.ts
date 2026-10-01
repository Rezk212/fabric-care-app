import Anthropic from "npm:@anthropic-ai/sdk";
import { SCHEMA, SYSTEM, userText } from "../prompt.ts";
import { AiError, type AiProvider, type ProviderRequest, type RawAnalysis } from "./types.ts";

export function anthropicProvider(opts: { apiKey?: string; model: string }): AiProvider {
  const client = new Anthropic({ apiKey: opts.apiKey });
  return {
    name: "anthropic",
    async analyze(req: ProviderRequest): Promise<RawAnalysis> {
      const content: Anthropic.Beta.BetaContentBlockParam[] = [];
      for (const img of req.images) {
        content.push({ type: "text", text: `Photo role: ${img.role}` });
        content.push({ type: "image", source: { type: "base64", media_type: img.mediaType, data: img.data } });
      }
      content.push({ type: "text", text: userText(req.modelNumber) });

      try {
        const response = await client.beta.messages.create({
          model: opts.model,
          max_tokens: 2000,
          betas: ["server-side-fallback-2026-07-01"],
          fallbacks: "default",
          system: SYSTEM,
          output_config: { effort: "low", format: { type: "json_schema", schema: SCHEMA } },
          messages: [{ role: "user", content }],
        });
        if (response.stop_reason === "refusal") throw new AiError("refused");
        if (response.stop_reason === "max_tokens") throw new AiError("bad_output", "truncated");
        const text = response.content.find((b) => b.type === "text");
        if (!text || text.type !== "text") throw new AiError("bad_output", "no text");
        try { return JSON.parse(text.text); } catch { throw new AiError("bad_output", "not json"); }
      } catch (err) {
        if (err instanceof AiError) throw err;
        if (err instanceof Anthropic.RateLimitError) throw new AiError("rate_limited");
        if (err instanceof Anthropic.AuthenticationError) throw new AiError("misconfigured");
        if (err instanceof Anthropic.BadRequestError) throw new AiError("bad_request", err.message);
        throw new AiError("upstream", String(err));
      }
    },
  };
}
