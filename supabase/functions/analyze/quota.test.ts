import assert from "node:assert/strict";
import { test } from "node:test";
import { createQuota, limitsFromEnv, type Rpc } from "./quota.ts";

test("limits default to 3 free and 100 plus, and ignore bad values", () => {
  assert.deepEqual(limitsFromEnv(() => undefined), { free: 3, plus: 100 });
  assert.deepEqual(limitsFromEnv((n) => ({ FREE_DAILY_LIMIT: "5", PLUS_DAILY_LIMIT: "x" } as Record<string, string>)[n]), { free: 5, plus: 100 });
  assert.deepEqual(limitsFromEnv((n) => (n === "FREE_DAILY_LIMIT" ? "-2" : undefined)), { free: 3, plus: 100 });
});

test("passes uid and configured limits to the database functions", async () => {
  const calls: [string, Record<string, unknown>][] = [];
  const rpc: Rpc = async (fn, args) => { calls.push([fn, args]); return { data: { allowed: true, used: 1, limit: 3, plan: "free" }, error: null }; };
  const q = createQuota(rpc, { free: 3, plus: 100 });
  const r = await q.consume("u1");
  assert.equal(r.allowed, true);
  assert.deepEqual(calls[0], ["consume_analysis", { uid: "u1", free_limit: 3, plus_limit: 100 }]);
  await q.refund("u1");
  assert.deepEqual(calls[1], ["refund_analysis", { uid: "u1" }]);
});

test("database errors surface as exceptions (the caller must not run the AI)", async () => {
  const q = createQuota(async () => ({ data: null, error: { message: "boom" } }), { free: 3, plus: 100 });
  await assert.rejects(q.consume("u1"), /consume_analysis: boom/);
});
