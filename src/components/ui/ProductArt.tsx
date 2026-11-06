import type { CategoryId } from "@/lib/data";
import { cn } from "./index";

// Placeholder product imagery drawn in SVG so the mock needs no photo assets.
// Swap for <Image src=...> once real product photography exists.

const palettes: Record<CategoryId, [string, string, string]> = {
  "pod-kits": ["#ecebff", "#6d5bff", "#2b2170"],
  "e-liquids": ["#efffd0", "#8fc21a", "#2f4a06"],
  "nic-salts": ["#fff1dc", "#f29a2e", "#6b3a07"],
  "pods-coils": ["#e2f6ff", "#2fa6d8", "#0b4560"],
  "mods-tanks": ["#ffe6ee", "#e8457a", "#5f0f2a"],
  accessories: ["#ededee", "#5b5d66", "#17181c"],
};

export function ProductArt({ category, seed = 0, className }: { category: CategoryId; seed?: number; className?: string }) {
  const [bg, mid, dark] = palettes[category];
  const tilt = ((seed * 37) % 14) - 7;
  return (
    <div className={cn("relative overflow-hidden", className)} style={{ background: `radial-gradient(120% 90% at 30% 20%, var(--surface) 0%, color-mix(in oklab, ${bg} var(--art-mix), var(--surface)) 60%)` }}>
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" aria-hidden>
        <circle cx="150" cy="40" r="46" fill={mid} opacity="0.14" />
        <circle cx="40" cy="170" r="34" fill={mid} opacity="0.1" />
        <g transform={`rotate(${tilt} 100 100)`}>
          {category === "pod-kits" && (
            <>
              <rect x="74" y="34" width="52" height="132" rx="20" fill={dark} />
              <rect x="78" y="38" width="44" height="40" rx="16" fill={mid} opacity="0.85" />
              <rect x="88" y="22" width="24" height="20" rx="6" fill={dark} />
              <circle cx="100" cy="140" r="4" fill={mid} />
              <rect x="84" y="96" width="32" height="3" rx="1.5" fill="#fff" opacity="0.25" />
            </>
          )}
          {(category === "e-liquids" || category === "nic-salts") && (
            <>
              <rect x="80" y="20" width="40" height="26" rx="6" fill={dark} />
              <rect x="70" y="44" width="60" height="124" rx="14" fill={mid} />
              <rect x="70" y="80" width="60" height="56" fill="#fff" opacity="0.9" />
              <rect x="80" y="92" width="40" height="6" rx="3" fill={dark} />
              <rect x="80" y="104" width="28" height="4" rx="2" fill={dark} opacity="0.4" />
              <rect x="80" y="114" width="34" height="4" rx="2" fill={dark} opacity="0.4" />
            </>
          )}
          {category === "pods-coils" && (
            <>
              <rect x="50" y="60" width="36" height="84" rx="14" fill={mid} opacity="0.55" />
              <rect x="82" y="50" width="36" height="94" rx="14" fill={mid} opacity="0.8" />
              <rect x="114" y="60" width="36" height="84" rx="14" fill={mid} />
              <rect x="92" y="40" width="16" height="14" rx="4" fill={dark} />
              <rect x="88" y="100" width="24" height="30" rx="6" fill={dark} opacity="0.5" />
            </>
          )}
          {category === "mods-tanks" && (
            <>
              <rect x="62" y="80" width="76" height="96" rx="14" fill={dark} />
              <rect x="74" y="94" width="52" height="30" rx="6" fill={mid} />
              <rect x="84" y="34" width="32" height="50" rx="8" fill={mid} opacity="0.6" />
              <rect x="90" y="22" width="20" height="16" rx="5" fill={dark} />
              <circle cx="100" cy="150" r="8" fill={mid} />
            </>
          )}
          {category === "accessories" && (
            <>
              <rect x="78" y="40" width="44" height="124" rx="10" fill={dark} />
              <rect x="78" y="40" width="44" height="22" rx="10" fill={mid} />
              <rect x="92" y="32" width="16" height="10" rx="3" fill={mid} />
              <path d="M104 92 l-12 22 h10 l-6 22 l16 -28 h-10 l6 -16z" fill="#c8f031" />
            </>
          )}
        </g>
      </svg>
    </div>
  );
}
