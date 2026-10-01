// The Supabase gateway already verified the JWT signature (verify_jwt). We only check *who* it is:
// the public anon key is also a valid JWT, so without this check anyone could call the function.
export function jwtRole(authorization: string | null): string | null {
  const token = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
  const part = token?.split(".")[1];
  if (!part) return null;
  try {
    const b64 = part.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(part.length / 4) * 4, "=");
    const payload = JSON.parse(atob(b64));
    return typeof payload.role === "string" ? payload.role : null;
  } catch {
    return null;
  }
}

export const isSignedInUser = (authorization: string | null) => jwtRole(authorization) === "authenticated";
