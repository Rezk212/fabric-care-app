import { anthropicProvider } from "./anthropic.ts";
import { openAiCompatibleProvider } from "./openai-compatible.ts";
import { AiError, type AiProvider } from "./types.ts";

/**
 * Chooses the provider from Supabase secrets, so switching AI needs no app update:
 *   AI_PROVIDER = "anthropic" (default) | "openai-compatible"
 *   AI_MODEL    = model id for the chosen provider
 * anthropic:          ANTHROPIC_API_KEY
 * openai-compatible:  AI_BASE_URL, AI_API_KEY, optional AI_JSON_MODE=schema|object
 */
export function pickProvider(env: (name: string) => string | undefined): AiProvider {
  const kind = env("AI_PROVIDER") ?? "anthropic";
  if (kind === "anthropic") {
    return anthropicProvider({
      apiKey: env("ANTHROPIC_API_KEY"),
      model: env("AI_MODEL") ?? env("ANTHROPIC_MODEL") ?? "claude-opus-5-5",
    });
  }
  if (kind === "openai-compatible") {
    const baseUrl = env("AI_BASE_URL");
    const apiKey = env("AI_API_KEY");
    const model = env("AI_MODEL");
    if (!baseUrl || !apiKey || !model) throw new AiError("misconfigured", "AI_BASE_URL, AI_API_KEY and AI_MODEL are required");
    return openAiCompatibleProvider({ baseUrl, apiKey, model, jsonMode: env("AI_JSON_MODE") === "object" ? "object" : "schema" });
  }
  throw new AiError("misconfigured", `Unknown AI_PROVIDER: ${kind}`);
}
