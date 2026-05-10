import { updateSession } from "@/lib/supabase/middleware";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Every request passes through here first.
  // updateSession silently refreshes the Supabase auth token if it's expiring.
  return await updateSession(request);
}

export const config = {
  matcher: [
    // Run middleware on all routes EXCEPT static files and Next.js internals.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};