import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Maesttro Checkout",
  description: "Checkout de alta conversão",
  icons: {
    icon: "/images/ICON.png",
    shortcut: "/images/ICON.png",
    apple: "/images/ICON.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/images/ICON.png" type="image/png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
