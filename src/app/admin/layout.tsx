import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Panel", template: "%s | Panel Tritotal" },
  robots: { index: false, follow: false },
};

export default function AdminRoot({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh bg-petrol-950">{children}</div>;
}
