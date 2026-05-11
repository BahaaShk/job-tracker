import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // Create the Supabase client using the request/response cookies.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
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

  // getUser() checks the session cookie and returns the logged-in user.
  // If no session exists, user will be null.
  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  // nextUrl.pathname is the current URL path, e.g. "/" or "/login".

  // If the user is NOT logged in and is trying to access a protected page,
  // redirect them to /login.
  if (!user && pathname !== "/login") {
    const url = request.nextUrl.clone();
    // .clone() creates a copy of the URL so we can modify it safely.
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // If the user IS logged in and tries to visit /login,
  // redirect them to the job feed — no reason to see the login page again.
  if (user && pathname === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // Otherwise, let the request through as normal.
  return supabaseResponse;
}

export const config = {
  matcher: [
    // Run this middleware on all routes except Next.js internals and static files.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};