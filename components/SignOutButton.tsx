"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    setLoading(true);
    await supabase.auth.signOut();
    // signOut() clears the session cookie in the browser.
    // But Next.js server still thinks you're logged in until we force a refresh.

    router.refresh();
    // This tells Next.js to re-run all server components and middleware.
    // Middleware then sees no session → redirects to /login automatically.
    // No need for router.push("/login") — middleware handles it.
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className="text-text-secondary hover:text-text-primary disabled:opacity-50 text-sm transition-colors cursor-pointer disabled:cursor-not-allowed"
    >
      {loading ? "Signing out…" : "Sign out"}
    </button>
  );
}