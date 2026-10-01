import assert from "node:assert/strict";
import { test } from "node:test";
import { isSignedInUser, jwtRole } from "./auth.ts";

const jwt = (payload: object) =>
  `h.${Buffer.from(JSON.stringify(payload)).toString("base64url")}.s`;

test("signed-in user is accepted", () => {
  assert.equal(isSignedInUser(`Bearer ${jwt({ role: "authenticated", sub: "u1" })}`), true);
});

test("anon key, garbage and missing headers are rejected", () => {
  assert.equal(isSignedInUser(`Bearer ${jwt({ role: "anon" })}`), false);
  assert.equal(isSignedInUser("Bearer not-a-jwt"), false);
  assert.equal(isSignedInUser("Bearer a.%%%.c"), false);
  assert.equal(isSignedInUser(null), false);
  assert.equal(jwtRole(null), null);
});
