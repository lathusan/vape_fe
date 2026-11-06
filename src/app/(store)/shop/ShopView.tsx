"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { categories, products, type CategoryId } from "@/lib/data";
import { ProductCard } from "@/components/store/ProductCard";
import { Button, cn, Select } from "@/components/ui";

const brands = [...new Set(products.map((p) => p.brand))].sort();

export function ShopView() {
  const sp = useSearchParams();
  const [cat, setCat] = useState<CategoryId | "all">((sp.get("cat") as CategoryId) ?? "all");
  const [q, setQ] = useState(sp.get("q") ?? "");
  const [selBrands, setSelBrands] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(60);
  const [inStock, setInStock] = useState(false);
  const [deals, setDeals] = useState(sp.get("deals") === "1");
  const [sort, setSort] = useState("popular");
  const [sheet, setSheet] = useState(false);

  // keep filters in sync when header links change the URL
  useEffect(() => {
    setCat((sp.get("cat") as CategoryId) ?? "all");
    setQ(sp.get("q") ?? "");
    setDeals(sp.get("deals") === "1");
  }, [sp]);

  const list = useMemo(() => {
    let r = products.filter((p) => p.status !== "draft");
    if (cat !== "all") r = r.filter((p) => p.category === cat);
    if (q) {
      const s = q.toLowerCase();
      r = r.filter((p) => [p.name, p.brand, ...(p.flavours ?? [])].join(" ").toLowerCase().includes(s));
    }
    if (selBrands.length) r = r.filter((p) => selBrands.includes(p.brand));
    if (inStock) r = r.filter((p) => p.stock > 0);
    if (deals) r = r.filter((p) => p.wasPrice || p.badge === "Sale" || p.badge === "Trade deal");
    r = r.filter((p) => p.retailPrice <= maxPrice);
    if (sort === "low") r = [...r].sort((a, b) => a.retailPrice - b.retailPrice);
    if (sort === "high") r = [...r].sort((a, b) => b.retailPrice - a.retailPrice);
    if (sort === "rating") r = [...r].sort((a, b) => b.rating - a.rating);
    if (sort === "popular") r = [...r].sort((a, b) => b.reviews - a.reviews);
    return r;
  }, [cat, q, selBrands, inStock, deals, maxPrice, sort]);

  const filters = (
    <div className="space-y-7">
      <div>
        <p className="mb-3 text-sm font-semibold">Brand</p>
        <div className="space-y-2.5">
          {brands.map((b) => (
            <label key={b} className="flex cursor-pointer items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={selBrands.includes(b)}
                onChange={(e) => setSelBrands((s) => (e.target.checked ? [...s, b] : s.filter((x) => x !== b)))}
                className="size-4.5 accent-ink"
              />
              {b}
            </label>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-3 flex justify-between text-sm font-semibold">Max price <span className="font-normal text-muted">£{maxPrice}</span></p>
        <input type="range" min={1} max={60} value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} className="w-full accent-ink" />
      </div>
      <div className="space-y-2.5">
        <label className="flex cursor-pointer items-center gap-3 text-sm"><input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} className="size-4.5 accent-ink" /> In stock only</label>
        <label className="flex cursor-pointer items-center gap-3 text-sm"><input type="checkbox" checked={deals} onChange={(e) => setDeals(e.target.checked)} className="size-4.5 accent-ink" /> Deals & offers</label>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-muted">Home / Shop</p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{cat === "all" ? "Shop all" : categories.find((c) => c.id === cat)?.name}</h1>
        </div>
        {q && (
          <button onClick={() => setQ("")} className="inline-flex items-center gap-1 rounded-full bg-surface px-3 py-1.5 text-sm">
            &ldquo;{q}&rdquo; <X className="size-3.5" />
          </button>
        )}
      </div>

      {/* Category chips */}
      <div className="no-scrollbar -mx-4 mt-5 flex gap-2 overflow-x-auto px-4">
        {[{ id: "all" as const, name: "All" }, ...categories].map((c) => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            className={cn("h-10 shrink-0 rounded-full border px-4 text-sm font-medium transition", cat === c.id ? "border-ink bg-ink text-on-ink" : "border-line bg-surface hover:border-ink/30")}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">{filters}</aside>
        <div>
          <div className="mb-5 flex items-center justify-between gap-3">
            <p className="text-sm text-muted">{list.length} products</p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setSheet(true)}>
                <SlidersHorizontal className="size-4" /> Filters
              </Button>
              <Select value={sort} onChange={(e) => setSort(e.target.value)} className="h-9 w-auto rounded-full text-sm">
                <option value="popular">Most popular</option>
                <option value="rating">Top rated</option>
                <option value="low">Price: low to high</option>
                <option value="high">Price: high to low</option>
              </Select>
            </div>
          </div>
          {list.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line p-12 text-center text-muted">No products match these filters.</div>
          ) : (
            <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3">
              {list.map((p) => <ProductCard key={p.id} p={p} />)}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter sheet */}
      {sheet && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setSheet(false)} />
          <div className="animate-slide-up pb-safe absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto rounded-t-3xl bg-paper p-6">
            <div className="mx-auto mb-5 h-1.5 w-10 rounded-full bg-ink/15" />
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button onClick={() => { setSelBrands([]); setMaxPrice(60); setInStock(false); setDeals(false); }} className="text-sm text-brand">Reset</button>
            </div>
            {filters}
            <Button size="lg" className="mt-8 w-full" onClick={() => setSheet(false)}>Show {list.length} products</Button>
          </div>
        </div>
      )}
    </div>
  );
}
