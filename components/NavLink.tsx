"use client";
// This file is a Client Component because it needs to read the current browser URL.
// Server Components cannot use hooks like usePathname().

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
};

export function NavLink({ href, children }: NavLinkProps) {
  // pathname is the current page path in the browser.
  // For example: "/" on the home page, or "/saved" on the saved jobs page.
  const pathname = usePathname();

  // If the current page path is the same as this link's href,
  // this link should look active.
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      // aria-current tells screen readers which nav link is the current page.
      aria-current={isActive ? "page" : undefined}
      className={[
        "rounded-md px-2.5 py-1 text-sm transition-colors",
        // Active links get a small background and accent color.
        // Normal links stay gray until the user hovers over them.
        isActive
          ? "bg-accent/10 font-medium text-accent"
          : "text-text-secondary hover:text-text-primary",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}
