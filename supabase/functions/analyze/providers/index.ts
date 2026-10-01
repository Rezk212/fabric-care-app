import { anthropicProvider } from "./anthropic.ts";
import { openAiCompatibleProvider } from "./openai-compatible.ts";
import { OPENAI_COMPATIBLE_PRESETS } from "./presets.ts";
import { AiError, type AiProvider } from "./types.ts";

/**
 * Chooses the provider from Supabase secrets, so switching AI needs no app update:
 *   AI_PROVIDER = "anthropic" (default) | "openai" | "deepseek" | "kimi" | "openai-compatible"
 *   AI_MODEL    = model id for the chosen provider
 * anthropic:          ANTHROPIC_API_KEY
 * all others:        AI_API_KEY, AI_MODEL, optional AI_BASE_URL (required for "openai-compatible"),
 *                     optional AI_JSON_MODE=schema|object
 */
export function pickProvider(env: (name: string) => string | undefined): AiProvider {
  const kind = env("AI_PROVIDER") ?? "anthropic";
  if (kind === "anthropic") {
    return anthropicProvider({
      apiKey: env("ANTHROPIC_API_KEY"),
      model: env("AI_MODEL") ?? env("ANTHROPIC_MODEL") ?? "claude-opus-5-5",
    });
  }
  if (kind in OPENAI_COMPATIBLE_PRESETS) {
    const baseUrl = env("AI_BASE_URL") || OPENAI_COMPATIBLE_PRESETS[kind];
    const apiKey = env("AI_API_KEY");
    const model = env("AI_MODEL");
    if (!baseUrl || !apiKey || !model) throw new AiError("misconfigured", "AI_API_KEY, AI_MODEL and a base URL are required");
    return openAiCompatibleProvider({ baseUrl, apiKey, model, jsonMode: env("AI_JSON_MODE") === "object" ? "object" : "schema" });
  }
  throw new AiError("misconfigured", `Unknown AI_PROVIDER: ${kind}`);
}
