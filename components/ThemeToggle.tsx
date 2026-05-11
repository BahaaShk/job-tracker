"use client";
// Client Component — needs useTheme() which reads from React context (browser only).

import { useTheme } from "@/components/ThemeProvider";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  // theme is "light" or "dark", toggle() switches between them.

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      // aria-label gives screen readers a description since there's no visible text.
      className="text-text-secondary hover:text-text-primary transition-colors cursor-pointer p-1 rounded-md hover:bg-border"
    >
      {/* Show sun icon in dark mode, moon icon in light mode */}
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