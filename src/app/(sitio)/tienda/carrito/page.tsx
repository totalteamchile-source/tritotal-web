import type { Metadata } from "next";
import { Section } from "@/components/ui";
import { Checkout } from "./Checkout";

export const metadata: Metadata = { title: "Carrito", robots: { index: false } };

export default function CarritoPage() {
  return (
    <Section className="pt-28 lg:pt-36">
      <h1 className="font-display text-5xl font-extrabold uppercase">Tu carrito</h1>
      <Checkout />
    </Section>
  );
}
