import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Maesttro Checkout",
  description: "Checkout de alta conversão",
  icons: {
    icon: "/images/ICON.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
