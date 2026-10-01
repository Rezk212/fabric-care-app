import assert from "node:assert/strict";
import { test } from "node:test";
import { OPENAI_COMPATIBLE_PRESETS as P } from "./presets.ts";

test("presets point at https endpoints (generic one is empty on purpose)", () => {
  assert.equal(P["openai-compatible"], "");
  for (const k of ["openai", "deepseek", "kimi"]) assert.match(P[k], /^https:\/\//);
});
