import DeleteDialog from "@/components/shared/delete-dialog";
import Pagination from "@/components/shared/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteUserById, getAllUsers } from "@/lib/actions/user.actions";
import { requireAdmin } from "@/lib/auth-guard";
import { formatId } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin Users",
};

export default async function AdminUsersPage(props: {
  searchParams: Promise<{ page: number; query: string }>;
}) {
  await requireAdmin();
  const { page = 1, query: searchText } = await props.searchParams;
  const users = await getAllUsers({ page: Number(page), query: searchText });
  return (
    <>
      <div className="space-y-2">
        <div className="flex-between">
          <div className="flex items-center gap-3">
            <h1 className="h2-bold">Users</h1>
            {searchText && (
              <div className="flex items-center gap-3">
                Filtered by <i>&quot;{searchText}&quot;</i>{" "}
                <Link href="/admin/users">
                  <Button variant="outline" size="sm">
                    Remove Filter
                  </Button>
                </Link>
              </div>
            )}
          </div>
          <Button variant="default" asChild>
            <Link href="/admin/products/create">Create Product</Link>
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>NAME</TableHead>
                <TableHead>EMAIL</TableHead>
                <TableHead>ROLE</TableHead>
                <TableHead>ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.data.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{formatId(user.id)}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user?.email || "Not provided"}</TableCell>
                  <TableCell>
                    {user.role === "user" ? (
                      <Badge variant="secondary">
                        {user.role.toUpperCase()}
                      </Badge>
                    ) : (
                      <Badge variant="default">{user.role.toUpperCase()}</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/users/${user.id}`}>Edit</Link>
                    </Button>
                    <DeleteDialog id={user.id} action={deleteUserById} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {users.totalPages > 1 && (
            <Pagination
              page={Number(page) || 1}
              totalPages={users.totalPages}
            />
          )}
        </div>
      </div>
    </>
  );
}
