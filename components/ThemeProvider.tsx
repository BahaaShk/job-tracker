"use client";
// This directive marks the component as a Client Component.
// It runs in the browser, not on the server — which is required here because
// we need access to localStorage and window (browser-only APIs).

import { createContext, useContext, useEffect, useState } from "react";
// createContext: creates a "shared state container" any child component can read from.
// useContext: lets a child component read from that container.
// useEffect: runs code AFTER the component mounts in the browser (not during server render).
// useState: local state inside a component.

// TypeScript: we define exactly what values are allowed for "theme".
type Theme = "light" | "dark";

// createContext sets up the shared state.
// We provide default values here just so TypeScript doesn't complain —
// the real values come from ThemeProvider below.
const ThemeContext = createContext<{
  theme: Theme;       // The current theme ("light" or "dark")
  toggle: () => void; // A function that switches the theme
}>({
  theme: "light",
  toggle: () => {}, // Empty function as placeholder default
});

// ThemeProvider is the component you wrap around your app in layout.tsx.
// Any component inside it can call useTheme() to get the current theme or toggle it.
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // useState stores the current theme. "light" is the default before we check localStorage.
  const [theme, setTheme] = useState<Theme>("light");

  // useEffect runs once after the component first renders in the browser.
  // We use it here to read the user's saved preference from localStorage.
  useEffect(() => {
    // Check if the user has a saved preference from a previous visit.
    const stored = localStorage.getItem("theme") as Theme | null;

    // If no saved preference, check the OS-level dark mode setting.
    const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

    // Use saved preference if it exists, otherwise fall back to OS preference.
    const resolved = stored ?? preferred;
    // ?? is the "nullish coalescing" operator — it means: use `stored` unless it's null/undefined.

    setTheme(resolved); // Update React state.

    // Add or remove the "dark" class on <html> to activate your dark CSS variables.
    document.documentElement.classList.toggle("dark", resolved === "dark");
    // classList.toggle(className, condition) — adds the class if condition is true, removes if false.
  }, []); // The empty array [] means: only run this effect once, on first mount.

  // This function is called when the user clicks the theme toggle button (in the navbar later).
  const toggle = () => {
    setTheme((prev) => {
      // prev is the current theme value. We flip it.
      const next = prev === "dark" ? "light" : "dark";

      localStorage.setItem("theme", next); // Save the new preference so it persists on refresh.

      document.documentElement.classList.toggle("dark", next === "dark"); // Update the <html> class.

      return next; // Return the new value to update React state.
    });
  };

  // ThemeContext.Provider makes the theme and toggle function available
  // to any component inside it that calls useTheme().
  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

// useTheme is a custom hook — a reusable function that gives any component
// access to the theme context. Usage: const { theme, toggle } = useTheme();
export const useTheme = () => useContext(ThemeContext);