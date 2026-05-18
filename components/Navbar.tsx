// Server Component — reads the session on the server to know if user is logged in.
// We keep it as a server component because most of it is static markup.
// Only the interactive or route-aware parts are split into client components.

import { createClient } from "@/lib/supabase/server";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SignOutButton } from "@/components/SignOutButton";
// NavLink is a small Client Component.
// It checks the current page URL and adds the active style to the matching link.
import { NavLink } from "@/components/NavLink";

export async function Navbar() {
  const supabase = await createClient();

  // getUser() returns the currently logged-in user from the session cookie.
  // We use this to decide whether to show the sign out button.
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="w-full border-b border-border bg-surface">
      <nav className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">

        {/* Left side — brand + nav links */}
        <div className="flex items-center gap-6">
          <span className="text-text-primary font-semibold text-sm tracking-tight">
            Job Tracker
          </span>

          {/* Only show nav links if the user is logged in */}
          {user && (
            <div className="flex items-center gap-4">
              {/* Each NavLink compares its href with the current URL. */}
              {/* On "/", Home is active. On "/saved", Saved is active. */}
              <NavLink href="/">Home</NavLink>
              <NavLink href="/saved">Saved</NavLink>
            </div>
          )}
        </div>

        {/* Right side — theme toggle + sign out */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {user && <SignOutButton />}
        </div>

      </nav>
    </header>
  );
}
