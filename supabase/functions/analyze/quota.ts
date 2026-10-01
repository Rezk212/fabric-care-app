// Daily analysis allowance. The counting is done atomically in Postgres (consume_analysis); this
// file only decides the limits and shapes the results. Limits are server secrets, not app settings.
export interface Usage { used: number; limit: number; plan: "free" | "plus" }
export interface Consumed extends Usage { allowed: boolean }

/** Minimal slice of the Supabase client we need, so tests can fake it. */
export type Rpc = (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;

export interface Limits { free: number; plus: number }

export function limitsFromEnv(env: (n: string) => string | undefined): Limits {
  const num = (v: string | undefined, d: number) => (v && Number.isFinite(Number(v)) && Number(v) >= 0 ? Math.floor(Number(v)) : d);
  return { free: num(env("FREE_DAILY_LIMIT"), 3), plus: num(env("PLUS_DAILY_LIMIT"), 100) };
}

export function createQuota(rpc: Rpc, limits: Limits) {
  const args = (uid: string) => ({ uid, free_limit: limits.free, plus_limit: limits.plus });
  async function call<T>(fn: string, a: Record<string, unknown>): Promise<T> {
    const { data, error } = await rpc(fn, a);
    if (error) throw new Error(`${fn}: ${error.message}`);
    return data as T;
  }
  return {
    peek: (uid: string) => call<Usage>("peek_usage", args(uid)),
    consume: (uid: string) => call<Consumed>("consume_analysis", args(uid)),
    refund: (uid: string) => call<void>("refund_analysis", { uid }),
  };
}
