# Nimbus Vape Co. – Frontend mock (Next.js)

A clickable, fully responsive **frontend mock** for a UK vape website that does **retail and wholesale on one URL**.
It has no backend yet. All data is mock data in `src/lib/data.ts`, and login is simulated.

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 4** (design tokens in `src/app/globals.css`)
- **lucide-react** icons, **Geist** font (bundled locally, so no Google Fonts call)
- **Light / dark / auto mode + 6 colour themes** (Ocean, Violet, Emerald, Sunset, Rose, Mono), switchable from the sun/moon button in every header, saved per browser
- **Gradient dashboards**: gradient KPI cards with sparklines, area chart (this year vs last year), donut, target gauge, progress rings and gradient bars (`src/components/portal/charts.tsx`, no chart library)
- **Collapsible gradient sidebar**: the « » button on its edge (or the panel icon in the top bar) shrinks it to an icon-only rail with tooltips, remembered per browser
- Mobile-first: bottom tab bars, slide-in drawers and bottom sheets on phones; sidebars and tables on desktop

## Run it

```bash
npm install
npm run dev
# open http://localhost:3000
```

Production build: `npm run build && npm start`

> **Demo login:** go to `/login`, pick **Shopper**, **Retailer** or **Wholesaler** and press log in. Any details work.
> The 18+ age gate shows on the first visit. To see it again, clear the site's localStorage.

---

## How one URL serves three kinds of user

| Who | Logs in at | Lands on | What they do |
|---|---|---|---|
| **Shopper** (public, 18+) | `/login` → Shopper | `/account` | Buys single items at retail prices (inc VAT) |
| **Retailer** (vape shop) | `/login?type=retailer` | `/retailer` | Buys stock wholesale **and** sells to shoppers |
| **Wholesaler** (supplier / distributor) | `/login?type=wholesaler` | `/wholesaler` | Sells in bulk to retailers |

The public shop is the same for everyone. When a **retailer** is logged in, product cards and pages show
**trade prices** and a "restock" button instead of the retail basket.

---

## Theming

All colours are CSS variables in `src/app/globals.css`, never hard-coded in components:

| Token | Use |
|---|---|
| `paper`, `surface`, `line` | page background, cards, borders |
| `ink`, `muted`, `on-ink` | main text, secondary text, text on ink-coloured buttons |
| `brand`, `brand-2`, `brand-soft` | theme colour, gradient end, tinted backgrounds (`bg-brand-gradient`) |
| `accent`, `on-accent` | highlight colour (e.g. "Shop now") |
| `night` | sections that stay dark in both modes (hero, footer) |

- `.dark` on `<html>` switches to dark values; `data-palette="..."` on `<html>` picks the colour theme
- To change the default brand colour, edit `--brand-base`, `--brand-2-base` and `--accent-base` in `:root`
- To add a palette, add a `[data-palette="name"]` rule in `globals.css` and an entry in `src/lib/theme.tsx`

## Pages

### Public website
| Route | Page |
|---|---|
| `/` | Home: hero, categories, best sellers, "two ways to buy" (retail vs trade), trust badges |
| `/shop` | Product listing with category chips, brand/price/stock filters (bottom sheet on mobile), sort, search |
| `/product/[slug]` | Product detail: gallery, colour & nicotine options, nicotine warning, trade price teaser, sticky add-to-basket on mobile |
| `/checkout` | Checkout with age check (DOB), UK postcode, delivery options, Apple Pay / Google Pay / PayPal / card |
| `/trade` | Wholesale landing: apply as retailer or wholesaler, tiers (Bronze / Silver / Gold) |
| `/login`, `/register` | One login with an account-type switch. Trade sign-up asks for company no., VAT and documents |
| `/account` | Shopper account: orders + "buy again", wishlist, addresses, settings, loyalty points |
| `/help` | FAQ: delivery, age checks, returns, recycling |

### Wholesaler portal (`/wholesaler`)
| Route | Feature |
|---|---|
| `/wholesaler` | Dashboard: trade revenue, open orders, active retailers, unpaid invoices, sales chart, low stock, retailer applications, top sellers |
| `/products` | Product list (table on desktop, cards on mobile), status tabs, search, category filter, bulk actions |
| `/products/new`, `/products/[id]/edit` | Add / edit product: details, images, **tiered trade prices + MOQ**, stock, options, **UK TPD compliance** (MHRA ECID, 20mg/ml limit check), visibility per tier |
| `/products/[id]` | View product: stats, price breaks, compliance, activity log |
| `/price-list` | Editable trade price list: inline edit tiers & MOQ, raise or lower all prices by a %, effective date, publish & notify retailers, CSV/PDF |
| `/orders`, `/orders/[id]` | Trade orders: status flow (pending → delivered), VAT invoice, delivery note, shipping label, payment terms |
| `/retailers` | Retail customers: approve or decline applications, set tier, credit limit, payment terms, extra discount |
| `/payments` | Money in, outstanding & overdue invoices, transactions, accepted payment methods, payout bank, overdue reminders |
| `/reports` | Revenue by month, sales by category and by region |
| `/settings` | Business details, team, delivery, compliance documents, notifications |

### Retailer portal (`/retailer`)
| Route | Feature |
|---|---|
| `/retailer` | Dashboard: sales today, orders to send, stock value, next payout, trade credit used, low stock → restock |
| `/orders`, `/orders/[id]` | Online shop orders with **age-verified** badge, packing slip, status flow, refunds |
| `/products` (+ new / view / edit) | Own products with selling price, cost, **live margin**, online/in-store visibility |
| `/price-list` | Retail price list: edit selling prices, see cost, RRP and margin colour-coded |
| `/restock` | **Buy wholesale**: trade catalogue with Gold-tier price breaks, MOQ steppers, trade basket (sheet on mobile), pay on account / card / pro-forma |
| `/purchases` | Purchase orders from the wholesaler, invoices, reorder |
| `/customers` | Shoppers, spend, repeat rate, age-check status |
| `/payments` | Balance, weekly payouts, card fees, money owed to supplier, payment methods |
| `/storefront` | The retailer's own page on the site (`/shops/your-shop`), logo, banner, hours, local delivery, click & collect |
| `/settings` | Business, team (staff roles), delivery, Challenge 25 / training compliance, notifications |

---

## Folder structure

```
src/
  app/
    (store)/        public website (shared header, footer, mobile tab bar)
    (auth)/         login & register (split-screen layout)
    (portal)/
      wholesaler/   wholesaler portal routes
      retailer/     retailer portal routes
  components/
    ui/             Button, Card, Badge, Input, Select, Toggle, ProductArt (SVG placeholder images)
    store/          Header, Footer, CartDrawer, ProductCard, AgeGate
    portal/         Shell (sidebar / mobile nav), Dashboards, Products, ProductForm, ProductView,
                    PriceList, Orders, People, Payments, Restock, Misc (settings, reports, storefront)
  lib/
    data.ts         ALL mock data (products, orders, retailers, payments) – swap for API calls
    store.tsx       client state: basket + mock logged-in role (localStorage)
    portal.ts       sidebar menus per role
    pricing.ts      cost / margin helpers
    orders.ts       order lookup helpers
```

Portal pages are shared components that take a `role` prop (`"wholesaler" | "retailer"`), so each
feature is built once and adapts its labels, prices and actions.

---

## UK compliance built into the UI
- 18+ age gate on first visit, DOB/age check at checkout, "ID on delivery" messaging
- Nicotine warning on nicotine product pages
- TPD fields on the product form: MHRA ECID, nicotine ≤ 20mg/ml (warns if over), bottle ≤ 10ml, tank ≤ 2ml
- No disposable (single-use) vapes. They are banned in the UK from 1 June 2025, and the footer and FAQ say so
- Retailer compliance: Challenge 25 policy and staff training log. Wholesaler: MHRA notifications and WEEE batteries

> These are UI placeholders, not legal advice. Check current UK rules (including any new Tobacco and Vapes
> legislation and registration schemes) before launch.

## Next steps for the real build
1. **Auth with roles**, e.g. NextAuth / Clerk / your API with `role = customer | retailer | wholesaler | admin`, plus middleware that protects `/retailer/*` and `/wholesaler/*`
2. **API + database** (products, price tiers, orders, accounts, invoices). Replace imports from `lib/data.ts`
3. **Age verification provider** at checkout (e.g. a UK credit reference / ID check service)
4. **Payments**: pick a provider that accepts vape merchants. Many mainstream processors restrict them
5. **Admin (super-admin) portal** for the site owner: approve wholesalers, set commissions, moderate products
6. Real product photos: swap `<ProductArt>` for `next/image`
