"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useGoogleAuthMutation } from "@/services/api/authApi";
import { getApiErrorMessage } from "@/lib/errors";

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

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

function GoogleGlyph({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function GoogleSignupButton({
  label = "Continue with Google",
  variant = "signup",
}: {
  label?: string;
  variant?: "signup" | "login";
}) {
  const router = useRouter();
  const hostRef = useRef<HTMLDivElement>(null);
  const googleBtnRef = useRef<HTMLDivElement>(null);
  const [googleAuth, { error, isLoading }] = useGoogleAuthMutation();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!CLIENT_ID) return;

    let cancelled = false;
    const scriptId = "google-gsi";

    function paintButton() {
      const googleId = getGoogleId();
      const host = hostRef.current;
      const mount = googleBtnRef.current;
      if (!googleId || !CLIENT_ID || !host || !mount || cancelled) return;

      // Avoid leftover One Tap prompts from earlier experiments.
      googleId.cancel?.();

      googleId.initialize({
        client_id: CLIENT_ID,
        auto_select: false,
        cancel_on_tap_outside: true,
        context: variant === "login" ? "signin" : "signup",
        callback: async (response) => {
          try {
            await googleAuth({
              credential: response.credential,
            }).unwrap();
            router.replace("/dashboard");
          } catch {
            // Mutation error state handles display
          }
        },
      });

      mount.innerHTML = "";
      const width = Math.max(Math.floor(host.getBoundingClientRect().width), 240);
      googleId.renderButton(mount, {
        type: "standard",
        theme: "filled_black",
        size: "large",
        text: variant === "login" ? "continue_with" : "signup_with",
        shape: "rectangular",
        logo_alignment: "left",
        width,
      });
      setReady(true);
    }

    const existing = document.getElementById(scriptId);
    if (existing) {
      paintButton();
    } else {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.onload = () => paintButton();
      document.body.appendChild(script);
    }

    const onResize = () => paintButton();
    window.addEventListener("resize", onResize);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
      getGoogleId()?.cancel?.();
    };
  }, [googleAuth, router, variant]);

  if (!CLIENT_ID) {
    return (
      <p className="body-sm text-center text-error">
        Google sign-in is not configured.
      </p>
    );
  }

  return (
    <div ref={hostRef} className="relative w-full space-y-2">
      {!ready ? (
        <div className="flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-outline-variant/40 bg-surface-container-highest px-4">
          <GoogleGlyph className="h-5 w-5" />
          <span className="font-[family-name:var(--font-jetbrains-mono)] text-[12px] font-medium tracking-[0.02em] text-on-surface">
            {label}
          </span>
        </div>
      ) : null}

      <div
        className={`relative flex w-full justify-center ${ready ? "" : "sr-only"} ${
          isLoading ? "pointer-events-none opacity-50" : ""
        }`}
      >
        <div ref={googleBtnRef} className="w-full [&_>div]:!w-full" />
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-lg bg-surface-container-highest/90">
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
