export type GrowthPath = "current-job" | "new-role";

const STORAGE_KEY = "forgeiq_growth_path";
const DOMAIN_KEY = "forgeiq_focus_domain";
const SCOPE_KEY = "forgeiq_growth_scope";

export function setGrowthPath(path: GrowthPath) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, path);
}

export function setFocusDomain(domain: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DOMAIN_KEY, domain);
}

export function setGrowthScopeLabel(scope: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SCOPE_KEY, scope);
}

export function getStoredGrowthPath(): GrowthPath | null {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(STORAGE_KEY);
  return v === "current-job" || v === "new-role" ? v : null;
}

export function getStoredFocusDomain(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(DOMAIN_KEY);
}

export function resolveGrowthPath(technicalGoal?: string | null): GrowthPath {
  const stored = getStoredGrowthPath();
  if (stored) return stored;
  const goal = (technicalGoal || "").toLowerCase();
  if (goal.includes("become better") || goal.includes("current job")) {
    return "current-job";
  }
  return "new-role";
}

export function resolveFocusDomain(technicalGoal?: string | null): string {
  const stored = getStoredFocusDomain();
  if (stored) return stored;
  const parts = (technicalGoal || "").split("·").map((p) => p.trim());
  if (parts.length >= 3) return parts[parts.length - 1]!;
  return "System Design & Architecture";
}
