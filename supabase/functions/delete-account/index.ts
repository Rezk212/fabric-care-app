// Supabase Edge Function: a signed-in user deletes their own account and all their data.
// Rows in profiles, usage_daily, machines and analyses go with the user (on delete cascade).
import { createClient } from "npm:@supabase/supabase-js";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

// The gateway verified the JWT signature (verify_jwt); we read who it is. The anon key is also a valid JWT, so require role=authenticated.
function claims(authorization: string | null): { sub?: string; role?: string } {
  const part = authorization?.match(/^Bearer\s+(.+)$/i)?.[1]?.split(".")[1];
  if (!part) return {};
  try {
    return JSON.parse(atob(part.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(part.length / 4) * 4, "=")));
  } catch {
    return {};
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "method" }, 405);
  const { sub, role } = claims(req.headers.get("Authorization"));
  if (!sub || role !== "authenticated") return json({ error: "unauthorized" }, 401);

  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) return json({ error: "misconfigured" }, 500);
  const admin = createClient(url, key, { auth: { persistSession: false } });
  const { error } = await admin.auth.admin.deleteUser(sub);
  if (error) {
    console.error("delete user failed", error.message);
    return json({ error: "failed" }, 500);
  }
  return json({ ok: true });
});
