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

Optional: `supabase secrets set ANTHROPIC_MODEL=<model id>` to override the default model.

## Notes
- The function currently accepts any caller holding the anon key. Before public launch, require a
  signed-in user (accounts are the next step) so strangers cannot spend your Anthropic credits.
- Photos are sent only for analysis and are not stored by the function.
