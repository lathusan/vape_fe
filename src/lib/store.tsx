"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getProduct } from "./data";

// Mock client-side state: cart + "who is logged in".
// Replace with real auth (e.g. NextAuth / your API) and a server cart later.

export type Role = "guest" | "customer" | "retailer" | "wholesaler";
export type CartLine = { productId: string; qty: number; variant?: string };

type Ctx = {
  role: Role;
  setRole: (r: Role) => void;
  cart: CartLine[];
  add: (productId: string, qty?: number, variant?: string) => void;
  setQty: (productId: string, qty: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
};

const StoreCtx = createContext<Ctx | null>(null);

function load<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}
function save(key: string, v: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(v));
  } catch {}
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>("guest");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setRoleState(load<Role>("nimbus.role", "guest"));
    setCart(load<CartLine[]>("nimbus.cart", []));
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) save("nimbus.cart", cart);
  }, [cart, ready]);

  const setRole = useCallback((r: Role) => {
    setRoleState(r);
    save("nimbus.role", r);
  }, []);

  const add = useCallback((productId: string, qty = 1, variant?: string) => {
    setCart((c) => {
      const i = c.findIndex((l) => l.productId === productId);
      if (i >= 0) {
        const n = [...c];
        n[i] = { ...n[i], qty: n[i].qty + qty };
        return n;
      }
      return [...c, { productId, qty, variant }];
    });
    setCartOpen(true);
  }, []);
  const setQty = useCallback((productId: string, qty: number) => {
    setCart((c) => c.map((l) => (l.productId === productId ? { ...l, qty: Math.max(1, qty) } : l)));
  }, []);
  const remove = useCallback((productId: string) => setCart((c) => c.filter((l) => l.productId !== productId)), []);
  const clear = useCallback(() => setCart([]), []);

  const value = useMemo<Ctx>(() => {
    const count = cart.reduce((s, l) => s + l.qty, 0);
    const subtotal = cart.reduce((s, l) => s + (getProduct(l.productId)?.retailPrice ?? 0) * l.qty, 0);
    return { role, setRole, cart, add, setQty, remove, clear, count, subtotal, cartOpen, setCartOpen };
  }, [role, setRole, cart, add, setQty, remove, clear, cartOpen]);

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const v = useContext(StoreCtx);
  if (!v) throw new Error("useStore must be used inside StoreProvider");
  return v;
}
