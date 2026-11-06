import { notFound } from "next/navigation";
import { getProduct } from "@/lib/data";
import { ProductForm } from "@/components/portal/ProductForm";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = getProduct(id);
  if (!p) notFound();
  return <ProductForm role="retailer" product={p} />;
}
