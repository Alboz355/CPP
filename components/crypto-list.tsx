"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react"
import { cryptoService, type CryptoPrice } from "@/lib/crypto-prices"

interface CryptoListProps {
  onCryptoSelect?: (crypto: CryptoPrice) => void
}

export function CryptoList({ onCryptoSelect }: CryptoListProps) {
  const [cryptos, setCryptos] = useState<CryptoPrice[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const fetchCryptos = async () => {
    setLoading(true)
    try {
      const data = await cryptoService.getCryptoPrices()
      setCryptos(data)
      setLastUpdate(new Date())
    } catch (error) {
      console.error("Error fetching crypto data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCryptos()
    const interval = setInterval(fetchCryptos, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-CH", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(price)
  }

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) {
      return `${(marketCap / 1e12).toFixed(2)}T $`
    } else if (marketCap >= 1e9) {
      return `${(marketCap / 1e9).toFixed(2)}B $`
    } else if (marketCap >= 1e6) {
      return `${(marketCap / 1e6).toFixed(2)}M $`
    } else {
      return `${marketCap.toLocaleString()} $`
    }
  }

  const formatChange = (change: number) => {
    const sign = change >= 0 ? "+" : ""
    return `${sign}${change.toFixed(2)}%`
  }

  if (loading && cryptos.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Prix des Cryptomonnaies</span>
            <RefreshCw className="h-4 w-4 animate-spin" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg animate-pulse">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/3"></div>
                </div>
                <div className="text-right space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-20"></div>
                  <div className="h-3 bg-gray-300 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="apple-card">
      <CardHeader className="apple-card-header">
        <CardTitle className="apple-card-title">
          <div className="p-2 bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-lg">
            <TrendingUp className="h-5 w-5 text-[#007AFF]" />
          </div>
          Prix des Cryptomonnaies
        </CardTitle>
        <div className="flex items-center space-x-2">
          {lastUpdate && <span className="text-sm text-[#8E8E93]">{lastUpdate.toLocaleTimeString()}</span>}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchCryptos} 
            disabled={loading}
            className="h-8 w-8 bg-[#FFFFFF] dark:bg-[#1C1C1E] border-[#E5E5EA] dark:border-[#38383A] hover:bg-[#F2F2F7] dark:hover:bg-[#2C2C2E] rounded-lg"
          >
            <RefreshCw className={`h-4 w-4 text-[#007AFF] ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="apple-card-content">
        <div className="space-y-3">
          {cryptos.map((crypto) => (
            <div
              key={crypto.id}
              className={`flex items-center space-x-4 p-4 bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-xl border border-[#E5E5EA] dark:border-[#38383A] transition-colors ${
                onCryptoSelect ? "cursor-pointer hover:bg-[#E5E5EA] dark:hover:bg-[#38383A]" : ""
              }`}
              onClick={() => onCryptoSelect?.(crypto)}
            >
              <img
                src={crypto.image || "/placeholder.svg"}
                alt={crypto.name}
                className="w-12 h-12 rounded-full border-2 border-[#E5E5EA] dark:border-[#38383A]"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.svg?height=48&width=48"
                }}
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-semibold text-[#000000] dark:text-[#FFFFFF]">{crypto.name}</h3>
                  <Badge variant="secondary" className="bg-[#007AFF]/10 text-[#007AFF] border-[#007AFF]/20">
                    {crypto.symbol.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm text-[#8E8E93]">Cap. marché: {formatMarketCap(crypto.market_cap)}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-[#000000] dark:text-[#FFFFFF]">{formatPrice(crypto.current_price)}</p>
                <div className="flex items-center space-x-1 mt-1">
                  {crypto.price_change_percentage_24h >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-[#34C759]" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-[#FF3B30]" />
                  )}
                  <span
                    className={`text-sm font-medium ${
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
      </CardContent>
    </Card>
  )
}
