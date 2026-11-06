"use client";

import Link from "next/link";
import { useState } from "react";
import { Gift, Heart, LogOut, MapPin, Package, RotateCcw, Settings, Truck } from "lucide-react";
import { getProduct, gbp, products, retailOrders } from "@/lib/data";
import { useStore } from "@/lib/store";
import { ProductArt } from "@/components/ui/ProductArt";
import { Button, Card, cn, Field, Input, StatusPill } from "@/components/ui";
import { ProductCard } from "@/components/store/ProductCard";

const tabs = [
  { id: "orders", label: "Orders", icon: Package },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function Account() {
  const [tab, setTab] = useState("orders");
  const { add, setRole } = useStore();
  const mine = retailOrders.filter((o) => ["Amelia Hart"].includes(o.customer)).concat(retailOrders.slice(3, 5));

  return (
    <div className="mx-auto max-w-6xl px-4 pt-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="grid size-14 place-items-center rounded-full bg-accent text-xl font-semibold">A</div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Hi, Amelia</h1>
            <p className="text-sm text-muted">Member since 2024 · Age verified ✓</p>
          </div>
        </div>
        <Link href="/" onClick={() => setRole("guest")} className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink"><LogOut className="size-4" /> Log out</Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="p-4"><Gift className="size-5 text-brand" /><p className="mt-2 text-2xl font-semibold">640</p><p className="text-xs text-muted">Loyalty points (£6.40)</p></Card>
        <Card className="p-4"><Package className="size-5 text-brand" /><p className="mt-2 text-2xl font-semibold">12</p><p className="text-xs text-muted">Orders placed</p></Card>
        <Card className="p-4"><Truck className="size-5 text-brand" /><p className="mt-2 text-2xl font-semibold">1</p><p className="text-xs text-muted">On the way</p></Card>
        <Card className="bg-brand-gradient border-0 p-4 text-white"><RotateCcw className="size-5" /><p className="mt-2 font-semibold">Reorder favourites</p><p className="text-xs text-white/60">One tap, same as last time</p></Card>
      </div>

      <div className="no-scrollbar -mx-4 mt-8 flex gap-2 overflow-x-auto border-b border-line px-4">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={cn("-mb-px flex shrink-0 items-center gap-2 border-b-2 px-3 pb-3 text-sm font-medium", tab === t.id ? "border-ink" : "border-transparent text-muted")}>
            <t.icon className="size-4" /> {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "orders" && (
          <div className="space-y-3">
            {mine.map((o) => (
              <Card key={o.id} className="p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <p className="font-semibold">Order {o.id}</p>
                    <StatusPill status={o.status} />
                  </div>
                  <p className="text-sm text-muted">{new Date(o.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} · {gbp(o.total)}</p>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  {o.items.map((it) => {
                    const p = getProduct(it.productId)!;
                    return (
                      <div key={it.productId} className="flex items-center gap-2 rounded-xl bg-paper p-2 pr-3">
                        <ProductArt category={p.category} seed={+p.id.slice(1)} className="size-11 rounded-lg" />
                        <div><p className="text-sm font-medium">{p.name}</p><p className="text-xs text-muted">Qty {it.qty}</p></div>
                      </div>
                    );
                  })}
                  <div className="ml-auto flex gap-2">
                    <Button variant="outline" size="sm">Track</Button>
                    <Button size="sm" onClick={() => o.items.forEach((it) => add(it.productId, it.qty))}>Buy again</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
        {tab === "wishlist" && (
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4">
            {products.slice(2, 6).map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        )}
        {tab === "addresses" && (
          <div className="grid gap-3 sm:grid-cols-2">
            <Card className="p-5"><p className="font-medium">Home <span className="ml-2 text-xs text-brand">Default</span></p><p className="mt-2 text-sm text-muted">Amelia Hart<br />14 Oxford Road<br />Manchester<br />M1 5QA</p></Card>
            <button className="grid min-h-36 place-items-center rounded-2xl border-2 border-dashed border-line text-sm font-medium text-muted hover:border-ink/30">+ Add new address</button>
          </div>
        )}
        {tab === "settings" && (
          <Card className="max-w-xl space-y-4 p-6">
            <div className="grid grid-cols-2 gap-3">
              <Field label="First name"><Input defaultValue="Amelia" /></Field>
              <Field label="Last name"><Input defaultValue="Hart" /></Field>
            </div>
            <Field label="Email"><Input defaultValue="amelia.h@example.com" /></Field>
            <Field label="Mobile"><Input defaultValue="07700 900123" /></Field>
            <label className="flex items-center gap-3 text-sm"><input type="checkbox" defaultChecked className="size-4 accent-ink" /> Email me about offers (18+ only)</label>
            <Button>Save changes</Button>
          </Card>
        )}
      </div>
    </div>
  );
}
