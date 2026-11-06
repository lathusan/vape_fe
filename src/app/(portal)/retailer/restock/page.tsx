import { Suspense } from "react";
import { Restock } from "@/components/portal/Restock";

export const metadata = { title: "Buy wholesale" };

export default function Page() {
  return (
    <Suspense>
      <Restock />
    </Suspense>
  );
}
