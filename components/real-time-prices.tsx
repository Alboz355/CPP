"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CryptoPrice {
  symbol: string
  name: string
  price: number
  change24h: number
  marketCap: number
}

export function RealTimePrices() {
  const [prices, setPrices] = useState<CryptoPrice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const fetchPrices = async () => {
    try {
      setError(null)
      console.log("Récupération des prix...")

      // Utiliser une API alternative sans CORS ou un proxy
      const apis = [
        {
          url: "https://api.coinbase.com/v2/exchange-rates?currency=USD",
          parser: (data: any) => parseCoinbaseData(data),
        },
        {
          url: "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,algorand,matic-network,cardano,solana,polkadot,avalanche-2&vs_currencies=usd&include_24hr_change=true&include_market_cap=true",
          parser: (data: any) => parseCoingeckoData(data),
        },
      ]

      let success = false

      // Essayer chaque API
      for (const api of apis) {
        try {
          console.log(`Tentative avec API: ${api.url}`)

          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 8000)

          const response = await fetch(api.url, {
            headers: {
              Accept: "application/json",
              "User-Agent": "CryptoWallet/1.0",
            },
            signal: controller.signal,
            mode: "cors",
          })

          clearTimeout(timeoutId)

          if (response.ok) {
            const data = await response.json()
            const parsedPrices = api.parser(data)

            if (parsedPrices && parsedPrices.length > 0) {
              setPrices(parsedPrices)
              setLastUpdate(new Date())
              success = true
              console.log(`Succès avec API: ${api.url}`)
              break
            }
          }
        } catch (apiError) {
          console.log(`Échec avec API: ${api.url}`, apiError)
          continue
        }
      }

      if (!success) {
        throw new Error("Toutes les APIs ont échoué")
      }
    } catch (error: any) {
      console.error("Erreur lors de la récupération des prix:", error)

      if (error.name === "AbortError") {
        setError("Timeout - Connexion lente")
      } else {
        setError("APIs indisponibles")
      }

      // Utiliser des prix par défaut réalistes
      if (prices.length === 0) {
        const defaultPrices: CryptoPrice[] = [
          { symbol: "BTC", name: "Bitcoin", price: 43250, change24h: 2.1, marketCap: 850000000000 },
          { symbol: "ETH", name: "Ethereum", price: 2650, change24h: 1.5, marketCap: 320000000000 },
          { symbol: "USDT", name: "Tether", price: 1.0, change24h: 0.02, marketCap: 95000000000 },
          { symbol: "ALGO", name: "Algorand", price: 0.15, change24h: -0.8, marketCap: 1200000000 },
          { symbol: "MATIC", name: "Polygon", price: 0.85, change24h: 3.2, marketCap: 8000000000 },
          { symbol: "ADA", name: "Cardano", price: 0.38, change24h: -1.1, marketCap: 13000000000 },
          { symbol: "SOL", name: "Solana", price: 98, change24h: 4.8, marketCap: 42000000000 },
          { symbol: "DOT", name: "Polkadot", price: 7.2, change24h: 2.3, marketCap: 9000000000 },
          { symbol: "AVAX", name: "Avalanche", price: 36, change24h: 1.9, marketCap: 14000000000 },
        ]
        setPrices(defaultPrices)
        setLastUpdate(new Date())
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Parser pour Coinbase
  const parseCoinbaseData = (data: any): CryptoPrice[] => {
    try {
      if (!data?.data?.rates) return []

      const rates = data.data.rates
      return [
        {
          symbol: "BTC",
          name: "Bitcoin",
          price: 1 / Number.parseFloat(rates.BTC || "0.000023"),
          change24h: 2.1, // Coinbase ne fournit pas le change, valeur par défaut
          marketCap: 850000000000,
        },
        {
          symbol: "ETH",
          name: "Ethereum",
          price: 1 / Number.parseFloat(rates.ETH || "0.00038"),
          change24h: 1.5,
          marketCap: 320000000000,
        },
      ]
    } catch (error) {
      console.error("Erreur parsing Coinbase:", error)
      return []
    }
  }

  // Parser pour CoinGecko
  const parseCoingeckoData = (data: any): CryptoPrice[] => {
    try {
      return [
        {
          symbol: "BTC",
          name: "Bitcoin",
          price: data.bitcoin?.usd || 43250,
          change24h: data.bitcoin?.usd_24h_change || 2.1,
          marketCap: data.bitcoin?.usd_market_cap || 850000000000,
        },
        {
          symbol: "ETH",
          name: "Ethereum",
          price: data.ethereum?.usd || 2650,
          change24h: data.ethereum?.usd_24h_change || 1.5,
          marketCap: data.ethereum?.usd_market_cap || 320000000000,
        },
        {
          symbol: "USDT",
          name: "Tether",
          price: data.tether?.usd || 1.0,
          change24h: data.tether?.usd_24h_change || 0.02,
          marketCap: data.tether?.usd_market_cap || 95000000000,
        },
        {
          symbol: "ALGO",
          name: "Algorand",
          price: data.algorand?.usd || 0.15,
          change24h: data.algorand?.usd_24h_change || -0.8,
          marketCap: data.algorand?.usd_market_cap || 1200000000,
        },
        {
          symbol: "MATIC",
          name: "Polygon",
          price: data["matic-network"]?.usd || 0.85,
          change24h: data["matic-network"]?.usd_24h_change || 3.2,
          marketCap: data["matic-network"]?.usd_market_cap || 8000000000,
        },
        {
          symbol: "ADA",
          name: "Cardano",
          price: data.cardano?.usd || 0.38,
          change24h: data.cardano?.usd_24h_change || -1.1,
          marketCap: data.cardano?.usd_market_cap || 13000000000,
        },
        {
          symbol: "SOL",
          name: "Solana",
          price: data.solana?.usd || 98,
          change24h: data.solana?.usd_24h_change || 4.8,
          marketCap: data.solana?.usd_market_cap || 42000000000,
        },
        {
          symbol: "DOT",
          name: "Polkadot",
          price: data.polkadot?.usd || 7.2,
          change24h: data.polkadot?.usd_24h_change || 2.3,
          marketCap: data.polkadot?.usd_market_cap || 9000000000,
        },
        {
          symbol: "AVAX",
          name: "Avalanche",
          price: data["avalanche-2"]?.usd || 36,
          change24h: data["avalanche-2"]?.usd_24h_change || 1.9,
          marketCap: data["avalanche-2"]?.usd_market_cap || 14000000000,
        },
      ]
    } catch (error) {
      console.error("Erreur parsing CoinGecko:", error)
      return []
    }
  }

  useEffect(() => {
    fetchPrices()
    // Actualiser toutes les 3 minutes pour éviter les limites de taux
    const interval = setInterval(fetchPrices, 180000)
    return () => clearInterval(interval)
  }, [])

  const handleRefresh = () => {
    setIsLoading(true)
    fetchPrices()
  }

  if (isLoading && prices.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <div className="flex items-center justify-center space-x-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <p className="text-gray-600">Chargement des prix...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="modern-card p-6">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h3 className="heading-3">Prix du marché</h3>
          <div className="flex items-center space-x-2">
            {error && (
              <div className="flex items-center space-x-1 text-yellow-500">
                <AlertCircle className="h-4 w-4" />
                <span className="text-xs">Mode hors ligne</span>
              </div>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRefresh} 
              disabled={isLoading}
              className="rounded-lg hover:bg-accent/50"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
        {lastUpdate && (
          <p className="caption-text">
            Dernière mise à jour: {lastUpdate.toLocaleTimeString()}
          </p>
        )}
      </div>
      <div className="space-y-3">
        {prices.slice(0, 6).map((crypto) => (
          <div 
            key={crypto.symbol} 
            className="flex items-center justify-between p-3 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
                <span className="font-bold text-sm text-primary">{crypto.symbol}</span>
              </div>
              <div>
                <p className="font-medium text-foreground">{crypto.name}</p>
                <p className="text-sm text-muted-foreground">
                  Cap: ${crypto.marketCap > 0 ? (crypto.marketCap / 1e9).toFixed(1) + "B" : "N/A"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-foreground">
                ${crypto.price < 1 ? crypto.price.toFixed(4) : crypto.price.toLocaleString()}
              </p>
              <div className="flex items-center space-x-1">
                {crypto.change24h >= 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <span className={`text-xs font-medium ${
                  crypto.change24h >= 0 ? "text-green-500" : "text-red-500"
                }`}>
                  {crypto.change24h.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
