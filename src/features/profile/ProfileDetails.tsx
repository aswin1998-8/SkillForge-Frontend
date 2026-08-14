"use client";

import { useMeQuery } from "@/services/api/authApi";
import { useGetProfileQuery } from "@/services/api/profileApi";

function initialsFrom(name: string, email: string | undefined) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  if (parts.length === 1 && parts[0].length >= 2) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  const local = email?.split("@")[0] || "U";
  return local.slice(0, 2).toUpperCase();
}

export function ProfileDetails() {
  const { data: user } = useMeQuery();
  const { data: profile } = useGetProfileQuery();

  const displayName =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    user?.email?.split("@")[0] ||
    "Account";

  const currentRole = profile?.current_role?.trim() || "";
  const targetRole =
    profile?.target_role?.name?.trim() ||
    profile?.target_role_label?.trim() ||
    "";
  const years = profile?.years_of_experience;
  const skills = (profile?.known_skills || []).filter(Boolean);
  const goal = profile?.technical_goal?.trim() || "";
  const initials = initialsFrom(displayName, user?.email);

  return (
    <div className="flex min-h-[calc(100dvh-3.5rem)] w-full min-w-0 flex-col overflow-x-hidden sm:min-h-[calc(100vh-64px)]">
      <div className="mx-auto flex h-full w-full max-w-[1440px] flex-col px-4 py-6 sm:px-6 sm:py-10 md:px-10 xl:px-[120px]">
        <div className="mb-8 min-w-0 sm:mb-10">
          <h1 className="display-lg m-0 text-on-background !text-[32px] !leading-[40px] sm:!text-[48px] sm:!leading-[56px]">
            Profile
          </h1>
          <p className="body-lg mt-2 text-on-surface-variant">
            Your account and career details.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-xl bg-surface-container p-6 shadow-sm md:p-10">
            <div className="flex flex-col items-start gap-8 sm:flex-row">
              <div className="flex h-[96px] w-[96px] shrink-0 items-center justify-center rounded-full bg-primary text-on-primary">
                <span className="headline-md">{initials}</span>
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="m-0 headline-md tracking-tight text-on-surface">
                  {displayName}
                </h2>
                {user?.email ? (
                  <p className="mt-1 body-lg text-on-surface-variant">
                    {user.email}
                  </p>
                ) : null}

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {currentRole ? (
                    <div className="flex flex-col gap-1">
                      <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium uppercase tracking-wider text-on-surface-variant opacity-70">
                        Current role
                      </span>
                      <span className="headline-sm text-on-surface">
                        {currentRole}
                      </span>
                    </div>
                  ) : null}
                  {targetRole ? (
                    <div className="flex flex-col gap-1">
                      <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium uppercase tracking-wider text-on-surface-variant opacity-70">
                        Target role
                      </span>
                      <span className="headline-sm text-on-surface">
                        {targetRole}
                      </span>
                    </div>
                  ) : null}
                  {years != null ? (
                    <div className="flex flex-col gap-1">
                      <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium uppercase tracking-wider text-on-surface-variant opacity-70">
                        Experience
                      </span>
                      <span className="headline-sm text-on-surface">
                        {years} {years === 1 ? "Year" : "Years"}
                      </span>
                    </div>
                  ) : null}
                </div>

                {goal ? (
                  <div className="mt-6 flex flex-col gap-1">
                    <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium uppercase tracking-wider text-on-surface-variant opacity-70">
                      Goal
                    </span>
                    <p className="body-lg text-on-surface">{goal}</p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {skills.length ? (
            <div className="rounded-xl bg-surface-container p-6 shadow-sm md:p-10">
              <h3 className="m-0 headline-sm text-on-surface">Skills</h3>
              <div className="mt-4 flex flex-wrap gap-3">
                {skills.map((skill) => (
                  <div
                    key={skill}
                    className="rounded-lg bg-surface-container-highest px-4 py-2 font-[family-name:var(--font-jetbrains-mono)] text-[13px] text-on-surface"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
