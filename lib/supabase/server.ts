import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
// cookies() is a Next.js function that reads the HTTP request cookies.
// Server Components can't access the browser directly, so Supabase
// uses cookies to know who's logged in.

export async function createClient() {
  // cookies() is async in Next.js 15 — we must await it.
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Supabase needs to READ cookies to check the session.
        getAll() {
          return cookieStore.getAll();
        },
        // Supabase needs to WRITE cookies to save/refresh the session.
        // In Server Components, cookie writes are ignored (read-only context),
        // but in Server Actions and Route Handlers they work fine.
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Silently ignore — this just means we're in a Server Component context.
          }
        },
      },
    }
  );
}