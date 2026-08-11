"use client";

import Link from "next/link";
import { useMeQuery } from "@/services/api/authApi";
import { useGetProfileQuery } from "@/services/api/profileApi";

const AVATAR_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCWSAlc9nXChx1dkjDkoE7aMVL-SQjbTrSaq-CdLXYgAlxz18_zSb-e2bUygHkoIJ4ZEb9Aiq660pbBK-3tg2oTJGULWK7Cg9mp5YsAIsqxdt-4r_RKMn3sfU62jRQRqtDxXJu5KGbXwnRv_4WuqtYP30xH8sDHs89lkSB1OADU66ZnEaNfwtFHac_D5bzEbiag4oYoGs5Cr-4EQDoIV9cr97Uv2608ipCLMm7SPenryuKPKYhurQ0j";

const STACK = [
  { name: "React", color: "#61DAFB", version: "v18.x" },
  { name: "TypeScript", color: "#3178C6", version: "v5.x" },
  { name: "Next.js", color: "#dae2fd", version: "v14.x" },
  { name: "Tailwind CSS", color: "#38B2AC" },
  { name: "JavaScript", color: "#F7DF1E" },
  { name: "Vercel", color: "#000000", bordered: true },
];

const ACTIVITY = [
  {
    title: (
      <>
        Merged PR{" "}
        <span className="rounded bg-primary/10 px-1 font-[family-name:var(--font-jetbrains-mono)] text-[13px] text-primary">
          #4291
        </span>
      </>
    ),
    detail: "Update auth middleware logic",
    time: "2 hours ago",
    dot: "bg-primary",
    hover: "group-hover:bg-primary/20 group-hover:border-primary/50",
  },
  {
    title: <>Deployed to Production</>,
    detail: "Release v2.4.1",
    time: "Yesterday, 14:30",
    dot: "bg-[#10B981]",
    hover: "group-hover:bg-[#10B981]/20 group-hover:border-[#10B981]/50",
  },
  {
    title: (
      <>
        Opened Issue{" "}
        <span className="rounded bg-primary/10 px-1 font-[family-name:var(--font-jetbrains-mono)] text-[13px] text-primary">
          #4288
        </span>
      </>
    ),
    detail: "Memory leak in data table component",
    time: "3 days ago",
    dot: "bg-outline-variant",
    hover: "group-hover:bg-primary/20 group-hover:border-primary/50",
  },
];

export function ProfileDetails() {
  const { data: user } = useMeQuery();
  const { data: profile } = useGetProfileQuery();

  const displayName =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    user?.email?.split("@")[0] ||
    "Developer Admin";

  const roleTitle =
    profile?.current_role ||
    profile?.target_role?.name ||
    "Staff Software Engineer";

  const years =
    profile?.years_of_experience != null
      ? `${profile.years_of_experience} Years`
      : "8 Years";

  const systemId = user?.id
    ? `DEVA-${String(942 + (user.id % 100)).padStart(3, "0")}`
    : "DEVA-942";

  return (
    <div className="flex min-h-[calc(100dvh-3.5rem)] w-full min-w-0 flex-col overflow-x-hidden sm:min-h-[calc(100vh-64px)]">
      <div className="mx-auto flex h-full w-full max-w-[1440px] flex-col px-4 py-6 sm:px-6 sm:py-10 md:px-10 xl:px-[120px]">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:mb-10 md:flex-row md:items-center">
          <div className="min-w-0">
            <h1 className="display-lg m-0 text-on-background !text-[32px] !leading-[40px] sm:!text-[48px] sm:!leading-[56px]">
              Profile Details
            </h1>
            <p className="body-lg mt-2 text-on-surface-variant">
              Manage your technical identity and system metadata.
            </p>
          </div>
          <Link
            href="/settings"
            className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2 body-sm text-on-primary shadow-md transition-all hover:brightness-110"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
            Edit Profile
          </Link>
        </div>

        <div className="grid h-full grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
          <div className="flex h-full flex-col gap-6">
            <div className="group relative overflow-hidden rounded-xl bg-surface-container p-6 shadow-sm md:p-10">
              <div className="absolute -right-32 -top-32 h-64 w-64 rounded-full bg-primary/5 blur-[80px] transition-transform duration-700 group-hover:scale-150" />
              <div className="relative z-10 flex flex-col flex-wrap items-start gap-10 sm:flex-row">
                <div className="relative h-[120px] w-[120px] shrink-0">
                  <div className="absolute inset-0 animate-pulse rounded-full bg-primary/20 blur-md" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt="User Avatar"
                    src={AVATAR_URL}
                    className="relative z-10 h-[120px] w-[120px] rounded-full bg-surface-container object-cover p-1 shadow-lg"
                  />
                  <div className="absolute bottom-0 right-0 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-surface-container">
                    <div className="h-4 w-4 animate-pulse rounded-full bg-[#10B981]" />
                  </div>
                </div>

                <div className="w-full flex-1">
                  <div className="mb-4 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                      <h2 className="m-0 headline-md tracking-tight text-on-surface">
                        {displayName}
                      </h2>
                      <p className="mt-1 flex items-center gap-2 body-lg text-on-surface-variant">
                        <span className="material-symbols-outlined text-[16px]">
                          terminal
                        </span>
                        {roleTitle}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col gap-1 self-start rounded-lg bg-surface-container-highest px-4 py-2">
                      <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium uppercase tracking-wider text-on-surface-variant opacity-70">
                        System ID
                      </span>
                      <span className="rounded bg-primary/10 px-2 py-[2px] text-center font-[family-name:var(--font-jetbrains-mono)] text-[13px] text-primary">
                        {systemId}
                      </span>
                    </div>
                  </div>

                  <div className="relative grid grid-cols-2 gap-4 pt-6 md:grid-cols-4">
                    <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-outline-variant/0 via-outline-variant/50 to-outline-variant/0" />
                    <div className="flex flex-col gap-1">
                      <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium uppercase tracking-wider text-on-surface-variant opacity-70">
                        Experience
                      </span>
                      <span className="headline-sm text-on-surface">{years}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium uppercase tracking-wider text-on-surface-variant opacity-70">
                        Deployments
                      </span>
                      <span className="headline-sm text-on-surface">1,492</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium uppercase tracking-wider text-on-surface-variant opacity-70">
                        Last Active
                      </span>
                      <span className="headline-sm text-on-surface">2m ago</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium uppercase tracking-wider text-on-surface-variant opacity-70">
                        Clearance
                      </span>
                      <div className="flex items-center gap-1 text-[#10B981]">
                        <span className="material-symbols-outlined text-[18px]">
                          verified_user
                        </span>
                        <span className="font-[family-name:var(--font-jetbrains-mono)] text-[13px]">
                          Lvl 4
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-1 flex-col rounded-xl bg-surface-container p-6 shadow-sm md:p-10">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="m-0 headline-sm text-on-surface">
                  Technical Stack
                </h3>
                <button
                  type="button"
                  className="text-on-surface-variant transition-colors hover:text-primary"
                >
                  <span className="material-symbols-outlined">add_circle</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-4">
                {STACK.map((tech) => (
                  <div
                    key={tech.name}
                    className="group flex cursor-default items-center gap-2 rounded-lg bg-surface-container-highest px-4 py-2 transition-colors hover:bg-surface-bright"
                  >
                    <span
                      className="h-2 w-2 rounded-full border border-outline-variant"
                      style={{
                        backgroundColor: tech.color,
                        borderColor: tech.bordered
                          ? "rgba(66,71,84,1)"
                          : "transparent",
                      }}
                    />
                    <span className="font-[family-name:var(--font-jetbrains-mono)] text-[13px] text-on-surface">
                      {tech.name}
                    </span>
                    {tech.version ? (
                      <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] text-on-surface-variant opacity-0 transition-opacity group-hover:opacity-100">
                        {tech.version}
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>

              <div className="relative mt-10 flex flex-1 flex-col justify-end pt-6">
                <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-outline-variant/0 via-outline-variant/50 to-outline-variant/0" />
                <div className="relative h-32 w-full opacity-20">
                  <div className="absolute inset-0 z-10 bg-gradient-to-t from-surface-container to-transparent" />
                  <svg
                    className="h-full w-full text-primary"
                    fill="none"
                    preserveAspectRatio="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    viewBox="0 0 100 20"
                  >
                    <path
                      className="animate-[dash_5s_linear_infinite]"
                      d="M0 15 Q 10 5, 20 15 T 40 15 T 60 15 T 80 15 T 100 15"
                      strokeDasharray="2 4"
                    />
                    <path
                      d="M0 10 L 15 10 L 20 5 L 25 15 L 30 10 L 100 10"
                      stroke="currentColor"
                      strokeWidth="1"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="flex h-full flex-col gap-6 rounded-xl bg-surface-container p-6 shadow-sm">
            <h3 className="m-0 flex items-center gap-2 headline-sm text-on-surface">
              <span className="material-symbols-outlined text-primary">
                activity_zone
              </span>
              Activity Stream
            </h3>
            <div className="relative flex flex-1 flex-col gap-6">
              <div className="absolute bottom-0 left-[11px] top-8 w-[2px] rounded-full bg-surface-container-highest" />
              {ACTIVITY.map((item, i) => (
                <div key={i} className="group relative z-10 flex gap-4">
                  <div
                    className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-[2px] border-surface-container bg-surface-container-highest transition-colors ${item.hover}`}
                  >
                    <div className={`h-2 w-2 rounded-full ${item.dot}`} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="m-0 body-sm text-on-surface">{item.title}</p>
                    <p className="m-0 body-sm text-on-surface-variant opacity-80">
                      {item.detail}
                    </p>
                    <span className="mt-1 font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium tracking-[0.02em] text-on-surface-variant opacity-60">
                      {item.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/sessions"
              className="mt-auto w-full rounded border border-outline-variant/30 py-2 text-center body-sm text-on-surface-variant transition-colors hover:bg-surface-container-highest hover:text-on-surface"
            >
              View All Activity
            </Link>
          </div>
        </div>
      </div>

      <footer className="mt-10 border-t border-outline-variant/20 bg-surface-container-lowest py-10">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-4 px-6 body-sm text-on-surface-variant md:flex-row">
          <div>© 2024 Honed Systems Inc.</div>
          <div className="flex gap-6">
            <a className="transition-colors hover:text-primary" href="#">
              Privacy
            </a>
            <a className="transition-colors hover:text-primary" href="#">
              Terms
            </a>
            <a className="transition-colors hover:text-primary" href="#">
              Status
            </a>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes dash {
          to { stroke-dashoffset: -24; }
        }
      `}</style>
    </div>
  );
}
