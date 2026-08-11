"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useGoogleAuthMutation } from "@/services/api/authApi";
import { getApiErrorMessage } from "@/lib/errors";

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const GSI_SCRIPT_ID = "google-gsi";
const GSI_SCRIPT_SRC = "https://accounts.google.com/gsi/client";

type GoogleAccountsId = {
  initialize: (config: {
    client_id: string;
    callback: (response: { credential: string }) => void;
    auto_select?: boolean;
    cancel_on_tap_outside?: boolean;
    context?: string;
  }) => void;
  cancel?: () => void;
  renderButton: (
    parent: HTMLElement,
    options: Record<string, unknown>,
  ) => void;
};

function getGoogleId(): GoogleAccountsId | undefined {
  return (
    window as unknown as {
      google?: { accounts: { id: GoogleAccountsId } };
    }
  ).google?.accounts.id;
}

/** Idempotent loader — auth layout may already have injected the script. */
export function loadGsiScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (getGoogleId()) return Promise.resolve();

  const existing = document.getElementById(
    GSI_SCRIPT_ID,
  ) as HTMLScriptElement | null;
  if (existing) {
    return new Promise((resolve, reject) => {
      if (getGoogleId()) {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Failed to load Google script")),
        { once: true },
      );
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = GSI_SCRIPT_ID;
    script.src = GSI_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google script"));
    document.body.appendChild(script);
  });
}

function buttonWidth(host: HTMLElement) {
  // GIS width is px number; max 400 per Google docs.
  return Math.min(400, Math.max(240, Math.floor(host.getBoundingClientRect().width)));
}

export function GoogleSignupButton({
  variant = "signup",
}: {
  label?: string;
  variant?: "signup" | "login";
}) {
  const router = useRouter();
  const hostRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);
  const [googleAuth, { error, isLoading }] = useGoogleAuthMutation();
  const googleAuthRef = useRef(googleAuth);
  const routerRef = useRef(router);
  const variantRef = useRef(variant);

  googleAuthRef.current = googleAuth;
  routerRef.current = router;
  variantRef.current = variant;

  useEffect(() => {
    if (!CLIENT_ID) return;

    let cancelled = false;
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;

    function paintButton() {
      const host = hostRef.current;
      const mount = mountRef.current;
      const googleId = getGoogleId();
      if (!host || !mount || !googleId || cancelled || !CLIENT_ID) return;

      if (!initializedRef.current) {
        googleId.initialize({
          client_id: CLIENT_ID,
          auto_select: false,
          cancel_on_tap_outside: true,
          context: variantRef.current === "login" ? "signin" : "signup",
          callback: async (response) => {
            try {
              await googleAuthRef
                .current({ credential: response.credential })
                .unwrap();
              routerRef.current.replace("/dashboard");
            } catch {
              // Mutation error state handles display
            }
          },
        });
        initializedRef.current = true;
      }

      mount.innerHTML = "";
      googleId.renderButton(mount, {
        type: "standard",
        theme: "filled_black",
        size: "large",
        text: variantRef.current === "login" ? "continue_with" : "signup_with",
        shape: "rectangular",
        logo_alignment: "left",
        width: buttonWidth(host),
      });
    }

    async function setup() {
      try {
        await loadGsiScript();
      } catch {
        return;
      }
      if (cancelled) return;
      paintButton();
    }

    void setup();

    const onResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (!cancelled) paintButton();
      }, 150);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelled = true;
      if (resizeTimer) clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      initializedRef.current = false;
      getGoogleId()?.cancel?.();
    };
  }, [variant]);

  if (!CLIENT_ID) {
    return (
      <p className="body-sm text-center text-on-surface-variant">
        Google sign-in is unavailable. Set{" "}
        <span className="font-[family-name:var(--font-jetbrains-mono)] text-[11px]">
          NEXT_PUBLIC_GOOGLE_CLIENT_ID
        </span>{" "}
        on Vercel and matching{" "}
        <span className="font-[family-name:var(--font-jetbrains-mono)] text-[11px]">
          GOOGLE_CLIENT_ID
        </span>{" "}
        on Render.
      </p>
    );
  }

  return (
    <div ref={hostRef} className="relative w-full space-y-2">
      <div
        className={`relative h-11 w-full overflow-hidden ${
          isLoading ? "pointer-events-none opacity-50" : ""
        }`}
      >
        {/* Single GIS mount — Google owns inline → iframe rendering */}
        <div ref={mountRef} className="w-full [&_>div]:!w-full" />

        {isLoading ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center gap-2 rounded-lg bg-surface-container-highest/90">
            <span className="material-symbols-outlined animate-spin text-[18px]">
              progress_activity
            </span>
            <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] tracking-[0.02em]">
              Connecting…
            </span>
          </div>
        ) : null}
      </div>

      {error ? (
        <p className="body-sm text-center text-error">
          {getApiErrorMessage(error)}
        </p>
      ) : null}
    </div>
  );
}
