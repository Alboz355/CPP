"use client"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { ArrowLeft, Settings } from "lucide-react"
import type { AppState } from "@/app/page"

interface StandardizedHeaderProps {
  title: string
  subtitle?: string
  onBack?: () => void
  onSettings?: () => void
  showThemeToggle?: boolean
  showSettings?: boolean
  backPage?: AppState
  onNavigate?: (page: AppState) => void
}

export function StandardizedHeader({
  title,
  subtitle,
  onBack,
  onSettings,
  showThemeToggle = true,
  showSettings = true,
  backPage,
  onNavigate
}: StandardizedHeaderProps) {
  const handleBack = () => {
    if (onBack) {
      onBack()
    } else if (backPage && onNavigate) {
      onNavigate(backPage)
    }
  }

  return (
    <div className="flex items-center justify-between p-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center space-x-4">
        {(onBack || (backPage && onNavigate)) && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleBack}
            className="hover:bg-accent/50 transition-all duration-200"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {subtitle && (
            <p className="text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        {showThemeToggle && <ThemeToggle />}
        {showSettings && onSettings && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onSettings}
            className="hover:bg-accent/50 transition-all duration-200"
          >
            <Settings className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  )
}