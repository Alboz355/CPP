// Service de gestion des prix des cryptomonnaies avec support multi-devises

export interface CryptoPrice {
  id: string
  symbol: string
  name: string
  current_price: number
  price_change_percentage_24h: number
  market_cap: number
  image: string
}

export type Currency = "CHF" | "EUR" | "USD"

export class CryptoPriceService {
  private static instance: CryptoPriceService
  private cache: Map<string, { data: CryptoPrice[]; timestamp: number }> = new Map()
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  private constructor() {}

  static getInstance(): CryptoPriceService {
    if (!CryptoPriceService.instance) {
      CryptoPriceService.instance = new CryptoPriceService()
    }
    return CryptoPriceService.instance
  }

  async getCryptoPrices(currency: Currency = "CHF"): Promise<CryptoPrice[]> {
    const cacheKey = `crypto-prices-${currency}`
    const cached = this.cache.get(cacheKey)

    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data
    }

    try {
      // Convertir la devise pour l'API CoinGecko
      const apiCurrency = currency.toLowerCase()

      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${apiCurrency}&ids=bitcoin,ethereum,algorand&order=market_cap_desc&per_page=10&page=1&sparkline=false`,
      )

      if (!response.ok) {
        throw new Error("Failed to fetch crypto prices")
      }

      const data: CryptoPrice[] = await response.json()
      this.cache.set(cacheKey, { data, timestamp: Date.now() })
      return data
    } catch (error) {
      console.error("Error fetching crypto prices:", error)
      // Retourner des données de fallback avec conversion approximative
      return this.getFallbackPrices(currency)
    }
  }

  private getFallbackPrices(currency: Currency): CryptoPrice[] {
    // Prix de base en USD
    const basePrices = [
      {
        id: "bitcoin",
        symbol: "btc",
        name: "Bitcoin",
        current_price: 65000,
        price_change_percentage_24h: 2.5,
        market_cap: 1200000000000,
        image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
      },
      {
        id: "ethereum",
        symbol: "eth",
        name: "Ethereum",
        current_price: 3200,
        price_change_percentage_24h: -1.2,
        market_cap: 380000000000,
        image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
      },
      {
        id: "algorand",
        symbol: "algo",
        name: "Algorand",
        current_price: 0.25,
        price_change_percentage_24h: 5.8,
        market_cap: 2000000000,
        image: "https://assets.coingecko.com/coins/images/4380/large/download.png",
      },
    ]

    // Taux de change approximatifs (en production, utiliser une API de taux de change)
    const exchangeRates = {
      USD: 1,
      CHF: 0.91, // 1 USD = 0.91 CHF
      EUR: 0.85, // 1 USD = 0.85 EUR
    }

    const rate = exchangeRates[currency]

    return basePrices.map((crypto) => ({
      ...crypto,
      current_price: crypto.current_price * rate,
      market_cap: crypto.market_cap * rate,
    }))
  }

  formatPrice(price: number, currency: Currency = "CHF"): string {
    const currencySymbols = {
      CHF: "CHF",
      EUR: "€",
      USD: "$",
    }

    const locales = {
      CHF: "fr-CH",
      EUR: "de-DE",
      USD: "en-US",
    }

    return new Intl.NumberFormat(locales[currency], {
      style: "currency",
      currency: currency,
      minimumFractionDigits: price < 1 ? 4 : 2,
      maximumFractionDigits: price < 1 ? 4 : 2,
    }).format(price)
  }

  formatMarketCap(marketCap: number, currency: Currency = "CHF"): string {
    const currencySymbol = currency === "EUR" ? "€" : currency === "USD" ? "$" : "CHF"

    if (marketCap >= 1e12) {
      return `${(marketCap / 1e12).toFixed(2)}T ${currencySymbol}`
    } else if (marketCap >= 1e9) {
      return `${(marketCap / 1e9).toFixed(2)}B ${currencySymbol}`
    } else if (marketCap >= 1e6) {
      return `${(marketCap / 1e6).toFixed(2)}M ${currencySymbol}`
    }
    return `${marketCap.toFixed(2)} ${currencySymbol}`
  }

  getCurrencySymbol(currency: Currency): string {
    const symbols = {
      CHF: "CHF",
      EUR: "€",
      USD: "$",
    }
    return symbols[currency]
  }
}

// Export de l'instance singleton
export const cryptoService = CryptoPriceService.getInstance()
