import { createBrowserClient } from "@supabase/ssr";
// createBrowserClient is for Client Components — it runs in the browser
// and manages the session using browser cookies automatically.

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,    // Your Supabase project URL
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // Your public anon key
    // The ! tells TypeScript "trust me, this value exists" — without it,
    // TypeScript would complain that env vars could be undefined.
  );
}