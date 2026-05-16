/* eslint-disable @typescript-eslint/no-unused-vars */
import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import useAuthStore from "@/store/useAuthStore";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Eye,
  RefreshCw,
  ShoppingBag
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { Order } from "@/lib/type";
import { cn } from "@/lib/utils";
import { set } from "zod";

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [total, setTotal] = useState(0);
  const axiosPrivate = useAxiosPrivate();
  const { checkIsAdmin } = useAuthStore();
  const isAdmin = checkIsAdmin();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axiosPrivate.get("/orders");
      setOrders(res.data.orders || []);
      setTotal(res?.data?.orders.length || 0);
    } catch (error) {
      console.log("Failed to fetch orders", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await axiosPrivate.get("/orders");
      setOrders(res.data.orders || []);
      setTotal(res?.data?.orders.length || 0);
      toast.success("Orders refreshed");
    } catch (error) {
      toast.error("Failed to refresh orders");
    } finally {
      setRefreshing(false);
    }
  };

  const handleView = (order: Order) => {
    setSelectedOrder(order);
    setIsViewOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentBadge = (status: string) => {
    return status === "paid"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  if (loading) {
    return (
      <div className="p-5">
        <p className="text-muted-foreground">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="p-5 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
          <p className="text-gray-600 mt-0.5">
            View and manage all system orders in one place. Search, filter, and export as needed.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-blue-600">{total}</span>
          </div>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
            className="border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead>Order ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Date</TableHead>
              {isAdmin && <TableHead className="text-right pr-[1%]">Actions</TableHead>}
            </TableRow>
          </TableHeader>

          <TableBody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell className="font-medium">
                    #{order._id.slice(-6)}
                  </TableCell>

                  <TableCell>
                    {order.user?.name || "Unknown"}
                  </TableCell>

                  <TableCell className="font-semibold text-green-600">
                    ${order.totalAmount.toFixed(2)}
                  </TableCell>

                  <TableCell>
                    <Badge className={cn(getPaymentBadge(order.paymentStatus))}>
                      {order.paymentStatus}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Badge className={cn(getStatusBadge(order.status))}>
                      {order.status}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    {order.items.length} items
                  </TableCell>

                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>

                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleView(order)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10">
                  No orders found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* View Order Modal */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Full order information
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              <div>
                <p className="font-semibold">Order ID</p>
                <p>{selectedOrder._id}</p>
              </div>

              <div>
                <p className="font-semibold">Customer</p>
                <p>{selectedOrder.user?.name}</p>
              </div>

              <div>
                <p className="font-semibold">Total Amount</p>
                <p className="text-green-600 font-bold">
                  ${selectedOrder.totalAmount}
                </p>
              </div>

              <div>
                <p className="font-semibold">Status</p>
                <Badge className={cn(getStatusBadge(selectedOrder.status))}>
                  {selectedOrder.status}
                </Badge>
              </div>

              <div>
                <p className="font-semibold">Payment</p>
                <Badge className={cn(getPaymentBadge(selectedOrder.paymentStatus))}>
                  {selectedOrder.paymentStatus}
                </Badge>
              </div>

              <div>
                <p className="font-semibold">Items</p>
                <ul className="list-disc pl-5 text-sm">
                  {selectedOrder.items.map((item, idx) => (
                    <li key={idx}>
                      {item.product?.name} × {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Orders;