"use client";

import { useState } from "react";
import { Bell, Building2, FileCheck2, Globe, ImagePlus, Plus, ShieldCheck, Store, Truck, Users } from "lucide-react";
import { categories, gbp, salesSeries } from "@/lib/data";
import { portals, type PortalRole } from "@/lib/portal";
import { ProductArt } from "@/components/ui/ProductArt";
import { Badge, Button, Card, cn, Field, Input, Select, Textarea, Toggle } from "@/components/ui";
import { PageHeader } from "./Shell";
import { AreaChart, Donut, KpiCard } from "./charts";

export function Settings({ role }: { role: PortalRole }) {
  const cfg = portals[role];
  const w = role === "wholesaler";
  const [tab, setTab] = useState("business");
  const tabs = [
    { id: "business", label: "Business", icon: Building2 },
    { id: "team", label: "Team", icon: Users },
    { id: "delivery", label: "Delivery", icon: Truck },
    { id: "compliance", label: "Compliance", icon: ShieldCheck },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];
  return (
    <>
      <PageHeader title="Settings" sub={cfg.business} />
      <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
        <nav className="no-scrollbar -mx-4 flex gap-1 overflow-x-auto px-4 lg:mx-0 lg:flex-col lg:px-0">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={cn("flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium", tab === t.id ? "bg-surface shadow-sm ring-1 ring-line" : "text-muted hover:text-ink")}>
              <t.icon className="size-4" /> {t.label}
            </button>
          ))}
        </nav>

        <Card className="p-5 sm:p-6">
          {tab === "business" && (
            <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
              <Field label="Business name" className="sm:col-span-2"><Input defaultValue={cfg.business} /></Field>
              <Field label="Company number"><Input defaultValue={w ? "09876543" : "11223344"} /></Field>
              <Field label="VAT number"><Input defaultValue={w ? "GB 901 2345 67" : "GB 284 1192 37"} /></Field>
              <Field label="Contact email"><Input defaultValue={w ? "trade@nimbuswholesale.co.uk" : "orders@cloudnine.co.uk"} /></Field>
              <Field label="Phone"><Input defaultValue="0113 496 0000" /></Field>
              <Field label="Address" className="sm:col-span-2"><Textarea defaultValue={w ? "Unit 12, Trafford Park\nManchester\nM17 1AA" : "Unit 4, Kirkstall Road\nLeeds\nLS3 1LH"} className="min-h-24" /></Field>
              <div className="sm:col-span-2"><Button>Save changes</Button></div>
            </div>
          )}
          {tab === "team" && (
            <div className="max-w-2xl">
              <div className="flex items-center justify-between"><p className="text-sm text-muted">People who can log in to this {w ? "wholesale" : "retailer"} account.</p><Button size="sm"><Plus className="size-4" /> Invite</Button></div>
              <ul className="mt-4 divide-y divide-line rounded-xl border border-line">
                {[
                  [cfg.user, "Owner", "Full access"],
                  [w ? "Sam Lowe" : "Mia Brooks", w ? "Sales" : "Shop staff", w ? "Orders, retailers" : "Orders, till"],
                  [w ? "Kate Price" : "Tom Hale", "Accounts", "Payments only"],
                ].map(([n, r, a]) => (
                  <li key={n} className="flex items-center gap-3 p-3">
                    <div className="grid size-9 place-items-center rounded-full bg-brand-soft text-sm font-semibold text-brand">{n[0]}</div>
                    <div className="flex-1"><p className="text-sm font-medium">{n}</p><p className="text-xs text-muted">{a}</p></div>
                    <Badge>{r}</Badge>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {tab === "delivery" && (
            <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
              <Field label="Dispatch cut-off"><Select defaultValue="16"><option value="14">2pm</option><option value="16">4pm</option></Select></Field>
              <Field label={w ? "Free delivery over (ex VAT)" : "Free delivery over"}><Input defaultValue={w ? 250 : 20} type="number" /></Field>
              <Field label="Courier"><Select><option>DPD (age verified)</option><option>Royal Mail Tracked (age verified)</option></Select></Field>
              <Field label="Flat rate below threshold"><Input defaultValue={w ? 9.95 : 2.99} type="number" /></Field>
              <div className="space-y-3 sm:col-span-2">
                <Toggle defaultChecked label="Require ID check on delivery (18+)" />
                {!w && <Toggle defaultChecked label="Offer click & collect from shop" />}
                {w && <Toggle label="Offer pallet delivery for large orders" />}
              </div>
            </div>
          )}
          {tab === "compliance" && (
            <div className="max-w-2xl space-y-3">
              <p className="text-sm text-muted">Keep these up to date. We remind you before anything expires.</p>
              {(w
                ? [["MHRA product notifications", "16 products notified", true], ["Trading Standards registration", "Valid", true], ["Producer compliance (WEEE batteries)", "Due 31 Dec 2026", false]]
                : [["Age-of-sale policy (Challenge 25)", "Uploaded 3 Mar 2026", true], ["Staff training log", "4 of 5 staff trained", false], ["Tobacco & vape retail registration", "Valid", true]]
              ).map(([t, d, ok]) => (
                <div key={String(t)} className="flex items-center gap-3 rounded-xl border border-line p-4">
                  <FileCheck2 className={cn("size-5", ok ? "text-success" : "text-warn")} />
                  <div className="flex-1"><p className="text-sm font-medium">{t}</p><p className="text-xs text-muted">{d}</p></div>
                  <Button size="sm" variant="outline">Upload</Button>
                </div>
              ))}
            </div>
          )}
          {tab === "notifications" && (
            <div className="max-w-md space-y-4">
              {(w ? ["New trade order", "Retailer application", "Invoice overdue", "Low stock", "Weekly sales summary"] : ["New shop order", "Low stock", "Trade order dispatched", "Payout sent", "Weekly sales summary"]).map((n, i) => (
                <div key={n} className="flex items-center justify-between text-sm">{n}<Toggle defaultChecked={i !== 4} /></div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}

export function Reports() {
  const byCat = [38, 24, 18, 11, 6, 3];
  const regions = [["North West", 31], ["Yorkshire", 22], ["London", 14], ["Scotland", 12], ["Wales", 9], ["Midlands", 8], ["Other", 4]] as const;
  return (
    <>
      <PageHeader title="Reports" sub="Last 12 months" actions={<Select className="h-9 w-40 rounded-full text-sm"><option>Last 12 months</option><option>This quarter</option><option>This month</option></Select>} />
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <KpiCard label="Revenue" value="£84,900" delta={22} icon={Globe} gradient="brand" />
        <KpiCard label="Avg. order (ex VAT)" value="£512" delta={5} icon={Store} gradient="sunset" />
        <KpiCard label="Repeat retailers" value="81%" delta={3} icon={Users} gradient="aqua" />
        <KpiCard label="Units shipped" value="148k" delta={17} icon={Truck} gradient="grape" />
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Card className="p-5 xl:col-span-2">
          <h2 className="mb-5 font-semibold">Revenue by month</h2>
          <AreaChart data={salesSeries.wholesale} labels={salesSeries.months} />
        </Card>
        <Card className="p-5">
          <h2 className="mb-4 font-semibold">Sales by category</h2>
          <Donut center="£84.9k" sub="12 months" items={categories.map((c, i) => ({ label: c.name, value: byCat[i] }))} />
        </Card>
      </div>
      <Card className="mt-4 p-5">
        <h2 className="font-semibold">Sales by region</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {regions.map(([r, v]) => (
            <div key={r} className="rounded-xl bg-paper p-4">
              <p className="text-sm text-muted">{r}</p>
              <p className="text-xl font-semibold">{v}%</p>
              <p className="text-xs text-muted">{gbp(84900 * (v / 100)).replace(/\.\d+$/, "")}</p>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

export function StorefrontSettings() {
  return (
    <>
      <PageHeader title="My storefront" sub="How your shop appears to shoppers on the Nimbus site." actions={<Button size="sm">Publish changes</Button>} />
      <div className="grid gap-4 [&>*]:min-w-0 xl:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          <Card className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
            <Field label="Shop name" className="sm:col-span-2"><Input defaultValue="Cloud Nine Vapes" /></Field>
            <Field label="Web address" className="sm:col-span-2" hint="Your page on the one Nimbus website">
              <div className="flex h-11 items-center overflow-hidden rounded-xl border border-line bg-surface text-[15px]">
                <span className="max-w-[55%] shrink-0 truncate bg-paper px-3 py-2.5 text-muted">nimbusvape.co.uk/shops/</span>
                <input defaultValue="cloud-nine-leeds" className="w-full min-w-0 flex-1 px-2 outline-none" />
              </div>
            </Field>
            <Field label="About your shop" className="sm:col-span-2"><Textarea defaultValue="Leeds' friendliest vape shop since 2016. Expert advice, 200+ flavours and same-day local delivery." /></Field>
            <Field label="Opening hours"><Input defaultValue="Mon–Sat 9am–7pm, Sun 11am–5pm" /></Field>
            <Field label="Local delivery radius"><Select defaultValue="5"><option value="0">Off</option><option value="3">3 miles</option><option value="5">5 miles</option><option value="10">10 miles</option></Select></Field>
          </Card>
          <Card className="p-5 sm:p-6">
            <h2 className="font-semibold">Logo & banner</h2>
            <div className="mt-4 grid grid-cols-[96px_1fr] gap-3">
              <label className="grid aspect-square cursor-pointer place-items-center rounded-2xl border-2 border-dashed border-line text-xs text-muted"><span className="text-center"><ImagePlus className="mx-auto size-5" />Logo</span><input type="file" className="sr-only" /></label>
              <label className="grid cursor-pointer place-items-center rounded-2xl border-2 border-dashed border-line text-xs text-muted"><span className="text-center"><ImagePlus className="mx-auto size-5" />Banner 1600×400</span><input type="file" className="sr-only" /></label>
            </div>
          </Card>
          <Card className="space-y-4 p-5 sm:p-6">
            <h2 className="font-semibold">Shop options</h2>
            <Toggle defaultChecked label="Show my shop on the store finder" />
            <Toggle defaultChecked label="Allow click & collect" />
            <Toggle label="Holiday mode (pause online orders)" />
          </Card>
        </div>
        <Card className="overflow-hidden xl:sticky xl:top-24 xl:self-start">
          <div className="h-28 bg-brand-gradient" />
          <div className="-mt-8 px-5 pb-5">
            <div className="grid size-16 place-items-center rounded-2xl border-4 border-white bg-accent text-xl font-bold">C9</div>
            <p className="mt-2 text-lg font-semibold">Cloud Nine Vapes</p>
            <p className="text-sm text-muted">Leeds · ★ 4.9 (320) · Open now</p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {(["pod-kits", "nic-salts", "e-liquids"] as const).map((c, i) => <ProductArt key={c} category={c} seed={i} className="aspect-square rounded-lg" />)}
            </div>
            <p className="mt-3 text-center text-xs text-muted">Live preview</p>
          </div>
        </Card>
      </div>
    </>
  );
}
