"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// Skeleton de base avec style Apple
export function Skeleton({ className, animated = true, ...props }: React.HTMLAttributes<HTMLDivElement> & { animated?: boolean }) {
  return (
    <div
      className={cn(
        "bg-[#E5E5EA] dark:bg-[#38383A] rounded-xl",
        animated && "animate-pulse",
        className
      )}
      aria-hidden="true"
      {...props}
    />
  )
}

// Skeleton pour le dashboard
export function DashboardSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-label="Chargement du tableau de bord">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-11 w-11 rounded-xl" />
          <Skeleton className="h-11 w-11 rounded-xl" />
        </div>
      </div>

      {/* Balance Card Skeleton */}
      <Card className="apple-card bg-[#007AFF]">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <Skeleton className="h-4 w-24 bg-white/20" />
              <Skeleton className="h-10 w-48 bg-white/20" />
              <Skeleton className="h-4 w-32 bg-white/20" />
            </div>
            <Skeleton className="h-16 w-16 rounded-full bg-white/20" />
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 bg-[#FFFFFF] dark:bg-[#1C1C1E] border border-[#E5E5EA] dark:border-[#38383A] rounded-2xl p-4 flex flex-col items-center justify-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>

      {/* Cards Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="apple-card">
          <CardHeader className="apple-card-header">
            <CardTitle className="apple-card-title">
              <Skeleton className="h-5 w-5 rounded-lg" />
              <Skeleton className="h-6 w-32" />
            </CardTitle>
          </CardHeader>
          <CardContent className="apple-card-content">
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-xl border border-[#E5E5EA] dark:border-[#38383A]">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="apple-card">
          <CardHeader className="apple-card-header">
            <CardTitle className="apple-card-title">
              <Skeleton className="h-5 w-5 rounded-lg" />
              <Skeleton className="h-6 w-40" />
            </CardTitle>
          </CardHeader>
          <CardContent className="apple-card-content">
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-xl border border-[#E5E5EA] dark:border-[#38383A]">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-xl" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Skeleton pour les transactions
export function TransactionSkeleton() {
  return (
    <div className="space-y-3" role="status" aria-label="Chargement des transactions">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between p-4 bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-xl border border-[#E5E5EA] dark:border-[#38383A]">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-xl" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <div className="text-right space-y-1">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  )
}

// Skeleton pour les paramètres
export function SettingsSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-label="Chargement des paramètres">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="apple-card">
          <CardHeader className="apple-card-header">
            <CardTitle className="apple-card-title">
              <Skeleton className="h-5 w-5 rounded-lg" />
              <Skeleton className="h-6 w-32" />
            </CardTitle>
          </CardHeader>
          <CardContent className="apple-card-content">
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, j) => (
                <div key={j} className="flex items-center justify-between py-3">
                  <div className="flex-1">
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-6 w-12 rounded-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Skeleton pour les cartes de statistiques
export function StatsCardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="apple-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <div className="space-y-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Skeleton pour les listes de crypto
export function CryptoListSkeleton() {
  return (
    <div className="space-y-3" role="status" aria-label="Chargement des cryptomonnaies">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between p-4 bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-xl border border-[#E5E5EA] dark:border-[#38383A]">
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <div className="text-right space-y-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  )
}
