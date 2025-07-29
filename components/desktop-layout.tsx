"use client"

import { useState } from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarProvider,
  SidebarInset
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { 
  Wallet, 
  History, 
  Settings, 
  CreditCard,
  Menu
} from "lucide-react"

interface DesktopLayoutProps {
  children: React.ReactNode
  currentPage: string
  onNavigate: (page: any) => void
  walletData?: any
}

export function DesktopLayout({ children, currentPage, onNavigate, walletData }: DesktopLayoutProps) {
  const isMobile = useIsMobile()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // If mobile, render children without desktop layout
  if (isMobile) {
    return <>{children}</>
  }

  const navigationItems = [
    {
      title: "Portefeuille",
      items: [
        {
          title: "Tableau de bord",
          icon: Wallet,
          page: "dashboard",
          isActive: currentPage === "dashboard"
        },
        {
          title: "Historique",
          icon: History,
          page: "history", 
          isActive: currentPage === "history"
        }
      ]
    },
    {
      title: "TPE",
      items: [
        {
          title: "Mode TPE",
          icon: CreditCard,
          page: "tpe-pin-verification",
          isActive: currentPage.startsWith("tpe")
        }
      ]
    },
    {
      title: "Configuration",
      items: [
        {
          title: "Paramètres",
          icon: Settings,
          page: "settings",
          isActive: currentPage === "settings"
        }
      ]
    }
  ]

  return (
    <SidebarProvider defaultOpen={sidebarOpen}>
      <div className="desktop-layout">
        <Sidebar collapsible="icon" className="desktop-sidebar">
          <SidebarHeader className="border-b border-sidebar-border">
            <div className="flex items-center gap-2 px-2 py-2">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Wallet className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">CryptoPayPro</span>
                <span className="truncate text-xs text-sidebar-foreground/70">
                  {walletData?.name || "Wallet"}
                </span>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            {navigationItems.map((group) => (
              <SidebarGroup key={group.title}>
                <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => (
                      <SidebarMenuItem key={item.page}>
                        <SidebarMenuButton
                          onClick={() => onNavigate(item.page)}
                          isActive={item.isActive}
                          tooltip={item.title}
                        >
                          <item.icon className="size-4" />
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="desktop-main">
          <header className="desktop-header">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="size-4" />
                </Button>
                <div>
                  <h1 className="text-lg font-semibold">
                    {getPageTitle(currentPage)}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {getPageDescription(currentPage)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle />
              </div>
            </div>
          </header>
          
          <main className="desktop-content">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

function getPageTitle(page: string): string {
  switch (page) {
    case "dashboard":
      return "Tableau de bord"
    case "send":
      return "Envoyer"
    case "receive":
      return "Recevoir"
    case "history":
      return "Historique des transactions"
    case "settings":
      return "Paramètres"
    case "tpe":
    case "tpe-pin-verification":
      return "Terminal de Paiement Électronique"
    default:
      return "CryptoPayPro"
  }
}

function getPageDescription(page: string): string {
  switch (page) {
    case "dashboard":
      return "Vue d'ensemble de votre portefeuille"
    case "send":
      return "Envoyer des cryptomonnaies"
    case "receive":
      return "Recevoir des paiements"
    case "history":
      return "Consulter vos transactions"
    case "settings":
      return "Configuration de l'application"
    case "tpe":
    case "tpe-pin-verification":
      return "Mode terminal de paiement"
    default:
      return "Application de portefeuille multi-crypto"
  }
}