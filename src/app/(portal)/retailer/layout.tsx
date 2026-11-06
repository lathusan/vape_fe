import { PortalShell } from "@/components/portal/Shell";

export const metadata = { title: { default: "Retailer portal", template: "%s | Retailer portal" } };

export default function Layout({ children }: { children: React.ReactNode }) {
  return <PortalShell role="retailer">{children}</PortalShell>;
}
