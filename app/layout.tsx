// This is the ROOT layout — Next.js requires this file in the app/ directory.
// Every page in the app is wrapped inside this layout automatically.
// Think of it as the "frame" that never changes between pages.

import type { Metadata } from "next";
// Metadata is a TypeScript type from Next.js — it shapes what you export
// for SEO (page title, description, etc.)

import { Geist } from "next/font/google";
// next/font loads Google Fonts at BUILD TIME — no extra network request in the browser.
// This means zero layout shift and better performance vs a <link> tag in HTML.

import "./globals.css";
// Importing your global CSS here makes it apply to every page in the app.

import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
// @/ is an alias for the root of your project (configured by Next.js automatically).
// ThemeProvider is a Client Component we wrote to manage dark/light mode.

// Geist is the font. We assign it a CSS variable name so Tailwind can use it.
const geist = Geist({
  subsets: ["latin"], // Only load the Latin character set — keeps the font file small.
  variable: "--font-geist", // The CSS variable name we'll reference in globals.css.
});

// This export tells Next.js what to put in the <head> of every page.
export const metadata: Metadata = {
  title: "Job Tracker",
  description: "Personal job search dashboard",
};

// RootLayout receives "children" — that's whatever page is currently being visited.
// Next.js passes the current page as children automatically.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode; // TypeScript: children can be any valid React content.
}) {
  return (
    // suppressHydrationWarning: the "dark" class is added to <html> by JavaScript
    // after the page loads (client-side). So the server-rendered HTML won't have it.
    // React would normally warn about this mismatch — this attribute silences that warning
    // specifically on <html>, and only for that one attribute.
    <html lang="en" suppressHydrationWarning>
            <head>
        {/*
          This script runs BEFORE the page renders — before React, before CSS, before anything.
          It reads localStorage and applies the "dark" class to <html> instantly.
          Because it blocks rendering, the user never sees the wrong theme for even one frame.
          dangerouslySetInnerHTML is React's way of injecting raw HTML/JS — we need it here
          because JSX would escape the string and break the script.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var theme = stored ? stored : (prefersDark ? 'dark' : 'light');
                  if (theme === 'dark') document.documentElement.classList.add('dark');
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`
          ${geist.variable}     /* Injects --font-geist as a CSS variable on <body> */
          font-sans             /* Tailwind uses --font-sans, which we map to --font-geist in globals.css */
          bg-bg                 /* Your custom token: background color (light: #F4F6F9, dark: #0D1117) */
          text-text-primary     /* Your custom token: main text color */
          min-h-screen          /* Body takes at least the full viewport height */
          antialiased           /* Smooths font rendering — makes text look sharper */
        `}
      >
        {/* ThemeProvider wraps all pages so every component can access the theme */}
        <ThemeProvider>
           <Navbar />  
          {children}
          </ThemeProvider>
      </body>
    </html>
  );
}