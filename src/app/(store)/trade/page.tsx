import { ArrowRight, BadgeCheck, Boxes, Building2, ClipboardCheck, CreditCard, FileSpreadsheet, Headphones, PackageCheck, Store, Truck } from "lucide-react";
import { ButtonLink, SectionTitle } from "@/components/ui";

export const metadata = { title: "Wholesale & trade" };

export default function Trade() {
  return (
    <div>
      <section className="mx-auto max-w-7xl px-4 pt-4 sm:pt-6">
        <div className="relative overflow-hidden rounded-[28px] bg-brand-gradient px-6 py-12 text-white sm:px-12 sm:py-16">
          <div className="absolute -right-20 -top-20 size-80 rounded-full bg-accent/30 blur-3xl" />
          <div className="relative max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs"><Building2 className="size-3.5" /> Nimbus Trade</span>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">Wholesale vape supply for UK shops</h1>
            <p className="mt-5 text-lg text-white/80">One site for everything: buy stock at trade prices, sell to shoppers online, and manage orders, payments and price lists from your own dashboard.</p>
          </div>
          <div className="relative mt-10 grid gap-3 sm:grid-cols-2 lg:max-w-3xl">
            <a href="/register?type=retailer" className="group rounded-2xl bg-surface p-5 text-ink transition hover:-translate-y-0.5">
              <Store className="size-6 text-brand" />
              <p className="mt-3 text-lg font-semibold">I&apos;m a retailer</p>
              <p className="text-sm text-muted">I run a vape shop and want to buy stock wholesale and sell online.</p>
              <p className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand">Apply as retailer <ArrowRight className="size-4 transition group-hover:translate-x-1" /></p>
            </a>
            <a href="/register?type=wholesaler" className="group rounded-2xl bg-night p-5 text-white transition hover:-translate-y-0.5">
              <Boxes className="size-6 text-accent" />
              <p className="mt-3 text-lg font-semibold">I&apos;m a wholesaler</p>
              <p className="text-sm text-white/60">I distribute or manufacture and want to sell bulk to UK shops.</p>
              <p className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent">Apply as supplier <ArrowRight className="size-4 transition group-hover:translate-x-1" /></p>
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-7xl px-4">
        <SectionTitle eyebrow="How it works" title="Get trading in 3 steps" />
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { i: ClipboardCheck, t: "1. Apply", d: "Tell us about your business: company number, VAT number, shop address and your age-of-sale policy." },
            { i: BadgeCheck, t: "2. Get approved", d: "We check your details within 24 hours and give you a pricing tier and credit limit." },
            { i: PackageCheck, t: "3. Start ordering", d: "Order at tiered trade prices, pay by card, bank transfer or 30-day terms, and get next-day dispatch." },
          ].map(({ i: I, t, d }) => (
            <div key={t} className="rounded-2xl border border-line bg-surface p-6">
              <I className="size-7 text-brand" />
              <p className="mt-4 text-lg font-semibold">{t}</p>
              <p className="mt-1 text-sm text-muted">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="mx-auto mt-16 max-w-7xl px-4">
        <SectionTitle eyebrow="Pricing tiers" title="The more you buy, the more you save" />
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { n: "Bronze", s: "£0 – £5k / year", f: ["Trade prices ex VAT", "Pro-forma or card payment", "Standard next-day dispatch"] },
            { n: "Silver", s: "£5k – £25k / year", f: ["Extra 5% off every tier", "14-day payment terms", "Priority dispatch", "Monthly promo packs"], hl: true },
            { n: "Gold", s: "£25k+ / year", f: ["Extra 10% off every tier", "30-day credit terms", "Dedicated account manager", "Free POS & display units"] },
          ].map((t) => (
            <div key={t.n} className={`rounded-3xl p-7 ${t.hl ? "bg-night text-white" : "border border-line bg-surface"}`}>
              <p className={`text-sm ${t.hl ? "text-accent" : "text-brand"}`}>{t.s}</p>
              <p className="mt-1 text-2xl font-semibold">{t.n}</p>
              <ul className="mt-5 space-y-2.5 text-sm">
                {t.f.map((x) => <li key={x} className="flex gap-2"><BadgeCheck className={`size-5 ${t.hl ? "text-accent" : "text-success"}`} />{x}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-7xl px-4">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { i: FileSpreadsheet, t: "Live price lists", d: "Download as CSV or PDF" },
            { i: CreditCard, t: "Flexible payment", d: "Card, BACS or credit terms" },
            { i: Truck, t: "Pallet & parcel", d: "Tracked UK-wide dispatch" },
            { i: Headphones, t: "Real support", d: "UK-based trade team" },
          ].map(({ i: I, t, d }) => (
            <div key={t} className="rounded-2xl border border-line bg-surface p-5">
              <I className="size-6 text-brand" />
              <p className="mt-3 font-medium">{t}</p>
              <p className="text-sm text-muted">{d}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center gap-3 rounded-3xl bg-accent p-8 text-center sm:p-12">
          <h2 className="text-3xl font-semibold tracking-tight">Already have a trade account?</h2>
          <p className="text-ink/70">Log in to see your prices, reorder and manage your shop.</p>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/login?type=retailer">Retailer login</ButtonLink>
            <ButtonLink href="/login?type=wholesaler" variant="outline">Wholesaler login</ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}
