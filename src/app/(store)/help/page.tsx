import { BRAND } from "@/lib/data";

export const metadata = { title: "Help" };

const faqs = [
  ["How fast is delivery?", "Orders placed before 4pm (Mon–Fri) go out the same day for next-day delivery. Standard delivery takes 2–3 working days and is free over £20."],
  ["Why do you check my age?", "UK law says vaping products can only be sold to adults 18 and over. We check your age at checkout, and an adult with photo ID must sign for the parcel."],
  ["Can I return an item?", "Sealed, unused items can be sent back within 30 days. Faulty devices are covered by the maker's warranty."],
  ["Do you sell disposable vapes?", "No. Single-use vapes have been banned in the UK since June 2025. We sell refillable, rechargeable kits only."],
  ["How do I recycle my old device?", "Request a free returns label from your account and we'll recycle old devices and batteries safely."],
  ["How do I open a trade account?", "Go to the Trade page and apply as a retailer or wholesaler. We approve most applications within 24 hours."],
];

export default function Help() {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-10">
      <h1 className="text-4xl font-semibold tracking-tight">Help & delivery</h1>
      <p className="mt-2 text-muted">Can&apos;t find an answer? Email {BRAND.email} or call {BRAND.phone}.</p>
      <div className="mt-8 divide-y divide-line rounded-2xl border border-line bg-surface">
        {faqs.map(([q, a]) => (
          <details key={q} className="group p-5">
            <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
              {q}
              <span className="text-xl text-muted transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-sm text-muted">{a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
