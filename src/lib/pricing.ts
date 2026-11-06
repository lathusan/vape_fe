import type { Product } from "./data";

// Helpers to derive the right numbers per portal from the shared mock catalogue
export const shopStock = (p: Product) => Math.round(p.stock / 20); // retailer's own shop stock (mock)
export const costPrice = (p: Product) => p.tiers[0].price; // retailer's cost = trade tier 1
export const marginPct = (p: Product) => Math.round(((p.retailPrice / 1.2 - costPrice(p)) / (p.retailPrice / 1.2)) * 100);
