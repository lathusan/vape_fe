import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { twMerge } from "tailwind-merge";

// Joins class names; later classes win over earlier ones (e.g. a Card with bg-ink overrides bg-surface)
export function cn(...c: (string | false | null | undefined)[]) {
  return twMerge(c.filter(Boolean).join(" "));
}

type BtnVariant = "primary" | "ink" | "accent" | "outline" | "ghost" | "danger" | "soft";
type BtnSize = "sm" | "md" | "lg";

const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap";
const btnVariants: Record<BtnVariant, string> = {
  primary: "bg-brand text-on-brand shadow-[0_8px_24px_-10px_var(--brand)] hover:brightness-110",
  ink: "bg-ink text-on-ink hover:bg-ink/85",
  accent: "bg-accent text-on-accent hover:bg-accent/85",
  outline: "border border-line bg-surface text-ink hover:border-ink/30",
  ghost: "text-ink hover:bg-ink/5",
  danger: "bg-danger text-white hover:opacity-90",
  soft: "bg-brand-soft text-brand hover:bg-brand/15",
};
const btnSizes: Record<BtnSize, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: BtnVariant; size?: BtnSize }) {
  return <button className={cn(btnBase, btnVariants[variant], btnSizes[size], className)} {...props} />;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: BtnVariant; size?: BtnSize }) {
  return <Link className={cn(btnBase, btnVariants[variant], btnSizes[size], className)} {...props} />;
}

export function Card({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("rounded-2xl border border-line bg-surface shadow-soft", className)} {...props} />;
}

export function Badge({ tone = "neutral", children, className }: { tone?: "neutral" | "accent" | "brand" | "success" | "warn" | "danger" | "dark"; children: ReactNode; className?: string }) {
  const tones = {
    neutral: "bg-ink/5 text-ink",
    accent: "bg-accent text-on-accent",
    brand: "bg-brand-soft text-brand",
    success: "bg-success/10 text-success",
    warn: "bg-warn/15 text-warn",
    danger: "bg-danger/10 text-danger",
    dark: "bg-ink text-on-ink",
  };
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium", tones[tone], className)}>
      {children}
    </span>
  );
}

const statusTone: Record<string, Parameters<typeof Badge>[0]["tone"]> = {
  pending: "warn", processing: "brand", packed: "brand", shipped: "brand", delivered: "success", cancelled: "neutral", refunded: "neutral",
  active: "success", draft: "neutral", out_of_stock: "danger",
  Paid: "success", Unpaid: "warn", "On account": "brand", Refunded: "neutral", Overdue: "danger",
  Completed: "success", Pending: "warn", Failed: "danger",
  approved: "success", suspended: "danger",
};

export function StatusPill({ status }: { status: string }) {
  const label = status.replace(/_/g, " ");
  return (
    <Badge tone={statusTone[status] ?? "neutral"} className="capitalize">
      <span className="size-1.5 rounded-full bg-current opacity-70" />
      {label}
    </Badge>
  );
}

export function Field({ label, hint, children, className }: { label: string; hint?: string; children: ReactNode; className?: string }) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

const inputCls =
  "w-full h-11 rounded-xl border border-line bg-surface px-3.5 text-[15px] outline-none transition placeholder:text-muted/70 focus:border-brand focus:ring-4 focus:ring-brand/10";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(inputCls, className)} {...props} />;
}
export function Select({ className, children, ...props }: ComponentProps<"select">) {
  return (
    <select className={cn(inputCls, "appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%236b6b73%22 stroke-width=%222%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[right_14px_center] bg-no-repeat pr-9", className)} {...props}>
      {children}
    </select>
  );
}
export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(inputCls, "h-auto min-h-28 py-3", className)} {...props} />;
}

export function Toggle({ defaultChecked, label }: { defaultChecked?: boolean; label?: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <input type="checkbox" defaultChecked={defaultChecked} className="peer sr-only" />
      <span className="relative h-6 w-11 rounded-full bg-ink/15 transition peer-checked:bg-brand after:absolute after:left-0.5 after:top-0.5 after:size-5 after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:translate-x-5" />
      {label && <span className="text-sm">{label}</span>}
    </label>
  );
}

export function SectionTitle({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: ReactNode }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-brand">{eyebrow}</p>}
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}
