import { redirect } from "next/navigation";

export default function Home() {
  redirect("/checkout/demo?source=lojaA");
}
