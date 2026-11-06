"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Boxes, Eye, Store, Upload, User } from "lucide-react";
import { useStore, type Role } from "@/lib/store";
import { Button, cn, Field, Input, Select } from "@/components/ui";
import { BRAND } from "@/lib/data";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const types = [
  { id: "customer" as const, label: "Shopper", icon: User, blurb: "Buy for yourself", dest: "/account" },
  { id: "retailer" as const, label: "Retailer", icon: Store, blurb: "Vape shop: buy trade & sell online", dest: "/retailer" },
  { id: "wholesaler" as const, label: "Wholesaler", icon: Boxes, blurb: "Supplier: sell bulk to shops", dest: "/wholesaler" },
];

function normalise(t: string | null): Exclude<Role, "guest"> {
  if (t === "trade" || t === "retailer") return "retailer";
  if (t === "wholesaler") return "wholesaler";
  return "customer";
}

function Shell({ children, side }: { children: React.ReactNode; side: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="flex flex-col px-5 py-6 sm:px-10">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-xl bg-brand-gradient font-bold text-white">N</span>
            <span className="text-lg font-semibold">{BRAND.name}</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted hover:text-ink"><ArrowLeft className="size-4" /> <span className="hidden sm:inline">Back to shop</span></Link>
            <ThemeToggle />
          </div>
        </div>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">{children}</div>
      </div>
      <div className="relative hidden overflow-hidden bg-night p-12 text-white lg:flex lg:flex-col lg:justify-end">
        <div className="absolute -right-20 top-10 size-96 rounded-full bg-brand/50 blur-3xl" />
        <div className="absolute -left-10 bottom-20 size-72 rounded-full bg-accent/25 blur-3xl" />
        <div className="relative">{side}</div>
      </div>
    </div>
  );
}

function TypePicker({ type, setType }: { type: string; setType: (t: Exclude<Role, "guest">) => void }) {
  return (
    <div className="grid grid-cols-3 gap-1 rounded-2xl bg-ink/5 p-1">
      {types.map((t) => (
        <button
          type="button"
          key={t.id}
          onClick={() => setType(t.id)}
          className={cn("flex flex-col items-center gap-1 rounded-xl px-2 py-2.5 text-xs font-medium transition sm:text-sm", type === t.id ? "bg-surface shadow-sm" : "text-muted")}
        >
          <t.icon className="size-4.5" />
          {t.label}
        </button>
      ))}
    </div>
  );
}

export function LoginForm() {
  const sp = useSearchParams();
  const router = useRouter();
  const { setRole } = useStore();
  const [type, setType] = useState(normalise(sp.get("type")));
  const t = types.find((x) => x.id === type)!;

  return (
    <Shell
      side={
        <>
          <p className="text-sm text-accent">One login for every way you trade</p>
          <p className="mt-3 text-4xl font-semibold leading-tight tracking-tight">Shoppers, shops and suppliers.<br />One website.</p>
          <p className="mt-4 max-w-md text-white/60">Each account type opens its own dashboard, with its own prices, orders and payments.</p>
        </>
      }
    >
      <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
      <p className="mt-1 text-muted">Choose your account type to log in.</p>
      <div className="mt-6"><TypePicker type={type} setType={setType} /></div>
      <p className="mt-3 text-center text-xs text-muted">{t.blurb}</p>
      <form
        className="mt-6 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          setRole(type);
          router.push(t.dest);
        }}
      >
        <Field label={type === "customer" ? "Email" : "Business email"}>
          <Input type="email" required placeholder={type === "customer" ? "you@example.com" : "orders@yourshop.co.uk"} defaultValue={type === "customer" ? "amelia.h@example.com" : type === "retailer" ? "orders@cloudnine.co.uk" : "trade@nimbuswholesale.co.uk"} />
        </Field>
        <Field label="Password">
          <div className="relative">
            <Input type="password" required defaultValue="password" />
            <Eye className="absolute right-3.5 top-3.5 size-4 text-muted" />
          </div>
        </Field>
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" defaultChecked className="size-4 accent-ink" /> Remember me</label>
          <a href="#" className="text-brand">Forgot password?</a>
        </div>
        <Button size="lg" className="w-full">Log in as {t.label.toLowerCase()}</Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">
        New here? <Link href={`/register?type=${type}`} className="font-medium text-ink underline">Create a {t.label.toLowerCase()} account</Link>
      </p>
      <p className="mt-8 rounded-xl bg-brand-soft p-3 text-center text-xs text-brand">Demo mode: any details work. Pick a type and press log in.</p>
    </Shell>
  );
}

export function RegisterForm() {
  const sp = useSearchParams();
  const router = useRouter();
  const { setRole } = useStore();
  const [type, setType] = useState(normalise(sp.get("type")));
  const [submitted, setSubmitted] = useState(false);
  const biz = type !== "customer";
  const t = types.find((x) => x.id === type)!;

  if (submitted) {
    return (
      <Shell side={<p className="text-4xl font-semibold tracking-tight">Thanks for applying.</p>}>
        <div className="grid size-14 place-items-center rounded-2xl bg-accent"><Store className="size-7" /></div>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight">Application received</h1>
        <p className="mt-2 text-muted">Our trade team will check your business details and email you within 24 hours. In the meantime you can look around your dashboard in preview mode.</p>
        <Button size="lg" className="mt-8" onClick={() => { setRole(type); router.push(t.dest); }}>Preview my dashboard</Button>
      </Shell>
    );
  }

  return (
    <Shell
      side={
        <>
          <p className="text-sm text-accent">{biz ? "Trade account" : "Shopper account"}</p>
          <p className="mt-3 text-4xl font-semibold leading-tight tracking-tight">{biz ? "Trade prices, credit terms and your own dashboard." : "Faster checkout, order tracking and loyalty points."}</p>
        </>
      }
    >
      <h1 className="text-3xl font-semibold tracking-tight">Create account</h1>
      <p className="mt-1 text-muted">{biz ? "Trade accounts are checked before approval." : "It takes less than a minute."}</p>
      <div className="mt-6"><TypePicker type={type} setType={setType} /></div>
      <form
        className="mt-6 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (biz) setSubmitted(true);
          else { setRole("customer"); router.push("/account"); }
        }}
      >
        <div className="grid grid-cols-2 gap-3">
          <Field label="First name"><Input required /></Field>
          <Field label="Last name"><Input required /></Field>
        </div>
        <Field label="Email"><Input type="email" required /></Field>
        {!biz && <Field label="Date of birth" hint="You must be 18 or over"><Input type="date" required /></Field>}
        {biz && (
          <>
            <Field label="Business name"><Input required placeholder={type === "retailer" ? "e.g. Cloud Nine Vapes Ltd" : "e.g. Northern Vape Distribution Ltd"} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Company number"><Input placeholder="08123456" /></Field>
              <Field label="VAT number"><Input placeholder="GB123456789" /></Field>
            </div>
            <Field label="Business type">
              <Select>
                {type === "retailer" ? (
                  <><option>Independent vape shop</option><option>Convenience store</option><option>Online retailer</option><option>Chain (2+ stores)</option></>
                ) : (
                  <><option>Distributor</option><option>Manufacturer / brand</option><option>Importer</option></>
                )}
              </Select>
            </Field>
            <Field label="Business address postcode"><Input placeholder="LS1 4AP" className="uppercase" /></Field>
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-line bg-surface p-4 text-sm">
              <Upload className="size-5 text-brand" />
              <span><b>Upload documents</b><br /><span className="text-muted">{type === "retailer" ? "Proof of premises & age-of-sale (Challenge 25) policy" : "Proof of MHRA product notifications & company docs"}</span></span>
              <input type="file" className="sr-only" multiple />
            </label>
          </>
        )}
        <Field label="Password"><Input type="password" required /></Field>
        <label className="flex items-start gap-3 text-sm">
          <input type="checkbox" required className="mt-0.5 size-4 accent-ink" />
          <span>I confirm I am 18 or over and agree to the terms and privacy policy.</span>
        </label>
        <Button size="lg" className="w-full">{biz ? "Submit application" : "Create account"}</Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">
        Already have an account? <Link href={`/login?type=${type}`} className="font-medium text-ink underline">Log in</Link>
      </p>
    </Shell>
  );
}
