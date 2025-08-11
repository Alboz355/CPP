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
    <Card className="apple-card">
      <CardHeader className="apple-card-header">
        <CardTitle className="apple-card-title">
          <div className="p-2 bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-lg">
            <TrendingUp className="h-5 w-5 text-[#007AFF]" />
          </div>
          Prix en Temps Réel
        </CardTitle>
        <div className="flex items-center space-x-2">
          {lastUpdate && <span className="text-sm text-[#8E8E93]">{lastUpdate.toLocaleTimeString()}</span>}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchPrices} 
            disabled={loading}
            className="h-8 w-8 bg-[#FFFFFF] dark:bg-[#1C1C1E] border-[#E5E5EA] dark:border-[#38383A] hover:bg-[#F2F2F7] dark:hover:bg-[#2C2C2E] rounded-lg"
          >
            <RefreshCw className={`h-4 w-4 text-[#007AFF] ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="apple-card-content">
        {loading && prices.length === 0 ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-xl border border-[#E5E5EA] dark:border-[#38383A] animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[#E5E5EA] dark:bg-[#38383A] rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-[#E5E5EA] dark:bg-[#38383A] rounded w-16"></div>
                    <div className="h-3 bg-[#E5E5EA] dark:bg-[#38383A] rounded w-12"></div>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <div className="h-4 bg-[#E5E5EA] dark:bg-[#38383A] rounded w-20"></div>
                  <div className="h-3 bg-[#E5E5EA] dark:bg-[#38383A] rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {prices.map((crypto) => (
              <div
                key={crypto.id}
                className="flex items-center justify-between p-4 bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-xl border border-[#E5E5EA] dark:border-[#38383A] hover:bg-[#E5E5EA] dark:hover:bg-[#38383A] transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-[#007AFF]">{getCryptoIcon(crypto.symbol)}</div>
                  <div>
                    <div className="font-semibold text-sm text-[#000000] dark:text-[#FFFFFF]">{crypto.symbol.toUpperCase()}</div>
                    <div className="text-xs text-[#8E8E93]">{crypto.name}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-sm text-[#000000] dark:text-[#FFFFFF]">{formatPrice(crypto.current_price)}</div>
                  <div className="flex items-center justify-end space-x-1 mt-1">
                    {crypto.price_change_percentage_24h >= 0 ? (
                      <TrendingUp className="h-3 w-3 text-[#34C759]" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-[#FF3B30]" />
                    )}
                    <span
                      className={`text-xs font-medium ${
                        crypto.price_change_percentage_24h >= 0 ? "text-[#34C759]" : "text-[#FF3B30]"
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
      </CardContent>
    </Card>
  )
}
