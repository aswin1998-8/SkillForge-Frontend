import { GoogleAuthProvider } from "@/features/auth/GoogleAuthProvider";

/**
 * Auth-route shell: GoogleOAuthProvider loads GIS for login/signup buttons.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <GoogleAuthProvider>{children}</GoogleAuthProvider>;
}
