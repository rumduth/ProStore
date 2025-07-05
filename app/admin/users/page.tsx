import { requireAdmin } from "@/lib/auth-guard";

export default async function AdminUsersPage() {
  await requireAdmin();
  return <>USERS</>;
}
