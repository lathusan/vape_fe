import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { ThemeProvider, themeInitScript } from "@/lib/theme";
import { AgeGate } from "@/components/store/AgeGate";
import { BRAND } from "@/lib/data";

export const metadata: Metadata = {
  title: { default: `${BRAND.full} | UK vape store & wholesale`, template: `%s | ${BRAND.name}` },
  description: "Pod kits, e-liquids, nic salts and coils for adults 18+. Retail delivery across the UK and trade accounts for vape shops.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f5f8" },
    { media: "(prefers-color-scheme: dark)", color: "#07080c" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: the theme script and browser extensions change <html> attributes before React loads
    <html lang="en-GB" className={`${GeistSans.variable} ${GeistMono.variable}`} data-palette="ocean" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-dvh font-sans antialiased" suppressHydrationWarning>
        <ThemeProvider>
          <StoreProvider>
            {children}
            <AgeGate />
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
