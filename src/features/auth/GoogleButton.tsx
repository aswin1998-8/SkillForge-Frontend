"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useGoogleAuthMutation } from "@/services/api/authApi";
import { getApiErrorMessage } from "@/lib/errors";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: Record<string, unknown>,
          ) => void;
        };
      };
    };
  }
}

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export function GoogleButton() {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [googleAuth, { error }] = useGoogleAuthMutation();

  useEffect(() => {
    if (!CLIENT_ID || !ref.current) return;

    const scriptId = "google-gsi";
    const existing = document.getElementById(scriptId);

    function render() {
      if (!window.google || !ref.current || !CLIENT_ID) return;
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: async (response) => {
          const user = await googleAuth({
            credential: response.credential,
          }).unwrap();
          if (user.profile?.onboarding_completed) {
            router.replace("/dashboard");
          } else {
            router.replace("/onboarding");
          }
        },
      });
      window.google.accounts.id.renderButton(ref.current, {
        theme: "filled_black",
        size: "large",
        width: "100%",
        text: "continue_with",
      });
    }

    if (existing) {
      render();
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = render;
    document.body.appendChild(script);
  }, [googleAuth, router]);

  if (!CLIENT_ID) return null;

  return (
    <div className="space-y-2">
      <div className="relative py-2 text-center text-xs text-muted">
        <span className="bg-card px-2 relative z-10">or</span>
        <div className="absolute inset-x-0 top-1/2 border-t border-border" />
      </div>
      <div ref={ref} className="flex justify-center" />
      {error ? (
        <p className="text-sm text-danger">{getApiErrorMessage(error)}</p>
      ) : null}
    </div>
  );
}
