import { StaffGate } from "@/features/admin-console/StaffGate";
import { AdminWaitlistPage } from "@/features/admin-console/AdminWaitlistPage";

export default function AdminConsoleRoute() {
  return (
    <StaffGate>
      <AdminWaitlistPage />
    </StaffGate>
  );
}
