"use client";

import Link from "next/link";
import { AlertTriangle, ArrowRight, Banknote, Boxes, FileUp, Package, Plus, ReceiptText, ShieldCheck, ShoppingCart, TrendingUp, Users, Wallet } from "lucide-react";
import { gbp, products, retailOrders, salesSeries, tradeAccounts, tradeOrders } from "@/lib/data";
import { ProductArt } from "@/components/ui/ProductArt";
import { ButtonLink, Card, Select, StatusPill } from "@/components/ui";
import { PageHeader } from "./Shell";
import { fmtDate } from "./widgets";
import { AreaChart, ChartCard, Donut, Gauge, GradientBars, gradientCss, KpiCard, Legend, Ring } from "./charts";

const lastYear = (s: number[]) => s.map((v, i) => Math.round(v * (0.72 + ((i * 7) % 5) / 30)));

function CardHead({ title, href, label = "View all" }: { title: string; href?: string; label?: string }) {
  return (
    <div className="flex items-center justify-between px-5 pt-5">
      <h2 className="font-semibold">{title}</h2>
      {href && <Link href={href} className="text-sm font-medium text-brand">{label}</Link>}
    </div>
  );
}

const Avatar = ({ name, i }: { name: string; i: number }) => (
  <div className="grid size-10 shrink-0 place-items-center rounded-full text-sm font-semibold text-white" style={{ background: gradientCss((["brand", "aqua", "sunset", "grape", "gold"] as const)[i % 5]) }}>
    {name[0]}
  </div>
);

const RangeSelect = () => (
  <Select className="h-8 w-auto rounded-full py-0 pl-3 pr-8 text-xs"><option>12 months</option><option>6 months</option><option>30 days</option></Select>
);

export function WholesalerDashboard() {
  const lowStock = products.filter((p) => p.stock < 100).slice(0, 3);
  const pending = tradeAccounts.filter((a) => a.status === "pending");
  return (
    <>
      <PageHeader
        title="Good evening, Nishan"
        sub="Here's how your wholesale business is doing this month."
        actions={
          <>
            <ButtonLink href="/wholesaler/price-list" variant="outline" size="sm"><FileUp className="size-4" /> Upload price list</ButtonLink>
            <ButtonLink href="/wholesaler/products/new" size="sm"><Plus className="size-4" /> Add product</ButtonLink>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <KpiCard label="Trade revenue (Nov)" value="£10,420" delta={18} icon={TrendingUp} gradient="brand" spark={salesSeries.wholesale} />
        <KpiCard label="Open orders" value="3" delta={-4} icon={Package} gradient="sunset" spark={[5, 7, 4, 6, 8, 5, 3]} />
        <KpiCard label="Active retailers" value="58" delta={6} icon={Users} gradient="aqua" spark={[40, 42, 45, 47, 50, 54, 58]} />
        <KpiCard label="Unpaid invoices" value={gbp(1306)} icon={ReceiptText} gradient="grape" spark={[900, 1400, 1100, 1600, 1200, 1306]} />
      </div>

      <div className="mt-4 grid gap-4 [&>*]:min-w-0 xl:grid-cols-3">
        <ChartCard
          className="xl:col-span-2"
          title="Trade revenue"
          sub="This year vs last year"
          action={<RangeSelect />}
        >
          <Legend items={[{ label: "This year", color: "var(--brand-base)" }, { label: "Last year", color: "#ff7a45", dashed: true }]} />
          <div className="mt-4"><AreaChart data={salesSeries.wholesale} compare={lastYear(salesSeries.wholesale)} labels={salesSeries.months} /></div>
        </ChartCard>
        <ChartCard title="Sales by category" sub="Share of revenue, Nov">
          <Donut center="£10.4k" sub="this month" items={[
            { label: "Nic Salts", value: 38 }, { label: "Pod Kits", value: 24 }, { label: "E-Liquids", value: 18 },
            { label: "Pods & Coils", value: 11 }, { label: "Mods & Tanks", value: 6 }, { label: "Accessories", value: 3 },
          ]} />
        </ChartCard>
      </div>

      <div className="mt-4 grid gap-4 [&>*]:min-w-0 lg:grid-cols-2 xl:grid-cols-3">
        <ChartCard title="Monthly target" sub="£14,500 goal for November">
          <Gauge value={72} label="£10,420 of £14,500" sub="13 trading days left" />
        </ChartCard>
        <ChartCard title="Performance">
          <div className="grid grid-cols-3 gap-2 pt-2">
            <Ring value={94} label="On-time dispatch" gradient="aqua" />
            <Ring value={81} label="Repeat retailers" gradient="brand" />
            <Ring value={67} label="Paid on time" gradient="sunset" />
          </div>
          <div className="mt-5 rounded-xl p-3 text-sm text-white" style={{ background: gradientCss("grape", 90) }}>
            <b>Tip:</b> 1 invoice is overdue. Send a reminder from Payments.
          </div>
        </ChartCard>
        <ChartCard title="Top retailers" sub="Spend this year" className="lg:col-span-2 xl:col-span-1" action={<Link href="/wholesaler/retailers" className="text-sm font-medium text-brand">All</Link>}>
          <GradientBars format={(n) => gbp(n).replace(".00", "")} items={tradeAccounts.filter((a) => a.status === "approved").slice(0, 4).map((a) => ({ label: a.business, value: a.spend }))} />
        </ChartCard>
      </div>

      <div className="mt-4 grid gap-4 [&>*]:min-w-0 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHead title="Latest trade orders" href="/wholesaler/orders" />
          <ul className="divide-y divide-line p-2">
            {tradeOrders.slice(0, 5).map((o, i) => (
              <li key={o.id}>
                <Link href={`/wholesaler/orders/${o.id}`} className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-ink/[0.03]">
                  <Avatar name={o.customer} i={i} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{o.customer}</p>
                    <p className="text-xs text-muted">{o.id} · {fmtDate(o.date)} · {o.items.reduce((s, x) => s + x.qty, 0)} units</p>
                  </div>
                  <div className="hidden sm:block"><StatusPill status={o.status} /></div>
                  <p className="w-20 text-right text-sm font-semibold">{gbp(o.total)}</p>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Retailer applications</h2>
              <span className="rounded-full px-2 text-xs font-bold text-white" style={{ background: gradientCss("sunset") }}>{pending.length}</span>
            </div>
            {pending.map((a) => (
              <div key={a.id} className="mt-4 rounded-xl bg-paper p-3">
                <p className="text-sm font-medium">{a.business}</p>
                <p className="text-xs text-muted">{a.city} · VAT {a.vat}</p>
                <div className="mt-3 flex gap-2">
                  <button className="h-8 flex-1 rounded-full bg-brand-gradient text-xs font-medium text-white">Approve</button>
                  <Link href="/wholesaler/retailers" className="grid h-8 flex-1 place-items-center rounded-full border border-line bg-surface text-xs font-medium">Review</Link>
                </div>
              </div>
            ))}
          </Card>
          <Card>
            <CardHead title="Low stock" href="/wholesaler/products" />
            <ul className="space-y-3 p-5 pt-4">
              {lowStock.map((p) => (
                <li key={p.id} className="flex items-center gap-3">
                  <ProductArt category={p.category} seed={+p.id.slice(1)} className="size-11 shrink-0 rounded-lg" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{p.name}</p>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-ink/5"><div className="h-full rounded-full" style={{ width: `${Math.max(4, p.stock)}%`, background: gradientCss(p.stock === 0 ? "sunset" : "gold", 90) }} /></div>
                  </div>
                  <span className={`text-sm font-semibold ${p.stock === 0 ? "text-danger" : "text-warn"}`}>{p.stock === 0 ? "Out" : p.stock}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}

export function RetailerDashboard() {
  const toFulfil = retailOrders.filter((o) => o.status === "pending" || o.status === "processing");
  const low = products.filter((p) => p.stock < 150).slice(0, 3);
  const acct = tradeAccounts[0];
  const shop = salesSeries.retail.map((v) => v * 10);
  return (
    <>
      <PageHeader
        title="Hi Jordan 👋"
        sub="Cloud Nine Vapes · Leeds. Your shop at a glance."
        actions={
          <>
            <ButtonLink href="/retailer/restock" variant="soft" size="sm"><ShoppingCart className="size-4" /> Buy wholesale</ButtonLink>
            <ButtonLink href="/retailer/products/new" size="sm"><Plus className="size-4" /> Add product</ButtonLink>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <KpiCard label="Sales today" value="£482.60" delta={12} icon={TrendingUp} gradient="brand" spark={[220, 310, 280, 390, 360, 482]} />
        <KpiCard label="Orders to send" value={String(toFulfil.length)} icon={Package} gradient="sunset" spark={[4, 3, 6, 2, 5, 2]} />
        <KpiCard label="Stock value (cost)" value="£14,210" delta={3} icon={Boxes} gradient="aqua" spark={[12, 13, 12.5, 14, 13.6, 14.2]} />
        <KpiCard label="Next payout" value="£1,318.40" icon={Banknote} gradient="grape" spark={[900, 1100, 980, 1240, 1180, 1318]} />
      </div>

      <div className="mt-4 grid gap-4 [&>*]:min-w-0 xl:grid-cols-3">
        <ChartCard className="xl:col-span-2" title="Shop sales" sub="Online + in-store" action={<RangeSelect />}>
          <Legend items={[{ label: "This year", color: "var(--brand-base)" }, { label: "Last year", color: "#ff7a45", dashed: true }]} />
          <div className="mt-4"><AreaChart data={shop} compare={lastYear(shop)} labels={salesSeries.months} /></div>
        </ChartCard>
        <ChartCard title="How shoppers pay" sub="Last 30 days">
          <Donut center="412" sub="orders" items={[
            { label: "Card", value: 46 }, { label: "Apple Pay", value: 24 }, { label: "Google Pay", value: 12 },
            { label: "PayPal", value: 10 }, { label: "Pay in 3", value: 8 },
          ]} />
        </ChartCard>
      </div>

      <div className="mt-4 grid gap-4 [&>*]:min-w-0 lg:grid-cols-2 xl:grid-cols-3">
        <ChartCard title="Trade credit" sub={`${acct.tier} tier · Nimbus Wholesale`}>
          <Gauge value={Math.round((acct.balance / acct.creditLimit) * 100)} label={`${gbp(acct.balance)} of ${gbp(acct.creditLimit).replace(".00", "")} used`} sub="Next invoice due 6 Dec" />
          <ButtonLink href="/retailer/purchases" variant="outline" size="sm" className="mt-4 w-full">View purchase orders</ButtonLink>
        </ChartCard>
        <ChartCard title="Shop health">
          <div className="grid grid-cols-3 gap-2 pt-2">
            <Ring value={98} label="Age checks passed" gradient="aqua" />
            <Ring value={62} label="Repeat customers" gradient="brand" />
            <Ring value={88} label="Sent same day" gradient="sunset" />
          </div>
        </ChartCard>
        <ChartCard title="Best sellers" sub="Units this month" className="lg:col-span-2 xl:col-span-1">
          <GradientBars items={[
            { label: "Blue Razz Ice 10ml", value: 142 }, { label: "Aerolux Flow Pods", value: 96 },
            { label: "Mango Ice Shortfill", value: 74 }, { label: "Aerolux Flow Pod Kit", value: 41 },
          ]} format={(n) => `${n} sold`} />
        </ChartCard>
      </div>

      <div className="mt-4 grid gap-4 [&>*]:min-w-0 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHead title="Orders to send" href="/retailer/orders" />
          <ul className="divide-y divide-line p-2">
            {retailOrders.slice(0, 5).map((o, i) => (
              <li key={o.id}>
                <Link href={`/retailer/orders/${o.id.replace("#", "")}`} className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-ink/[0.03]">
                  <Avatar name={o.customer} i={i} />
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1.5 truncate text-sm font-medium">{o.customer} {o.ageVerified && <ShieldCheck className="size-3.5 text-success" />}</p>
                    <p className="text-xs text-muted">{o.id} · {fmtDate(o.date)} · {o.method}</p>
                  </div>
                  <div className="hidden sm:block"><StatusPill status={o.status} /></div>
                  <p className="w-16 text-right text-sm font-semibold">{gbp(o.total)}</p>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-5">
          <h2 className="flex items-center gap-2 font-semibold"><AlertTriangle className="size-4 text-warn" /> Running low</h2>
          <ul className="mt-4 space-y-3">
            {low.map((p) => (
              <li key={p.id} className="flex items-center gap-3">
                <ProductArt category={p.category} seed={+p.id.slice(1)} className="size-11 shrink-0 rounded-lg" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-muted">{Math.round(p.stock / 20)} in shop · trade {gbp(p.tiers[0].price)}</p>
                </div>
              </li>
            ))}
          </ul>
          <ButtonLink href="/retailer/restock" size="sm" className="mt-5 w-full">Restock now <ArrowRight className="size-4" /></ButtonLink>
          <div className="mt-4 flex items-center gap-3 rounded-xl p-3 text-sm text-white" style={{ background: gradientCss("aqua", 90) }}>
            <Wallet className="size-5 shrink-0" /> Payouts every Friday to Barclays •• 2201
          </div>
        </Card>
      </div>
    </>
  );
}
