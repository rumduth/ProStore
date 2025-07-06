import { requireAdmin } from "@/lib/auth-guard";
import { deleteOrder, getAllOrders } from "@/lib/actions/order.actions";
import { Metadata } from "next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import Link from "next/link";
import Pagination from "@/components/shared/pagination";
import { Button } from "@/components/ui/button";
import DeleteDialog from "@/components/shared/delete-dialog";
export const metadata: Metadata = {
  title: "Admin Orders",
};
export default async function AdminOrdersPage(props: {
  searchParams: Promise<{ page: string; query: string }>;
}) {
  await requireAdmin();
  const { page = "1", query: searchText } = await props.searchParams;
  const orders = await getAllOrders({ page: Number(page), query: searchText });
  return (
    <>
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h2 className="h2-bold">Order</h2>
          {searchText && (
            <div className="flex items-center gap-3">
              Filtered by <i>&quot;{searchText}&quot;</i>{" "}
              <Link href="/admin/orders">
                <Button variant="outline" size="sm">
                  Remove Filter
                </Button>
              </Link>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>DATE</TableHead>
                <TableHead>BUYER</TableHead>
                <TableHead>TOTAL</TableHead>
                <TableHead>PAID</TableHead>
                <TableHead>DELIVERED</TableHead>
                <TableHead>ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.data.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{formatId(order.id)}</TableCell>
                  <TableCell>
                    {formatDateTime(order.createdAt).dateTime}
                  </TableCell>
                  <TableCell>{order.user.name}</TableCell>
                  <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                  <TableCell>
                    {order.isPaid
                      ? formatDateTime(order.paidAt!).dateTime
                      : "Not Paid"}
                  </TableCell>
                  <TableCell>
                    {order.isDelivered
                      ? formatDateTime(order.deliveredAt!).dateTime
                      : "Not Delivered"}
                  </TableCell>
                  <TableCell>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/order/${order.id}`}>Detail</Link>
                    </Button>
                    <DeleteDialog id={order.id} action={deleteOrder} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {orders.totalPages > 1 && (
            <Pagination
              page={Number(page) || 1}
              totalPages={orders?.totalPages}
            />
          )}
        </div>
      </div>
    </>
  );
}
