"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, ChevronDown, CreditCard, Lock, ShieldCheck } from "lucide-react";
import { getProduct, gbp } from "@/lib/data";
import { useStore } from "@/lib/store";
import { ProductArt } from "@/components/ui/ProductArt";
import { Button, ButtonLink, cn, Field, Input, Select } from "@/components/ui";

const shipping = [
  { id: "std", name: "Standard (2–3 days)", price: 2.99, free: 20 },
  { id: "next", name: "Next day (order by 4pm)", price: 4.99 },
  { id: "click", name: "Collect from store", price: 0 },
];

export default function Checkout() {
  const { cart, subtotal, clear } = useStore();
  const [ship, setShip] = useState("std");
  const [pay, setPay] = useState("card");
  const [done, setDone] = useState(false);
  const [summary, setSummary] = useState(false);
  const s = shipping.find((x) => x.id === ship)!;
  const shipCost = s.free && subtotal >= s.free ? 0 : s.price;
  const total = subtotal + shipCost;

  if (done) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <CheckCircle2 className="mx-auto size-16 text-success" />
        <h1 className="mt-5 text-3xl font-semibold tracking-tight">Order confirmed</h1>
        <p className="mt-2 text-muted">Order <b className="text-ink">#5813</b> is on its way to being packed. We&apos;ve emailed your receipt. Have your photo ID ready on delivery.</p>
        <div className="mt-8 flex justify-center gap-3">
          <ButtonLink href="/account">Track order</ButtonLink>
          <ButtonLink href="/shop" variant="outline">Keep shopping</ButtonLink>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold">Your basket is empty</h1>
        <ButtonLink href="/shop" className="mt-6">Go to shop</ButtonLink>
      </div>
    );
  }

  const Summary = (
    <div className="space-y-4">
      {cart.map((l) => {
        const p = getProduct(l.productId)!;
        return (
          <div key={l.productId} className="flex items-center gap-3">
            <div className="relative">
              <ProductArt category={p.category} seed={+p.id.slice(1)} className="size-16 rounded-xl" />
              <span className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-ink text-[11px] font-bold text-on-ink">{l.qty}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{p.name}</p>
              <p className="text-xs text-muted">{l.variant ?? p.brand}</p>
            </div>
            <p className="text-sm font-medium">{gbp(p.retailPrice * l.qty)}</p>
          </div>
        );
      })}
      <div className="flex gap-2">
        <Input placeholder="Discount code" className="h-10" />
        <Button variant="outline" size="sm" className="h-10">Apply</Button>
      </div>
      <dl className="space-y-2 border-t border-line pt-4 text-sm">
        <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd>{gbp(subtotal)}</dd></div>
        <div className="flex justify-between"><dt className="text-muted">Delivery</dt><dd>{shipCost === 0 ? "Free" : gbp(shipCost)}</dd></div>
        <div className="flex justify-between"><dt className="text-muted">VAT included (20%)</dt><dd>{gbp(total / 6)}</dd></div>
        <div className="flex justify-between border-t border-line pt-3 text-lg font-semibold"><dt>Total</dt><dd>{gbp(total)}</dd></div>
      </dl>
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 pt-6">
      <h1 className="text-3xl font-semibold tracking-tight">Checkout</h1>

      {/* Mobile summary toggle */}
      <button onClick={() => setSummary(!summary)} className="mt-4 flex w-full items-center justify-between rounded-2xl border border-line bg-surface p-4 text-sm lg:hidden">
        <span className="flex items-center gap-1 font-medium">Order summary <ChevronDown className={cn("size-4 transition", summary && "rotate-180")} /></span>
        <span className="font-semibold">{gbp(total)}</span>
      </button>
      {summary && <div className="mt-2 rounded-2xl border border-line bg-surface p-4 lg:hidden">{Summary}</div>}

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_400px]">
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            clear();
            setDone(true);
          }}
        >
          <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
            <h2 className="mb-1 font-semibold">1. Contact & age check</h2>
            <p className="mb-4 text-sm text-muted">We check your age with a UK credit reference agency. This does not affect your credit score.</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Email"><Input type="email" required placeholder="you@example.com" /></Field>
              <Field label="Mobile"><Input type="tel" placeholder="07…" /></Field>
              <Field label="Date of birth" hint="You must be 18 or over"><Input type="date" required /></Field>
              <div className="flex items-end">
                <p className="flex items-center gap-2 rounded-xl bg-success/10 px-3 py-2.5 text-sm text-success"><ShieldCheck className="size-4" /> Age verified instantly</p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
            <h2 className="mb-4 font-semibold">2. Delivery address</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="First name"><Input required /></Field>
              <Field label="Last name"><Input required /></Field>
              <Field label="Postcode" className="sm:col-span-2">
                <div className="flex gap-2">
                  <Input required placeholder="e.g. M1 1AE" className="uppercase" />
                  <Button type="button" variant="outline" className="h-11">Find address</Button>
                </div>
              </Field>
              <Field label="Address line 1" className="sm:col-span-2"><Input required /></Field>
              <Field label="Town / City"><Input required /></Field>
              <Field label="Country">
                <Select defaultValue="England"><option>England</option><option>Scotland</option><option>Wales</option><option>Northern Ireland</option></Select>
              </Field>
            </div>
            <div className="mt-5 space-y-2">
              {shipping.map((o) => (
                <label key={o.id} className={cn("flex cursor-pointer items-center justify-between rounded-xl border p-4 transition", ship === o.id ? "border-ink bg-paper" : "border-line")}>
                  <span className="flex items-center gap-3 text-sm">
                    <input type="radio" name="ship" checked={ship === o.id} onChange={() => setShip(o.id)} className="size-4 accent-ink" />
                    {o.name}
                  </span>
                  <span className="text-sm font-medium">{o.free && subtotal >= o.free ? "Free" : o.price === 0 ? "Free" : gbp(o.price)}</span>
                </label>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
            <h2 className="mb-4 font-semibold">3. Payment</h2>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                { id: "apple", l: " Pay" },
                { id: "google", l: "G Pay" },
                { id: "paypal", l: "PayPal" },
                { id: "card", l: "Card" },
              ].map((m) => (
                <button type="button" key={m.id} onClick={() => setPay(m.id)} className={cn("h-12 rounded-xl border text-sm font-semibold transition", pay === m.id ? "border-ink bg-ink text-on-ink" : "border-line bg-surface")}>
                  {m.id === "card" ? <span className="inline-flex items-center gap-2"><CreditCard className="size-4" /> Card</span> : m.l}
                </button>
              ))}
            </div>
            {pay === "card" && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                <Field label="Card number" className="col-span-2"><Input inputMode="numeric" placeholder="1234 5678 9012 3456" /></Field>
                <Field label="Expiry"><Input placeholder="MM / YY" /></Field>
                <Field label="CVC"><Input placeholder="123" /></Field>
              </div>
            )}
            <label className="mt-5 flex items-start gap-3 text-sm">
              <input type="checkbox" required className="mt-0.5 size-4 accent-ink" />
              <span>I confirm I am 18 or over and I agree to the <Link href="/help" className="underline">terms</Link>. An adult with photo ID must sign for delivery.</span>
            </label>
          </section>

          <Button size="lg" className="w-full">
            <Lock className="size-4" /> Pay {gbp(total)}
          </Button>
        </form>

        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-line bg-surface p-6">
            <h2 className="mb-4 font-semibold">Order summary</h2>
            {Summary}
          </div>
        </aside>
      </div>
    </div>
  );
}
