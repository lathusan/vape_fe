import { PortalShell } from "@/components/portal/Shell";

export const metadata = { title: { default: "Wholesale portal", template: "%s | Wholesale portal" } };

export default function Layout({ children }: { children: React.ReactNode }) {
  return <PortalShell role="wholesaler">{children}</PortalShell>;
}
