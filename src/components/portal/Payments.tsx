"use client";

import { useState } from "react";
import { Banknote, CreditCard, Download, Landmark, Plus, ReceiptText, Send, TrendingUp, Wallet } from "lucide-react";
import { gbp, retailTxns, wholesaleTxns } from "@/lib/data";
import type { PortalRole } from "@/lib/portal";
import { Badge, Button, Card, cn, StatusPill, Toggle } from "@/components/ui";
import { PageHeader } from "./Shell";
import { fmtDate, StatCard, Tabs, Td, Th } from "./widgets";

export function Payments({ role }: { role: PortalRole }) {
  const w = role === "wholesaler";
  const txns = w ? wholesaleTxns : retailTxns;
  const [tab, setTab] = useState<"all" | "in" | "out">("all");
  const list = txns.filter((t) => tab === "all" || (tab === "in" ? t.amount > 0 : t.amount < 0));

  return (
    <>
      <PageHeader
        title={w ? "Payments & invoices" : "Payments & payouts"}
        sub={w ? "Money in from retailers, invoices and credit." : "Money from shop sales, payouts to your bank and bills from suppliers."}
        actions={
          <>
            <Button variant="outline" size="sm"><Download className="size-4" /> Statement</Button>
            {w && <Button size="sm"><Plus className="size-4" /> New invoice</Button>}
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {w ? (
          <>
            <StatCard label="Received (Nov)" value="£9,152.40" delta={14} icon={TrendingUp} dark />
            <StatCard label="Outstanding" value={gbp(1306)} icon={ReceiptText} />
            <StatCard label="Overdue" value={gbp(438)} icon={Wallet} />
            <StatCard label="Credit extended" value="£23,000" icon={CreditCard} />
          </>
        ) : (
          <>
            <StatCard label="Available balance" value="£1,318.40" icon={Wallet} dark />
            <StatCard label="Next payout (Fri)" value="£1,318.40" icon={Banknote} />
            <StatCard label="Owed to supplier" value={gbp(868)} icon={ReceiptText} />
            <StatCard label="Card fees (Nov)" value={gbp(42.3)} icon={CreditCard} />
          </>
        )}
      </div>

      <div className="mt-4 grid gap-4 [&>*]:min-w-0 xl:grid-cols-[1fr_340px]">
        <Card className="overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 p-5 pb-3">
            <h2 className="font-semibold">Transactions</h2>
            <Tabs value={tab} onChange={setTab} items={[{ id: "all", label: "All" }, { id: "in", label: "Money in" }, { id: "out", label: "Money out" }]} />
          </div>
          <div className="hidden md:block">
            <table className="w-full">
              <thead className="border-y border-line bg-paper/60"><tr><Th>Date</Th><Th>Reference</Th><Th>{w ? "Retailer" : "From / to"}</Th><Th>Type</Th><Th>Status</Th><Th className="text-right">Amount</Th></tr></thead>
              <tbody className="divide-y divide-line">
                {list.map((t) => (
                  <tr key={t.id} className="hover:bg-paper/50">
                    <Td className="text-muted">{fmtDate(t.date)}</Td>
                    <Td className="font-mono text-xs">{t.ref}</Td>
                    <Td><p className="font-medium">{t.party}</p><p className="text-xs text-muted">{t.method}</p></Td>
                    <Td><Badge>{t.type}</Badge></Td>
                    <Td><StatusPill status={t.status} /></Td>
                    <Td className={cn("text-right font-semibold", t.amount < 0 ? "text-ink/60" : "text-success")}>{t.amount > 0 ? "+" : "−"}{gbp(Math.abs(t.amount))}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="divide-y divide-line md:hidden">
            {list.map((t) => (
              <li key={t.id} className="flex items-center gap-3 px-5 py-3.5">
                <div className={cn("grid size-10 place-items-center rounded-full", t.amount > 0 ? "bg-success/10 text-success" : "bg-ink/5")}>
                  {t.type === "Payout" ? <Landmark className="size-4" /> : t.type === "Invoice" ? <ReceiptText className="size-4" /> : <CreditCard className="size-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{t.party}</p>
                  <p className="text-xs text-muted">{t.type} · {t.ref} · {fmtDate(t.date)}</p>
                </div>
                <div className="text-right">
                  <p className={cn("text-sm font-semibold", t.amount > 0 && "text-success")}>{t.amount > 0 ? "+" : "−"}{gbp(Math.abs(t.amount))}</p>
                  <p className="text-[11px] text-muted">{t.status}</p>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <h2 className="font-semibold">{w ? "Payment options for retailers" : "Ways shoppers can pay"}</h2>
            <div className="mt-4 space-y-3.5">
              {(w
                ? ["Card (Visa, Mastercard, Amex)", "Bank transfer (BACS)", "Credit terms (approved accounts)", "Pro-forma invoice"]
                : ["Card", "Apple Pay & Google Pay", "PayPal", "Pay in 3 (Klarna)"]
              ).map((m, i) => (
                <div key={m} className="flex items-center justify-between text-sm">{m}<Toggle defaultChecked={i < 3} /></div>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted">Note: some card schemes and payment providers have their own rules for vape merchants. Check yours before go-live.</p>
          </Card>
          <Card className="p-5">
            <h2 className="font-semibold">Payout account</h2>
            <div className="mt-4 flex items-center gap-3 rounded-xl bg-paper p-3">
              <div className="grid size-10 place-items-center rounded-lg bg-ink text-on-ink"><Landmark className="size-5" /></div>
              <div className="text-sm">
                <p className="font-medium">{w ? "HSBC Business •• 8812" : "Barclays Business •• 2201"}</p>
                <p className="text-xs text-muted">Sort code ••-••-{w ? "40" : "17"} · Weekly on Friday</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="mt-3 w-full">Change account</Button>
          </Card>
          {w && (
            <Card className="bg-brand-gradient border-0 p-5 text-white">
              <h2 className="font-semibold">Chase overdue invoices</h2>
              <p className="mt-1 text-sm text-white/75">1 invoice is overdue ({gbp(438)}). Send a friendly reminder in one click.</p>
              <Button variant="accent" size="sm" className="mt-4"><Send className="size-4" /> Send reminders</Button>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
