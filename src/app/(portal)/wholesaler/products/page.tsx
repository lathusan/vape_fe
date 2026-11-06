import { ProductsList } from "@/components/portal/Products";

export const metadata = { title: "Products" };

export default function Page() {
  return <ProductsList role="wholesaler" />;
}
