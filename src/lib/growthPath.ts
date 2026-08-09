export type GrowthPath = "current-job" | "new-role";

const STORAGE_KEY = "forgeiq_growth_path";
const DOMAIN_KEY = "forgeiq_focus_domain";
const DOMAIN_IDS_KEY = "forgeiq_focus_domain_ids";

export function setGrowthPath(path: GrowthPath) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, path);
}

export function setFocusDomain(domain: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DOMAIN_KEY, domain);
}

export function setFocusDomainIds(ids: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DOMAIN_IDS_KEY, JSON.stringify(ids));
}

export function getStoredFocusDomainIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(DOMAIN_IDS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.map((x) => String(x)).filter(Boolean)
      : [];
  } catch {
    return [];
  }
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

export function growthPathToDiagnosticGoal(
  path: GrowthPath | null | undefined,
): "sharpen_current" | "switch_role" {
  return path === "current-job" ? "sharpen_current" : "switch_role";
}

export function resolveFocusDomain(technicalGoal?: string | null): string {
  const stored = getStoredFocusDomain();
  if (stored) return stored;
  const parts = (technicalGoal || "").split("·").map((p) => p.trim());
  if (parts.length >= 2) return parts[parts.length - 1]!;
  return "System Design & Architecture";
}
