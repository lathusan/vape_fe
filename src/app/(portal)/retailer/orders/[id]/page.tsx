import { notFound } from "next/navigation";
import { OrderDetail } from "@/components/portal/Orders";
import { findOrder } from "@/lib/orders";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = findOrder("retailer", id);
  if (!order) notFound();
  return <OrderDetail role="retailer" order={order} />;
}
