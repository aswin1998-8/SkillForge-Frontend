import Script from "next/script";

/**
 * Auth-route shell: preload Google Identity Services early so login/signup
 * can call renderButton without a branded placeholder race.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        id="google-gsi"
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
      />
      {children}
    </>
  );
}
