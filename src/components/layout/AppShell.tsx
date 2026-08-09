"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BrandLogo } from "@/components/common/BrandLogo";
import { EmailVerificationBanner } from "@/components/layout/EmailVerificationBanner";
import { useLogoutMutation, useMeQuery } from "@/services/api/authApi";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Home", icon: "home" },
  { href: "/roadmap", label: "Roadmap", icon: "map" },
  { href: "/sessions", label: "History", icon: "history" },
  { href: "/profile", label: "Profile", icon: "person" },
  { href: "/settings", label: "Settings", icon: "settings" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: user } = useMeQuery();
  const [logout] = useLogoutMutation();

  const displayName =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    user?.email?.split("@")[0] ||
    "Developer Admin";

  async function handleLogout() {
    try {
      await logout().unwrap();
    } catch {
      // ignore
    }
    router.replace("/login");
  }

  return (
    <div className="min-h-screen bg-background text-on-background">
      <aside className="fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-outline-variant/20 bg-surface-container-lowest">
        <div className="flex items-center gap-2 border-b border-outline-variant/20 p-6">
          <BrandLogo size={24} />
          <Link
            href="/dashboard"
            className="headline-sm text-on-surface tracking-tight"
          >
            Honed
          </Link>
        </div>

        <nav className="flex-1 space-y-1 px-4 py-6">
          {nav.map((item) => {
            const active =
              item.label === "Home"
                ? pathname === "/dashboard"
                : item.label === "Roadmap"
                  ? pathname === "/roadmap" ||
                    pathname.startsWith("/roadmap/")
                  : item.label === "History"
                  ? pathname === "/sessions" ||
                    pathname.startsWith("/sessions/")
                  : item.label === "Settings"
                    ? pathname === "/settings" ||
                      pathname.startsWith("/settings/")
                    : pathname === item.href ||
                      pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={`${item.label}-${item.icon}`}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 rounded-lg px-4 py-2 body-sm transition-all",
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

        <div className="space-y-3 border-t border-outline-variant/20 p-6">
          <div className="flex items-center gap-4">
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

      <div className="pl-0 md:pl-64">
        <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-outline-variant/20 bg-surface/80 px-6 backdrop-blur-xl md:left-64">
          <div className="flex items-center gap-4">
            <span className="rounded bg-surface-container-high px-2 py-[2px] font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium tracking-[0.02em] text-on-surface-variant">
              PRODUCTION
            </span>
          </div>
          <div className="flex items-center gap-6">
            <span className="material-symbols-outlined cursor-pointer text-on-surface-variant hover:text-on-surface">
              search
            </span>
            <span className="material-symbols-outlined cursor-pointer text-on-surface-variant hover:text-on-surface">
              notifications
            </span>
          </div>
        </header>

        <div className="pt-16">
          <EmailVerificationBanner />
          <main className="min-h-screen w-full">{children}</main>
        </div>
      </div>
    </div>
  );
}
