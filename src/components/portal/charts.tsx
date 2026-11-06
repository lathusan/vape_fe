"use client";

import { useId, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card, cn } from "@/components/ui";

// ---------------------------------------------------------------------------
// Gradient sets. "brand" follows the chosen colour theme; the rest are fixed
// so dashboards stay colourful whatever palette is picked.
// ---------------------------------------------------------------------------
export const gradients = {
  brand: ["var(--brand-base)", "var(--brand-2-base)"],
  sunset: ["#ff7a45", "#ff3d7f"],
  aqua: ["#11c5a5", "#2f80ed"],
  grape: ["#8b5cf6", "#d946ef"],
  gold: ["#f7b733", "#fc4a1a"],
  sky: ["#38bdf8", "#6366f1"],
} as const;
export type GradientName = keyof typeof gradients;
export const gradientCss = (g: GradientName, angle = 135) => `linear-gradient(${angle}deg, ${gradients[g][0]}, ${gradients[g][1]})`;

// Series colours for donuts / legends
export const seriesColors = ["var(--brand-base)", "#11c5a5", "#ff7a45", "#d946ef", "#f7b733", "#38bdf8"];

// ---------------------------------------------------------------------------
// KPI card with a full gradient background
// ---------------------------------------------------------------------------
export function KpiCard({ label, value, delta, icon: Icon, gradient = "brand", spark }: { label: string; value: string; delta?: number; icon: LucideIcon; gradient?: GradientName; spark?: number[] }) {
  const id = useId();
  return (
    <div className="relative overflow-hidden rounded-2xl p-4 text-white shadow-[0_14px_30px_-14px_rgba(0,0,0,0.45)] sm:p-5" style={{ background: gradientCss(gradient) }}>
      <div className="pointer-events-none absolute -right-8 -top-10 size-32 rounded-full bg-white/20 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-6 size-28 rounded-full bg-black/10 blur-2xl" />
      <div className="relative flex items-start justify-between gap-2">
        <p className="text-sm text-white/85">{label}</p>
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/20 ring-1 ring-white/25 backdrop-blur"><Icon className="size-[18px]" /></span>
      </div>
      <p className="relative mt-2 text-2xl font-semibold tracking-tight sm:text-[28px]">{value}</p>
      <div className="relative mt-1 flex items-end justify-between gap-2">
        {delta !== undefined ? (
          <span className="inline-flex items-center gap-0.5 rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-medium">
            {delta >= 0 ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
            {Math.abs(delta)}% <span className="hidden font-normal text-white/80 sm:inline">vs last month</span>
          </span>
        ) : <span />}
        {spark && (
          <svg viewBox="0 0 100 30" className="h-8 w-20 overflow-visible" aria-hidden>
            <defs>
              <linearGradient id={`${id}s`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#fff" stopOpacity="0.5" />
                <stop offset="1" stopColor="#fff" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={`${smooth(scale(spark, 100, 30))} L100,30 L0,30 Z`} fill={`url(#${id}s)`} />
            <path d={smooth(scale(spark, 100, 30))} fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Smooth line helpers
// ---------------------------------------------------------------------------
type Pt = [number, number];
function scale(data: number[], w: number, h: number, pad = 2, max?: number, min?: number): Pt[] {
  const mx = max ?? Math.max(...data);
  const mn = min ?? Math.min(...data);
  return data.map((v, i) => [(i / (data.length - 1)) * w, h - pad - ((v - mn) / (mx - mn || 1)) * (h - pad * 2)]);
}
function smooth(pts: Pt[]) {
  if (!pts.length) return "";
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${p2[0]},${p2[1]}`;
  }
  return d;
}

// ---------------------------------------------------------------------------
// Area chart: gradient fill + optional comparison line
// ---------------------------------------------------------------------------
export function AreaChart({ data, compare, labels, prefix = "£" }: { data: number[]; compare?: number[]; labels: string[]; prefix?: string }) {
  const id = useId();
  const W = 600, H = 220;
  const all = [...data, ...(compare ?? [])];
  const max = Math.max(...all) * 1.12;
  const min = 0;
  const pts = scale(data, W, H, 6, max, min);
  const cmp = compare ? scale(compare, W, H, 6, max, min) : null;
  return (
    <div>
      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-52 w-full overflow-visible sm:h-60">
          <defs>
            <linearGradient id={`${id}f`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" style={{ stopColor: "var(--brand-base)" }} stopOpacity="0.45" />
              <stop offset="1" style={{ stopColor: "var(--brand-2-base)" }} stopOpacity="0" />
            </linearGradient>
            <linearGradient id={`${id}l`} x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" style={{ stopColor: "var(--brand-2-base)" }} />
              <stop offset="1" style={{ stopColor: "var(--brand-base)" }} />
            </linearGradient>
          </defs>
          {[0.25, 0.5, 0.75].map((g) => (
            <line key={g} x1="0" x2={W} y1={H * g} y2={H * g} stroke="var(--line)" strokeDasharray="4 6" vectorEffect="non-scaling-stroke" />
          ))}
          {cmp && <path d={smooth(cmp)} fill="none" stroke="#ff7a45" strokeWidth="2" strokeDasharray="6 6" strokeLinecap="round" vectorEffect="non-scaling-stroke" opacity="0.8" />}
          <path d={`${smooth(pts)} L${W},${H} L0,${H} Z`} fill={`url(#${id}f)`} />
          <path d={smooth(pts)} fill="none" stroke={`url(#${id}l)`} strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </svg>
        {/* Hover points as HTML so they stay round when the SVG stretches */}
        <div className="absolute inset-0">
          {pts.map(([x, y], i) => (
            <div key={i} className="group absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%` }}>
              <span className={cn("block size-3 rounded-full border-2 border-surface bg-brand opacity-0 shadow transition group-hover:opacity-100", i === pts.length - 1 && "opacity-100 ring-4 ring-brand/20")} />
              <span className="pointer-events-none absolute bottom-5 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink px-2 py-1 text-[11px] font-medium text-on-ink group-hover:block">
                {labels[i]}: {prefix}{data[i].toLocaleString()}
              </span>
              <span className="absolute -inset-3" />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-muted sm:text-xs">
        {labels.map((l) => <span key={l}>{l}</span>)}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Donut chart
// ---------------------------------------------------------------------------
export function Donut({ items, center, sub }: { items: { label: string; value: number }[]; center: string; sub?: string }) {
  const total = items.reduce((s, i) => s + i.value, 0);
  const R = 42, C = 2 * Math.PI * R;
  let acc = 0;
  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center xl:flex-col 2xl:flex-row">
      <div className="relative size-44 shrink-0">
        <svg viewBox="0 0 100 100" className="size-full -rotate-90">
          <circle cx="50" cy="50" r={R} fill="none" stroke="var(--line)" strokeWidth="11" opacity="0.6" />
          {items.map((it, i) => {
            const len = (it.value / total) * C;
            const el = (
              <circle
                key={it.label}
                cx="50" cy="50" r={R} fill="none"
                stroke={seriesColors[i % seriesColors.length]}
                strokeWidth="11"
                strokeDasharray={`${Math.max(len - 1.5, 0)} ${C}`}
                strokeDashoffset={-acc}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
            );
            acc += len;
            return el;
          })}
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            <p className="text-xl font-semibold tracking-tight">{center}</p>
            {sub && <p className="text-xs text-muted">{sub}</p>}
          </div>
        </div>
      </div>
      <ul className="grid w-full grid-cols-2 gap-x-4 gap-y-2.5 text-sm sm:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-1">
        {items.map((it, i) => (
          <li key={it.label} className="flex items-center gap-2">
            <span className="size-2.5 shrink-0 rounded-full" style={{ background: seriesColors[i % seriesColors.length] }} />
            <span className="flex-1 truncate text-muted">{it.label}</span>
            <span className="font-medium">{Math.round((it.value / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Semi-circle gauge
// ---------------------------------------------------------------------------
export function Gauge({ value, label, sub }: { value: number; label: string; sub?: string }) {
  const id = useId();
  const v = Math.max(0, Math.min(100, value));
  const R = 80, len = Math.PI * R;
  const angle = -90 + (v / 100) * 180;
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 118" className="w-full max-w-[260px]">
        <defs>
          <linearGradient id={`${id}g`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#ff7a45" />
            <stop offset="0.5" stopColor="#f7b733" />
            <stop offset="1" stopColor="#11c5a5" />
          </linearGradient>
        </defs>
        <path d="M20,100 A80,80 0 0 1 180,100" fill="none" stroke="var(--line)" strokeWidth="16" strokeLinecap="round" />
        <path d="M20,100 A80,80 0 0 1 180,100" fill="none" stroke={`url(#${id}g)`} strokeWidth="16" strokeLinecap="round" strokeDasharray={`${(v / 100) * len} ${len}`} className="transition-all duration-700" />
        <g transform={`rotate(${angle} 100 100)`} className="transition-transform duration-700">
          <path d="M97,100 L100,34 L103,100 Z" fill="var(--ink)" />
        </g>
        <circle cx="100" cy="100" r="8" fill="var(--ink)" />
        <circle cx="100" cy="100" r="3" fill="var(--surface)" />
      </svg>
      <p className="-mt-1 text-3xl font-semibold tracking-tight text-brand-gradient">{v}%</p>
      <p className="mt-1 text-sm font-medium">{label}</p>
      {sub && <p className="text-xs text-muted">{sub}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Circular progress ring
// ---------------------------------------------------------------------------
export function Ring({ value, label, gradient = "brand", size = 88 }: { value: number; label: string; gradient?: GradientName; size?: number }) {
  const id = useId();
  const R = 40, C = 2 * Math.PI * R;
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 100 100" className="size-full -rotate-90">
          <defs>
            <linearGradient id={`${id}r`} x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" style={{ stopColor: gradients[gradient][0] }} />
              <stop offset="1" style={{ stopColor: gradients[gradient][1] }} />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r={R} fill="none" stroke="var(--line)" strokeWidth="9" />
          <circle cx="50" cy="50" r={R} fill="none" stroke={`url(#${id}r)`} strokeWidth="9" strokeLinecap="round" strokeDasharray={`${(value / 100) * C} ${C}`} className="transition-all duration-700" />
        </svg>
        <span className="absolute inset-0 grid place-items-center text-lg font-semibold">{value}%</span>
      </div>
      <p className="mt-2 text-xs font-medium text-muted">{label}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Horizontal gradient progress bars
// ---------------------------------------------------------------------------
export function GradientBars({ items, max, format }: { items: { label: string; value: number; sub?: string }[]; max?: number; format?: (n: number) => string }) {
  const top = max ?? Math.max(...items.map((i) => i.value));
  const order: GradientName[] = ["brand", "aqua", "sunset", "grape", "gold", "sky"];
  return (
    <ul className="space-y-4">
      {items.map((it, i) => (
        <li key={it.label}>
          <div className="mb-1.5 flex items-baseline justify-between gap-2 text-sm">
            <span className="truncate font-medium">{it.label}</span>
            <span className="shrink-0 text-muted">{format ? format(it.value) : it.value}{it.sub && <span className="ml-1 text-xs">{it.sub}</span>}</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-ink/5">
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(it.value / top) * 100}%`, background: gradientCss(order[i % order.length], 90) }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function ChartCard({ title, sub, action, children, className }: { title: string; sub?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <Card className={cn("p-5", className)}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold">{title}</h2>
          {sub && <p className="text-xs text-muted">{sub}</p>}
        </div>
        {action}
      </div>
      {children}
    </Card>
  );
}

export function Legend({ items }: { items: { label: string; color: string; dashed?: boolean }[] }) {
  return (
    <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
      {items.map((i) => (
        <span key={i.label} className="flex items-center gap-1.5">
          <span className={cn("h-0.5 w-4 rounded", i.dashed && "border-t-2 border-dashed bg-transparent")} style={i.dashed ? { borderColor: i.color } : { background: i.color, height: 3 }} />
          {i.label}
        </span>
      ))}
    </div>
  );
}
