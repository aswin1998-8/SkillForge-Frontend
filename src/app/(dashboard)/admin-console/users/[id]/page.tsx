import { StaffGate } from "@/features/admin-console/StaffGate";
import { AdminUserDetailPage } from "@/features/admin-console/AdminUserDetailPage";

export default async function AdminConsoleUserDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const userId = Number(id);
  return (
    <StaffGate>
      <AdminUserDetailPage userId={Number.isFinite(userId) ? userId : 0} />
    </StaffGate>
  );
}
