"use client";

import Link from "next/link";
import { useState } from "react";
import { Building2, Check, ChevronDown, Lock, Minus, Plus, RotateCcw, ShieldCheck, Star, Truck } from "lucide-react";
import { catName, gbp, products, type Product } from "@/lib/data";
import { useStore } from "@/lib/store";
import { ProductArt } from "@/components/ui/ProductArt";
import { Badge, Button, cn } from "@/components/ui";
import { ProductCard } from "@/components/store/ProductCard";
import { NicotineWarning } from "@/components/store/Footer";

export function ProductDetail({ p }: { p: Product }) {
  const { add, role } = useStore();
  const options = p.colours ?? p.flavours ?? [];
  const nicOptions = p.nicotine?.includes("/") ? p.nicotine.split("/").map((s) => s.trim().replace(/mg.*/, "mg")) : [];
  const [opt, setOpt] = useState(options[0]);
  const [nic, setNic] = useState(nicOptions[nicOptions.length - 1]);
  const [qty, setQty] = useState(1);
  const [img, setImg] = useState(0);
  const [open, setOpen] = useState<string | null>("Details");
  const oos = p.status === "out_of_stock";
  const isTrade = role === "retailer" || role === "wholesaler";
  const related = products.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4);
  const variant = [p.colours ? opt : null, nic].filter(Boolean).join(" · ") || undefined;

  return (
    <div className="mx-auto max-w-7xl px-4 pt-4 sm:pt-8">
      <p className="mb-4 text-sm text-muted">
        <Link href="/shop" className="hover:text-ink">Shop</Link> / <Link href={`/shop?cat=${p.category}`} className="hover:text-ink">{catName(p.category)}</Link> / <span className="text-ink">{p.name}</span>
      </p>
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
        {/* Gallery */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <ProductArt category={p.category} seed={+p.id.slice(1) + img * 3} className="aspect-square rounded-3xl" />
          <div className="mt-3 grid grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <button key={i} onClick={() => setImg(i)} className={cn("overflow-hidden rounded-xl ring-2 ring-offset-2 ring-offset-paper transition", img === i ? "ring-ink" : "ring-transparent")}>
                <ProductArt category={p.category} seed={+p.id.slice(1) + i * 3} className="aspect-square" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="brand">{p.brand}</Badge>
            {p.badge && <Badge tone="accent">{p.badge}</Badge>}
            {p.stock > 0 && p.stock < 100 && <Badge tone="warn">Only {p.stock} left</Badge>}
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{p.name}</h1>
          <div className="mt-2 flex items-center gap-2 text-sm">
            <span className="flex">{[1, 2, 3, 4, 5].map((i) => <Star key={i} className={cn("size-4", i <= Math.round(p.rating) ? "fill-amber-400 text-amber-400" : "text-ink/15")} />)}</span>
            <span className="font-medium">{p.rating}</span>
            <span className="text-muted">· {p.reviews.toLocaleString()} reviews</span>
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <p className="text-3xl font-semibold">{gbp(p.retailPrice)}</p>
            {p.wasPrice && <p className="text-lg text-muted line-through">{gbp(p.wasPrice)}</p>}
            {p.wasPrice && <Badge tone="danger">Save {gbp(p.wasPrice - p.retailPrice)}</Badge>}
          </div>
          <p className="text-sm text-muted">Inc VAT · or 3 interest-free payments of {gbp(p.retailPrice / 3)}</p>

          <p className="mt-5 text-[15px] leading-relaxed text-ink/80">{p.description}</p>

          {options.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium">{p.colours ? "Colour" : "Flavour profile"}: <span className="text-muted">{opt}</span></p>
              <div className="flex flex-wrap gap-2">
                {options.map((o) => (
                  <button key={o} onClick={() => setOpt(o)} disabled={!p.colours} className={cn("h-10 rounded-full border px-4 text-sm transition disabled:cursor-default", opt === o && p.colours ? "border-ink bg-ink text-on-ink" : "border-line bg-surface")}>
                    {o}
                  </button>
                ))}
              </div>
            </div>
          )}
          {nicOptions.length > 0 && (
            <div className="mt-5">
              <p className="mb-2 text-sm font-medium">Nicotine strength</p>
              <div className="flex flex-wrap gap-2">
                {nicOptions.map((o) => (
                  <button key={o} onClick={() => setNic(o)} className={cn("h-10 min-w-16 rounded-full border px-4 text-sm transition", nic === o ? "border-ink bg-ink text-on-ink" : "border-line bg-surface")}>
                    {o}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-7 hidden gap-3 sm:flex">
            <div className="flex h-13 items-center rounded-full border border-line bg-surface">
              <button className="grid size-12 place-items-center" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease"><Minus className="size-4" /></button>
              <span className="w-8 text-center font-medium">{qty}</span>
              <button className="grid size-12 place-items-center" onClick={() => setQty(qty + 1)} aria-label="Increase"><Plus className="size-4" /></button>
            </div>
            <Button size="lg" className="flex-1" disabled={oos} onClick={() => add(p.id, qty, variant)}>
              {oos ? "Out of stock" : `Add to basket · ${gbp(p.retailPrice * qty)}`}
            </Button>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs">
            {[{ i: Truck, t: "Next-day delivery" }, { i: ShieldCheck, t: "18+ verified" }, { i: RotateCcw, t: "30-day returns" }].map(({ i: I, t }) => (
              <div key={t} className="rounded-xl bg-surface p-3"><I className="mx-auto mb-1 size-5 text-brand" />{t}</div>
            ))}
          </div>

          {p.nicotine && !p.nicotine.startsWith("0mg") && <NicotineWarning className="mt-5" />}

          {/* Trade pricing */}
          <div className="mt-6 rounded-2xl border border-line bg-surface p-5">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 font-semibold"><Building2 className="size-4 text-brand" /> Trade pricing</p>
              <span className="text-xs text-muted">MOQ {p.moq} units · ex VAT</span>
            </div>
            {isTrade ? (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {p.tiers.map((t) => (
                  <div key={t.minQty} className="rounded-xl bg-brand-soft p-3 text-center">
                    <p className="text-xs text-brand">{t.minQty}+ units</p>
                    <p className="font-semibold">{gbp(t.price)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-paper p-3">
                <p className="flex items-center gap-2 text-sm text-muted"><Lock className="size-4" /> Log in with a trade account to see wholesale prices</p>
                <Link href="/login?type=retailer" className="shrink-0 text-sm font-medium text-brand">Log in</Link>
              </div>
            )}
          </div>

          {/* Accordion */}
          <div className="mt-6 divide-y divide-line border-y border-line">
            {[
              { h: "Details", b: (
                <dl className="grid grid-cols-2 gap-y-2 text-sm">
                  <dt className="text-muted">SKU</dt><dd>{p.sku}</dd>
                  <dt className="text-muted">Category</dt><dd>{catName(p.category)}</dd>
                  {p.nicotine && (<><dt className="text-muted">Nicotine</dt><dd>{p.nicotine}</dd></>)}
                  {p.volume && (<><dt className="text-muted">Volume</dt><dd>{p.volume}</dd></>)}
                  <dt className="text-muted">MHRA ECID</dt><dd>{p.ecid}</dd>
                </dl>
              ) },
              { h: "Delivery & returns", b: <p className="text-sm text-muted">Free UK delivery over £20. Order before 4pm for next-day delivery (Mon–Fri). Sealed, unused items can be returned within 30 days. Adult signature with ID required.</p> },
              { h: "Safety & compliance", b: <p className="text-sm text-muted">Not for use by under-18s, non-smokers, or pregnant or breastfeeding women. Keep out of reach of children. Meets UK TPD rules: max 20mg/ml nicotine, max 2ml tank, max 10ml bottle for nicotine liquid.</p> },
            ].map((s) => (
              <div key={s.h}>
                <button onClick={() => setOpen(open === s.h ? null : s.h)} className="flex w-full items-center justify-between py-4 text-left font-medium">
                  {s.h}
                  <ChevronDown className={cn("size-4 transition", open === s.h && "rotate-180")} />
                </button>
                {open === s.h && <div className="pb-5">{s.b}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-5 text-2xl font-semibold tracking-tight">You might also like</h2>
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4">
            {related.map((r) => <ProductCard key={r.id} p={r} />)}
          </div>
        </section>
      )}

      {/* Mobile sticky add bar */}
      <div className="fixed inset-x-0 bottom-[60px] z-30 border-t border-line bg-surface/90 p-3 backdrop-blur-xl sm:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-12 items-center rounded-full border border-line">
            <button className="grid size-11 place-items-center" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease"><Minus className="size-4" /></button>
            <span className="w-5 text-center font-medium">{qty}</span>
            <button className="grid size-11 place-items-center" onClick={() => setQty(qty + 1)} aria-label="Increase"><Plus className="size-4" /></button>
          </div>
          <Button size="lg" className="h-12 flex-1" disabled={oos} onClick={() => add(p.id, qty, variant)}>
            {oos ? "Out of stock" : <><Check className="size-4" /> Add · {gbp(p.retailPrice * qty)}</>}
          </Button>
        </div>
      </div>
    </div>
  );
}
