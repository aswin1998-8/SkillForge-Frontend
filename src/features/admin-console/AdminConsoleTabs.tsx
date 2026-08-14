"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/admin-console", label: "Waitlist" },
  { href: "/admin-console/users", label: "Users" },
];

export function AdminConsoleTabs() {
  const pathname = usePathname();

  return (
    <div className="flex gap-1 border-b border-outline-variant/20">
      {tabs.map((tab) => {
        const active =
          tab.href === "/admin-console"
            ? pathname === "/admin-console"
            : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "border-b-2 px-3 py-2 body-sm",
              active
                ? "border-primary text-primary"
                : "border-transparent text-on-surface-variant hover:text-on-surface",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
