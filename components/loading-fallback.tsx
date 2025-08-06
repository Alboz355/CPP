"use client"

import { Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function LoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardContent className="p-8 flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-lg font-semibold text-muted-foreground">Chargement de l'application...</p>
          <p className="text-sm text-muted-foreground mt-2">Veuillez patienter un instant.</p>
        </CardContent>
      </Card>
    </div>
  )
}
