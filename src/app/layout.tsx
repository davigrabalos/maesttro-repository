import type { Metadata } from "next";
import "./globals.css";
import { GlobalKeepNotes } from "@/components/ui/GlobalKeepNotes";

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
        {/* Favicon */}
        <link rel="icon" href="/images/ICON.png" type="image/png" />

        {/* Fontes do Google - carregamento prioritário via <link> direto no HTML */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Fontes Especiais: Barriecito, Google Sans e IBM Plex Mono */}
        <link
          href="https://fonts.googleapis.com/css2?family=Barriecito&family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap"
          rel="stylesheet"
        />

        {/* Material Symbols Outlined (MD3 Icons) - tag separada garante carregamento */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <GlobalKeepNotes />
      </body>
    </html>
  );
}
