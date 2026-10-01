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
| OpenAI or any OpenAI-compatible API | `AI_PROVIDER=openai-compatible`, `AI_BASE_URL` (e.g. `https://api.openai.com/v1`), `AI_API_KEY`, `AI_MODEL`, optional `AI_JSON_MODE=object` for servers without JSON-schema support |

```bash
supabase secrets set AI_PROVIDER=openai-compatible AI_BASE_URL=https://api.openai.com/v1 AI_API_KEY=... AI_MODEL=...
supabase functions deploy analyze   # only needed after code changes; secrets apply on next call
```

To add a provider of another shape, implement `AiProvider` in `functions/analyze/providers/` and
register it in `providers/index.ts`. The care rules and the app stay untouched because the provider
only returns facts (fabric, label symbols), never wash advice.

## Notes
- The function currently accepts any caller holding the anon key. Before public launch, require a
  signed-in user (accounts are the next step) so strangers cannot spend your Anthropic credits.
- Photos are sent only for analysis and are not stored by the function.
