"use client";
// Client Component — we need this because we're handling form state,
// user interaction, and calling a Server Action on submit.

import { useState } from "react";
import { useRouter } from "next/navigation";
// useRouter lets us programmatically redirect the user after login.

import { createClient } from "@/lib/supabase/client";
// We use the BROWSER client here because this component runs in the browser.

export function LoginForm() {
  // These hold what the user types into the inputs.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // error holds any login failure message to show the user.
  const [error, setError] = useState<string | null>(null);

  // loading prevents double-submits and gives feedback while waiting.
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    // FormEvent is the TypeScript type for a form's submit event.

    e.preventDefault();
    // Prevents the browser's default behavior of reloading the page on submit.

    setLoading(true);
    setError(null); // Clear any previous error before trying again.

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    // signInWithPassword talks to Supabase, checks credentials, and sets the session cookie.
    // We destructure just "error" from the response — if it's null, login succeeded.

    if (error) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    // Login succeeded — send the user to the job feed.
    router.push("/");
    router.refresh();
    // router.refresh() tells Next.js to re-fetch server data for the current route.
    // Without it, the server components on "/" might still think the user is logged out.
  }

  return (
    <div className="w-full max-w-sm bg-surface border border-border rounded-xl p-8 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-text-primary text-xl font-semibold">Job Tracker</h1>
        <p className="text-text-secondary text-sm">Sign in to your dashboard</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-text-secondary text-sm" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            // e.target.value is the current text in the input.
            // We update state on every keystroke so React stays in sync.
            placeholder="you@example.com"
            className="bg-bg border border-border rounded-lg px-3 py-2 text-text-primary text-sm outline-none focus:border-accent transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-text-secondary text-sm" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="bg-bg border border-border rounded-lg px-3 py-2 text-text-primary text-sm outline-none focus:border-accent transition-colors"
          />
        </div>

        {/* Only renders if there's an error message to show */}
        {error && (
          <p className="text-danger text-sm">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          // disabled prevents clicking while the request is in-flight.
          className="bg-accent hover:bg-accent-hover disabled:opacity-50 text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}