// The Supabase gateway already verified the JWT signature (verify_jwt). We only check *who* it is:
// the public anon key is also a valid JWT, so without this check anyone could call the function.
function jwtPayload(authorization: string | null): Record<string, unknown> | null {
  const token = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
  const part = token?.split(".")[1];
  if (!part) return null;
  try {
    const b64 = part.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(part.length / 4) * 4, "=");
    return JSON.parse(atob(b64));
  } catch {
    return null;
  }
}

export function jwtRole(authorization: string | null): string | null {
  const role = jwtPayload(authorization)?.role;
  return typeof role === "string" ? role : null;
}

/** The signed-in user's id (the JWT `sub` claim), or null. */
export function jwtSub(authorization: string | null): string | null {
  const sub = jwtPayload(authorization)?.sub;
  return typeof sub === "string" ? sub : null;
}

export const isSignedInUser = (authorization: string | null) => jwtRole(authorization) === "authenticated";
