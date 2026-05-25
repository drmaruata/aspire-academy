# Supabase setup (Phase 2)

Run-once setup for the Aspire Academy Mizo website forms.

## 1. Create a Supabase project

1. Sign up / log in at [supabase.com](https://supabase.com).
2. Create a new project (region: **Singapore (ap-southeast-1)** for India latency).
3. In **Project Settings → API**, copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **service_role** secret → `SUPABASE_SERVICE_ROLE_KEY`

Add both to `.env.local`.

## 2. Apply the initial migration

Open the Supabase **SQL Editor** and paste the contents of
[`migrations/0001_init.sql`](./migrations/0001_init.sql), then **Run**.

This creates:

| Table | Purpose |
| --- | --- |
| `newsletter_subscribers` | Email list (unique by lower-case email) |
| `lead_submissions` | Contact-form enquiries with status workflow |

Both tables have **RLS enabled with no public policies** — only the
service-role key (used by our Next.js server actions) can read or write
them. The anon / authenticated keys have zero access.

## 3. Verify

In the Supabase **Table Editor** you should now see both tables, each
showing 0 rows and a green "RLS enabled" badge.

## 4. (Optional) Local CLI workflow

If you prefer to track migrations locally:

```bash
brew install supabase/tap/supabase     # or: scoop install supabase
supabase init                          # only first time
supabase link --project-ref <ref>
supabase db push                       # applies migrations/*.sql
```

## Future migrations

Add new files as `migrations/000N_short_name.sql` and apply them with
either the SQL Editor or `supabase db push`.
