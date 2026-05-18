"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
};

export function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={[
        "rounded-md px-2.5 py-1 text-sm transition-colors",
        isActive
          ? "bg-accent/10 font-medium text-accent"
          : "text-text-secondary hover:text-text-primary",
      ].join(" ")}
    >
      {children}
    </Link>
  );
}
