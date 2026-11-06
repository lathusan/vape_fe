// ---------------------------------------------------------------------------
// MOCK DATA — replace with API calls when the backend is ready.
// All brands, people and businesses below are fictional.
// ---------------------------------------------------------------------------

export const BRAND = {
  name: "Nimbus",
  full: "Nimbus Vape Co.",
  tagline: "The UK's vape store for shoppers and trade.",
  email: "hello@nimbusvape.co.uk",
  phone: "0161 555 0192",
};

export type CategoryId =
  | "pod-kits"
  | "e-liquids"
  | "nic-salts"
  | "pods-coils"
  | "mods-tanks"
  | "accessories";

export const categories: { id: CategoryId; name: string; blurb: string; hue: string }[] = [
  { id: "pod-kits", name: "Pod Kits", blurb: "Refillable, rechargeable, pocket-sized", hue: "from-violet-500 to-indigo-600" },
  { id: "e-liquids", name: "E-Liquids", blurb: "Freebase shortfills & 10ml", hue: "from-lime-400 to-emerald-500" },
  { id: "nic-salts", name: "Nic Salts", blurb: "Smooth hit, 10mg & 20mg", hue: "from-amber-400 to-orange-500" },
  { id: "pods-coils", name: "Pods & Coils", blurb: "Replacement pods & coil heads", hue: "from-sky-400 to-cyan-500" },
  { id: "mods-tanks", name: "Mods & Tanks", blurb: "Advanced kits for cloud chasers", hue: "from-rose-400 to-pink-600" },
  { id: "accessories", name: "Accessories", blurb: "Batteries, chargers, cases", hue: "from-zinc-500 to-zinc-800" },
];

export type PriceTier = { minQty: number; price: number }; // trade price per unit, ex VAT

export type Product = {
  id: string;
  slug: string;
  sku: string;
  name: string;
  brand: string;
  category: CategoryId;
  retailPrice: number; // inc VAT
  wasPrice?: number;
  tiers: PriceTier[]; // wholesale tiers ex VAT
  moq: number; // minimum trade order quantity
  stock: number;
  status: "active" | "draft" | "out_of_stock";
  nicotine?: string; // e.g. "20mg/ml"
  volume?: string; // e.g. "10ml"
  flavours?: string[];
  colours?: string[];
  rating: number;
  reviews: number;
  badge?: "New" | "Best seller" | "Sale" | "Trade deal";
  ecid: string; // MHRA notification ID (mock)
  description: string;
};

export const products: Product[] = [
  {
    id: "p1", slug: "aerolux-flow-pod-kit", sku: "AX-FLOW-01", name: "Aerolux Flow Pod Kit", brand: "Aerolux", category: "pod-kits",
    retailPrice: 24.99, wasPrice: 29.99, tiers: [{ minQty: 10, price: 13.5 }, { minQty: 50, price: 12.2 }, { minQty: 100, price: 11.4 }],
    moq: 10, stock: 842, status: "active", colours: ["Graphite", "Lilac", "Ice Blue", "Sage"], rating: 4.8, reviews: 1284, badge: "Best seller",
    ecid: "04312-24-01188", description: "A refillable 2ml pod kit with a 1000mAh battery, USB-C fast charging and adjustable airflow. Built for an easy, flavour-first draw.",
  },
  {
    id: "p2", slug: "kova-nano-x", sku: "KV-NANOX", name: "Kova Nano X", brand: "Kova", category: "pod-kits",
    retailPrice: 19.99, tiers: [{ minQty: 10, price: 10.8 }, { minQty: 50, price: 9.9 }, { minQty: 100, price: 9.2 }],
    moq: 10, stock: 510, status: "active", colours: ["Black", "Pearl", "Rose"], rating: 4.6, reviews: 642, badge: "New",
    ecid: "04312-24-02240", description: "Ultra-compact draw-activated pod system with a 0.8Ω mesh pod and 800mAh battery.",
  },
  {
    id: "p3", slug: "halcyon-prism-pro", sku: "HC-PRISM-P", name: "Halcyon Prism Pro", brand: "Halcyon", category: "pod-kits",
    retailPrice: 34.99, tiers: [{ minQty: 5, price: 19.5 }, { minQty: 25, price: 18.1 }, { minQty: 60, price: 17.0 }],
    moq: 5, stock: 128, status: "active", colours: ["Aurora", "Midnight"], rating: 4.9, reviews: 311,
    ecid: "04312-25-00412", description: "Pod-mod hybrid with a 1500mAh battery, 5–30W output and a colour display.",
  },
  {
    id: "p4", slug: "drift-labs-blue-razz-10ml", sku: "DL-BRZ-10", name: "Blue Razz Ice 10ml", brand: "Drift Labs", category: "nic-salts",
    retailPrice: 3.99, tiers: [{ minQty: 50, price: 1.45 }, { minQty: 200, price: 1.29 }, { minQty: 500, price: 1.15 }],
    moq: 50, stock: 6320, status: "active", nicotine: "10mg / 20mg", volume: "10ml", flavours: ["Blue raspberry", "Menthol"], rating: 4.7, reviews: 2210, badge: "Best seller",
    ecid: "04312-23-05561", description: "Tart blue raspberry with a cool finish. 50VG/50PG nicotine salt for pod kits.",
  },
  {
    id: "p5", slug: "drift-labs-strawberry-kiwi-10ml", sku: "DL-SKW-10", name: "Strawberry Kiwi 10ml", brand: "Drift Labs", category: "nic-salts",
    retailPrice: 3.99, tiers: [{ minQty: 50, price: 1.45 }, { minQty: 200, price: 1.29 }, { minQty: 500, price: 1.15 }],
    moq: 50, stock: 4120, status: "active", nicotine: "10mg / 20mg", volume: "10ml", flavours: ["Strawberry", "Kiwi"], rating: 4.6, reviews: 1460,
    ecid: "04312-23-05562", description: "Sweet strawberry balanced with tangy kiwi. 50VG/50PG nicotine salt.",
  },
  {
    id: "p6", slug: "volt-vine-tobacco-gold", sku: "VV-TGOLD-10", name: "Tobacco Gold 10ml", brand: "Volt & Vine", category: "nic-salts",
    retailPrice: 4.49, tiers: [{ minQty: 50, price: 1.7 }, { minQty: 200, price: 1.52 }, { minQty: 500, price: 1.39 }],
    moq: 50, stock: 0, status: "out_of_stock", nicotine: "10mg / 20mg", volume: "10ml", flavours: ["Golden tobacco", "Caramel"], rating: 4.5, reviews: 388,
    ecid: "04312-22-03019", description: "Smooth golden tobacco with a hint of caramel. For those switching from smoking.",
  },
  {
    id: "p7", slug: "nimbus-mango-ice-shortfill", sku: "NB-MNG-100", name: "Mango Ice 100ml Shortfill", brand: "Nimbus", category: "e-liquids",
    retailPrice: 12.99, wasPrice: 15.99, tiers: [{ minQty: 12, price: 5.9 }, { minQty: 48, price: 5.4 }, { minQty: 120, price: 4.95 }],
    moq: 12, stock: 980, status: "active", nicotine: "0mg (add shots)", volume: "100ml", flavours: ["Mango", "Menthol"], rating: 4.8, reviews: 903, badge: "Sale",
    ecid: "N/A – 0mg", description: "Juicy Alphonso mango with icy menthol. 70VG/30PG, space for two nicotine shots.",
  },
  {
    id: "p8", slug: "nimbus-pink-lemonade-shortfill", sku: "NB-PLM-100", name: "Pink Lemonade 100ml Shortfill", brand: "Nimbus", category: "e-liquids",
    retailPrice: 12.99, tiers: [{ minQty: 12, price: 5.9 }, { minQty: 48, price: 5.4 }, { minQty: 120, price: 4.95 }],
    moq: 12, stock: 744, status: "active", nicotine: "0mg (add shots)", volume: "100ml", flavours: ["Lemon", "Raspberry"], rating: 4.7, reviews: 512,
    ecid: "N/A – 0mg", description: "Fizzy pink lemonade with raspberry. 70VG/30PG.",
  },
  {
    id: "p9", slug: "kova-cola-ice-10ml", sku: "KV-COL-10", name: "Cola Ice 10ml 18mg", brand: "Kova", category: "e-liquids",
    retailPrice: 3.49, tiers: [{ minQty: 50, price: 1.25 }, { minQty: 200, price: 1.12 }, { minQty: 500, price: 0.99 }],
    moq: 50, stock: 2200, status: "active", nicotine: "3 / 6 / 12 / 18mg", volume: "10ml", flavours: ["Cola", "Menthol"], rating: 4.4, reviews: 276, badge: "Trade deal",
    ecid: "04312-24-07310", description: "Classic fizzy cola with an icy kick. 50VG/50PG freebase.",
  },
  {
    id: "p10", slug: "aerolux-flow-replacement-pods", sku: "AX-FLOW-PD3", name: "Aerolux Flow Pods (3 pack)", brand: "Aerolux", category: "pods-coils",
    retailPrice: 8.99, tiers: [{ minQty: 20, price: 4.2 }, { minQty: 100, price: 3.85 }, { minQty: 300, price: 3.5 }],
    moq: 20, stock: 1900, status: "active", volume: "2ml", rating: 4.7, reviews: 860, badge: "Best seller",
    ecid: "04312-24-01189", description: "Three 0.6Ω mesh replacement pods for the Aerolux Flow. 2ml refillable.",
  },
  {
    id: "p11", slug: "halcyon-mesh-coils", sku: "HC-MESH-5", name: "Halcyon Mesh Coils (5 pack)", brand: "Halcyon", category: "pods-coils",
    retailPrice: 11.99, tiers: [{ minQty: 20, price: 5.6 }, { minQty: 100, price: 5.1 }, { minQty: 300, price: 4.7 }],
    moq: 20, stock: 63, status: "active", rating: 4.5, reviews: 194,
    ecid: "N/A – component", description: "0.4Ω and 0.8Ω mesh coil heads for the Prism series.",
  },
  {
    id: "p12", slug: "titan-x200-kit", sku: "TT-X200", name: "Titan X200 Mod Kit", brand: "Titan", category: "mods-tanks",
    retailPrice: 54.99, tiers: [{ minQty: 3, price: 31.0 }, { minQty: 15, price: 29.2 }, { minQty: 40, price: 27.5 }],
    moq: 3, stock: 46, status: "active", colours: ["Gunmetal", "Carbon", "Red"], rating: 4.7, reviews: 158, badge: "New",
    ecid: "04312-25-01102", description: "Dual 18650 box mod, 5–200W, with a 2ml TPD sub-ohm tank.",
  },
  {
    id: "p13", slug: "halcyon-sub-tank", sku: "HC-SUBT", name: "Halcyon Sub-Ohm Tank 2ml", brand: "Halcyon", category: "mods-tanks",
    retailPrice: 22.99, tiers: [{ minQty: 5, price: 12.5 }, { minQty: 25, price: 11.6 }, { minQty: 60, price: 10.9 }],
    moq: 5, stock: 210, status: "draft", colours: ["Silver", "Black"], rating: 4.3, reviews: 77,
    ecid: "04312-25-01450", description: "Top-fill 2ml sub-ohm tank with leak-resistant airflow.",
  },
  {
    id: "p14", slug: "nimbus-18650-battery", sku: "NB-18650", name: "18650 Battery 3000mAh", brand: "Nimbus", category: "accessories",
    retailPrice: 7.99, tiers: [{ minQty: 20, price: 3.4 }, { minQty: 100, price: 3.1 }, { minQty: 300, price: 2.85 }],
    moq: 20, stock: 1200, status: "active", rating: 4.8, reviews: 420,
    ecid: "N/A – accessory", description: "High-drain 20A rechargeable battery. Sold with a protective case.",
  },
  {
    id: "p15", slug: "nimbus-carry-case", sku: "NB-CASE", name: "Silicone Carry Case", brand: "Nimbus", category: "accessories",
    retailPrice: 5.99, tiers: [{ minQty: 25, price: 1.9 }, { minQty: 100, price: 1.65 }, { minQty: 300, price: 1.45 }],
    moq: 25, stock: 3400, status: "active", colours: ["Black", "Lime", "Lilac"], rating: 4.4, reviews: 98,
    ecid: "N/A – accessory", description: "Soft-touch silicone sleeve with a lanyard loop.",
  },
  {
    id: "p16", slug: "kova-nic-shot-18mg", sku: "KV-SHOT-18", name: "Nic Shot 18mg 10ml", brand: "Kova", category: "e-liquids",
    retailPrice: 0.99, tiers: [{ minQty: 100, price: 0.34 }, { minQty: 500, price: 0.29 }, { minQty: 1000, price: 0.25 }],
    moq: 100, stock: 12000, status: "active", nicotine: "18mg", volume: "10ml", rating: 4.6, reviews: 1820,
    ecid: "04312-22-00901", description: "Flavourless nicotine shot for shortfills. 50VG/50PG.",
  },
];

export const getProduct = (slugOrId: string) =>
  products.find((p) => p.slug === slugOrId || p.id === slugOrId);

export const gbp = (n: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(n);

export const catName = (id: CategoryId) => categories.find((c) => c.id === id)?.name ?? id;

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------
export type OrderStatus = "pending" | "processing" | "packed" | "shipped" | "delivered" | "cancelled" | "refunded";

export type Order = {
  id: string;
  date: string;
  customer: string;
  email: string;
  city: string;
  items: { productId: string; qty: number; price: number }[];
  total: number;
  status: OrderStatus;
  payment: "Paid" | "Unpaid" | "On account" | "Refunded" | "Overdue";
  method: string;
  ageVerified?: boolean;
};

// Trade (wholesale) orders placed by retailers
export const tradeOrders: Order[] = [
  { id: "TR-10482", date: "2026-11-06", customer: "Cloud Nine Vapes", email: "orders@cloudnine.co.uk", city: "Leeds", items: [{ productId: "p1", qty: 50, price: 12.2 }, { productId: "p4", qty: 200, price: 1.29 }], total: 868.0, status: "processing", payment: "On account", method: "30-day terms" },
  { id: "TR-10481", date: "2026-11-05", customer: "Vapour Lounge", email: "buying@vapourlounge.uk", city: "Bristol", items: [{ productId: "p10", qty: 100, price: 3.85 }], total: 385.0, status: "packed", payment: "Paid", method: "Bank transfer" },
  { id: "TR-10480", date: "2026-11-05", customer: "Mist & Co", email: "hello@mistandco.uk", city: "Glasgow", items: [{ productId: "p7", qty: 48, price: 5.4 }, { productId: "p8", qty: 48, price: 5.4 }], total: 518.4, status: "shipped", payment: "Paid", method: "Card" },
  { id: "TR-10479", date: "2026-11-03", customer: "The Vape Spot", email: "spot@thevapespot.co.uk", city: "Cardiff", items: [{ productId: "p12", qty: 15, price: 29.2 }], total: 438.0, status: "delivered", payment: "Overdue", method: "30-day terms" },
  { id: "TR-10478", date: "2026-11-02", customer: "Cloud Nine Vapes", email: "orders@cloudnine.co.uk", city: "Leeds", items: [{ productId: "p16", qty: 1000, price: 0.25 }], total: 250.0, status: "delivered", payment: "Paid", method: "Bank transfer" },
  { id: "TR-10477", date: "2026-10-30", customer: "Brum Vape Hub", email: "trade@brumvape.co.uk", city: "Birmingham", items: [{ productId: "p2", qty: 50, price: 9.9 }], total: 495.0, status: "pending", payment: "Unpaid", method: "Pro-forma" },
  { id: "TR-10476", date: "2026-10-28", customer: "Northern Clouds", email: "orders@northernclouds.uk", city: "Newcastle", items: [{ productId: "p5", qty: 500, price: 1.15 }], total: 575.0, status: "cancelled", payment: "Refunded", method: "Card" },
];

// Retail (consumer) orders placed on the retailer's shop
export const retailOrders: Order[] = [
  { id: "#5812", date: "2026-11-06", customer: "Amelia Hart", email: "amelia.h@example.com", city: "Manchester", items: [{ productId: "p1", qty: 1, price: 24.99 }, { productId: "p4", qty: 3, price: 3.99 }], total: 36.96, status: "pending", payment: "Paid", method: "Apple Pay", ageVerified: true },
  { id: "#5811", date: "2026-11-06", customer: "Ravi Patel", email: "ravi.p@example.com", city: "Leicester", items: [{ productId: "p10", qty: 2, price: 8.99 }], total: 17.98, status: "processing", payment: "Paid", method: "Visa •• 4421", ageVerified: true },
  { id: "#5810", date: "2026-11-05", customer: "Chloe Evans", email: "chloe.e@example.com", city: "Swansea", items: [{ productId: "p7", qty: 2, price: 12.99 }, { productId: "p16", qty: 4, price: 0.99 }], total: 29.94, status: "shipped", payment: "Paid", method: "PayPal", ageVerified: true },
  { id: "#5809", date: "2026-11-05", customer: "Daniel Okafor", email: "dan.o@example.com", city: "London", items: [{ productId: "p12", qty: 1, price: 54.99 }], total: 54.99, status: "delivered", payment: "Paid", method: "Mastercard •• 1180", ageVerified: true },
  { id: "#5808", date: "2026-11-04", customer: "Sophie Clarke", email: "sophie.c@example.com", city: "Leeds", items: [{ productId: "p2", qty: 1, price: 19.99 }], total: 19.99, status: "refunded", payment: "Refunded", method: "Visa •• 9087", ageVerified: true },
  { id: "#5807", date: "2026-11-04", customer: "Liam Murphy", email: "liam.m@example.com", city: "Belfast", items: [{ productId: "p5", qty: 5, price: 3.99 }], total: 19.95, status: "delivered", payment: "Paid", method: "Google Pay", ageVerified: true },
  { id: "#5806", date: "2026-11-03", customer: "Grace Wilson", email: "grace.w@example.com", city: "Edinburgh", items: [{ productId: "p3", qty: 1, price: 34.99 }, { productId: "p11", qty: 1, price: 11.99 }], total: 46.98, status: "delivered", payment: "Paid", method: "Visa •• 3321", ageVerified: true },
];

// ---------------------------------------------------------------------------
// Customers
// ---------------------------------------------------------------------------
export type TradeAccount = {
  id: string;
  business: string;
  contact: string;
  email: string;
  city: string;
  tier: "Bronze" | "Silver" | "Gold";
  spend: number;
  orders: number;
  creditLimit: number;
  balance: number;
  status: "approved" | "pending" | "suspended";
  vat: string;
  joined: string;
};

export const tradeAccounts: TradeAccount[] = [
  { id: "r1", business: "Cloud Nine Vapes", contact: "Jordan Reid", email: "orders@cloudnine.co.uk", city: "Leeds", tier: "Gold", spend: 48210, orders: 64, creditLimit: 10000, balance: 868, status: "approved", vat: "GB 284 1192 37", joined: "2024-03-11" },
  { id: "r2", business: "Vapour Lounge", contact: "Priya Shah", email: "buying@vapourlounge.uk", city: "Bristol", tier: "Silver", spend: 21480, orders: 31, creditLimit: 5000, balance: 0, status: "approved", vat: "GB 377 4410 02", joined: "2024-08-02" },
  { id: "r3", business: "Mist & Co", contact: "Callum Fraser", email: "hello@mistandco.uk", city: "Glasgow", tier: "Silver", spend: 17320, orders: 22, creditLimit: 5000, balance: 0, status: "approved", vat: "GB 199 0023 81", joined: "2025-01-19" },
  { id: "r4", business: "The Vape Spot", contact: "Owain Jones", email: "spot@thevapespot.co.uk", city: "Cardiff", tier: "Bronze", spend: 6840, orders: 9, creditLimit: 2000, balance: 438, status: "approved", vat: "GB 512 7781 44", joined: "2025-06-27" },
  { id: "r5", business: "Brum Vape Hub", contact: "Aisha Khan", email: "trade@brumvape.co.uk", city: "Birmingham", tier: "Bronze", spend: 495, orders: 1, creditLimit: 0, balance: 495, status: "pending", vat: "GB 631 2209 18", joined: "2026-10-29" },
  { id: "r6", business: "Northern Clouds", contact: "Ben Taylor", email: "orders@northernclouds.uk", city: "Newcastle", tier: "Bronze", spend: 2210, orders: 4, creditLimit: 1000, balance: 0, status: "suspended", vat: "GB 744 0918 63", joined: "2025-11-04" },
];

export type RetailCustomer = { id: string; name: string; email: string; city: string; orders: number; spend: number; lastOrder: string; verified: boolean };

export const retailCustomers: RetailCustomer[] = [
  { id: "c1", name: "Amelia Hart", email: "amelia.h@example.com", city: "Manchester", orders: 12, spend: 412.4, lastOrder: "2026-11-06", verified: true },
  { id: "c2", name: "Ravi Patel", email: "ravi.p@example.com", city: "Leicester", orders: 7, spend: 188.2, lastOrder: "2026-11-06", verified: true },
  { id: "c3", name: "Chloe Evans", email: "chloe.e@example.com", city: "Swansea", orders: 4, spend: 96.7, lastOrder: "2026-11-05", verified: true },
  { id: "c4", name: "Daniel Okafor", email: "dan.o@example.com", city: "London", orders: 9, spend: 530.1, lastOrder: "2026-11-05", verified: true },
  { id: "c5", name: "Sophie Clarke", email: "sophie.c@example.com", city: "Leeds", orders: 2, spend: 39.98, lastOrder: "2026-11-04", verified: true },
  { id: "c6", name: "Liam Murphy", email: "liam.m@example.com", city: "Belfast", orders: 15, spend: 301.5, lastOrder: "2026-11-04", verified: true },
  { id: "c7", name: "Grace Wilson", email: "grace.w@example.com", city: "Edinburgh", orders: 3, spend: 120.9, lastOrder: "2026-11-03", verified: false },
];

// ---------------------------------------------------------------------------
// Payments
// ---------------------------------------------------------------------------
export type Txn = { id: string; date: string; ref: string; party: string; type: "Payment" | "Payout" | "Refund" | "Invoice" | "Fee"; method: string; amount: number; status: "Completed" | "Pending" | "Failed" | "Overdue" };

export const wholesaleTxns: Txn[] = [
  { id: "t1", date: "2026-11-06", ref: "INV-20931", party: "Cloud Nine Vapes", type: "Invoice", method: "30-day terms", amount: 868.0, status: "Pending" },
  { id: "t2", date: "2026-11-05", ref: "INV-20930", party: "Vapour Lounge", type: "Payment", method: "Bank transfer", amount: 385.0, status: "Completed" },
  { id: "t3", date: "2026-11-05", ref: "INV-20929", party: "Mist & Co", type: "Payment", method: "Card", amount: 518.4, status: "Completed" },
  { id: "t4", date: "2026-11-03", ref: "INV-20928", party: "The Vape Spot", type: "Invoice", method: "30-day terms", amount: 438.0, status: "Overdue" },
  { id: "t5", date: "2026-11-02", ref: "INV-20927", party: "Cloud Nine Vapes", type: "Payment", method: "Bank transfer", amount: 250.0, status: "Completed" },
  { id: "t6", date: "2026-10-28", ref: "CR-0192", party: "Northern Clouds", type: "Refund", method: "Card", amount: -575.0, status: "Completed" },
];

export const retailTxns: Txn[] = [
  { id: "t1", date: "2026-11-06", ref: "#5812", party: "Amelia Hart", type: "Payment", method: "Apple Pay", amount: 36.96, status: "Completed" },
  { id: "t2", date: "2026-11-06", ref: "#5811", party: "Ravi Patel", type: "Payment", method: "Visa", amount: 17.98, status: "Completed" },
  { id: "t3", date: "2026-11-05", ref: "PO-3301", party: "Nimbus Wholesale", type: "Invoice", method: "30-day terms", amount: -868.0, status: "Pending" },
  { id: "t4", date: "2026-11-05", ref: "PAYOUT-118", party: "Barclays •• 2201", type: "Payout", method: "Bank", amount: 1240.5, status: "Completed" },
  { id: "t5", date: "2026-11-04", ref: "#5808", party: "Sophie Clarke", type: "Refund", method: "Visa", amount: -19.99, status: "Completed" },
  { id: "t6", date: "2026-11-01", ref: "FEE-NOV", party: "Card processing", type: "Fee", method: "Auto", amount: -42.3, status: "Completed" },
];

// Purchases the retailer made from the wholesaler
export const purchaseOrders = [
  { id: "PO-3301", date: "2026-11-06", supplier: "Nimbus Wholesale", lines: 2, units: 250, total: 868.0, status: "processing" as OrderStatus, payment: "On account" as const, due: "2026-12-06" },
  { id: "PO-3288", date: "2026-11-02", supplier: "Nimbus Wholesale", lines: 1, units: 1000, total: 250.0, status: "delivered" as OrderStatus, payment: "Paid" as const, due: "—" },
  { id: "PO-3260", date: "2026-10-21", supplier: "Nimbus Wholesale", lines: 4, units: 420, total: 1490.6, status: "delivered" as OrderStatus, payment: "Paid" as const, due: "—" },
  { id: "PO-3241", date: "2026-10-09", supplier: "Nimbus Wholesale", lines: 3, units: 180, total: 1022.0, status: "delivered" as OrderStatus, payment: "Paid" as const, due: "—" },
];

export const salesSeries = {
  wholesale: [4200, 5100, 4800, 6200, 5900, 7400, 6800, 8100, 7600, 9200, 8800, 10400],
  retail: [820, 940, 760, 1100, 1240, 980, 1320, 1410, 1190, 1560, 1480, 1720],
  months: ["Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"],
};
