export function getApiErrorMessage(error: unknown, fallback = "Something went wrong") {
  if (!error || typeof error !== "object") return fallback;
  const err = error as {
    data?: {
      error?: {
        message?: string;
        details?: unknown;
      };
      message?: string;
    };
    status?: number | string;
  };
  const details = err.data?.error?.details;
  if (details && typeof details === "object" && !Array.isArray(details)) {
    const first = Object.values(details as Record<string, unknown>).flat()[0];
    if (typeof first === "string" && first.trim()) return first;
  }
  return err.data?.error?.message || err.data?.message || fallback;
}

export function getApiFieldErrors(
  error: unknown,
): Partial<Record<string, string>> {
  if (!error || typeof error !== "object") return {};
  const details = (error as { data?: { error?: { details?: unknown } } }).data
    ?.error?.details;
  if (!details || typeof details !== "object" || Array.isArray(details)) {
    return {};
  }
  const result: Partial<Record<string, string>> = {};
  for (const [key, value] of Object.entries(details as Record<string, unknown>)) {
    const message = Array.isArray(value) ? value[0] : value;
    if (typeof message === "string") result[key] = message;
  }
  return result;
}
