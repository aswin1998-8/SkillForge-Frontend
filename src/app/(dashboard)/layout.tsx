import { AuthGate } from "@/components/layout/AuthGate";
import { AppShell } from "@/components/layout/AppShell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGate mode="dashboard">
      <AppShell>{children}</AppShell>
    </AuthGate>
  );
}
