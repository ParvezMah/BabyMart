"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Package, Loader2, Eye } from "lucide-react";

import Container from "../common/Container";
import PriceFormatter from "../common/PriceFormatter";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

import { useUserStore } from "@/lib/store";
import authApi from "@/lib/authApi";

type OrderItem = {
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

type Order = {
  _id: string;
  total: number;
  status: "pending" | "paid" | "shipped" | "cancelled";
  items: OrderItem[];
  createdAt: string;
};

const OrderPageClient = () => {
  const router = useRouter();
  const { auth_token, isAuthenticated } = useUserStore();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/signin");
    }
  }, [isAuthenticated, router]);



const fetchOrders = useCallback(async () => {
  if (!auth_token) return;

  setLoading(true);

  try {
    const res = await authApi.get("/orders");

    setOrders(res.data || []);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    toast.error("Failed to load orders");
    setOrders([]);
  } finally {
    setLoading(false);
  }
}, [auth_token]);

useEffect(() => {
  fetchOrders();
}, [fetchOrders]);

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "paid":
        return "text-green-600 bg-green-50";
      case "shipped":
        return "text-blue-600 bg-blue-50";
      case "cancelled":
        return "text-red-600 bg-red-50";
      default:
        return "text-yellow-600 bg-yellow-50";
    }
  };

  if (loading) {
    return (
      <Container className="py-16 flex justify-center">
        <Loader2 className="animate-spin w-6 h-6" />
      </Container>
    );
  }

  if (!orders.length) {
    return (
      <Container className="py-16 text-center">
        <Package className="mx-auto w-16 h-16 text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold mb-2">No Orders Found</h1>
        <p className="text-gray-500 mb-6">
          You haven’t placed any orders yet.
        </p>
        <Button onClick={() => router.push("/shop")}>
          Start Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-10">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border rounded-xl p-5 bg-white shadow-sm"
          >
            {/* Top row */}
            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="text-sm text-gray-500">
                  Order ID: {order._id}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  order.status
                )}`}
              >
                {order.status.toUpperCase()}
              </span>
            </div>

            <Separator className="my-3" />

            {/* Items preview */}
            <div className="text-sm text-gray-600 mb-3">
              {order.items.slice(0, 2).map((item, i) => (
                <div key={i}>
                  {item.name} × {item.quantity}
                </div>
              ))}

              {order.items.length > 2 && (
                <p className="text-xs text-gray-400">
                  +{order.items.length - 2} more items
                </p>
              )}
            </div>

            {/* Bottom row */}
            <div className="flex justify-between items-center">
              <PriceFormatter
                amount={order.total}
                className="text-lg font-semibold"
              />

              <Button
                size="sm"
                onClick={() => setSelectedOrder(order)}
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                View
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Simple Order Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-xl p-6">
            <h2 className="text-xl font-bold mb-2">Order Details</h2>

            <p className="text-sm text-gray-500 mb-2">
              ID: {selectedOrder._id}
            </p>

            <span
              className={`px-3 py-1 rounded-full text-xs ${getStatusColor(
                selectedOrder.status
              )}`}
            >
              {selectedOrder.status.toUpperCase()}
            </span>

            <Separator className="my-4" />

            <div className="space-y-2">
              {selectedOrder.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>
                    <PriceFormatter amount={item.price * item.quantity} />
                  </span>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between font-bold">
              <span>Total</span>
              <PriceFormatter amount={selectedOrder.total} />
            </div>

            <Button
              className="w-full mt-5"
              onClick={() => setSelectedOrder(null)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </Container>
  );
};

export default OrderPageClient;