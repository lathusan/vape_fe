import {
  BarChart3, Boxes, CreditCard, FileSpreadsheet, LayoutDashboard, Package, Settings, ShoppingCart, Store, Truck, Users, type LucideIcon,
} from "lucide-react";

export type PortalRole = "wholesaler" | "retailer";

export type NavItem = { href: string; label: string; icon: LucideIcon; mobile?: boolean; short?: string; badge?: string };

export const portals: Record<PortalRole, {
  base: string;
  title: string;
  business: string;
  user: string;
  initials: string;
  plan: string;
  nav: NavItem[];
}> = {
  wholesaler: {
    base: "/wholesaler",
    title: "Wholesale",
    business: "Nimbus Wholesale Ltd",
    user: "Nishan K.",
    initials: "NK",
    plan: "Supplier · Verified",
    nav: [
      { href: "", label: "Dashboard", short: "Home", icon: LayoutDashboard, mobile: true },
      { href: "/products", label: "Products", icon: Boxes, mobile: true },
      { href: "/price-list", label: "Price list", icon: FileSpreadsheet },
      { href: "/orders", label: "Trade orders", short: "Orders", icon: Package, mobile: true, badge: "2" },
      { href: "/retailers", label: "Retailers", icon: Users, badge: "1" },
      { href: "/payments", label: "Payments & invoices", short: "Payments", icon: CreditCard, mobile: true },
      { href: "/reports", label: "Reports", icon: BarChart3 },
      { href: "/settings", label: "Settings", icon: Settings },
    ],
  },
  retailer: {
    base: "/retailer",
    title: "Retailer",
    business: "Cloud Nine Vapes",
    user: "Jordan Reid",
    initials: "JR",
    plan: "Gold trade tier",
    nav: [
      { href: "", label: "Dashboard", short: "Home", icon: LayoutDashboard, mobile: true },
      { href: "/orders", label: "Shop orders", short: "Orders", icon: Package, mobile: true, badge: "2" },
      { href: "/products", label: "My products", short: "Products", icon: Boxes, mobile: true },
      { href: "/price-list", label: "Retail price list", icon: FileSpreadsheet },
      { href: "/restock", label: "Buy wholesale", short: "Restock", icon: ShoppingCart, mobile: true },
      { href: "/purchases", label: "Purchase orders", icon: Truck },
      { href: "/customers", label: "Customers", icon: Users },
      { href: "/payments", label: "Payments & payouts", icon: CreditCard },
      { href: "/storefront", label: "My storefront", icon: Store },
      { href: "/settings", label: "Settings", icon: Settings },
    ],
  },
};
