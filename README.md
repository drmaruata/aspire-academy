# Aspire Academy Mizo — Website

Production site for **Aspire Academy Mizo**, an MPSC Civil Services coaching
institute in Aizawl, Mizoram.

## Tech Stack

| Layer | Choice |
| --- | --- |
| Framework | **Next.js 16** (App Router, React 19, Turbopack) |
| Language | TypeScript |
| Styling | **Tailwind CSS v4** + CSS design tokens (`@theme`) |
| Icons | `lucide-react` + a couple of brand SVGs (`src/components/icons.tsx`) |
| Fonts | `next/font` — Playfair Display + DM Sans |
| CMS | **Sanity v5** (embedded Studio at `/studio`, GROQ + TypeGen, tag-based revalidation) |
| Rich text | `@portabletext/react` via `next-sanity` |
| Forms DB | **Supabase** (Phase 2 — `newsletter_subscribers`, `lead_submissions`) |
| Auth / Payments | **Supabase Auth** + **Razorpay** *(wired up in Phase 4)* |
| Email | **Resend** (Phase 2 — transactional + admin alerts) |
| Validation | `zod` + native Server Actions (`useActionState`) |
| Hosting | Vercel |

## Project structure

```
src/
  app/
    layout.tsx          Root layout: fonts, metadata, JSON-LD
    page.tsx            Home page (composes section components)
    globals.css         Tailwind v4 + design tokens + animations
  components/
    icons.tsx           Brand SVGs (WhatsApp, LogoMark)
    layout/             Site chrome
      admission-banner.tsx
      top-bar.tsx
      navbar.tsx        (client)
      footer.tsx
      whatsapp-fab.tsx
    sections/           Home page sections
      hero.tsx
      features-band.tsx
      quick-links.tsx
      courses.tsx
      about-strip.tsx
      why-choose.tsx
      testimonials.tsx
      resources.tsx
      strategy.tsx
      videos.tsx
      newsletter.tsx    (client)
      contact.tsx       (client)
    ui/
      scroll-reveal.tsx (client - IntersectionObserver for .fade-up)
  lib/
    utils.ts            cn() class helper
    site.ts             Site-wide config (phones, emails, social, banner)
    data.ts             Static fallback content (used when Sanity isn't configured)
    env.ts              Typed env loader + formsCapability() + isSanityConfigured()
    schemas.ts          zod schemas (newsletter, lead)
    supabase.ts         Server-only service-role client factory
    resend.ts           Server-only Resend client factory
    rate-limit.ts       In-memory sliding-window rate limiter
    request-context.ts  Server-action header helpers (IP, UA)
    actions/
      newsletter.ts     Server action: subscribeNewsletter
      lead.ts           Server action: submitLead
    emails/
      templates.ts      HTML email templates
    content/            Sanity-or-static data adapters (server-only)
      courses.ts        getCourses()
      testimonials.ts   getTestimonials()
      videos.ts         getVideos()
      resources.ts      getResources()
      posts.ts          getPosts() / getPostBySlug() / getPostSlugs()
  sanity/
    env.ts              projectId / dataset / apiVersion / isConfigured
    queries.ts          GROQ queries (defineQuery)
    tags.ts             Cache tag names + revalidation map
    lib/
      client.ts         Lazy server Sanity client factory
      fetch.ts          safeSanityFetch() — fallback-safe wrapper
      image.ts          urlFor() image builder
    schemas/
      index.ts          schemaTypes registration
      objects/
        block-content.ts  Portable Text definition
      documents/
        course.ts
        testimonial.ts
        video.ts
        resource.ts
        author.ts
        post.ts
sanity.config.ts        Embedded Studio config
sanity.cli.ts           Project + TypeGen config (pnpm typegen)
supabase/
  README.md             Supabase setup instructions
  migrations/
    0001_init.sql       newsletter_subscribers + lead_submissions
_reference/
  index.html            Original static design (do not edit)
  chase-academy.html    Original reference for new layout
```

## Getting started

Requires Node 20+ and pnpm.

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # production build
pnpm start        # serve production build
pnpm lint
```

## Environment variables

Copy `.env.example` to `.env.local` and fill in real values.
For local UI work without provisioning Supabase / Resend, leave
`AAM_STUB_FORMS=1` to use the dev stub mode (forms succeed visually,
nothing is sent or stored).

```env
# ─── Phase 2 — forms ─────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=                # server-only secret
RESEND_API_KEY=                           # server-only secret
EMAIL_FROM="Aspire Academy Mizo <hello@aspireacademymizo.com>"
EMAIL_REPLY_TO=hello@aspireacademymizo.com
EMAIL_ADMIN_TO=team@aspireacademymizo.com
AAM_STUB_FORMS=1                          # dev only — remove in prod

# ─── Phase 3 — Sanity CMS ────────────────────────────────────
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-02-01
SANITY_API_READ_TOKEN=           # only needed for draft preview
SANITY_REVALIDATE_SECRET=        # shared with the Sanity webhook

# ─── Phase 4 — Auth + Payments (future) ──────────────────────
# NEXT_PUBLIC_SUPABASE_ANON_KEY=
# RAZORPAY_KEY_ID=
# RAZORPAY_KEY_SECRET=
# RAZORPAY_WEBHOOK_SECRET=
```

## Phase 2 — Forms architecture

Both forms ship as **React Server Actions** with `useActionState` +
`useFormStatus` for progressive enhancement (work without JS) and
real-time pending states.

```
<form>  ──▶  subscribeNewsletter / submitLead  (server action)
              │
              ├─ zod validate FormData
              ├─ honeypot trap
              ├─ in-memory rate limit (IP + email)
              ├─ Supabase service-role upsert/insert
              └─ Resend → welcome / admin alert / student confirmation
```

**Anti-spam**: invisible `name="website"` honeypot field on both forms
+ sliding-window rate limit (8/10min/IP for newsletter, 3/10min/IP for
leads, plus per-email caps).

**Dev mode**: set `AAM_STUB_FORMS=1` to skip DB/email entirely. The
server action logs the payload to the dev console and returns a
success state — perfect for UI work before provisioning Supabase /
Resend. The flag is also auto-applied when running `NODE_ENV !== 'production'`
and either env is missing.

**Supabase setup**: see [`supabase/README.md`](./supabase/README.md).

## Phase 3 — Sanity CMS

The Sanity Studio is **embedded** in the Next.js app at
[`/studio`](http://localhost:3100/studio) — one deployable, one set of env vars,
zero extra infrastructure. Until a project ID is configured the homepage
transparently falls back to the static content in `src/lib/data.ts`, so the
site is fully functional from day one.

### 1. Create a Sanity project

```bash
# Create the project on sanity.io/manage (or via CLI):
pnpm dlx sanity@latest init --bare \
  --create-project "Aspire Academy Mizo" --dataset production
```

Copy the project ID into `.env.local`:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=abc12345
NEXT_PUBLIC_SANITY_DATASET=production
```

Add CORS origins in **Settings → API → CORS origins**:

| Origin | Allow credentials |
| --- | --- |
| `http://localhost:3100` | yes |
| `https://aspireacademymizo.com` (or your prod URL) | yes |

### 2. Open Studio

Restart `pnpm dev`, then visit
[`http://localhost:3100/studio`](http://localhost:3100/studio). Sign in with
Google / GitHub / Sanity. You'll see desks for **Courses · Testimonials ·
Video lectures · Study resources · Blog posts · Authors**.

### 3. Hook up the revalidation webhook (production)

1. Generate a long random string for `SANITY_REVALIDATE_SECRET` and add it
   to `.env.local` + your hosting platform.
2. In **sanity.io/manage → API → Webhooks → Create webhook**:
    - **URL** &nbsp;`https://<your-site>/api/sanity/revalidate`
    - **Dataset** &nbsp;`production`
    - **Trigger on** &nbsp;Create, Update, Delete
    - **Filter** &nbsp;`_type in ["course","testimonial","video","resource","post","author"]`
    - **Projection** &nbsp;`{ "type": _type, "slug": slug.current }`
    - **Secret** &nbsp;same value as `SANITY_REVALIDATE_SECRET`

The webhook flushes Next.js cache tags (`sanity:course`, `sanity:post`, …)
so the site reflects published changes within seconds.

### 4. Generate TypeScript types (optional, recommended)

```bash
pnpm typegen     # writes ./sanity.types.ts
```

Once generated, `client.fetch(QUERY)` returns fully-typed results. TypeGen
is non-blocking — every `getXxx()` adapter already declares its own row
shape, so the site builds without `sanity.types.ts`.

### 5. Blog routes

- `/blog` — paginated index pulling `*[_type == "post"]`
- `/blog/[slug]` — detail page with Portable Text body, author, main image
  (statically generated via `generateStaticParams`).

When no posts exist (or Sanity isn't configured) the blog index shows a
friendly empty state with a link to `/studio`.

## Roadmap

- [x] **Phase 0** — Bootstrap Next.js 16 + Tailwind v4 + design tokens
- [x] **Phase 1** — Static parity with `_reference/index.html`
- [x] **Phase 2** — Wire newsletter + contact forms (Resend + Supabase)
- [x] **Phase 3** — Sanity CMS for courses, testimonials, videos, resources, blog
- [ ] **Phase 4** — Supabase Auth + Razorpay checkout + enrollment webhooks
- [ ] **Phase 5** — Student dashboard + mock-test runner
- [ ] **Phase 6** — Admin dashboard
- [ ] **Phase 7** — English + Mizo (`next-intl`)
