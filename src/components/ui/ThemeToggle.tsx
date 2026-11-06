"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Monitor, Moon, Palette as PaletteIcon, Sun } from "lucide-react";
import { palettes, useTheme, type Mode } from "@/lib/theme";
import { cn } from "./index";

const modes: { id: Mode; label: string; icon: typeof Sun }[] = [
  { id: "light", label: "Light", icon: Sun },
  { id: "dark", label: "Dark", icon: Moon },
  { id: "system", label: "Auto", icon: Monitor },
];

/** Full theme controls: mode + colour palette. Used inside menus and popovers. */
export function ThemePanel({ className }: { className?: string }) {
  const { mode, setMode, palette, setPalette } = useTheme();
  return (
    <div className={className}>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">Appearance</p>
      <div className="grid grid-cols-3 gap-1 rounded-xl bg-ink/5 p-1">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={cn(
              "flex flex-col items-center gap-1 rounded-lg py-2 text-xs font-medium transition",
              mode === m.id ? "bg-surface text-ink shadow-soft" : "text-muted hover:text-ink",
            )}
          >
            <m.icon className="size-4" />
            {m.label}
          </button>
        ))}
      </div>
      <p className="mb-2 mt-4 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
        <PaletteIcon className="size-3.5" /> Colour theme
      </p>
      <div className="grid grid-cols-6 gap-2">
        {palettes.map((p) => (
          <button
            key={p.id}
            onClick={() => setPalette(p.id)}
            title={p.name}
            aria-label={`${p.name} colour theme`}
            className={cn(
              "relative grid aspect-square place-items-center rounded-full ring-2 ring-offset-2 ring-offset-surface transition hover:scale-105",
              palette === p.id ? "ring-ink" : "ring-transparent",
            )}
            style={{ background: `linear-gradient(135deg, ${p.colors[0]}, ${p.colors[1]})` }}
          >
            {palette === p.id && <Check className="size-3.5 text-white" />}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Round icon button that opens the theme popover. */
export function ThemeToggle({ className, align = "right" }: { className?: string; align?: "left" | "right" }) {
  const { isDark, setMode } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        onClick={() => setOpen(!open)}
        onDoubleClick={() => setMode(isDark ? "light" : "dark")}
        className="grid size-10 place-items-center rounded-full text-ink transition hover:bg-ink/5"
        aria-label="Theme settings"
        aria-expanded={open}
      >
        <Sun className="size-5 dark:hidden" />
        <Moon className="hidden size-5 dark:block" />
      </button>
      {open && (
        <div className={cn("animate-pop absolute top-12 z-50 w-64 rounded-2xl border border-line bg-surface p-4 shadow-2xl", align === "right" ? "right-0" : "left-0")}>
          <ThemePanel />
        </div>
      )}
    </div>
  );
}
