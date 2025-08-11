"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, RefreshCw, AlertCircle, CheckCircle } from "lucide-react"
import { cryptoService, type CryptoPrice } from "@/lib/crypto-prices"
import { useCurrency } from "@/contexts/currency-context"

export function RealTimePrices() {
  const [prices, setPrices] = useState<CryptoPrice[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [autoRefreshId, setAutoRefreshId] = useState<number | null>(null)
  const { currency } = useCurrency()

  const fetchPrices = async (forceRefresh = false) => {
    try {
      setLoading(true)
      setError(null)
      
      if (forceRefresh) {
        console.log('⚡ REFRESH FORCÉ des prix depuis CoinMarketCap...')
        cryptoService.clearCache()
      }
      
      const data = await cryptoService.getCryptoPrices(currency)
      setPrices(data)
      setLastUpdate(new Date())
      
      console.log(`🔥 ${data.length} prix TEMPS RÉEL chargés:`, data.find(p => p.symbol === 'BTC')?.current_price.toLocaleString('en-US'))
    } catch (error) {
      console.error("🚨 Erreur récupération prix TEMPS RÉEL:", error)
      setError(error instanceof Error ? error.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  // Auto-refresh TOUTES LES MINUTES
  useEffect(() => {
    // Chargement initial
    fetchPrices(true) // Force refresh initial
    
    // Démarrer auto-refresh TEMPS RÉEL
    const intervalId = cryptoService.startAutoRefresh(currency, (newPrices) => {
      console.log('🔄 Prix mis à jour automatiquement (1 minute écoulée)')
      setPrices(newPrices)
      setLastUpdate(new Date())
    })
    
    setAutoRefreshId(intervalId)
    console.log('🔄 Auto-refresh TEMPS RÉEL démarré (toutes les minutes)')
    
    return () => {
      if (intervalId) {
        cryptoService.stopAutoRefresh(intervalId)
        console.log('⏹️ Auto-refresh TEMPS RÉEL arrêté')
      }
    }
  }, [currency]) // Re-fetch quand la devise change

  // Nettoyage au démontage
  useEffect(() => {
    return () => {
      if (autoRefreshId) {
        cryptoService.stopAutoRefresh(autoRefreshId)
      }
    }
  }, [autoRefreshId])

  const formatPrice = (price: number): string => {
    return cryptoService.formatPrice(price, currency)
  }

  const formatChange = (change: number): string => {
    const sign = change >= 0 ? "+" : ""
    return `${sign}${change.toFixed(2)}%`
  }

  const getCryptoIcon = (symbol: string) => {
    const iconMap = {
      'BTC': '₿',
      'ETH': 'Ξ', 
      'SOL': '◎',
      'ALGO': 'Ⱥ',
      'USDC': '$'
    }
    
    return (
      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#007AFF] to-[#5856D6] flex items-center justify-center text-white font-bold text-lg">
        {iconMap[symbol as keyof typeof iconMap] || symbol.charAt(0)}
      </div>
    )
  }

  return (
    <Card className="apple-card">
      <CardHeader className="apple-card-header">
        <div className="flex items-center justify-between">
          <CardTitle className="apple-card-title flex items-center gap-2">
            <div className="p-2 bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-lg">
              <TrendingUp className="h-5 w-5 text-[#007AFF]" />
            </div>
            <div>
              <span>Prix CoinMarketCap</span>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={error ? "destructive" : "secondary"} className="text-xs">
                  {error ? (
                    <>
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Erreur
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Temps Réel
                    </>
                  )}
                </Badge>
              </div>
            </div>
          </CardTitle>
          <div className="flex items-center gap-2">
            {lastUpdate && (
              <span className="text-xs text-[#8E8E93]">
                {lastUpdate.toLocaleTimeString('fr-FR')}
              </span>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => fetchPrices(true)} 
              disabled={loading}
              className="h-8 w-8 bg-[#FFFFFF] dark:bg-[#1C1C1E] border-[#E5E5EA] dark:border-[#38383A] hover:bg-[#F2F2F7] dark:hover:bg-[#2C2C2E] rounded-lg"
            >
              <RefreshCw className={`h-4 w-4 text-[#007AFF] ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="apple-card-content">
        {error ? (
          <div className="flex items-center justify-center p-6 text-center">
            <div>
              <AlertCircle className="h-8 w-8 text-[#FF3B30] mx-auto mb-2" />
              <p className="text-sm text-[#FF3B30] font-medium">Erreur récupération prix</p>
              <p className="text-xs text-[#8E8E93] mt-1">{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => fetchPrices(true)}
                className="mt-3"
              >
                Réessayer
              </Button>
            </div>
          </div>
        ) : loading && prices.length === 0 ? (
          <div className="space-y-3">
            <div className="flex items-center justify-center p-4">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 text-[#007AFF] animate-spin mx-auto mb-2" />
                <p className="text-sm font-medium text-[#000000] dark:text-[#FFFFFF]">
                  Récupération prix CoinMarketCap...
                </p>
                <p className="text-xs text-[#8E8E93] mt-1">Données temps réel</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {prices.map((crypto) => (
              <div
                key={crypto.id}
                className="flex items-center justify-between p-4 bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-xl border border-[#E5E5EA] dark:border-[#38383A] hover:bg-[#E5E5EA] dark:hover:bg-[#38383A] transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  {getCryptoIcon(crypto.symbol)}
                  <div>
                    <div className="font-semibold text-sm text-[#000000] dark:text-[#FFFFFF]">
                      {crypto.symbol.toUpperCase()}
                    </div>
                    <div className="text-xs text-[#8E8E93]">{crypto.name}</div>
                    {crypto.cmc_rank && (
                      <div className="text-xs text-[#007AFF]">#{crypto.cmc_rank}</div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-sm text-[#000000] dark:text-[#FFFFFF]">
                    {formatPrice(crypto.current_price)}
                  </div>
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
                  {crypto.volume_24h && (
                    <div className="text-xs text-[#8E8E93] mt-1">
                      Vol: {cryptoService.formatMarketCap(crypto.volume_24h, currency)}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Indicateur de mise à jour automatique */}
            <div className="flex items-center justify-center gap-2 pt-2 text-xs text-[#8E8E93]">
              <div className="w-2 h-2 bg-[#34C759] rounded-full animate-pulse"></div>
              <span>Actualisation automatique toutes les minutes</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
