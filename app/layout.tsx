import type { Metadata, Viewport } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/contexts/language-context"
import { CurrencyProvider } from "@/contexts/currency-context"
import { Toaster } from "@/components/ui/toaster"
import { ObservabilityInit } from '@/components/observability-init'

const inter = Inter({ subsets: ["latin"] })

const isDev = process.env.NODE_ENV !== 'production'
const csp = isDev
  ? "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:; img-src 'self' data: https: blob:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' ws: http: https:; worker-src 'self' blob:; base-uri 'self'; form-action 'self'"
  : "default-src 'self'; script-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https:; worker-src 'self' blob:; base-uri 'self'; form-action 'self'"

export const metadata: Metadata = {
  title: "Crypto Wallet App - Portefeuille Crypto Sécurisé",
  description: "Application de portefeuille crypto sécurisée développée en Suisse avec support multi-devises et terminal de paiement intégré",
  keywords: ["crypto", "wallet", "bitcoin", "ethereum", "blockchain", "suisse", "sécurisé"],
  authors: [{ name: "Crypto Wallet Team" }],
  creator: "Crypto Wallet Team",
  publisher: "Crypto Wallet Team",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Crypto Wallet",
    startupImage: [
      {
        url: "/placeholder.jpg",
        media: "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)",
      },
    ],
  },
  openGraph: {
    type: "website",
    locale: "fr_CH",
    url: "https://cryptowallet.app",
    title: "Crypto Wallet App",
    description: "Portefeuille crypto sécurisé développé en Suisse",
    siteName: "Crypto Wallet App",
    images: [
      {
        url: "/placeholder.jpg",
        width: 1200,
        height: 630,
        alt: "Crypto Wallet App",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Crypto Wallet App",
    description: "Portefeuille crypto sécurisé développé en Suisse",
    images: ["/placeholder.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/placeholder-logo.png", sizes: "32x32", type: "image/png" },
      { url: "/placeholder-logo.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/placeholder-logo.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/placeholder-logo.svg",
        color: "#3b82f6",
      },
    ],
  },
  generator: "v0.dev",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        {/* iOS Meta Tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Crypto Wallet" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* Content Security Policy (meta) - frame-ancestors non supporté via meta */}
        <meta httpEquiv="Content-Security-Policy" content={csp} />
        
        {/* iOS Splash Screens */}
        <link
          rel="apple-touch-startup-image"
          href="/placeholder.jpg"
          media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/placeholder.jpg"
          media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        
        {/* Prevent iOS zoom */}
        <meta name="format-detection" content="telephone=no" />
        
        {/* iOS Home Screen Icons */}
        <link rel="apple-touch-icon" href="/placeholder-logo.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/placeholder-logo.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/placeholder-logo.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/placeholder-logo.png" />
        
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <CurrencyProvider>
              <div className="min-h-screen bg-background text-foreground">
                {children}
              </div>
              <Toaster />
              <ObservabilityInit />
            </CurrencyProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
