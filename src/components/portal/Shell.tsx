"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bell, ChevronsLeft, ChevronsRight, ExternalLink, LogOut, Menu, MoreHorizontal, PanelLeft, Search, X } from "lucide-react";
import { portals, type PortalRole } from "@/lib/portal";
import { useStore } from "@/lib/store";
import { cn } from "@/components/ui";
import { ThemePanel, ThemeToggle } from "@/components/ui/ThemeToggle";

export function PortalShell({ role, children }: { role: PortalRole; children: React.ReactNode }) {
  const cfg = portals[role];
  const path = usePathname();
  const router = useRouter();
  const { setRole } = useStore();
  const [drawer, setDrawer] = useState(false);

  useEffect(() => setRole(role), [role, setRole]);
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => setDrawer(false), [path]);

  // Remember sidebar open/closed per browser
  useEffect(() => {
    try { setCollapsed(localStorage.getItem("nimbus.sidebar") === "closed"); } catch {}
  }, []);
  const toggleSidebar = () => {
    setCollapsed((c) => {
      try { localStorage.setItem("nimbus.sidebar", c ? "open" : "closed"); } catch {}
      return !c;
    });
  };

  const isActive = (href: string) => {
    const full = cfg.base + href;
    return href === "" ? path === cfg.base : path.startsWith(full);
  };

  const logout = () => {
    setRole("guest");
    router.push("/");
  };

  // `mini` = icon-only rail (collapsed desktop sidebar)
  const NavList = ({ mini = false }: { mini?: boolean }) => (
    <nav className="space-y-1">
      {cfg.nav.map((n) => {
        const active = isActive(n.href);
        return (
          <Link
            key={n.href}
            href={cfg.base + n.href}
            aria-label={n.label}
            className={cn(
              "group relative flex items-center gap-3 rounded-xl py-2.5 text-sm font-medium transition",
              mini ? "justify-center px-0" : "px-3",
              active ? "bg-white/18 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]" : "text-white/70 hover:bg-white/10 hover:text-white",
            )}
          >
            {active && !mini && <span className="absolute -left-3 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-white" />}
            <n.icon className="size-[19px] shrink-0" />
            {!mini && <span className="flex-1 truncate">{n.label}</span>}
            {n.badge && (mini
              ? <span className="absolute right-2.5 top-1.5 size-2 rounded-full bg-accent ring-2 ring-[color:var(--brand-base)]" />
              : <span className="grid min-w-5 place-items-center rounded-full bg-white px-1.5 text-[11px] font-bold text-brand">{n.badge}</span>)}
            {mini && (
              <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 whitespace-nowrap rounded-lg bg-ink px-2.5 py-1.5 text-xs font-medium text-on-ink opacity-0 shadow-lg transition group-hover:opacity-100">
                {n.label}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );

  const Brand = ({ mini = false }: { mini?: boolean }) => (
    <Link href={cfg.base} className={cn("flex items-center gap-2.5", mini && "justify-center")}>
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/95 text-lg font-bold text-brand shadow-lg">N</span>
      {!mini && (
        <div className="leading-tight text-white">
          <p className="font-semibold">Nimbus</p>
          <p className="text-[11px] font-medium uppercase tracking-wider text-white/70">{cfg.title} portal</p>
        </div>
      )}
    </Link>
  );

  const Profile = ({ mini = false }: { mini?: boolean }) => (
    <div className={cn("rounded-2xl bg-white/10 ring-1 ring-white/15", mini ? "p-2" : "p-3")}>
      <div className={cn("flex items-center gap-3", mini && "flex-col gap-2")}>
        <div className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-sm font-semibold text-brand">{cfg.initials}</div>
        {!mini && (
          <div className="min-w-0 flex-1 leading-tight text-white">
            <p className="truncate text-sm font-medium">{cfg.business}</p>
            <p className="truncate text-xs text-white/60">{cfg.plan}</p>
          </div>
        )}
        <button onClick={logout} className="grid size-8 place-items-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white" aria-label="Log out" title="Log out"><LogOut className="size-4" /></button>
      </div>
    </div>
  );

  const mobileTabs = cfg.nav.filter((n) => n.mobile).slice(0, 4);

  return (
    <div className={cn("min-h-dvh transition-[padding] duration-300", collapsed ? "lg:pl-[104px]" : "lg:pl-[272px]")}>
      {/* Desktop sidebar: full or icon-only */}
      <aside
        className={cn(
          "bg-sidebar fixed inset-y-3 left-3 z-30 hidden flex-col gap-6 rounded-3xl p-4 shadow-[0_20px_50px_-20px_var(--brand-base)] transition-[width] duration-300 lg:flex",
          collapsed ? "w-[80px] px-3" : "w-[248px]",
        )}
      >
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-9 z-10 grid size-7 place-items-center rounded-full border border-line bg-surface text-ink shadow-md transition hover:scale-110"
          aria-label={collapsed ? "Open sidebar" : "Close sidebar"}
          title={collapsed ? "Open sidebar" : "Close sidebar"}
        >
          {collapsed ? <ChevronsRight className="size-4" /> : <ChevronsLeft className="size-4" />}
        </button>
        <div className={cn("pt-1", !collapsed && "px-2")}>{Brand({ mini: collapsed })}</div>
        <div className={cn("flex-1", collapsed ? "overflow-visible" : "overflow-y-auto px-1")}>{NavList({ mini: collapsed })}</div>
        <Link href="/" title="View website" className={cn("flex items-center gap-2 text-sm text-white/70 hover:text-white", collapsed ? "justify-center" : "px-3")}>
          <ExternalLink className="size-4" /> {!collapsed && "View website"}
        </Link>
        {Profile({ mini: collapsed })}
      </aside>

      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-line/70 bg-paper/70 backdrop-blur-xl lg:border-none lg:bg-transparent lg:pt-3 lg:backdrop-blur-none">
        <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:mx-5 lg:rounded-2xl lg:border lg:border-line lg:bg-surface/70 lg:px-4 lg:shadow-soft lg:backdrop-blur-xl">
          <button onClick={() => setDrawer(true)} className="-ml-2 grid size-10 place-items-center rounded-full hover:bg-ink/5 lg:hidden" aria-label="Menu"><Menu className="size-5" /></button>
          <button onClick={toggleSidebar} className="-ml-1 hidden size-10 place-items-center rounded-full text-muted hover:bg-ink/5 hover:text-ink lg:grid" aria-label="Toggle sidebar" title="Toggle sidebar"><PanelLeft className="size-5" /></button>
          <p className="truncate font-semibold lg:hidden">{cfg.business}</p>
          <label className="hidden h-10 max-w-md flex-1 items-center gap-2 rounded-full border border-line bg-paper/70 px-4 focus-within:border-brand md:flex">
            <Search className="size-4 text-muted" />
            <input placeholder={role === "wholesaler" ? "Search products, orders, retailers…" : "Search orders, products, customers…"} className="w-full bg-transparent text-sm outline-none" />
            <kbd className="rounded border border-line px-1.5 text-[10px] text-muted">⌘K</kbd>
          </label>
          <div className="ml-auto flex items-center gap-1">
            <ThemeToggle />
            <button className="relative grid size-10 place-items-center rounded-full hover:bg-ink/5" aria-label="Notifications">
              <Bell className="size-5" />
              <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-danger ring-2 ring-surface" />
            </button>
            <div className="ml-1 hidden items-center gap-2 sm:flex">
              <div className="grid size-9 place-items-center rounded-full bg-brand-gradient text-sm font-semibold text-white">{cfg.initials}</div>
              <div className="hidden leading-tight xl:block">
                <p className="text-sm font-medium">{cfg.user}</p>
                <p className="text-xs text-muted">Owner</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-12">{children}</main>

      {/* Mobile drawer */}
      {drawer && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-night/60 backdrop-blur-sm" onClick={() => setDrawer(false)} />
          <aside className="bg-sidebar animate-slide-in absolute inset-y-0 left-0 flex w-[84%] max-w-xs flex-col gap-5 p-4">
            <div className="flex items-center justify-between px-2 pt-2">
              {Brand({})}
              <button onClick={() => setDrawer(false)} className="grid size-9 place-items-center rounded-full text-white hover:bg-white/10" aria-label="Close"><X className="size-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-1">
              {NavList({})}
              <ThemePanel className="mt-6 rounded-2xl border border-line bg-surface p-3" />
            </div>
            <Link href="/" className="flex items-center gap-2 px-3 text-sm text-white/70"><ExternalLink className="size-4" /> View website</Link>
            {Profile({})}
          </aside>
        </div>
      )}

      {/* Mobile bottom tabs */}
      <nav className="pb-safe fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/90 backdrop-blur-xl lg:hidden">
        <div className="grid grid-cols-5 pt-1.5">
          {mobileTabs.map((n) => {
            const active = isActive(n.href);
            return (
              <Link key={n.href} href={cfg.base + n.href} className={cn("relative flex flex-col items-center gap-0.5 py-1 text-[11px] font-medium", active ? "text-brand" : "text-muted")}>
                <span className={cn("grid h-7 w-12 place-items-center rounded-full transition", active && "bg-brand-soft")}>
                  <n.icon className="size-[20px]" />
                </span>
                <span className="max-w-full truncate px-1">{n.short ?? n.label}</span>
                {n.badge && <span className="absolute right-[20%] top-0 grid min-w-4 place-items-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">{n.badge}</span>}
              </Link>
            );
          })}
          <button onClick={() => setDrawer(true)} className="flex flex-col items-center gap-0.5 py-1 text-[11px] font-medium text-muted">
            <span className="grid h-7 w-12 place-items-center"><MoreHorizontal className="size-[20px]" /></span>
            More
          </button>
        </div>
      </nav>
    </div>
  );
}

export function PageHeader({ title, sub, actions, back }: { title: string; sub?: string; actions?: React.ReactNode; back?: { href: string; label: string } }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {back && <Link href={back.href} className="mb-1 inline-block text-sm text-muted hover:text-ink">← {back.label}</Link>}
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        {sub && <p className="mt-1 text-sm text-muted">{sub}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
