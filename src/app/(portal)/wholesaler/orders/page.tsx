import { OrdersList } from "@/components/portal/Orders";

export const metadata = { title: "Orders" };

export default function Page() {
  return <OrdersList role="wholesaler" />;
}
