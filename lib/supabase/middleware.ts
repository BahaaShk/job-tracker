import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
// NextRequest/NextResponse are Next.js's versions of the web Request/Response objects.
// Middleware runs on the Edge — before any page renders — so we use these instead of cookies().

export async function updateSession(request: NextRequest) {
  // We start with the incoming response and may modify it (e.g., add cookies).
  let supabaseResponse = NextResponse.next({ request });

  createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Read cookies from the incoming request.
        getAll() {
          return request.cookies.getAll();
        },
        // Write cookies onto the outgoing response so the browser receives them.
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Returning the response with updated cookies keeps the session alive.
  return supabaseResponse;
}