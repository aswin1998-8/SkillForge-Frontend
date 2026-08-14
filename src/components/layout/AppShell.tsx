"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BrandLogo } from "@/components/common/BrandLogo";
import { EmailVerificationBanner } from "@/components/layout/EmailVerificationBanner";
import { useLogoutMutation, useMeQuery } from "@/services/api/authApi";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Home", icon: "home" },
  { href: "/roadmap", label: "Roadmap", icon: "map" },
  { href: "/skill-gaps", label: "Skill Gaps", icon: "analytics" },
  { href: "/sessions", label: "History", icon: "history" },
  { href: "/profile", label: "Profile", icon: "person" },
  { href: "/settings", label: "Settings", icon: "settings" },
];

function navItemActive(pathname: string, item: (typeof nav)[number]) {
  if (item.label === "Home") return pathname === "/dashboard";
  if (item.label === "Roadmap") {
    return pathname === "/roadmap" || pathname.startsWith("/roadmap/");
  }
  if (item.label === "Skill Gaps") {
    return pathname === "/skill-gaps" || pathname.startsWith("/skill-gaps/");
  }
  if (item.label === "History") {
    return pathname === "/sessions" || pathname.startsWith("/sessions/");
  }
  if (item.label === "Settings") {
    return pathname === "/settings" || pathname.startsWith("/settings/");
  }
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: user } = useMeQuery();
  const [logout] = useLogoutMutation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const displayName =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    user?.email?.split("@")[0] ||
    "Developer Admin";

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileNavOpen]);

  async function handleLogout() {
    try {
      await logout().unwrap();
    } catch {
      // ignore
    }
    setMobileNavOpen(false);
    router.replace("/login");
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-on-background">
      <button
        type="button"
        aria-label="Close navigation"
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden",
          mobileNavOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
        onClick={() => setMobileNavOpen(false)}
      />

      <aside
        id="app-sidebar"
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full w-[min(16rem,85vw)] flex-col border-r border-outline-variant/20 bg-surface-container-lowest transition-transform duration-200 ease-out md:w-64 md:translate-x-0",
          mobileNavOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between gap-2 border-b border-outline-variant/20 p-4 sm:p-6">
          <div className="flex min-w-0 items-center gap-2">
            <BrandLogo size={24} />
            <Link
              href="/dashboard"
              className="headline-sm tracking-tight text-on-surface"
              onClick={() => setMobileNavOpen(false)}
            >
              Honed
            </Link>
          </div>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileNavOpen(false)}
            className="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface md:hidden"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4 sm:px-4 sm:py-6">
          {[
            ...nav,
            ...(user?.is_staff
              ? [{ href: "/admin-console", label: "Admin", icon: "admin_panel_settings" }]
              : []),
          ].map((item) => {
            const active =
              item.label === "Admin"
                ? pathname === "/admin-console" || pathname.startsWith("/admin-console/")
                : navItemActive(pathname, item as (typeof nav)[number]);
            return (
              <Link
                key={`${item.label}-${item.icon}`}
                href={item.href}
                onClick={() => setMobileNavOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 body-sm transition-all sm:gap-4 sm:px-4 sm:py-2",
                  active
                    ? "border-l-2 border-primary bg-primary-container/20 text-primary"
                    : "text-on-surface-variant hover:bg-surface-container-high",
                )}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-3 border-t border-outline-variant/20 p-4 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
              <span className="material-symbols-outlined text-[18px] text-on-primary">
                person
              </span>
            </div>
            <div className="min-w-0 flex-1 overflow-hidden">
              <div className="truncate body-sm text-on-surface">{displayName}</div>
              <div className="truncate font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium tracking-[0.02em] text-on-surface-variant">
                {user?.email || "Signed in"}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-outline-variant/40 px-3 py-2 body-sm text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Log out
          </button>
        </div>
      </aside>

      <div className="min-w-0 md:pl-64">
        <header className="fixed left-0 right-0 top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-outline-variant/20 bg-surface/80 px-3 backdrop-blur-xl sm:h-16 sm:px-6 md:left-64">
          <div className="flex min-w-0 items-center gap-2 sm:gap-4">
            <button
              type="button"
              aria-label="Open navigation"
              aria-expanded={mobileNavOpen}
              aria-controls="app-sidebar"
              onClick={() => setMobileNavOpen(true)}
              className="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface md:hidden"
            >
              <span className="material-symbols-outlined text-[22px]">menu</span>
            </button>
            <span className="truncate rounded bg-surface-container-high px-2 py-[2px] font-[family-name:var(--font-jetbrains-mono)] text-[11px] font-medium tracking-[0.02em] text-on-surface-variant sm:text-[12px]">
              PRODUCTION
            </span>
          </div>
        </header>

        <div className="pt-14 sm:pt-16">
          <EmailVerificationBanner />
          <main className="w-full min-w-0 overflow-x-hidden">{children}</main>
        </div>
      </div>
    </div>
  );
}
