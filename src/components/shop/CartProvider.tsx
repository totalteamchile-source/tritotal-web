"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { MAX_POR_ITEM, type CartItem } from "@/lib/shop";

const KEY = "tritotal-carrito";

type Cart = {
  items: CartItem[];
  count: number;
  total: number;
  ready: boolean;
  add: (item: CartItem) => void;
  setQty: (producto_id: string, talla: string, cantidad: number) => void;
  remove: (producto_id: string, talla: string) => void;
  clear: () => void;
};

const Ctx = createContext<Cart | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {}
  }, [items, ready]);

  const same = (a: CartItem, id: string, t: string) => a.producto_id === id && a.talla === t;

  const add = useCallback((item: CartItem) => {
    setItems((prev) => {
      const ex = prev.find((p) => same(p, item.producto_id, item.talla));
      if (ex) return prev.map((p) => (p === ex ? { ...p, cantidad: Math.min(MAX_POR_ITEM, p.cantidad + item.cantidad) } : p));
      return [...prev, item];
    });
  }, []);
  const setQty = useCallback((id: string, t: string, c: number) => {
    setItems((prev) => prev.map((p) => (same(p, id, t) ? { ...p, cantidad: Math.max(1, Math.min(MAX_POR_ITEM, c)) } : p)));
  }, []);
  const remove = useCallback((id: string, t: string) => setItems((prev) => prev.filter((p) => !same(p, id, t))), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({
      items,
      ready,
      count: items.reduce((a, i) => a + i.cantidad, 0),
      total: items.reduce((a, i) => a + i.cantidad * i.precio, 0),
      add,
      setQty,
      remove,
      clear,
    }),
    [items, ready, add, setQty, remove, clear],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart fuera de CartProvider");
  return c;
}
