import { Copy, ExternalLink, Pencil, ShieldCheck } from "lucide-react";
import { catName, gbp, type Product } from "@/lib/data";
import type { PortalRole } from "@/lib/portal";
import { ProductArt } from "@/components/ui/ProductArt";
import { Button, ButtonLink, Card, StatusPill } from "@/components/ui";
import { PageHeader } from "./Shell";
import { costPrice, marginPct, shopStock } from "@/lib/pricing";

export function ProductView({ role, p }: { role: PortalRole; p: Product }) {
  const w = role === "wholesaler";
  const stock = w ? p.stock : shopStock(p);
  const sold = w ? 1240 : 64;
  return (
    <>
      <PageHeader
        back={{ href: `/${role}/products`, label: "Products" }}
        title={p.name}
        sub={`${p.sku} · ${p.brand} · ${catName(p.category)}`}
        actions={
          <>
            <ButtonLink href={`/product/${p.slug}`} variant="outline" size="sm"><ExternalLink className="size-4" /> View on site</ButtonLink>
            <Button variant="outline" size="sm"><Copy className="size-4" /> Duplicate</Button>
            <ButtonLink href={`/${role}/products/${p.id}/edit`} size="sm"><Pencil className="size-4" /> Edit</ButtonLink>
          </>
        }
      />

      <div className="grid gap-4 [&>*]:min-w-0 xl:grid-cols-[380px_1fr]">
        <Card className="p-4">
          <ProductArt category={p.category} seed={+p.id.slice(1)} className="aspect-square rounded-xl" />
          <div className="mt-3 grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => <ProductArt key={i} category={p.category} seed={+p.id.slice(1) + i * 3} className="aspect-square rounded-lg" />)}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <StatusPill status={p.status} />
            <span className="text-sm text-muted">Updated 2 days ago</span>
          </div>
        </Card>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              ["In stock", stock.toLocaleString()],
              ["Sold (30 days)", sold.toLocaleString()],
              ["Revenue (30 days)", gbp(sold * (w ? p.tiers[1]?.price ?? p.tiers[0].price : p.retailPrice))],
              [w ? "Retailers stocking" : "Margin", w ? "41" : `${marginPct(p)}%`],
            ].map(([l, v]) => (
              <Card key={l} className="p-4"><p className="text-sm text-muted">{l}</p><p className="mt-1 text-xl font-semibold">{v}</p></Card>
            ))}
          </div>

          <Card className="p-5">
            <h2 className="font-semibold">{w ? "Trade price breaks (ex VAT)" : "Pricing"}</h2>
            {w ? (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[420px] text-sm">
                  <thead className="text-left text-xs text-muted"><tr><th className="pb-2 font-medium">Quantity</th><th className="pb-2 font-medium">Unit price</th><th className="pb-2 font-medium">Off RRP</th><th className="pb-2 font-medium">Gold tier</th></tr></thead>
                  <tbody className="divide-y divide-line">
                    {p.tiers.map((t) => (
                      <tr key={t.minQty}>
                        <td className="py-2.5">{t.minQty}+</td>
                        <td className="py-2.5 font-medium">{gbp(t.price)}</td>
                        <td className="py-2.5 text-success">{Math.round((1 - t.price / (p.retailPrice / 1.2)) * 100)}%</td>
                        <td className="py-2.5">{gbp(t.price * 0.9)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="mt-3 text-xs text-muted">MOQ {p.moq} units · RRP {gbp(p.retailPrice)} inc VAT</p>
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                <div><p className="text-muted">Selling price</p><p className="font-semibold">{gbp(p.retailPrice)}</p></div>
                <div><p className="text-muted">Was</p><p className="font-semibold">{p.wasPrice ? gbp(p.wasPrice) : "—"}</p></div>
                <div><p className="text-muted">Cost</p><p className="font-semibold">{gbp(costPrice(p))}</p></div>
                <div><p className="text-muted">Profit / unit</p><p className="font-semibold text-success">{gbp(p.retailPrice / 1.2 - costPrice(p))}</p></div>
              </div>
            )}
          </Card>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="p-5">
              <h2 className="font-semibold">Details</h2>
              <p className="mt-3 text-sm text-muted">{p.description}</p>
              <dl className="mt-4 grid grid-cols-2 gap-y-2 text-sm">
                {p.colours && (<><dt className="text-muted">Colours</dt><dd>{p.colours.join(", ")}</dd></>)}
                {p.flavours && (<><dt className="text-muted">Flavours</dt><dd>{p.flavours.join(", ")}</dd></>)}
                {p.nicotine && (<><dt className="text-muted">Nicotine</dt><dd>{p.nicotine}</dd></>)}
                {p.volume && (<><dt className="text-muted">Volume</dt><dd>{p.volume}</dd></>)}
              </dl>
            </Card>
            <Card className="p-5">
              <h2 className="flex items-center gap-2 font-semibold"><ShieldCheck className="size-4 text-success" /> Compliance</h2>
              <dl className="mt-4 grid grid-cols-2 gap-y-2.5 text-sm">
                <dt className="text-muted">MHRA ECID</dt><dd className="font-mono text-xs">{p.ecid}</dd>
                <dt className="text-muted">Age restriction</dt><dd>18+</dd>
                <dt className="text-muted">Nicotine warning</dt><dd>On packaging ✓</dd>
                <dt className="text-muted">TPD limits</dt><dd>Within limits ✓</dd>
              </dl>
            </Card>
          </div>

          <Card className="p-5">
            <h2 className="font-semibold">Activity</h2>
            <ol className="mt-4 space-y-4 border-l border-line pl-5 text-sm">
              {[
                ["Price updated", w ? "Tier 2 changed from £12.50 to £12.20" : "Selling price set to " + gbp(p.retailPrice), "2 days ago"],
                ["Stock received", w ? "+500 units from supplier" : "+40 units from PO-3288", "4 days ago"],
                ["Product created", "by " + (w ? "Nishan K." : "Jordan Reid"), "12 Mar 2026"],
              ].map(([t, d, when]) => (
                <li key={t} className="relative">
                  <span className="absolute -left-[25px] top-1 size-2.5 rounded-full bg-brand ring-4 ring-white" />
                  <p className="font-medium">{t}</p>
                  <p className="text-muted">{d} · {when}</p>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </div>
    </>
  );
}
