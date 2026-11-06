"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Check, Download, FileText, Mail, MapPin, Phone, Printer, RotateCcw, Search, ShieldCheck, Truck } from "lucide-react";
import { getProduct, gbp, type Order, type OrderStatus } from "@/lib/data";
import type { PortalRole } from "@/lib/portal";
import { ProductArt } from "@/components/ui/ProductArt";
import { Button, Card, cn, Select, StatusPill } from "@/components/ui";
import { PageHeader } from "./Shell";
import { fmtDate, Tabs, Td, Th } from "./widgets";

import { ordersFor, slug } from "@/lib/orders";

export function OrdersList({ role }: { role: PortalRole }) {
  const w = role === "wholesaler";
  const all = ordersFor(role);
  const [tab, setTab] = useState<"all" | "open" | "shipped" | "done" | "cancelled">("all");
  const [q, setQ] = useState("");
  const groups: Record<string, OrderStatus[]> = { open: ["pending", "processing", "packed"], shipped: ["shipped"], done: ["delivered"], cancelled: ["cancelled", "refunded"] };
  const list = useMemo(
    () => all.filter((o) => (tab === "all" || groups[tab].includes(o.status)) && (!q || `${o.id} ${o.customer} ${o.email}`.toLowerCase().includes(q.toLowerCase()))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tab, q, all],
  );
  const c = (k: string) => all.filter((o) => groups[k].includes(o.status)).length;

  return (
    <>
      <PageHeader
        title={w ? "Trade orders" : "Shop orders"}
        sub={w ? "Bulk orders from your retailers" : "Orders from shoppers on your online shop"}
        actions={<Button variant="outline" size="sm"><Download className="size-4" /> Export</Button>}
      />
      <Tabs value={tab} onChange={setTab} items={[
        { id: "all", label: "All", count: all.length },
        { id: "open", label: "To send", count: c("open") },
        { id: "shipped", label: "Shipped", count: c("shipped") },
        { id: "done", label: "Delivered", count: c("done") },
        { id: "cancelled", label: "Cancelled", count: c("cancelled") },
      ]} />
      <div className="mt-4 flex gap-2">
        <label className="flex h-11 min-h-11 flex-1 items-center gap-2 rounded-xl border border-line bg-surface px-3.5">
          <Search className="size-4 text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={w ? "Search order or retailer" : "Search order, name or email"} className="w-full bg-transparent text-sm outline-none" />
        </label>
        <Select className="w-36 sm:w-44"><option>Last 30 days</option><option>Last 7 days</option><option>This year</option></Select>
      </div>

      <Card className="mt-4 hidden overflow-hidden md:block">
        <table className="w-full">
          <thead className="border-b border-line bg-paper/60">
            <tr><Th>Order</Th><Th>Date</Th><Th>{w ? "Retailer" : "Customer"}</Th><Th>Items</Th><Th>Payment</Th><Th>Status</Th><Th className="text-right">Total</Th></tr>
          </thead>
          <tbody className="divide-y divide-line">
            {list.map((o) => (
              <tr key={o.id} className="cursor-pointer hover:bg-paper/50">
                <Td><Link href={`/${role}/orders/${slug(o.id)}`} className="font-medium hover:underline">{o.id}</Link></Td>
                <Td className="text-muted">{fmtDate(o.date)}</Td>
                <Td>
                  <p className="flex items-center gap-1.5 font-medium">{o.customer} {o.ageVerified && <ShieldCheck className="size-3.5 text-success" />}</p>
                  <p className="text-xs text-muted">{o.city}</p>
                </Td>
                <Td className="text-muted">{o.items.reduce((s, i) => s + i.qty, 0)} units</Td>
                <Td><StatusPill status={o.payment} /></Td>
                <Td><StatusPill status={o.status} /></Td>
                <Td className="text-right font-semibold">{gbp(o.total)}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div className="mt-4 space-y-2 md:hidden">
        {list.map((o) => (
          <Link key={o.id} href={`/${role}/orders/${slug(o.id)}`}>
            <Card className="mb-2 p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold">{o.id}</p>
                <p className="font-semibold">{gbp(o.total)}</p>
              </div>
              <p className="mt-0.5 flex items-center gap-1.5 text-sm">{o.customer} {o.ageVerified && <ShieldCheck className="size-3.5 text-success" />}</p>
              <div className="mt-3 flex items-center gap-2">
                <StatusPill status={o.status} />
                <StatusPill status={o.payment} />
                <span className="ml-auto text-xs text-muted">{fmtDate(o.date)}</span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}

const flow: OrderStatus[] = ["pending", "processing", "packed", "shipped", "delivered"];

export function OrderDetail({ role, order }: { role: PortalRole; order: Order }) {
  const w = role === "wholesaler";
  const [status, setStatus] = useState(order.status);
  const idx = flow.indexOf(status);
  const next = idx >= 0 && idx < flow.length - 1 ? flow[idx + 1] : null;
  const net = w ? order.total : order.total / 1.2;
  const vat = w ? order.total * 0.2 : order.total - order.total / 1.2;
  const grand = w ? order.total * 1.2 : order.total;

  return (
    <>
      <PageHeader
        back={{ href: `/${role}/orders`, label: "Orders" }}
        title={`Order ${order.id}`}
        sub={`${new Date(order.date).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "long", year: "numeric" })} · ${order.method}`}
        actions={
          <>
            <Button variant="outline" size="sm"><Printer className="size-4" /> {w ? "Delivery note" : "Packing slip"}</Button>
            <Button variant="outline" size="sm"><FileText className="size-4" /> {w ? "VAT invoice" : "Receipt"}</Button>
            {next && <Button size="sm" onClick={() => setStatus(next)}><Check className="size-4" /> Mark as {next}</Button>}
          </>
        }
      />

      {/* Progress */}
      {status !== "cancelled" && status !== "refunded" && (
        <Card className="mb-4 p-5">
          <div className="flex items-center">
            {flow.map((s, i) => (
              <div key={s} className="flex flex-1 items-center last:flex-none">
                <div className="flex flex-col items-center gap-1.5">
                  <span className={cn("grid size-8 place-items-center rounded-full text-xs font-semibold", i <= idx ? "bg-ink text-on-ink" : "bg-ink/5 text-muted")}>{i < idx ? <Check className="size-4" /> : i + 1}</span>
                  <span className={cn("hidden text-xs capitalize sm:block", i <= idx ? "font-medium" : "text-muted")}>{s}</span>
                </div>
                {i < flow.length - 1 && <div className={cn("mx-1 h-0.5 flex-1 rounded sm:mx-2 sm:-mt-5", i < idx ? "bg-ink" : "bg-ink/10")} />}
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="grid gap-4 [&>*]:min-w-0 xl:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <Card>
            <div className="flex items-center justify-between p-5 pb-0">
              <h2 className="font-semibold">Items</h2>
              <StatusPill status={status} />
            </div>
            <ul className="divide-y divide-line p-2">
              {order.items.map((it) => {
                const p = getProduct(it.productId)!;
                return (
                  <li key={it.productId} className="flex items-center gap-3 p-3">
                    <ProductArt category={p.category} seed={+p.id.slice(1)} className="size-14 shrink-0 rounded-xl" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{p.name}</p>
                      <p className="text-xs text-muted">{p.sku} · {gbp(it.price)} {w ? "ex VAT" : ""} × {it.qty}</p>
                    </div>
                    <p className="font-semibold">{gbp(it.price * it.qty)}</p>
                  </li>
                );
              })}
            </ul>
            <dl className="space-y-2 border-t border-line p-5 text-sm">
              <div className="flex justify-between"><dt className="text-muted">Subtotal (ex VAT)</dt><dd>{gbp(net)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Delivery</dt><dd>{w ? "Free (over £250)" : "£0.00"}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">VAT 20%</dt><dd>{gbp(vat)}</dd></div>
              <div className="flex justify-between pt-2 text-base font-semibold"><dt>Total</dt><dd>{gbp(grand)}</dd></div>
            </dl>
          </Card>

          <Card className="p-5">
            <h2 className="font-semibold">Timeline</h2>
            <ol className="mt-4 space-y-4 border-l border-line pl-5 text-sm">
              {[
                status !== "pending" && ["Order confirmed", "Stock reserved", "Today, 10:42"],
                !w && ["Age verified", "Passed check via credit reference agency", "Today, 10:41"],
                ["Payment", `${order.payment} · ${order.method}`, "Today, 10:41"],
                ["Order placed", w ? "via trade portal" : "via online shop", "Today, 10:40"],
              ].filter(Boolean).map((r) => {
                const [t, d, when] = r as string[];
                return (
                  <li key={t} className="relative">
                    <span className="absolute -left-[25px] top-1 size-2.5 rounded-full bg-brand ring-4 ring-white" />
                    <p className="font-medium">{t}</p>
                    <p className="text-muted">{d} · {when}</p>
                  </li>
                );
              })}
            </ol>
            <div className="mt-5 flex gap-2">
              <input placeholder="Add a note for your team…" className="h-10 flex-1 rounded-xl border border-line px-3 text-sm outline-none focus:border-brand" />
              <Button size="sm" className="h-10">Add</Button>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <h2 className="font-semibold">{w ? "Retailer" : "Customer"}</h2>
            <div className="mt-4 flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-full bg-brand-soft font-semibold text-brand">{order.customer[0]}</div>
              <div>
                <p className="font-medium">{order.customer}</p>
                <p className="text-xs text-muted">{w ? "Gold tier · 64 orders" : "12 orders · since 2024"}</p>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <p className="flex items-center gap-2"><Mail className="size-4 text-muted" /> {order.email}</p>
              <p className="flex items-center gap-2"><Phone className="size-4 text-muted" /> 07700 900{order.id.slice(-3)}</p>
              <p className="flex items-start gap-2"><MapPin className="mt-0.5 size-4 text-muted" /> {w ? "Unit 4, Kirkstall Road" : "14 Oxford Road"}<br />{order.city}</p>
            </div>
            {!w && (
              <div className={cn("mt-4 flex items-center gap-2 rounded-xl p-3 text-sm", order.ageVerified ? "bg-success/10 text-success" : "bg-warn/10 text-warn")}>
                <ShieldCheck className="size-4" /> {order.ageVerified ? "Age verified (18+)" : "Age check pending"}
              </div>
            )}
          </Card>
          <Card className="p-5">
            <h2 className="font-semibold">Delivery</h2>
            <div className="mt-4 space-y-3">
              <Select defaultValue="dpd"><option value="dpd">DPD Next Day (18+ ID check)</option><option>Royal Mail Tracked 24 (Age verified)</option>{w && <option>Pallet – 48h</option>}</Select>
              <Button variant="outline" className="w-full"><Truck className="size-4" /> Create shipping label</Button>
            </div>
          </Card>
          <Card className="p-5">
            <h2 className="font-semibold">Payment</h2>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-muted">{order.method}</span>
              <StatusPill status={order.payment} />
            </div>
            {w && order.payment === "On account" && <p className="mt-2 text-sm text-muted">Due on {new Date(new Date(order.date).getTime() + 30 * 864e5).toLocaleDateString("en-GB")}</p>}
            <Button variant="ghost" size="sm" className="mt-3 text-danger"><RotateCcw className="size-4" /> Refund</Button>
          </Card>
        </div>
      </div>
    </>
  );
}
