import { Suspense } from "react";
import { ShopView } from "./ShopView";

export const metadata = { title: "Shop" };

export default function ShopPage() {
  return (
    <Suspense>
      <ShopView />
    </Suspense>
  );
}
