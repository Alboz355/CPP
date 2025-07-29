import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";

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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        
        {/* Meta tags pour iOS */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="CryptoPayPro" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      {/* On remplace "className={inter.className}" par un style direct */}
      <body style={{ fontFamily: "'Inter', sans-serif" }} className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <div className="mobile-container">
            {children}
          </div>
          <Toaster 
            position="top-center"
            richColors
            closeButton
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
