/**
 * Default re-export keeps the old `@/lib/supabase` import path working.
 *
 * Per-runtime clients live alongside:
 *   • `@/lib/supabase/service`     — service-role admin client (RLS bypass)
 *   • `@/lib/supabase/server`      — cookie-bound client for RSC / actions
 *   • `@/lib/supabase/browser`     — anon-key client for Client Components
 *   • `@/lib/supabase/middleware`  — session-refresh helper for middleware.ts
 */
export { getSupabaseAdmin } from "./service";
