"use client";

import { useEffect } from "react";
import { useCart } from "@/components/shop/CartProvider";

/** Vacía el carrito cuando el pedido quedó pagado. */
export function ClearCart() {
  const { clear, ready } = useCart();
  useEffect(() => {
    if (ready) clear();
  }, [ready, clear]);
  return null;
}
