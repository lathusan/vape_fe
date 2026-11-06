"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { getProduct, gbp } from "@/lib/data";
import { useStore } from "@/lib/store";
import { ProductArt } from "@/components/ui/ProductArt";
import { ButtonLink } from "@/components/ui";

const FREE_DELIVERY = 20;

export function CartDrawer() {
  const { cart, cartOpen, setCartOpen, setQty, remove, subtotal } = useStore();
  if (!cartOpen) return null;
  const left = Math.max(0, FREE_DELIVERY - subtotal);

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-ink/50" onClick={() => setCartOpen(false)} />
      <aside className="animate-slide-in-right absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-paper">
        <div className="flex h-16 items-center justify-between border-b border-line px-5">
          <h2 className="text-lg font-semibold">Your basket</h2>
          <button onClick={() => setCartOpen(false)} className="grid size-10 place-items-center rounded-full hover:bg-ink/5" aria-label="Close">
            <X className="size-5" />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="grid flex-1 place-items-center p-8 text-center">
            <div>
              <div className="mx-auto mb-4 grid size-16 place-items-center rounded-full bg-surface"><ShoppingBag className="size-7 text-muted" /></div>
              <p className="font-medium">Your basket is empty</p>
              <p className="mt-1 text-sm text-muted">Find your next favourite flavour.</p>
              <ButtonLink href="/shop" onClick={() => setCartOpen(false)} className="mt-5">Start shopping</ButtonLink>
            </div>
          </div>
        ) : (
          <>
            <div className="border-b border-line px-5 py-3">
              <p className="text-sm">{left > 0 ? <>Add <b>{gbp(left)}</b> more for free delivery</> : <>🎉 You&apos;ve unlocked <b>free UK delivery</b></>}</p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink/10">
                <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${Math.min(100, (subtotal / FREE_DELIVERY) * 100)}%` }} />
              </div>
            </div>
            <ul className="flex-1 space-y-3 overflow-y-auto p-5">
              {cart.map((l) => {
                const p = getProduct(l.productId);
                if (!p) return null;
                return (
                  <li key={l.productId} className="flex gap-3 rounded-2xl bg-surface p-3">
                    <ProductArt category={p.category} seed={+p.id.slice(1)} className="size-20 shrink-0 rounded-xl" />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate font-medium">{p.name}</p>
                          <p className="text-xs text-muted">{l.variant ?? p.brand}</p>
                        </div>
                        <button onClick={() => remove(p.id)} className="text-muted hover:text-danger" aria-label="Remove"><Trash2 className="size-4" /></button>
                      </div>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center rounded-full border border-line">
                          <button className="grid size-8 place-items-center" onClick={() => setQty(p.id, l.qty - 1)} aria-label="Decrease"><Minus className="size-3.5" /></button>
                          <span className="w-6 text-center text-sm font-medium">{l.qty}</span>
                          <button className="grid size-8 place-items-center" onClick={() => setQty(p.id, l.qty + 1)} aria-label="Increase"><Plus className="size-3.5" /></button>
                        </div>
                        <p className="font-semibold">{gbp(p.retailPrice * l.qty)}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="pb-safe border-t border-line bg-surface p-5">
              <div className="mb-4 flex justify-between text-lg font-semibold">
                <span>Subtotal</span>
                <span>{gbp(subtotal)}</span>
              </div>
              <ButtonLink href="/checkout" onClick={() => setCartOpen(false)} size="lg" className="w-full">Checkout securely</ButtonLink>
              <p className="mt-3 text-center text-xs text-muted">Prices include VAT · ID check (18+) needed on delivery</p>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
