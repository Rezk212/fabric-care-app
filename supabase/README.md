# Naqa backend (Supabase)

- `functions/analyze` — Edge Function: photos in, fabric + care-label facts out (calls Claude).
- `migrations/` — database schema with Row Level Security.

## Setup (once you have a Supabase project and an Anthropic API key)

```bash
npm i -g supabase                       # or: npx supabase ...
supabase login
supabase link --project-ref <PROJECT_REF>
supabase db push                         # applies migrations
supabase secrets set ANTHROPIC_API_KEY=<your key>   # secret: never commit, never put in the app
supabase functions deploy analyze
```

Then in `apps/mobile`, copy `.env.example` to `.env` and fill in the project URL and the **anon** key
(Project Settings → API). Restart `npm run mobile`.

## Switching the AI provider

The provider is a server setting; the app does not change and needs no update.

| Goal | Secrets to set |
|---|---|
| Claude (default) | `ANTHROPIC_API_KEY`, optional `AI_MODEL` (default `claude-opus-5-5`) |
| OpenAI | `AI_PROVIDER=openai`, `AI_API_KEY`, `AI_MODEL` |
| DeepSeek | `AI_PROVIDER=deepseek`, `AI_API_KEY`, `AI_MODEL` |
| Kimi (Moonshot) | `AI_PROVIDER=kimi`, `AI_API_KEY`, `AI_MODEL` (mainland China: also `AI_BASE_URL=https://api.moonshot.cn/v1`) |
| Any other OpenAI-compatible API | `AI_PROVIDER=openai-compatible`, `AI_BASE_URL`, `AI_API_KEY`, `AI_MODEL` |

Add `AI_JSON_MODE=object` for servers that do not support JSON-schema output.

**Vision is required.** This app sends photos, so `AI_MODEL` must be a model that accepts images.
Text-only models fail on every request. Check the vendor's docs for which model ids accept images
(DeepSeek's and Moonshot's model lineups change often; ids are not hard-coded here on purpose).

```bash
supabase secrets set AI_PROVIDER=kimi AI_API_KEY=... AI_MODEL=<vision model id>
supabase functions deploy analyze   # only needed after code changes; secrets apply on next call
```

To add a provider of another shape, implement `AiProvider` in `functions/analyze/providers/` and
register it in `providers/index.ts`. The care rules and the app stay untouched because the provider
only returns facts (fabric, label symbols), never wash advice.

## Accounts
Email + password sign-in uses Supabase Auth (enabled by default). In Authentication → Providers keep
Email on. If "Confirm email" is on, new users must confirm by email before signing in (the app tells them).

## Notes
- `analyze` only accepts signed-in users (the public anon key alone gets 401), so strangers cannot spend
  your AI credits. For local development only, `supabase secrets set AI_REQUIRE_AUTH=false` disables this.
- Photos are sent only for analysis and are not stored by the function.
