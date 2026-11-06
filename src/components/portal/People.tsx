"use client";

import { useState } from "react";
import { Building2, Check, Download, Mail, Search, ShieldCheck, UserPlus, X } from "lucide-react";
import { gbp, retailCustomers, tradeAccounts, type TradeAccount } from "@/lib/data";
import { Badge, Button, Card, cn, Field, Input, Select, StatusPill } from "@/components/ui";
import { PageHeader } from "./Shell";
import { fmtDate, Tabs, Td, Th } from "./widgets";

const tierTone = { Gold: "bg-warn/15 text-warn", Silver: "bg-ink/10 text-ink/70", Bronze: "bg-orange-500/15 text-orange-600 dark:text-orange-300" };

export function Retailers() {
  const [tab, setTab] = useState<"all" | "approved" | "pending" | "suspended">("all");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<TradeAccount | null>(null);
  const list = tradeAccounts.filter((a) => (tab === "all" || a.status === tab) && (!q || `${a.business} ${a.contact} ${a.city}`.toLowerCase().includes(q.toLowerCase())));
  const c = (s: string) => tradeAccounts.filter((a) => a.status === s).length;

  return (
    <>
      <PageHeader
        title="Retailers"
        sub="Shops with a trade account. Approve applications and set tiers and credit."
        actions={<><Button variant="outline" size="sm"><Download className="size-4" /> Export</Button><Button size="sm"><UserPlus className="size-4" /> Invite retailer</Button></>}
      />
      <Tabs value={tab} onChange={setTab} items={[
        { id: "all", label: "All", count: tradeAccounts.length },
        { id: "approved", label: "Approved", count: c("approved") },
        { id: "pending", label: "Applications", count: c("pending") },
        { id: "suspended", label: "Suspended", count: c("suspended") },
      ]} />
      <label className="mt-4 flex h-11 items-center gap-2 rounded-xl border border-line bg-surface px-3.5">
        <Search className="size-4 text-muted" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search business, contact or city" className="w-full bg-transparent text-sm outline-none" />
      </label>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((a) => (
          <Card key={a.id} className="flex flex-col p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="grid size-11 place-items-center rounded-xl bg-brand-soft text-brand"><Building2 className="size-5" /></div>
                <div>
                  <p className="font-semibold">{a.business}</p>
                  <p className="text-xs text-muted">{a.contact} · {a.city}</p>
                </div>
              </div>
              <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", tierTone[a.tier])}>{a.tier}</span>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-paper p-3 text-sm">
              <div><p className="text-xs text-muted">Spend</p><p className="font-semibold">{gbp(a.spend).replace(".00", "")}</p></div>
              <div><p className="text-xs text-muted">Orders</p><p className="font-semibold">{a.orders}</p></div>
              <div><p className="text-xs text-muted">Owes</p><p className={cn("font-semibold", a.balance > 0 && "text-warn")}>{gbp(a.balance).replace(".00", "")}</p></div>
            </div>
            {a.creditLimit > 0 && (
              <div className="mt-3">
                <div className="flex justify-between text-xs text-muted"><span>Credit used</span><span>{gbp(a.creditLimit).replace(".00", "")} limit</span></div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-ink/5"><div className="h-full rounded-full bg-brand" style={{ width: `${Math.min(100, (a.balance / a.creditLimit) * 100)}%` }} /></div>
              </div>
            )}
            <div className="mt-4 flex items-center gap-2 pt-1">
              <StatusPill status={a.status} />
              <div className="ml-auto flex gap-2">
                {a.status === "pending" ? (
                  <>
                    <Button size="sm" variant="outline" className="h-8"><X className="size-3.5" /> Decline</Button>
                    <Button size="sm" className="h-8"><Check className="size-3.5" /> Approve</Button>
                  </>
                ) : (
                  <Button size="sm" variant="outline" className="h-8" onClick={() => setOpen(a)}>Manage</Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setOpen(null)} />
          <aside className="animate-slide-in-right absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-paper">
            <div className="flex h-16 items-center justify-between border-b border-line px-5">
              <h2 className="font-semibold">{open.business}</h2>
              <button onClick={() => setOpen(null)} className="grid size-9 place-items-center rounded-full hover:bg-ink/5" aria-label="Close"><X className="size-5" /></button>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              <Card className="space-y-2 p-4 text-sm">
                <p className="flex justify-between"><span className="text-muted">Contact</span>{open.contact}</p>
                <p className="flex justify-between"><span className="text-muted">Email</span>{open.email}</p>
                <p className="flex justify-between"><span className="text-muted">VAT</span>{open.vat}</p>
                <p className="flex justify-between"><span className="text-muted">Customer since</span>{fmtDate(open.joined)} {open.joined.slice(0, 4)}</p>
              </Card>
              <Field label="Pricing tier">
                <Select defaultValue={open.tier}><option>Bronze</option><option>Silver</option><option>Gold</option></Select>
              </Field>
              <Field label="Credit limit (£)"><Input type="number" defaultValue={open.creditLimit} /></Field>
              <Field label="Payment terms">
                <Select defaultValue="30"><option value="0">Pay before dispatch</option><option value="14">14 days</option><option value="30">30 days</option></Select>
              </Field>
              <Field label="Extra discount (%)" hint="On top of their tier"><Input type="number" defaultValue={0} /></Field>
              <Field label="Account status">
                <Select defaultValue={open.status}><option value="approved">Approved</option><option value="suspended">Suspended</option></Select>
              </Field>
            </div>
            <div className="pb-safe flex gap-2 border-t border-line bg-surface p-4">
              <Button variant="outline" className="flex-1"><Mail className="size-4" /> Email</Button>
              <Button className="flex-1" onClick={() => setOpen(null)}>Save</Button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

export function Customers() {
  const [q, setQ] = useState("");
  const list = retailCustomers.filter((c) => !q || `${c.name} ${c.email} ${c.city}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <PageHeader title="Customers" sub={`${retailCustomers.length} shoppers have bought from your shop`} actions={<Button variant="outline" size="sm"><Download className="size-4" /> Export</Button>} />
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4"><p className="text-sm text-muted">Customers</p><p className="mt-1 text-xl font-semibold">1,284</p></Card>
        <Card className="p-4"><p className="text-sm text-muted">Repeat rate</p><p className="mt-1 text-xl font-semibold">62%</p></Card>
        <Card className="p-4"><p className="text-sm text-muted">Avg. order</p><p className="mt-1 text-xl font-semibold">£32.40</p></Card>
      </div>
      <label className="mt-4 flex h-11 items-center gap-2 rounded-xl border border-line bg-surface px-3.5">
        <Search className="size-4 text-muted" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, email or town" className="w-full bg-transparent text-sm outline-none" />
      </label>
      <Card className="mt-4 hidden overflow-hidden md:block">
        <table className="w-full">
          <thead className="border-b border-line bg-paper/60"><tr><Th>Customer</Th><Th>Town</Th><Th>Orders</Th><Th>Spent</Th><Th>Last order</Th><Th>Age check</Th></tr></thead>
          <tbody className="divide-y divide-line">
            {list.map((c) => (
              <tr key={c.id} className="hover:bg-paper/50">
                <Td><p className="font-medium">{c.name}</p><p className="text-xs text-muted">{c.email}</p></Td>
                <Td className="text-muted">{c.city}</Td>
                <Td>{c.orders}</Td>
                <Td className="font-medium">{gbp(c.spend)}</Td>
                <Td className="text-muted">{fmtDate(c.lastOrder)}</Td>
                <Td>{c.verified ? <Badge tone="success"><ShieldCheck className="size-3" /> Verified</Badge> : <Badge tone="warn">Pending</Badge>}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <div className="mt-4 space-y-2 md:hidden">
        {list.map((c) => (
          <Card key={c.id} className="flex items-center gap-3 p-4">
            <div className="grid size-10 place-items-center rounded-full bg-accent/60 font-semibold">{c.name[0]}</div>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 font-medium">{c.name} {c.verified && <ShieldCheck className="size-3.5 text-success" />}</p>
              <p className="text-xs text-muted">{c.city} · {c.orders} orders</p>
            </div>
            <p className="font-semibold">{gbp(c.spend)}</p>
          </Card>
        ))}
      </div>
    </>
  );
}
