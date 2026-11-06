import { Suspense } from "react";
import { LoginForm } from "../AuthForms";

export const metadata = { title: "Log in" };

export default function Page() {
  return <Suspense><LoginForm /></Suspense>;
}
