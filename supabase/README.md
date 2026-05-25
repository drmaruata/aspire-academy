# Supabase setup (Phases 2 + 4)

Run-once setup for forms (Phase 2) + auth & enrollments (Phase 4).

## 1. Create a Supabase project

1. Sign up / log in at [supabase.com](https://supabase.com).
2. Create a new project (region: **Singapore (ap-southeast-1)** for India latency).
3. In **Project Settings → API**, copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon `public`** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY` *(needed in Phase 4)*
   - **service_role** secret → `SUPABASE_SERVICE_ROLE_KEY`

Add all three to `.env.local`.

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

## 5. Phase 4 — Auth + enrollments

Apply the second migration the same way (SQL Editor or
`supabase db push`):

```text
migrations/0002_auth_enrollments.sql
```

This creates:

| Table | Purpose |
| --- | --- |
| `profiles`        | Extends `auth.users` with `full_name`, `phone`. RLS: row owner can read + update. |
| `enrollments`     | Paid courses (`razorpay_order_id` is the idempotency key). RLS: row owner can read; writes only via service role. |
| `payment_events`  | Append-only audit log of every Razorpay webhook event. RLS: service role only. |

Plus a trigger (`on_auth_user_created`) that auto-inserts a `profiles`
row whenever a new Supabase user is created.

### 5.1 Configure auth in Supabase

1. **Settings → Auth → URL Configuration**
   - **Site URL** &nbsp; `http://localhost:3100` *(prod: your domain)*
   - **Redirect URLs** &nbsp; add `http://localhost:3100/auth/callback`
     *(and the prod variant)*
2. **Settings → Auth → Providers** — enable Email; turn off the email
   confirmation requirement during dev (Settings → Auth → "Confirm email").
3. **Authentication → Email Templates**
   - Edit the **Confirm signup** template's link target to:
     `{{ .SiteURL }}/auth/callback?code={{ .TokenHash }}&next={{ .NextPath }}`
     (the default `{{ .ConfirmationURL }}` also works as long as the
     redirect URL is allowed.)

## 6. Razorpay setup (Phase 4)

1. Create a Razorpay account at <https://razorpay.com>.
2. **Dashboard → Settings → API Keys** — generate **Test Mode** keys; copy
   the Key ID + Key Secret into `.env.local` as `RAZORPAY_KEY_ID` /
   `RAZORPAY_KEY_SECRET`. Mirror the Key ID into
   `NEXT_PUBLIC_RAZORPAY_KEY_ID` so the browser modal can open.
3. **Dashboard → Settings → Webhooks → Add new webhook**
   - **URL** &nbsp; `https://<your-site>/api/razorpay/webhook`
     *(use ngrok / Cloudflare Tunnel for local dev)*
   - **Secret** &nbsp; a long random string — also save it as
     `RAZORPAY_WEBHOOK_SECRET`
   - **Events** &nbsp; `payment.captured`, `payment.failed`, `order.paid`,
     `refund.created`
4. **Test card** &nbsp; `4111 1111 1111 1111` &nbsp;·&nbsp; any future date
   &nbsp;·&nbsp; CVV `123` &nbsp;·&nbsp; OTP `123456`.

After a successful test payment you should see:

- a row in `enrollments` with `status = 'active'`
- one or more rows in `payment_events` with the raw event payload

## Future migrations

Add new files as `migrations/000N_short_name.sql` and apply them with
either the SQL Editor or `supabase db push`.
