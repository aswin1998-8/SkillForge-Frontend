import { StaffGate } from "@/features/admin-console/StaffGate";
import { AdminUsersPage } from "@/features/admin-console/AdminUsersPage";

export default function AdminConsoleUsersRoute() {
  return (
    <StaffGate>
      <AdminUsersPage />
    </StaffGate>
  );
}
