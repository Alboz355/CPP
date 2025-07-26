"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface LoadingFallbackProps {
  message?: string
}

export function LoadingFallback({ message = "Chargement..." }: LoadingFallbackProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm text-gray-600">{message}</span>
        </div>
      </CardContent>
    </Card>
  )
}
