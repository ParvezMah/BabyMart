"use client";

import { useOrderStore } from "@/lib/store";
import { Package } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const OrdersIcon = () => {
  const { getOrdersCount, orders } = useOrderStore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const orderCount = getOrdersCount();

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <Link
        href={"/user/orders"}
        className="relative hover:text-babyshopSky hoverEffect"
      >
        <Package size={24} />
        <span className="absolute -right-2 -top-2 bg-babyshopSky text-babyshopWhite text-[11px] font-medium w-4 h-4 rounded-full flex items-center justify-center">
          0
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={"/user/orders"}
      className="relative hover:text-babyshopSky hoverEffect"
    >
      <Package size={24} />

      <span className="absolute -right-2 -top-2 bg-babyshopSky text-babyshopWhite text-[11px] font-medium w-4 h-4 rounded-full flex items-center justify-center">
        {orderCount > 99 ? "99+" : orderCount}
      </span>
    </Link>
  );
};

export default OrdersIcon;