"use client";

import { useState } from "react";
import { CalendarClock, Download, FileUp, Percent, Search } from "lucide-react";
import { categories, gbp, products } from "@/lib/data";
import type { PortalRole } from "@/lib/portal";
import { Button, Card, cn, Select } from "@/components/ui";
import { PageHeader } from "./Shell";
import { costPrice } from "@/lib/pricing";

const cell = "w-24 rounded-lg border border-transparent bg-transparent px-2 py-1.5 text-right text-sm outline-none hover:border-line focus:border-brand focus:bg-surface";

export function PriceList({ role }: { role: PortalRole }) {
  const w = role === "wholesaler";
  const initial = () =>
    products.map((p) => ({ id: p.id, sku: p.sku, name: p.name, cat: p.category, moq: p.moq, rrp: p.retailPrice, t: p.tiers.map((x) => x.price), cost: costPrice(p), retail: p.retailPrice }));
  const [rows, setRows] = useState(initial);
  const [dirty, setDirty] = useState<string[]>([]);
  const [adj, setAdj] = useState(5);
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");

  const mark = (id: string) => setDirty((d) => (d.includes(id) ? d : [...d, id]));
  const shown = rows.filter((r) => (cat === "all" || r.cat === cat) && (!q || `${r.name} ${r.sku}`.toLowerCase().includes(q.toLowerCase())));

  const bulk = (dir: 1 | -1) => {
    const f = 1 + (dir * adj) / 100;
    setRows((rs) => rs.map((r) => (shown.some((s) => s.id === r.id) ? (w ? { ...r, t: r.t.map((x) => +(x * f).toFixed(2)) } : { ...r, retail: +(r.retail * f).toFixed(2) }) : r)));
    setDirty(shown.map((s) => s.id));
  };

  return (
    <>
      <PageHeader
        title={w ? "Trade price list" : "Retail price list"}
        sub={w ? "Prices are ex VAT. Changes reach retailers when you publish." : "Your shelf and online prices, inc VAT."}
        actions={
          <>
            <Button variant="outline" size="sm"><FileUp className="size-4" /> Import CSV</Button>
            <Button variant="outline" size="sm"><Download className="size-4" /> {w ? "PDF / CSV" : "Export"}</Button>
          </>
        }
      />

      <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
        <div className="flex flex-col gap-2 sm:flex-row">
          <label className="flex h-11 min-h-11 flex-1 items-center gap-2 rounded-xl border border-line bg-surface px-3.5">
            <Search className="size-4 text-muted" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products" className="w-full bg-transparent text-sm outline-none" />
          </label>
          <Select value={cat} onChange={(e) => setCat(e.target.value)} className="sm:w-48">
            <option value="all">All categories</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-line bg-surface p-1.5 pl-3">
          <Percent className="size-4 text-muted" />
          <span className="text-sm text-muted">Adjust shown by</span>
          <input type="number" value={adj} onChange={(e) => setAdj(+e.target.value)} className="w-12 rounded-md bg-paper px-1.5 py-1 text-center text-sm outline-none" />
          <span className="text-sm text-muted">%</span>
          <Button size="sm" variant="soft" className="h-8" onClick={() => bulk(1)}>+ Raise</Button>
          <Button size="sm" variant="outline" className="h-8" onClick={() => bulk(-1)}>− Lower</Button>
        </div>
      </div>

      <Card className="mt-4 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="border-b border-line bg-paper/60 text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="sticky left-0 bg-paper px-4 py-3 text-left font-medium">Product</th>
                {w ? (
                  <>
                    <th className="px-2 py-3 text-right font-medium">MOQ</th>
                    <th className="px-2 py-3 text-right font-medium">Tier 1</th>
                    <th className="px-2 py-3 text-right font-medium">Tier 2</th>
                    <th className="px-2 py-3 text-right font-medium">Tier 3</th>
                    <th className="px-4 py-3 text-right font-medium">RRP</th>
                  </>
                ) : (
                  <>
                    <th className="px-2 py-3 text-right font-medium">Cost</th>
                    <th className="px-2 py-3 text-right font-medium">RRP</th>
                    <th className="px-2 py-3 text-right font-medium">Your price</th>
                    <th className="px-4 py-3 text-right font-medium">Margin</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {shown.map((r) => {
                const margin = Math.round(((r.retail / 1.2 - r.cost) / (r.retail / 1.2)) * 100);
                return (
                  <tr key={r.id} className={cn(dirty.includes(r.id) && "bg-accent/10")}>
                    <td className="sticky left-0 bg-surface px-4 py-2">
                      <p className="font-medium">{r.name}</p>
                      <p className="text-xs text-muted">{r.sku}</p>
                    </td>
                    {w ? (
                      <>
                        <td className="px-2 py-2 text-right">
                          <input type="number" className={cn(cell, "w-16")} value={r.moq} onChange={(e) => { setRows(rows.map((x) => (x.id === r.id ? { ...x, moq: +e.target.value } : x))); mark(r.id); }} />
                        </td>
                        {r.t.map((price, i) => (
                          <td key={i} className="px-2 py-2 text-right">
                            <input
                              type="number"
                              step="0.01"
                              className={cell}
                              value={price}
                              onChange={(e) => { setRows(rows.map((x) => (x.id === r.id ? { ...x, t: x.t.map((y, j) => (j === i ? +e.target.value : y)) } : x))); mark(r.id); }}
                            />
                          </td>
                        ))}
                        <td className="px-4 py-2 text-right text-muted">{gbp(r.rrp)}</td>
                      </>
                    ) : (
                      <>
                        <td className="px-2 py-2 text-right text-muted">{gbp(r.cost)}</td>
                        <td className="px-2 py-2 text-right text-muted">{gbp(r.rrp)}</td>
                        <td className="px-2 py-2 text-right">
                          <input type="number" step="0.01" className={cell} value={r.retail} onChange={(e) => { setRows(rows.map((x) => (x.id === r.id ? { ...x, retail: +e.target.value } : x))); mark(r.id); }} />
                        </td>
                        <td className={cn("px-4 py-2 text-right font-medium", margin >= 40 ? "text-success" : margin >= 20 ? "text-warn" : "text-danger")}>{margin}%</td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <div className={cn("sticky bottom-20 z-10 mt-4 flex flex-wrap items-center gap-3 rounded-2xl bg-night p-3 pl-5 text-white ring-1 ring-white/10 shadow-xl transition lg:bottom-4", dirty.length === 0 && "pointer-events-none translate-y-4 opacity-0")}>
        <p className="text-sm">{dirty.length} price{dirty.length !== 1 && "s"} changed</p>
        {w && (
          <label className="ml-auto flex items-center gap-2 text-sm text-white/70">
            <CalendarClock className="size-4" /> Effective
            <input type="date" defaultValue="2026-11-09" className="rounded-md bg-white/10 px-2 py-1 text-white outline-none" />
          </label>
        )}
        <div className={cn("flex gap-2", !w && "ml-auto")}>
          <Button size="sm" className="bg-white/10" onClick={() => { setRows(initial()); setDirty([]); }}>Discard</Button>
          <Button size="sm" variant="accent" onClick={() => setDirty([])}>{w ? "Publish & notify retailers" : "Save prices"}</Button>
        </div>
      </div>
    </>
  );
}
