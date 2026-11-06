"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertCircle, ImagePlus, Lock, Plus, ShieldCheck, Trash2, X } from "lucide-react";
import { categories, gbp, type CategoryId, type PriceTier, type Product } from "@/lib/data";
import type { PortalRole } from "@/lib/portal";
import { ProductArt } from "@/components/ui/ProductArt";
import { Button, Card, cn, Field, Input, Select, Textarea, Toggle } from "@/components/ui";
import { PageHeader } from "./Shell";
import { costPrice } from "@/lib/pricing";

function Section({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <Card className="p-5 sm:p-6">
      <h2 className="font-semibold">{title}</h2>
      {sub && <p className="mt-0.5 text-sm text-muted">{sub}</p>}
      <div className="mt-5">{children}</div>
    </Card>
  );
}

function Chips({ initial, placeholder }: { initial: string[]; placeholder: string }) {
  const [items, setItems] = useState(initial);
  const [v, setV] = useState("");
  return (
    <div className="flex min-h-11 flex-wrap items-center gap-1.5 rounded-xl border border-line bg-surface p-1.5 focus-within:border-brand">
      {items.map((i) => (
        <span key={i} className="inline-flex items-center gap-1 rounded-full bg-paper px-2.5 py-1 text-sm">
          {i}
          <button type="button" onClick={() => setItems(items.filter((x) => x !== i))} aria-label={`Remove ${i}`}><X className="size-3.5 text-muted" /></button>
        </span>
      ))}
      <input
        value={v}
        onChange={(e) => setV(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && v.trim()) {
            e.preventDefault();
            setItems([...items, v.trim()]);
            setV("");
          }
        }}
        placeholder={placeholder}
        className="min-w-24 flex-1 bg-transparent px-1.5 text-sm outline-none"
      />
    </div>
  );
}

export function ProductForm({ role, product }: { role: PortalRole; product?: Product }) {
  const router = useRouter();
  const editing = !!product;
  const [category, setCategory] = useState<CategoryId>(product?.category ?? "pod-kits");
  const [tiers, setTiers] = useState<PriceTier[]>(product?.tiers ?? [{ minQty: 10, price: 0 }]);
  const [retail, setRetail] = useState(product?.retailPrice ?? 0);
  const [nic, setNic] = useState(product?.nicotine?.match(/(\d+)mg/)?.[1] ?? "20");
  const [saved, setSaved] = useState(false);
  const cost = product ? costPrice(product) : 0;
  const net = retail / 1.2;
  const margin = net > 0 ? Math.round(((net - cost) / net) * 100) : 0;
  const nicOver = +nic > 20;
  const back = `/${role}/products`;
  const isLiquid = category === "e-liquids" || category === "nic-salts";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSaved(true);
        setTimeout(() => router.push(product ? `${back}/${product.id}` : back), 700);
      }}
    >
      <PageHeader
        back={{ href: back, label: "Products" }}
        title={editing ? `Edit: ${product!.name}` : "Add product"}
        sub={role === "wholesaler" ? "Shown to approved retailers in the trade catalogue." : "Shown in your online shop and in-store till."}
        actions={
          <div className="hidden gap-2 sm:flex">
            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit">{saved ? "Saved ✓" : editing ? "Save changes" : "Publish product"}</Button>
          </div>
        }
      />

      <div className="grid gap-4 [&>*]:min-w-0 xl:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          <Section title="Basic details">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Product name" className="sm:col-span-2"><Input required defaultValue={product?.name} placeholder="e.g. Aerolux Flow Pod Kit" /></Field>
              <Field label="Brand"><Input defaultValue={product?.brand} placeholder="e.g. Aerolux" /></Field>
              <Field label="Category">
                <Select value={category} onChange={(e) => setCategory(e.target.value as CategoryId)}>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </Select>
              </Field>
              <Field label="Description" className="sm:col-span-2"><Textarea defaultValue={product?.description} placeholder="What makes it great? Battery, pod size, flavour notes…" /></Field>
            </div>
          </Section>

          <Section title="Images" sub="Up to 8 images. The first one is the main image.">
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
              {editing && [0, 1].map((i) => (
                <div key={i} className="group relative">
                  <ProductArt category={category} seed={+product!.id.slice(1) + i * 3} className="aspect-square rounded-xl" />
                  {i === 0 && <span className="absolute left-1.5 top-1.5 rounded-full bg-ink px-2 text-[10px] text-on-ink">Main</span>}
                  <button type="button" className="absolute right-1.5 top-1.5 hidden size-7 place-items-center rounded-full bg-surface shadow group-hover:grid" aria-label="Remove image"><Trash2 className="size-3.5" /></button>
                </div>
              ))}
              <label className="grid aspect-square cursor-pointer place-items-center rounded-xl border-2 border-dashed border-line bg-paper text-center text-xs text-muted hover:border-brand">
                <span><ImagePlus className="mx-auto mb-1 size-6" />Add image</span>
                <input type="file" accept="image/*" multiple className="sr-only" />
              </label>
            </div>
          </Section>

          {role === "wholesaler" ? (
            <Section title="Trade pricing (ex VAT)" sub="Set quantity breaks. Retailers see the price for the quantity they order.">
              <div className="space-y-2">
                <div className="grid grid-cols-[1fr_1fr_40px] gap-2 text-xs font-medium text-muted">
                  <span>From quantity</span><span>Price per unit</span><span />
                </div>
                {tiers.map((t, i) => (
                  <div key={i} className="grid grid-cols-[1fr_1fr_40px] gap-2">
                    <Input type="number" value={t.minQty} onChange={(e) => setTiers(tiers.map((x, j) => (j === i ? { ...x, minQty: +e.target.value } : x)))} />
                    <div className="relative">
                      <span className="absolute left-3.5 top-3 text-sm text-muted">£</span>
                      <Input type="number" step="0.01" className="pl-7" value={t.price} onChange={(e) => setTiers(tiers.map((x, j) => (j === i ? { ...x, price: +e.target.value } : x)))} />
                    </div>
                    <button type="button" onClick={() => setTiers(tiers.filter((_, j) => j !== i))} className="grid size-11 place-items-center rounded-xl text-muted hover:bg-danger/10 hover:text-danger" aria-label="Remove tier"><Trash2 className="size-4" /></button>
                  </div>
                ))}
                <Button type="button" variant="soft" size="sm" onClick={() => setTiers([...tiers, { minQty: (tiers.at(-1)?.minQty ?? 0) * 2 || 10, price: tiers.at(-1)?.price ?? 0 }])}>
                  <Plus className="size-4" /> Add price break
                </Button>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <Field label="Minimum order (MOQ)"><Input type="number" defaultValue={product?.moq ?? 10} /></Field>
                <Field label="Case size"><Input type="number" defaultValue={10} /></Field>
                <Field label="RRP (inc VAT)" hint="Suggested shelf price"><Input type="number" step="0.01" value={retail} onChange={(e) => setRetail(+e.target.value)} /></Field>
              </div>
              <div className="mt-5 grid gap-2 sm:grid-cols-3">
                {(["Bronze", "Silver", "Gold"] as const).map((tier, i) => (
                  <div key={tier} className="rounded-xl bg-paper p-3 text-sm">
                    <p className="text-xs text-muted">{tier} tier sees</p>
                    <p className="font-semibold">{gbp((tiers[0]?.price ?? 0) * (1 - i * 0.05))}</p>
                  </div>
                ))}
              </div>
            </Section>
          ) : (
            <Section title="Pricing" sub="Retail prices include 20% VAT.">
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Selling price"><Input type="number" step="0.01" value={retail} onChange={(e) => setRetail(+e.target.value)} /></Field>
                <Field label="Was price" hint="Shows as a sale"><Input type="number" step="0.01" defaultValue={product?.wasPrice} /></Field>
                <Field label="Cost price" hint="From your last trade order"><Input type="number" step="0.01" defaultValue={cost || undefined} /></Field>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-paper p-4 text-sm">
                <div><p className="text-xs text-muted">Net (ex VAT)</p><p className="font-semibold">{gbp(net)}</p></div>
                <div><p className="text-xs text-muted">Profit / unit</p><p className="font-semibold">{gbp(net - cost)}</p></div>
                <div><p className="text-xs text-muted">Margin</p><p className={cn("font-semibold", margin >= 30 ? "text-success" : "text-warn")}>{margin}%</p></div>
              </div>
            </Section>
          )}

          <Section title="Stock">
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="SKU"><Input defaultValue={product?.sku} placeholder="AX-FLOW-01" /></Field>
              <Field label="Barcode (EAN)"><Input placeholder="5060000000000" /></Field>
              <Field label="Quantity in stock"><Input type="number" defaultValue={product ? (role === "wholesaler" ? product.stock : Math.round(product.stock / 20)) : 0} /></Field>
              <Field label="Low stock alert at"><Input type="number" defaultValue={role === "wholesaler" ? 100 : 10} /></Field>
              <Field label="Weight (g)"><Input type="number" defaultValue={60} /></Field>
            </div>
          </Section>

          <Section title="Options" sub="Press Enter to add each one.">
            <div className="grid gap-4">
              <Field label={category === "pod-kits" || category === "mods-tanks" || category === "accessories" ? "Colours" : "Flavour notes"}>
                <Chips initial={product?.colours ?? product?.flavours ?? []} placeholder="Add option…" />
              </Field>
              {isLiquid && (
                <Field label="Nicotine strengths">
                  <Chips initial={product?.nicotine?.split("/").map((s) => s.trim().replace(/mg.*/, "mg")) ?? ["10mg", "20mg"]} placeholder="e.g. 20mg" />
                </Field>
              )}
            </div>
          </Section>

          <Section title="UK compliance (TPD)" sub="Needed before a nicotine product can be sold in the UK.">
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="MHRA ECID number"><Input defaultValue={product?.ecid} placeholder="04312-24-00000" /></Field>
              <Field label="Max nicotine (mg/ml)">
                <Input type="number" value={nic} onChange={(e) => setNic(e.target.value)} className={cn(nicOver && "border-danger focus:border-danger focus:ring-danger/10")} />
              </Field>
              <Field label={isLiquid ? "Bottle size (ml)" : "Tank / pod size (ml)"}>
                <Input type="number" defaultValue={isLiquid ? 10 : 2} />
              </Field>
            </div>
            {nicOver && <p className="mt-3 flex items-center gap-2 text-sm text-danger"><AlertCircle className="size-4" /> UK limit is 20mg/ml. This product can&apos;t be listed.</p>}
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-success/10 p-3 text-sm text-success">
              <ShieldCheck className="size-4 shrink-0" /> Age restriction (18+) and the nicotine warning are added to every listing automatically.
            </div>
          </Section>
        </div>

        <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
          <Card className="p-5">
            <h2 className="font-semibold">Status</h2>
            <Select className="mt-3" defaultValue={product?.status ?? "draft"}>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="out_of_stock">Out of stock</option>
            </Select>
          </Card>
          <Card className="space-y-4 p-5">
            <h2 className="font-semibold">{role === "wholesaler" ? "Who can see it" : "Where it's sold"}</h2>
            {role === "wholesaler" ? (
              <>
                <Toggle defaultChecked label="Bronze retailers" />
                <Toggle defaultChecked label="Silver retailers" />
                <Toggle defaultChecked label="Gold retailers" />
                <Toggle label="Feature in 'Trade deals'" />
              </>
            ) : (
              <>
                <Toggle defaultChecked label="Online shop" />
                <Toggle defaultChecked label="In-store till (POS)" />
                <Toggle label="Click & collect" />
              </>
            )}
          </Card>
          <Card className="p-5">
            <h2 className="font-semibold">Preview</h2>
            <ProductArt category={category} seed={product ? +product.id.slice(1) : 1} className="mt-3 aspect-[4/3] rounded-xl" />
            <p className="mt-3 font-medium">{product?.name ?? "New product"}</p>
            <p className="text-sm text-muted">{role === "wholesaler" ? `From ${gbp(tiers.at(-1)?.price ?? 0)} ex VAT` : gbp(retail)}</p>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-muted"><Lock className="size-3.5" /> 18+ age gate applied</p>
          </Card>
        </aside>
      </div>

      {/* Mobile save bar */}
      <div className="pb-safe fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-line bg-surface p-3 sm:hidden">
        <Button type="button" variant="outline" className="flex-1" onClick={() => router.back()}>Cancel</Button>
        <Button type="submit" className="flex-[2]">{saved ? "Saved ✓" : editing ? "Save changes" : "Publish"}</Button>
      </div>
    </form>
  );
}
