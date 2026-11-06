"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Copy, Download, Eye, Filter, MoreHorizontal, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { categories, catName, gbp, products, type Product } from "@/lib/data";
import type { PortalRole } from "@/lib/portal";
import { ProductArt } from "@/components/ui/ProductArt";
import { Button, ButtonLink, Card, cn, Select, StatusPill } from "@/components/ui";
import { PageHeader } from "./Shell";
import { costPrice, marginPct, shopStock } from "@/lib/pricing";
import { Tabs, Td, Th } from "./widgets";


export function ProductsList({ role }: { role: PortalRole }) {
  const base = `/${role}/products`;
  const [tab, setTab] = useState<"all" | "active" | "draft" | "out_of_stock">("all");
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [sel, setSel] = useState<string[]>([]);
  const [menu, setMenu] = useState<string | null>(null);
  const stockOf = (p: Product) => (role === "wholesaler" ? p.stock : shopStock(p));

  const list = useMemo(
    () =>
      products.filter(
        (p) =>
          (tab === "all" || p.status === tab) &&
          (cat === "all" || p.category === cat) &&
          (!q || `${p.name} ${p.sku} ${p.brand}`.toLowerCase().includes(q.toLowerCase())),
      ),
    [tab, q, cat],
  );
  const count = (s: string) => products.filter((p) => p.status === s).length;

  const Actions = ({ p }: { p: Product }) => (
    <div className="relative flex items-center justify-end gap-1">
      <Link href={`${base}/${p.id}`} className="grid size-8 place-items-center rounded-lg text-muted hover:bg-ink/5 hover:text-ink" aria-label="View"><Eye className="size-4" /></Link>
      <Link href={`${base}/${p.id}/edit`} className="grid size-8 place-items-center rounded-lg text-muted hover:bg-ink/5 hover:text-ink" aria-label="Edit"><Pencil className="size-4" /></Link>
      <button onClick={() => setMenu(menu === p.id ? null : p.id)} className="grid size-8 place-items-center rounded-lg text-muted hover:bg-ink/5 hover:text-ink" aria-label="More"><MoreHorizontal className="size-4" /></button>
      {menu === p.id && (
        <div className="absolute right-0 top-9 z-10 w-40 rounded-xl border border-line bg-surface p-1 text-sm shadow-lg">
          <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 hover:bg-paper"><Copy className="size-4" /> Duplicate</button>
          <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-danger hover:bg-danger/10"><Trash2 className="size-4" /> Delete</button>
        </div>
      )}
    </div>
  );

  return (
    <>
      <PageHeader
        title={role === "wholesaler" ? "Products" : "My products"}
        sub={role === "wholesaler" ? `${products.length} products in your trade catalogue` : "Products you sell in your shop and online"}
        actions={
          <>
            <Button variant="outline" size="sm"><Download className="size-4" /> Export CSV</Button>
            <ButtonLink href={`${base}/new`} size="sm"><Plus className="size-4" /> Add product</ButtonLink>
          </>
        }
      />

      <Tabs
        value={tab}
        onChange={setTab}
        items={[
          { id: "all", label: "All", count: products.length },
          { id: "active", label: "Active", count: count("active") },
          { id: "draft", label: "Draft", count: count("draft") },
          { id: "out_of_stock", label: "Out of stock", count: count("out_of_stock") },
        ]}
      />

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <label className="flex h-11 min-h-11 flex-1 items-center gap-2 rounded-xl border border-line bg-surface px-3.5">
          <Search className="size-4 text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, SKU or brand" className="w-full bg-transparent text-sm outline-none" />
        </label>
        <div className="flex gap-2">
          <Select value={cat} onChange={(e) => setCat(e.target.value)} className="sm:w-48">
            <option value="all">All categories</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
          <Button variant="outline" className="h-11 shrink-0 rounded-xl"><Filter className="size-4" /></Button>
        </div>
      </div>

      {sel.length > 0 && (
        <div className="mt-3 flex items-center gap-3 rounded-xl bg-night px-4 py-2.5 text-sm text-white">
          <span>{sel.length} selected</span>
          <button className="ml-auto text-accent">Set active</button>
          <button className="text-white/70">Change price</button>
          <button className="text-red-300">Delete</button>
        </div>
      )}

      {/* Desktop table */}
      <Card className="mt-4 hidden overflow-hidden md:block">
        <table className="w-full">
          <thead className="border-b border-line bg-paper/60">
            <tr>
              <Th className="w-10">
                <input type="checkbox" className="size-4 accent-ink" checked={sel.length === list.length && list.length > 0} onChange={(e) => setSel(e.target.checked ? list.map((p) => p.id) : [])} />
              </Th>
              <Th>Product</Th>
              <Th>Category</Th>
              <Th>{role === "wholesaler" ? "Trade price" : "Retail price"}</Th>
              <Th>{role === "wholesaler" ? "MOQ" : "Margin"}</Th>
              <Th>Stock</Th>
              <Th>Status</Th>
              <Th />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {list.map((p) => (
              <tr key={p.id} className="hover:bg-paper/50">
                <Td><input type="checkbox" className="size-4 accent-ink" checked={sel.includes(p.id)} onChange={(e) => setSel((s) => (e.target.checked ? [...s, p.id] : s.filter((x) => x !== p.id)))} /></Td>
                <Td>
                  <Link href={`${base}/${p.id}`} className="flex items-center gap-3">
                    <ProductArt category={p.category} seed={+p.id.slice(1)} className="size-11 shrink-0 rounded-lg" />
                    <div className="min-w-0">
                      <p className="truncate font-medium hover:underline">{p.name}</p>
                      <p className="text-xs text-muted">{p.sku} · {p.brand}</p>
                    </div>
                  </Link>
                </Td>
                <Td className="text-muted">{catName(p.category)}</Td>
                <Td>
                  {role === "wholesaler" ? (
                    <><p className="font-medium">{gbp(p.tiers[0].price)}</p><p className="text-xs text-muted">to {gbp(p.tiers[p.tiers.length - 1].price)}</p></>
                  ) : (
                    <><p className="font-medium">{gbp(p.retailPrice)}</p><p className="text-xs text-muted">cost {gbp(costPrice(p))}</p></>
                  )}
                </Td>
                <Td>{role === "wholesaler" ? p.moq : <span className="font-medium text-success">{marginPct(p)}%</span>}</Td>
                <Td><span className={cn("font-medium", stockOf(p) === 0 ? "text-danger" : stockOf(p) < (role === "wholesaler" ? 100 : 10) && "text-warn")}>{stockOf(p).toLocaleString()}</span></Td>
                <Td><StatusPill status={p.status} /></Td>
                <Td><Actions p={p} /></Td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Mobile cards */}
      <div className="mt-4 space-y-2 md:hidden">
        {list.map((p) => (
          <Card key={p.id} className="flex items-center gap-3 p-3">
            <Link href={`${base}/${p.id}`} className="flex min-w-0 flex-1 items-center gap-3">
              <ProductArt category={p.category} seed={+p.id.slice(1)} className="size-16 shrink-0 rounded-xl" />
              <div className="min-w-0">
                <p className="truncate font-medium">{p.name}</p>
                <p className="text-xs text-muted">{p.sku}</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="text-sm font-semibold">{role === "wholesaler" ? gbp(p.tiers[0].price) : gbp(p.retailPrice)}</span>
                  <span className={cn("text-xs", stockOf(p) === 0 ? "text-danger" : "text-muted")}>{stockOf(p)} in stock</span>
                </div>
              </div>
            </Link>
            <div className="flex flex-col items-end gap-2">
              <StatusPill status={p.status} />
              <Link href={`${base}/${p.id}/edit`} className="grid size-8 place-items-center rounded-lg bg-paper"><Pencil className="size-4" /></Link>
            </div>
          </Card>
        ))}
      </div>

      {list.length === 0 && <div className="mt-4 rounded-2xl border border-dashed border-line p-12 text-center text-muted">No products found.</div>}
    </>
  );
}
