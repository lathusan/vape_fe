"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Home, LayoutGrid, Menu, Search, ShoppingBag, User, X, Building2, ChevronRight } from "lucide-react";
import { BRAND, categories } from "@/lib/data";
import { useStore } from "@/lib/store";
import { cn } from "@/components/ui";
import { CartDrawer } from "./CartDrawer";
import { ThemePanel, ThemeToggle } from "@/components/ui/ThemeToggle";

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2">
      <span className={cn("grid size-9 place-items-center rounded-xl font-bold", "bg-brand-gradient text-white")}>N</span>
      <span className={cn("text-lg font-semibold tracking-tight", dark && "text-white")}>{BRAND.name}</span>
    </Link>
  );
}

export function accountHref(role: string) {
  return role === "wholesaler" ? "/wholesaler" : role === "retailer" ? "/retailer" : role === "customer" ? "/account" : "/login";
}

export function Header() {
  const { count, setCartOpen, role } = useStore();
  const [menu, setMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const router = useRouter();
  const path = usePathname();

  const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = new FormData(e.currentTarget).get("q");
    router.push(`/shop?q=${encodeURIComponent(String(q ?? ""))}`);
    setSearchOpen(false);
  };

  return (
    <>
      <div className="bg-night text-white">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-center gap-6 px-4 text-xs sm:justify-between">
          <p className="truncate">
            <span className="text-accent">●</span> Free UK delivery over £20 · Order by 4pm for next-day delivery
          </p>
          <div className="hidden items-center gap-5 sm:flex">
            <Link href="/trade" className="hover:text-accent">Wholesale / Trade</Link>
            <Link href="/help" className="hover:text-accent">Help</Link>
            <span className="rounded-full border border-white/20 px-2 py-0.5">18+ only</span>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 lg:gap-8">
          <button className="-ml-2 grid size-10 place-items-center rounded-full hover:bg-ink/5 lg:hidden" onClick={() => setMenu(true)} aria-label="Menu">
            <Menu className="size-5" />
          </button>
          <Logo />
          <nav className="hidden items-center gap-1 lg:flex">
            {[
              { href: "/shop", label: "Shop all" },
              { href: "/shop?cat=pod-kits", label: "Pod Kits" },
              { href: "/shop?cat=e-liquids", label: "E-Liquids" },
              { href: "/shop?cat=nic-salts", label: "Nic Salts" },
              { href: "/shop?cat=pods-coils", label: "Pods & Coils" },
              { href: "/shop?deals=1", label: "Deals" },
            ].map((l) => (
              <Link key={l.label} href={l.href} className="rounded-full px-3 py-2 text-sm font-medium text-ink/80 hover:bg-ink/5 hover:text-ink">
                {l.label}
              </Link>
            ))}
          </nav>

          <form onSubmit={onSearch} className="ml-auto hidden max-w-xs flex-1 md:block">
            <label className="flex h-10 items-center gap-2 rounded-full border border-line bg-surface px-4 focus-within:border-brand">
              <Search className="size-4 text-muted" />
              <input name="q" placeholder="Search kits, flavours, brands…" className="w-full bg-transparent text-sm outline-none" />
            </label>
          </form>

          <div className="ml-auto flex items-center gap-1 md:ml-0">
            <button className="grid size-10 place-items-center rounded-full hover:bg-ink/5 md:hidden" onClick={() => setSearchOpen(true)} aria-label="Search">
              <Search className="size-5" />
            </button>
            <Link href="/trade" className="hidden h-10 items-center gap-2 rounded-full bg-brand-soft px-4 text-sm font-medium text-brand hover:bg-brand/15 xl:flex">
              <Building2 className="size-4" /> Trade account
            </Link>
            <ThemeToggle />
            <Link href={accountHref(role)} className="hidden size-10 place-items-center rounded-full hover:bg-ink/5 sm:grid" aria-label="Account">
              <User className="size-5" />
            </Link>
            <button onClick={() => setCartOpen(true)} className="relative grid size-10 place-items-center rounded-full hover:bg-ink/5" aria-label="Basket">
              <ShoppingBag className="size-5" />
              {count > 0 && (
                <span className="absolute right-0.5 top-0.5 grid min-w-5 place-items-center rounded-full bg-accent px-1 text-[11px] font-bold text-on-accent">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile search sheet */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-paper p-4 md:hidden">
          <form onSubmit={onSearch} className="flex items-center gap-2">
            <label className="flex h-12 flex-1 items-center gap-2 rounded-full border border-line bg-surface px-4">
              <Search className="size-5 text-muted" />
              <input autoFocus name="q" placeholder="Search kits, flavours, brands…" className="w-full bg-transparent outline-none" />
            </label>
            <button type="button" onClick={() => setSearchOpen(false)} className="px-2 text-sm font-medium">Cancel</button>
          </form>
          <p className="mb-3 mt-6 text-xs font-semibold uppercase tracking-wider text-muted">Popular</p>
          <div className="flex flex-wrap gap-2">
            {["Blue Razz", "Pod kit", "Nic salt 20mg", "Mango Ice", "Replacement pods", "Shortfill"].map((t) => (
              <Link key={t} href={`/shop?q=${encodeURIComponent(t)}`} onClick={() => setSearchOpen(false)} className="rounded-full border border-line bg-surface px-3.5 py-2 text-sm">
                {t}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Mobile menu drawer */}
      {menu && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setMenu(false)} />
          <div className="animate-slide-in absolute inset-y-0 left-0 flex w-[86%] max-w-sm flex-col bg-paper">
            <div className="flex h-16 items-center justify-between border-b border-line px-4">
              <Logo />
              <button onClick={() => setMenu(false)} className="grid size-10 place-items-center rounded-full hover:bg-ink/5" aria-label="Close">
                <X className="size-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted">Shop</p>
              {categories.map((c) => (
                <Link key={c.id} href={`/shop?cat=${c.id}`} onClick={() => setMenu(false)} className="flex items-center justify-between rounded-xl px-2 py-3 text-[15px] font-medium hover:bg-ink/5">
                  {c.name} <ChevronRight className="size-4 text-muted" />
                </Link>
              ))}
              <Link href="/shop?deals=1" onClick={() => setMenu(false)} className="flex items-center justify-between rounded-xl px-2 py-3 text-[15px] font-medium text-brand">
                Deals <ChevronRight className="size-4" />
              </Link>
              <div className="my-4 h-px bg-line" />
              <Link href="/trade" onClick={() => setMenu(false)} className="block rounded-2xl bg-brand-gradient p-4 text-white">
                <p className="text-sm text-accent">For vape shops</p>
                <p className="mt-1 font-semibold">Open a wholesale trade account →</p>
              </Link>
              <ThemePanel className="mt-4 rounded-2xl border border-line bg-surface p-3" />
              <div className="mt-4 grid gap-1">
                <Link href={accountHref(role)} onClick={() => setMenu(false)} className="rounded-xl px-2 py-3 font-medium hover:bg-ink/5">My account</Link>
                <Link href="/help" onClick={() => setMenu(false)} className="rounded-xl px-2 py-3 font-medium hover:bg-ink/5">Help & delivery</Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile bottom tab bar */}
      <nav className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/90 backdrop-blur-xl sm:hidden">
        <div className="grid grid-cols-5 pt-1.5">
          {[
            { href: "/", label: "Home", icon: Home, active: path === "/" },
            { href: "/shop", label: "Shop", icon: LayoutGrid, active: path.startsWith("/shop") || path.startsWith("/product") },
            { href: "/trade", label: "Trade", icon: Building2, active: path.startsWith("/trade") },
            { href: accountHref(role), label: "Account", icon: User, active: path.startsWith("/account") || path.startsWith("/login") },
          ].map((t) => (
            <Link key={t.label} href={t.href} className={cn("flex flex-col items-center gap-0.5 py-1 text-[11px] font-medium", t.active ? "text-ink" : "text-muted")}>
              <t.icon className={cn("size-[22px]", t.active && "stroke-[2.4]")} />
              {t.label}
            </Link>
          ))}
          <button onClick={() => setCartOpen(true)} className="relative flex flex-col items-center gap-0.5 py-1 text-[11px] font-medium text-muted">
            <ShoppingBag className="size-[22px]" />
            Basket
            {count > 0 && <span className="absolute right-[22%] top-0 grid min-w-4.5 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-on-accent">{count}</span>}
          </button>
        </div>
      </nav>

      <CartDrawer />
    </>
  );
}
