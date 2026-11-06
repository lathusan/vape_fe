import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card, cn } from "@/components/ui";

export function StatCard({ label, value, delta, icon: Icon, dark }: { label: string; value: string; delta?: number; icon: LucideIcon; dark?: boolean }) {
  return (
    <Card className={cn("relative overflow-hidden p-4 sm:p-5", dark && "border-transparent bg-brand-gradient text-white")}>
      {dark && <div className="pointer-events-none absolute -right-10 -top-10 size-36 rounded-full bg-white/15 blur-2xl" />}
      <div className="relative flex items-center justify-between">
        <p className={cn("text-sm", dark ? "text-white/80" : "text-muted")}>{label}</p>
        <span className={cn("grid size-8 place-items-center rounded-lg", dark ? "bg-white/20 text-white" : "bg-brand-soft text-brand")}><Icon className="size-4" /></span>
      </div>
      <p className="relative mt-3 text-2xl font-semibold tracking-tight sm:text-[28px]">{value}</p>
      {delta !== undefined && (
        <p className={cn("relative mt-1 inline-flex items-center gap-0.5 text-xs font-medium", dark ? "text-white" : delta >= 0 ? "text-success" : "text-danger")}>
          {delta >= 0 ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
          {Math.abs(delta)}% <span className={cn("font-normal", dark ? "text-white/70" : "text-muted")}>vs last month</span>
        </p>
      )}
    </Card>
  );
}

// Lightweight bar chart (no chart library). Colours follow the active theme.
export function BarChart({ data, labels, prefix = "£" }: { data: number[]; labels: string[]; prefix?: string }) {
  const max = Math.max(...data) * 1.1;
  return (
    <div>
      <div className="relative h-52 sm:h-60">
        {[0.25, 0.5, 0.75, 1].map((g) => (
          <div key={g} className="absolute inset-x-0 border-t border-dashed border-line" style={{ bottom: `${g * 100}%` }}>
            <span className="absolute -top-2.5 right-0 bg-surface pl-1 text-[10px] text-muted">{prefix}{Math.round((max * g) / 1000)}k</span>
          </div>
        ))}
        <div className="absolute inset-0 flex items-end gap-[3%] pr-8">
          {data.map((v, i) => {
            const last = i === data.length - 1;
            return (
              <div key={i} className="group relative flex h-full flex-1 items-end">
                <div
                  className={cn("w-full rounded-t-lg transition-all duration-300 group-hover:opacity-100", last ? "bg-brand-gradient shadow-[0_8px_24px_-8px_var(--brand)]" : "bg-brand/20 group-hover:bg-brand/40")}
                  style={{ height: `${(v / max) * 100}%` }}
                />
                <span className="pointer-events-none absolute left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-1.5 py-0.5 text-[10px] text-on-ink group-hover:block" style={{ bottom: `calc(${(v / max) * 100}% + 6px)` }}>
                  {prefix}{v.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-2 flex gap-[3%] pr-8">
        {labels.map((l) => (
          <span key={l} className="flex-1 text-center text-[10px] text-muted sm:text-xs">{l}</span>
        ))}
      </div>
    </div>
  );
}

export function Tabs<T extends string>({ value, onChange, items }: { value: T; onChange: (v: T) => void; items: { id: T; label: string; count?: number }[] }) {
  return (
    <div className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      {items.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={cn("flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-sm font-medium transition", value === t.id ? "bg-ink text-on-ink" : "border border-line bg-surface text-ink/70 hover:text-ink")}
        >
          {t.label}
          {t.count !== undefined && <span className={cn("rounded-full px-1.5 text-[11px]", value === t.id ? "bg-on-ink/20" : "bg-ink/5")}>{t.count}</span>}
        </button>
      ))}
    </div>
  );
}

export const fmtDate = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

// Table on desktop, stacked cards on mobile.
export function Th({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <th className={cn("px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted", className)}>{children}</th>;
}
export function Td({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <td className={cn("px-4 py-3.5 text-sm", className)}>{children}</td>;
}
