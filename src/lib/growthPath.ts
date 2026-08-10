export type GrowthPath = "current-job" | "new-role";

export type FrameworkSlug = "react" | "nextjs" | "django" | "fastapi";

const STORAGE_KEY = "forgeiq_growth_path";
const FRAMEWORK_KEY = "forgeiq_focus_frameworks";
const FRAMEWORK_LABELS_KEY = "forgeiq_focus_framework_labels";

export function setGrowthPath(path: GrowthPath) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, path);
}

export function setFocusFrameworks(ids: FrameworkSlug[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(FRAMEWORK_KEY, JSON.stringify(ids));
}

export function setFocusFrameworkLabels(labels: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(FRAMEWORK_LABELS_KEY, labels);
}

export function getStoredFocusFrameworks(): FrameworkSlug[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(FRAMEWORK_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((x): x is FrameworkSlug =>
          ["react", "nextjs", "django", "fastapi"].includes(String(x)),
        )
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

export function getStoredFocusFrameworkLabels(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(FRAMEWORK_LABELS_KEY);
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

export function resolveFocusFrameworkLabels(technicalGoal?: string | null): string {
  const stored = getStoredFocusFrameworkLabels();
  if (stored) return stored;
  const parts = (technicalGoal || "").split("·").map((p) => p.trim());
  if (parts.length >= 2) return parts[parts.length - 1]!;
  return "React, Django";
}
