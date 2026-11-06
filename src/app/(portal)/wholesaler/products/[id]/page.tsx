import { notFound } from "next/navigation";
import { getProduct } from "@/lib/data";
import { ProductView } from "@/components/portal/ProductView";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = getProduct(id);
  if (!p) notFound();
  return <ProductView role="wholesaler" p={p} />;
}
