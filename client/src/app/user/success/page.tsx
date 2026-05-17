"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useUserStore, useOrderStore } from "@/lib/store";

export default function SuccessPage() {
  const { auth_token } = useUserStore();
  const { loadOrders } = useOrderStore();
  const searchParams = useSearchParams();

  const orderId = searchParams.get("orderId");

  console.log("Order ID from query:", orderId);

  useEffect(() => {
    if (auth_token) {
      loadOrders(auth_token);
    }
  }, [auth_token, loadOrders]);

  return (
    <div className="text-center py-20">
      <h1 className="text-2xl font-bold">Payment Successful 🎉</h1>
      <p>Order ID: {orderId}</p>
    </div>
  );
}