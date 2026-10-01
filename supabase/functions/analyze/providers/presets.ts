// Known OpenAI-compatible vendors: only the default base URL differs. Override with AI_BASE_URL.
export const OPENAI_COMPATIBLE_PRESETS: Record<string, string> = {
  "openai-compatible": "", // generic: AI_BASE_URL is required
  openai: "https://api.openai.com/v1",
  deepseek: "https://api.deepseek.com",
  kimi: "https://api.moonshot.ai/v1", // Moonshot AI global endpoint; mainland China uses https://api.moonshot.cn/v1
};
