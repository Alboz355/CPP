import type React from "react";
import type { Metadata } from "next";
import "./globals.css";

// Les lignes "next/font" qui causaient l'erreur ont été supprimées.

export const metadata: Metadata = {
  title: "Crypto Wallet App",
  description: "Application de portefeuille multi-crypto",
  generator: 'v0.dev'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        {/* Votre script est bien conservé */}
        <script src="https://widget.mtpelerin.com/mtp-widget.js" async></script>

        {/* On ajoute les polices directement depuis Google pour éviter le conflit */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      {/* On remplace "className={inter.className}" par un style direct */}
      <body style={{ fontFamily: "'Inter', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
