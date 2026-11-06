"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Minus, Plus, RotateCcw, Search, ShoppingCart, X } from "lucide-react";
import { categories, gbp, getProduct, products, purchaseOrders, type Product } from "@/lib/data";
import { ProductArt } from "@/components/ui/ProductArt";
import { Badge, Button, ButtonLink, Card, cn, Select, StatusPill } from "@/components/ui";
import { PageHeader } from "./Shell";
import { fmtDate, Td, Th } from "./widgets";

const GOLD = 0.9; // Gold tier gets an extra 10% off

export const unitPrice = (p: Product, qty: number) => {
  const tier = [...p.tiers].reverse().find((t) => qty >= t.minQty) ?? p.tiers[0];
  return +(tier.price * GOLD).toFixed(2);
};

export function Restock() {
  const sp = useSearchParams();
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cat, setCat] = useState("all");
  const [q, setQ] = useState("");
  const [sheet, setSheet] = useState(false);
  const [placed, setPlaced] = useState(false);

  useEffect(() => {
    const id = sp.get("add");
    const p = id && getProduct(id);
    if (p) setCart((c) => ({ ...c, [p.id]: c[p.id] ?? p.moq }));
  }, [sp]);

  const list = products.filter((p) => p.status !== "draft" && (cat === "all" || p.category === cat) && (!q || `${p.name} ${p.sku}`.toLowerCase().includes(q.toLowerCase())));
  const lines = Object.entries(cart).map(([id, qty]) => ({ p: getProduct(id)!, qty }));
  const net = useMemo(() => lines.reduce((s, l) => s + unitPrice(l.p, l.qty) * l.qty, 0), [lines]);
  const units = lines.reduce((s, l) => s + l.qty, 0);
  const setQty = (p: Product, qty: number) =>
    setCart((c) => {
      const n = { ...c };
      if (qty < p.moq) delete n[p.id];
      else n[p.id] = qty;
      return n;
    });

  const Basket = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Trade basket</h2>
        <span className="text-sm text-muted">{units} units</span>
      </div>
      {lines.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-line p-6 text-center text-sm text-muted">Add products to build your order.</p>
      ) : (
        <ul className="mt-4 flex-1 space-y-3 overflow-y-auto">
          {lines.map(({ p, qty }) => (
            <li key={p.id} className="flex items-center gap-3">
              <ProductArt category={p.category} seed={+p.id.slice(1)} className="size-11 shrink-0 rounded-lg" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{p.name}</p>
                <p className="text-xs text-muted">{qty} × {gbp(unitPrice(p, qty))}</p>
              </div>
              <p className="text-sm font-semibold">{gbp(unitPrice(p, qty) * qty)}</p>
              <button onClick={() => setQty(p, 0)} className="text-muted hover:text-danger" aria-label="Remove"><X className="size-4" /></button>
            </li>
          ))}
        </ul>
      )}
      <dl className="mt-4 space-y-1.5 border-t border-line pt-4 text-sm">
        <div className="flex justify-between"><dt className="text-muted">Subtotal (ex VAT)</dt><dd>{gbp(net)}</dd></div>
        <div className="flex justify-between"><dt className="text-muted">VAT 20%</dt><dd>{gbp(net * 0.2)}</dd></div>
        <div className="flex justify-between"><dt className="text-muted">Delivery</dt><dd>{net >= 250 || net === 0 ? "Free" : gbp(9.95)}</dd></div>
        <div className="flex justify-between pt-1 text-base font-semibold"><dt>Total</dt><dd>{gbp(net * 1.2 + (net > 0 && net < 250 ? 9.95 : 0))}</dd></div>
      </dl>
      <Select className="mt-4" defaultValue="account"><option value="account">Pay on account (30 days) · £9,132 available</option><option>Pay by card now</option><option>Bank transfer (pro-forma)</option></Select>
      <Button size="lg" className="mt-3 w-full" disabled={lines.length === 0} onClick={() => { setPlaced(true); setCart({}); setSheet(false); }}>Place trade order</Button>
      {net > 0 && net < 250 && <p className="mt-2 text-center text-xs text-muted">Add {gbp(250 - net)} more for free delivery</p>}
    </div>
  );

  return (
    <>
      <PageHeader title="Buy wholesale" sub="Trade catalogue from Nimbus Wholesale. Your Gold tier prices are shown, ex VAT." actions={<ButtonLink href="/retailer/purchases" variant="outline" size="sm"><RotateCcw className="size-4" /> Reorder last order</ButtonLink>} />

      {placed && (
        <div className="mb-4 flex items-center gap-3 rounded-2xl bg-success/10 p-4 text-success">
          <CheckCircle2 className="size-5" />
          <p className="flex-1 text-sm"><b>Order PO-3302 placed.</b> It will be sent today if placed before 4pm.</p>
          <button onClick={() => setPlaced(false)} aria-label="Dismiss"><X className="size-4" /></button>
        </div>
      )}

      <div className="grid gap-4 [&>*]:min-w-0 xl:grid-cols-[1fr_360px]">
        <div className="min-w-0">
          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="flex h-11 min-h-11 flex-1 items-center gap-2 rounded-xl border border-line bg-surface px-3.5">
              <Search className="size-4 text-muted" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search trade catalogue" className="w-full bg-transparent text-sm outline-none" />
            </label>
            <Select value={cat} onChange={(e) => setCat(e.target.value)} className="sm:w-48">
              <option value="all">All categories</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          </div>

          <div className="mt-4 space-y-2">
            {list.map((p) => {
              const qty = cart[p.id] ?? 0;
              const oos = p.status === "out_of_stock";
              return (
                <Card key={p.id} className={cn("p-3 sm:p-4", qty > 0 && "border-brand ring-2 ring-brand/15")}>
                  <div className="flex items-center gap-3">
                    <ProductArt category={p.category} seed={+p.id.slice(1)} className="size-16 shrink-0 rounded-xl" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <p className="truncate font-medium">{p.name}</p>
                        {p.badge === "Trade deal" && <Badge tone="dark">Trade deal</Badge>}
                        {oos && <Badge tone="danger">Out of stock</Badge>}
                      </div>
                      <p className="text-xs text-muted">{p.sku} · MOQ {p.moq} · RRP {gbp(p.retailPrice)}</p>
                      <div className="mt-1.5 hidden gap-1.5 sm:flex">
                        {p.tiers.map((t) => (
                          <span key={t.minQty} className={cn("rounded-md px-2 py-0.5 text-xs", qty >= t.minQty && unitPrice(p, qty) === +(t.price * GOLD).toFixed(2) ? "bg-brand text-white" : "bg-paper text-muted")}>
                            {t.minQty}+ {gbp(t.price * GOLD)}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <p className="text-sm font-semibold">{gbp(unitPrice(p, Math.max(qty, p.moq)))}<span className="text-xs font-normal text-muted">/u</span></p>
                      {!(p.id in cart) ? (
                        <Button size="sm" variant="soft" disabled={oos} onClick={() => setQty(p, p.moq)}><Plus className="size-4" /><span className="hidden sm:inline">Add {p.moq}</span></Button>
                      ) : (
                        <div className="flex items-center rounded-full border border-line bg-surface">
                          <button className="grid size-8 place-items-center" onClick={() => setQty(p, qty - p.moq)} aria-label="Less"><Minus className="size-3.5" /></button>
                          <input value={qty} onChange={(e) => setCart((c) => ({ ...c, [p.id]: +e.target.value.replace(/\D/g, "") || 0 }))} onBlur={() => setQty(p, Math.max(qty, p.moq))} className="w-12 bg-transparent text-center text-sm font-medium outline-none" />
                          <button className="grid size-8 place-items-center" onClick={() => setQty(p, qty + p.moq)} aria-label="More"><Plus className="size-3.5" /></button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        <aside className="hidden xl:block">
          <Card className="sticky top-24 max-h-[calc(100dvh-7rem)] p-5">{Basket}</Card>
        </aside>
      </div>

      {/* Mobile/tablet basket bar */}
      {lines.length > 0 && (
        <button onClick={() => setSheet(true)} className="fixed inset-x-4 bottom-20 z-30 flex items-center gap-3 rounded-2xl bg-brand-gradient p-4 text-white shadow-2xl xl:hidden">
          <ShoppingCart className="size-5 text-accent" />
          <span className="text-sm">{units} units · {lines.length} lines</span>
          <span className="ml-auto font-semibold">{gbp(net)} <span className="text-xs font-normal text-white/60">ex VAT</span></span>
        </button>
      )}
      {sheet && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setSheet(false)} />
          <div className="animate-slide-up pb-safe absolute inset-x-0 bottom-0 max-h-[88dvh] overflow-y-auto rounded-t-3xl bg-surface p-5">
            <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-ink/15" />
            {Basket}
          </div>
        </div>
      )}
    </>
  );
}

export function Purchases() {
  return (
    <>
      <PageHeader title="Purchase orders" sub="Stock you've bought from your wholesaler" actions={<ButtonLink href="/retailer/restock" size="sm"><Plus className="size-4" /> New order</ButtonLink>} />
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4"><p className="text-sm text-muted">Spent this year</p><p className="mt-1 text-xl font-semibold">£48,210</p></Card>
        <Card className="p-4"><p className="text-sm text-muted">On account</p><p className="mt-1 text-xl font-semibold">{gbp(868)}</p></Card>
        <Card className="p-4"><p className="text-sm text-muted">Saved vs RRP</p><p className="mt-1 text-xl font-semibold text-success">£31,940</p></Card>
      </div>
      <Card className="mt-4 hidden overflow-hidden md:block">
        <table className="w-full">
          <thead className="border-b border-line bg-paper/60"><tr><Th>PO</Th><Th>Date</Th><Th>Supplier</Th><Th>Units</Th><Th>Status</Th><Th>Payment</Th><Th className="text-right">Total</Th><Th /></tr></thead>
          <tbody className="divide-y divide-line">
            {purchaseOrders.map((o) => (
              <tr key={o.id} className="hover:bg-paper/50">
                <Td className="font-medium">{o.id}</Td>
                <Td className="text-muted">{fmtDate(o.date)}</Td>
                <Td>{o.supplier}</Td>
                <Td className="text-muted">{o.units} ({o.lines} lines)</Td>
                <Td><StatusPill status={o.status} /></Td>
                <Td><StatusPill status={o.payment} />{o.due !== "—" && <p className="mt-1 text-xs text-muted">Due {fmtDate(o.due)}</p>}</Td>
                <Td className="text-right font-semibold">{gbp(o.total)}</Td>
                <Td className="text-right"><div className="flex justify-end gap-1"><Button size="sm" variant="ghost">Invoice</Button><ButtonLink href="/retailer/restock?add=p1" size="sm" variant="soft">Reorder</ButtonLink></div></Td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <div className="mt-4 space-y-2 md:hidden">
        {purchaseOrders.map((o) => (
          <Card key={o.id} className="p-4">
            <div className="flex justify-between"><p className="font-semibold">{o.id}</p><p className="font-semibold">{gbp(o.total)}</p></div>
            <p className="text-sm text-muted">{fmtDate(o.date)} · {o.units} units</p>
            <div className="mt-3 flex items-center gap-2">
              <StatusPill status={o.status} /><StatusPill status={o.payment} />
              <ButtonLink href="/retailer/restock?add=p1" size="sm" variant="soft" className="ml-auto h-8">Reorder</ButtonLink>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
