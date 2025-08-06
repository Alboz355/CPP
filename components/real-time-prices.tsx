"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, RefreshCw, Bitcoin, Zap } from "lucide-react"
import { cryptoService, type CryptoPrice } from "@/lib/crypto-prices"
import { useCurrency } from "@/contexts/currency-context"

export function RealTimePrices() {
  const [prices, setPrices] = useState<CryptoPrice[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const { currency } = useCurrency()

  const fetchPrices = async () => {
    try {
      setLoading(true)
      const data = await cryptoService.getCryptoPrices(currency)
      setPrices(data)
      setLastUpdate(new Date())
    } catch (error) {
      console.error("Error fetching prices:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPrices()
    const interval = setInterval(fetchPrices, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [currency]) // Re-fetch when currency changes

  const formatPrice = (price: number): string => {
    return cryptoService.formatPrice(price, currency)
  }

  const formatChange = (change: number): string => {
    const sign = change >= 0 ? "+" : ""
    return `${sign}${change.toFixed(2)}%`
  }

  const getCryptoIcon = (symbol: string) => {
    switch (symbol.toLowerCase()) {
      case "btc":
        return <Bitcoin className="h-6 w-6" />
      case "eth":
        return <Zap className="h-6 w-6" />
      default:
        return <div className="h-6 w-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Prix Temps Réel ({currency})</CardTitle>
          <div className="flex items-center space-x-2">
            {lastUpdate && <span className="text-xs text-muted-foreground">{lastUpdate.toLocaleTimeString()}</span>}
            <Button variant="outline" size="sm" onClick={fetchPrices} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading && prices.length === 0 ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-lg animate-pulse">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
                    <div>
                      <div className="h-4 w-16 bg-gray-300 rounded mb-1"></div>
                      <div className="h-3 w-12 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="h-4 w-20 bg-gray-300 rounded mb-1"></div>
                    <div className="h-3 w-16 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {prices.map((crypto) => (
                <div
                  key={crypto.id}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-primary">{getCryptoIcon(crypto.symbol)}</div>
                    <div>
                      <div className="font-semibold text-sm">{crypto.symbol.toUpperCase()}</div>
                      <div className="text-xs text-muted-foreground">{crypto.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-sm">{formatPrice(crypto.current_price)}</div>
                    <div className="flex items-center justify-end space-x-1">
                      {crypto.price_change_percentage_24h >= 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-600" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-600" />
                      )}
                      <span
                        className={`text-xs font-medium ${
                          crypto.price_change_percentage_24h >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {formatChange(crypto.price_change_percentage_24h)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
