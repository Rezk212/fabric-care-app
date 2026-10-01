// Type-check shim only: the real Deno runtime provides these on Supabase.
declare const Deno: {
  env: { get(name: string): string | undefined };
  serve(handler: (req: Request) => Response | Promise<Response>): void;
};
