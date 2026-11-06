"use client";

import Link from "next/link";
import { Plus, Star } from "lucide-react";
import { catName, gbp, type Product } from "@/lib/data";
import { useStore } from "@/lib/store";
import { ProductArt } from "@/components/ui/ProductArt";
import { Badge } from "@/components/ui";

export function ProductCard({ p }: { p: Product }) {
  const { add, role } = useStore();
  const trade = role === "retailer"; // signed-in shops see trade prices
  const oos = p.status === "out_of_stock";
  return (
    <div className="group relative flex flex-col">
      <Link href={`/product/${p.slug}`} className="relative block overflow-hidden rounded-2xl">
        <ProductArt category={p.category} seed={+p.id.slice(1)} className="aspect-square transition duration-500 group-hover:scale-[1.04]" />
        <div className="absolute left-2.5 top-2.5 flex gap-1.5">
          {p.badge && <Badge tone={p.badge === "Sale" ? "danger" : p.badge === "New" ? "brand" : p.badge === "Trade deal" ? "dark" : "accent"}>{p.badge}</Badge>}
          {oos && <Badge tone="neutral">Sold out</Badge>}
        </div>
      </Link>
      <div className="mt-3 flex flex-1 flex-col">
        <p className="text-xs text-muted">{p.brand} · {catName(p.category)}</p>
        <Link href={`/product/${p.slug}`} className="mt-0.5 line-clamp-2 font-medium leading-snug hover:underline">{p.name}</Link>
        <div className="mt-1 flex items-center gap-1 text-xs text-muted">
          <Star className="size-3.5 fill-amber-400 text-amber-400" /> {p.rating} <span>({p.reviews.toLocaleString()})</span>
        </div>
        <div className="mt-auto flex items-end justify-between pt-2">
          <div>
            {trade ? (
              <>
                <p className="font-semibold">{gbp(p.tiers[p.tiers.length - 1].price)}<span className="text-xs font-normal text-muted"> from, ex VAT</span></p>
                <p className="text-xs text-muted">RRP {gbp(p.retailPrice)} · MOQ {p.moq}</p>
              </>
            ) : (
              <p className="font-semibold">
                {gbp(p.retailPrice)}{" "}
                {p.wasPrice && <span className="text-sm font-normal text-muted line-through">{gbp(p.wasPrice)}</span>}
              </p>
            )}
          </div>
          {trade ? (
            <Link href={`/retailer/restock?add=${p.id}`} className="grid size-9 place-items-center rounded-full bg-brand text-white" aria-label={`Restock ${p.name}`}>
              <Plus className="size-4" />
            </Link>
          ) : (
          <button
            disabled={oos}
            onClick={() => add(p.id)}
            className="grid size-9 place-items-center rounded-full bg-ink text-on-ink transition hover:bg-brand hover:text-on-brand disabled:bg-ink/10 disabled:text-muted"
            aria-label={`Add ${p.name} to basket`}
          >
            <Plus className="size-4" />
          </button>
          )}
        </div>
      </div>
    </div>
  );
}
