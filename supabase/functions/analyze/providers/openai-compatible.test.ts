import assert from "node:assert/strict";
import { test } from "node:test";
import { openAiCompatibleProvider } from "./openai-compatible.ts";
import { AiError } from "./types.ts";

const req = { images: [{ role: "label" as const, mediaType: "image/jpeg" as const, data: "AAAA" }], modelNumber: "WW90" };
const ok = (content: string) =>
  new Response(JSON.stringify({ choices: [{ message: { content }, finish_reason: "stop" }] }), { status: 200 });

function make(handler: (url: string, init: RequestInit) => Response, jsonMode?: "schema" | "object") {
  const calls: { url: string; body: any; auth: string }[] = [];
  const provider = openAiCompatibleProvider({
    baseUrl: "https://example.test/v1/", apiKey: "k", model: "m", jsonMode,
    fetch: (async (url: string, init: RequestInit) => {
      calls.push({ url, body: JSON.parse(init.body as string), auth: (init.headers as any).Authorization });
      return handler(url, init);
    }) as unknown as typeof fetch,
  });
  return { provider, calls };
}

test("sends image as data URL to /chat/completions and parses JSON", async () => {
  const { provider, calls } = make(() => ok('{"fabric":"silk","confidence":0.8}'));
  const out = await provider.analyze(req);
  assert.equal(out.fabric, "silk");
  assert.equal(calls[0].url, "https://example.test/v1/chat/completions");
  assert.equal(calls[0].auth, "Bearer k");
  assert.equal(calls[0].body.response_format.type, "json_schema");
  const parts = calls[0].body.messages[1].content;
  assert.ok(parts.some((p: any) => p.type === "image_url" && p.image_url.url === "data:image/jpeg;base64,AAAA"));
  assert.ok(parts.some((p: any) => p.type === "text" && p.text.includes("WW90")));
});

test("json_object mode embeds the schema in the system prompt", async () => {
  const { provider, calls } = make(() => ok("{}"), "object");
  await provider.analyze(req);
  assert.equal(calls[0].body.response_format.type, "json_object");
  assert.match(calls[0].body.messages[0].content, /JSON Schema/);
});

test("maps HTTP failures to typed errors", async () => {
  for (const [status, code] of [[401, "misconfigured"], [429, "rate_limited"], [400, "bad_request"], [503, "upstream"]] as const) {
    const { provider } = make(() => new Response("x", { status }));
    await assert.rejects(provider.analyze(req), (e: unknown) => e instanceof AiError && e.code === code);
  }
});

test("refusal and invalid output are typed", async () => {
  const refusal = make(() => new Response(JSON.stringify({ choices: [{ message: { content: null, refusal: "no" } }] }), { status: 200 }));
  await assert.rejects(refusal.provider.analyze(req), (e: unknown) => e instanceof AiError && e.code === "refused");
  const bad = make(() => ok("not json"));
  await assert.rejects(bad.provider.analyze(req), (e: unknown) => e instanceof AiError && e.code === "bad_output");
});
