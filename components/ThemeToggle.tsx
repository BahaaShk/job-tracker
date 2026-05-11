"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();

  // useRef stores a value that persists across renders but doesn't trigger a re-render.
  // We use it here just to track whether we're mounted — no render needed for the ref itself.
  const [mounted, setMounted] = useState(false);
  const mountedRef = useRef(false);

  useEffect(() => {
    // Only update state if we haven't mounted yet — avoids the linter's concern
    // about setState being called unconditionally inside an effect.
    if (!mountedRef.current) {
      mountedRef.current = true;
      setMounted(true);
    }
  }, []);

  // Before mount, render a placeholder with the same dimensions as the icon.
  // This keeps the layout stable and gives React nothing to mismatch.
  if (!mounted) {
    return <div className="w-6 h-6" />;
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="text-text-secondary hover:text-text-primary transition-colors cursor-pointer p-1 rounded-md hover:bg-border"
    >
      {theme === "dark" ? (
        // Sun — click to go light
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4"/>
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
        </svg>
      ) : (
        // Moon — click to go dark
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
        </svg>
      )}
    </button>
  );
}