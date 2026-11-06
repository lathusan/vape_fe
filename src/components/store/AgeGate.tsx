"use client";

import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { BRAND } from "@/lib/data";

// UK law: nicotine-inhaling products may only be sold to adults 18+.
// This splash is the first line only. Real age checks still run at checkout/delivery.
export function AgeGate() {
  const [show, setShow] = useState(false);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem("nimbus.age") !== "ok") setShow(true);
    } catch {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-ink/70 p-0 backdrop-blur-md sm:items-center sm:p-6">
      <div className="animate-slide-up w-full max-w-md rounded-t-3xl bg-surface p-7 pb-safe sm:rounded-3xl sm:p-9">
        <div className="mb-5 flex items-center gap-2">
          <span className="grid size-10 place-items-center rounded-2xl bg-brand-gradient text-white font-bold">N</span>
          <span className="text-lg font-semibold">{BRAND.full}</span>
        </div>
        {!denied ? (
          <>
            <h2 className="text-2xl font-semibold tracking-tight">Are you 18 or over?</h2>
            <p className="mt-2 text-[15px] text-muted">
              You must be 18 or over to visit this site. Vaping products are for adult smokers and ex-smokers only.
            </p>
            <div className="mt-7 grid grid-cols-2 gap-3">
              <button onClick={() => setDenied(true)} className="h-12 rounded-full border border-line font-medium hover:bg-ink/5">
                No, I&apos;m under 18
              </button>
              <button
                onClick={() => {
                  try { localStorage.setItem("nimbus.age", "ok"); } catch {}
                  setShow(false);
                }}
                className="h-12 rounded-full bg-ink font-medium text-on-ink hover:bg-ink/85"
              >
                Yes, I&apos;m 18+
              </button>
            </div>
            <p className="mt-5 flex items-start gap-2 text-xs text-muted">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-success" />
              We verify age at checkout and an ID check is needed on delivery.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold tracking-tight">Sorry, you can&apos;t enter</h2>
            <p className="mt-2 text-[15px] text-muted">
              This site is only for adults aged 18 and over. If you want help to stop smoking, the NHS can help.
            </p>
            <a href="https://www.nhs.uk/better-health/quit-smoking/" className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-ink font-medium text-on-ink">
              Visit NHS Better Health
            </a>
          </>
        )}
      </div>
    </div>
  );
}
