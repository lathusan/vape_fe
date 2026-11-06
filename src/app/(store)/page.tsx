import Link from "next/link";
import { ArrowRight, BadgeCheck, Building2, Recycle, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { categories, products } from "@/lib/data";
import { ProductCard } from "@/components/store/ProductCard";
import { ProductArt } from "@/components/ui/ProductArt";
import { ButtonLink, SectionTitle } from "@/components/ui";

export default function Home() {
  const best = products.filter((p) => p.status === "active").sort((a, b) => b.reviews - a.reviews).slice(0, 8);
  const fresh = products.filter((p) => p.badge === "New" || p.badge === "Sale").slice(0, 4);

  return (
    <div className="pb-6">
      {/* HERO */}
      <section className="mx-auto max-w-7xl px-4 pt-4 sm:pt-6">
        <div className="relative overflow-hidden rounded-[28px] bg-night text-white">
          <div className="absolute -right-24 -top-24 size-96 rounded-full bg-brand/40 blur-3xl" />
          <div className="absolute -bottom-32 left-1/3 size-80 rounded-full bg-accent/20 blur-3xl" />
          <div className="relative grid items-center gap-8 p-6 sm:p-10 lg:grid-cols-[1.2fr_1fr] lg:p-14">
            <div className="animate-rise">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs">
                <span className="size-1.5 rounded-full bg-accent" /> New season flavours just landed
              </span>
              <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl xl:text-[64px]">
                Better vapes.<br />
                <span className="text-accent">Delivered tomorrow.</span>
              </h1>
              <p className="mt-5 max-w-md text-base text-white/70 sm:text-lg">
                Pod kits, nic salts and e-liquids from brands you trust, all TPD-compliant. For shoppers 18+ and for shops buying wholesale.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/shop" variant="accent" size="lg">Shop now <ArrowRight className="size-4" /></ButtonLink>
                <ButtonLink href="/trade" size="lg" className="bg-white/10 hover:bg-white/15">
                  <Building2 className="size-4" /> I&apos;m a shop: buy wholesale
                </ButtonLink>
              </div>
              <div className="mt-8 flex gap-8 text-sm">
                <div><p className="text-2xl font-semibold">4.8★</p><p className="text-white/50">12k+ reviews</p></div>
                <div><p className="text-2xl font-semibold">1,200+</p><p className="text-white/50">trade stockists</p></div>
                <div className="hidden sm:block"><p className="text-2xl font-semibold">Next day</p><p className="text-white/50">order by 4pm</p></div>
              </div>
            </div>
            <div className="relative hidden h-[420px] lg:block" aria-hidden>
              <ProductArt category="pod-kits" seed={1} className="absolute right-[38%] top-4 h-72 w-52 rotate-[-8deg] rounded-3xl shadow-2xl" />
              <ProductArt category="nic-salts" seed={4} className="absolute right-4 top-16 h-64 w-48 rotate-[6deg] rounded-3xl shadow-2xl" />
              <ProductArt category="e-liquids" seed={7} className="absolute bottom-2 right-[22%] h-48 w-40 rotate-[-2deg] rounded-3xl shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto mt-12 max-w-7xl px-4">
        <SectionTitle eyebrow="Browse" title="Shop by category" />
        <div className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:px-0 lg:grid-cols-6">
          {categories.map((c, i) => (
            <Link key={c.id} href={`/shop?cat=${c.id}`} className="group w-36 shrink-0 snap-start sm:w-auto">
              <ProductArt category={c.id} seed={i + 2} className="aspect-[4/5] rounded-2xl transition group-hover:-translate-y-1" />
              <p className="mt-2 font-medium">{c.name}</p>
              <p className="text-xs text-muted">{c.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="mx-auto mt-14 max-w-7xl px-4">
        <SectionTitle eyebrow="Customer favourites" title="Best sellers" action={<Link href="/shop" className="text-sm font-medium text-brand">View all →</Link>} />
        <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
          {best.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>

      {/* TWO WAYS TO BUY */}
      <section className="mx-auto mt-16 max-w-7xl px-4">
        <SectionTitle eyebrow="One site, two ways to buy" title="Shopping for yourself, or stocking your shop?" />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-line bg-surface p-7 sm:p-9">
            <div className="grid size-12 place-items-center rounded-2xl bg-accent"><ShoppingBag className="size-6" /></div>
            <h3 className="mt-5 text-2xl font-semibold tracking-tight">Retail shoppers</h3>
            <p className="mt-2 text-muted">Buy single items at retail prices, inc VAT. Track your orders, reorder favourites, save addresses and earn loyalty points.</p>
            <ul className="mt-5 space-y-2 text-sm">
              {["Free delivery over £20", "Pay with Apple Pay, Google Pay, card or PayPal", "Age-verified checkout"].map((t) => (
                <li key={t} className="flex gap-2"><BadgeCheck className="size-5 text-success" />{t}</li>
              ))}
            </ul>
            <ButtonLink href="/shop" className="mt-7">Start shopping</ButtonLink>
          </div>
          <div className="rounded-3xl bg-brand-gradient p-7 text-white sm:p-9">
            <div className="grid size-12 place-items-center rounded-2xl bg-white/15"><Building2 className="size-6" /></div>
            <h3 className="mt-5 text-2xl font-semibold tracking-tight">Trade & wholesale</h3>
            <p className="mt-2 text-white/75">For UK vape shops and retailers. Tiered bulk pricing ex VAT, 30-day credit terms, quick reorders and your own shop dashboard.</p>
            <ul className="mt-5 space-y-2 text-sm">
              {["Up to 55% off RRP with volume tiers", "Dedicated account manager", "Download price lists and VAT invoices"].map((t) => (
                <li key={t} className="flex gap-2"><BadgeCheck className="size-5 text-accent" />{t}</li>
              ))}
            </ul>
            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonLink href="/register?type=retailer" variant="accent">Apply for trade</ButtonLink>
              <ButtonLink href="/login?type=retailer" className="bg-white/15 hover:bg-white/25">Trade login</ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* NEW */}
      <section className="mx-auto mt-16 max-w-7xl px-4">
        <SectionTitle eyebrow="Just in" title="New & on offer" />
        <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4">
          {fresh.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>

      {/* TRUST */}
      <section className="mx-auto mt-16 max-w-7xl px-4">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { i: Truck, t: "Next-day UK delivery", d: "Royal Mail & DPD tracked" },
            { i: ShieldCheck, t: "Age verified", d: "18+ check at checkout & door" },
            { i: BadgeCheck, t: "TPD compliant", d: "Every product MHRA notified" },
            { i: Recycle, t: "Free recycling", d: "Send back old devices free" },
          ].map(({ i: Icon, t, d }) => (
            <div key={t} className="rounded-2xl border border-line bg-surface p-5">
              <Icon className="size-6 text-brand" />
              <p className="mt-3 font-medium">{t}</p>
              <p className="text-sm text-muted">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
