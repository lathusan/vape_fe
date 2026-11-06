import Link from "next/link";
import { BRAND } from "@/lib/data";

export function NicotineWarning({ className = "" }: { className?: string }) {
  return (
    <div className={`border-2 border-ink bg-surface px-4 py-3 text-center text-sm font-bold leading-snug ${className}`}>
      This product contains nicotine which is a highly addictive substance.
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-20 bg-night pb-24 text-white sm:pb-0">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-xl bg-accent font-bold text-on-accent">N</span>
            <span className="text-lg font-semibold">{BRAND.full}</span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-white/60">{BRAND.tagline} Retail delivery across England, Scotland, Wales and Northern Ireland, plus trade supply for independent vape shops.</p>
          <form className="mt-6 flex max-w-sm gap-2">
            <input placeholder="Email for deals (18+)" className="h-11 flex-1 rounded-full bg-white/10 px-4 text-sm outline-none placeholder:text-white/40 focus:bg-white/15" />
            <button className="h-11 rounded-full bg-accent px-5 text-sm font-semibold text-on-accent">Join</button>
          </form>
        </div>
        {[
          { h: "Shop", l: [["Pod Kits", "/shop?cat=pod-kits"], ["E-Liquids", "/shop?cat=e-liquids"], ["Nic Salts", "/shop?cat=nic-salts"], ["Pods & Coils", "/shop?cat=pods-coils"], ["Deals", "/shop?deals=1"]] },
          { h: "Trade", l: [["Wholesale account", "/trade"], ["Trade login", "/login?type=trade"], ["Retailer login", "/login?type=retailer"], ["Price lists", "/trade#pricing"]] },
          { h: "Help", l: [["Delivery & returns", "/help"], ["Age verification", "/help"], ["Contact us", "/help"], ["Recycling your device", "/help"]] },
        ].map((c) => (
          <div key={c.h}>
            <p className="mb-3 text-sm font-semibold">{c.h}</p>
            <ul className="space-y-2 text-sm text-white/60">
              {c.l.map(([t, h]) => (
                <li key={t}><Link href={h} className="hover:text-accent">{t}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl space-y-2 px-4 py-6 text-xs text-white/50">
          <p>
            Vaping products are not for sale to anyone under 18. Not for use by non-smokers, pregnant or breastfeeding women.
            We do not sell single-use (disposable) vapes. All nicotine products are TPD compliant and notified with the MHRA.
          </p>
          <p>© {new Date().getFullYear()} {BRAND.full} Ltd. Registered in England & Wales. VAT GB 000 0000 00 (placeholder).</p>
        </div>
      </div>
    </footer>
  );
}
