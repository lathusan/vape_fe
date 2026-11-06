"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type Mode = "light" | "dark" | "system";
export type Palette = "ocean" | "violet" | "emerald" | "sunset" | "rose" | "mono";

export const palettes: { id: Palette; name: string; colors: [string, string] }[] = [
  { id: "ocean", name: "Ocean", colors: ["#2f6bff", "#00b8f0"] },
  { id: "violet", name: "Violet", colors: ["#6d5bff", "#b05cff"] },
  { id: "emerald", name: "Emerald", colors: ["#0d9668", "#2fd39a"] },
  { id: "sunset", name: "Sunset", colors: ["#f0532d", "#ff9a3c"] },
  { id: "rose", name: "Rose", colors: ["#e0336e", "#ff7a9f"] },
  { id: "mono", name: "Mono", colors: ["#3a3f4b", "#6b7280"] },
];

const MODE_KEY = "nimbus.mode";
const PALETTE_KEY = "nimbus.palette";

// Runs in <head> before the page paints, so there is no light/dark "flash".
export const themeInitScript = `(function(){try{var m=localStorage.getItem('${MODE_KEY}')||'system';var p=localStorage.getItem('${PALETTE_KEY}')||'ocean';var d=m==='dark'||(m==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);var r=document.documentElement;r.classList.toggle('dark',d);r.dataset.palette=p;}catch(e){}})();`;

type Ctx = { mode: Mode; setMode: (m: Mode) => void; palette: Palette; setPalette: (p: Palette) => void; isDark: boolean };
const ThemeCtx = createContext<Ctx | null>(null);

function apply(mode: Mode, palette: Palette) {
  const dark = mode === "dark" || (mode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  const root = document.documentElement;
  root.classList.toggle("dark", dark);
  root.dataset.palette = palette;
  return dark;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<Mode>("system");
  const [palette, setPaletteState] = useState<Palette>("ocean");
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    let m: Mode = "system";
    let p: Palette = "ocean";
    try {
      m = (localStorage.getItem(MODE_KEY) as Mode) || "system";
      p = (localStorage.getItem(PALETTE_KEY) as Palette) || "ocean";
    } catch {}
    setModeState(m);
    setPaletteState(p);
    setIsDark(apply(m, p));
  }, []);

  // Follow the OS setting live when in "system" mode
  useEffect(() => {
    if (mode !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const on = () => setIsDark(apply("system", palette));
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [mode, palette]);

  const setMode = useCallback((m: Mode) => {
    setModeState(m);
    try { localStorage.setItem(MODE_KEY, m); } catch {}
    setIsDark(apply(m, (document.documentElement.dataset.palette as Palette) || "ocean"));
  }, []);

  const setPalette = useCallback((p: Palette) => {
    setPaletteState(p);
    try { localStorage.setItem(PALETTE_KEY, p); } catch {}
    document.documentElement.dataset.palette = p;
  }, []);

  return <ThemeCtx.Provider value={{ mode, setMode, palette, setPalette, isDark }}>{children}</ThemeCtx.Provider>;
}

export function useTheme() {
  const v = useContext(ThemeCtx);
  if (!v) throw new Error("useTheme must be used inside ThemeProvider");
  return v;
}
