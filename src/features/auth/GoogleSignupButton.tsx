"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useGoogleAuthMutation } from "@/services/api/authApi";
import { getApiErrorMessage } from "@/lib/errors";

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export function GoogleSignupButton({
  variant = "signup",
}: {
  label?: string;
  variant?: "signup" | "login";
}) {
  const router = useRouter();
  const hostRef = useRef<HTMLDivElement>(null);
  // null until measured — avoids painting at a guess width, then again at the real width
  // (GoogleLogin's effect calls renderButton without clearing, which stacks two buttons).
  const [width, setWidth] = useState<number | null>(null);
  const [googleAuth, { error, isLoading }] = useGoogleAuthMutation();
  const [gisError, setGisError] = useState<string | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const update = () => {
      const next = Math.min(
        400,
        Math.max(240, Math.floor(host.getBoundingClientRect().width)),
      );
      setWidth((prev) => (prev === next ? prev : next));
    };
    update();

    const observer = new ResizeObserver(update);
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  async function onSuccess(response: CredentialResponse) {
    if (!response.credential) {
      setGisError("Google did not return a credential. Try again.");
      return;
    }
    setGisError(null);
    try {
      await googleAuth({ credential: response.credential }).unwrap();
      router.replace("/dashboard");
    } catch {
      // Mutation error state handles display
    }
  }

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

  const displayError = gisError ?? (error ? getApiErrorMessage(error) : null);

  return (
    <div ref={hostRef} className="relative w-full space-y-2">
      <div
        className={`relative h-11 w-full overflow-hidden ${
          isLoading ? "pointer-events-none opacity-50" : ""
        }`}
      >
        {width != null ? (
          <GoogleLogin
            // Remount on width change so renderButton gets a fresh empty container
            key={width}
            onSuccess={onSuccess}
            onError={() => setGisError("Google sign-in failed. Try again.")}
            theme="filled_black"
            size="large"
            text={variant === "login" ? "signin_with" : "signup_with"}
            shape="rectangular"
            logo_alignment="left"
            width={String(width)}
            context={variant === "login" ? "signin" : "signup"}
          />
        ) : null}
      </div>

      {displayError ? (
        <p className="body-sm text-center text-error">{displayError}</p>
      ) : null}
    </div>
  );
}
