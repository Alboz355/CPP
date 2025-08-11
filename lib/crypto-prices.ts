// Service de gestion des prix des cryptomonnaies - VERSION SÉCURISÉE
// Utilise les API routes internes au lieu d'exposer les clés API côté client

export interface CryptoPrice {
  id: string
  symbol: string
  name: string
  current_price: number
  price_change_percentage_24h: number
  market_cap: number
  image?: string
}

export type Currency = "CHF" | "EUR" | "USD"

export class CryptoPriceService {
  private static instance: CryptoPriceService
  private cache: Map<string, { data: CryptoPrice[]; timestamp: number }> = new Map()
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes - aligné avec le cache serveur

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
      // Utiliser la nouvelle API route sécurisée
      const response = await fetch('/api/crypto-prices', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      const json = await response.json()
      let data = json.data || []

      // Filtrer et formater les données pour les cryptos supportées
      const supportedSymbols = ['BTC', 'ETH', 'ALGO', 'SOL']
      const imageMap: Record<string, string> = {
        'BTC': 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png',
        'ETH': 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
        'ALGO': 'https://s2.coinmarketcap.com/static/img/coins/64x64/4030.png',
        'SOL': 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png',
      }

      data = data
        .filter((crypto: any) => supportedSymbols.includes(crypto.symbol))
        .map((crypto: any) => ({
          ...crypto,
          image: imageMap[crypto.symbol] || '/placeholder-crypto.png'
        }))

      // Conversion de devise si nécessaire (pour l'instant les prix sont en USD)
      if (currency !== 'USD') {
        const exchangeRates = await this.getExchangeRates()
        const rate = exchangeRates[currency] || 1

        data = data.map((crypto: any) => ({
          ...crypto,
          current_price: crypto.current_price * rate,
          market_cap: crypto.market_cap * rate
        }))
      }

      if (data.length === 0) {
        throw new Error('No crypto data received')
      }

      this.cache.set(cacheKey, { data, timestamp: Date.now() })
      return data

    } catch (error) {
      console.error('Error fetching crypto prices:', error)
      
      // Retourner des données de fallback pour ne pas casser l'UX
      return this.getFallbackPrices(currency)
    }
  }

  private async getExchangeRates(): Promise<Record<Currency, number>> {
    try {
      // Taux de change approximatifs (en production, utiliser une API de taux de change)
      return {
        USD: 1,
        CHF: 0.91,
        EUR: 0.85
      }
    } catch {
      return { USD: 1, CHF: 0.91, EUR: 0.85 }
    }
  }

  private getFallbackPrices(currency: Currency): CryptoPrice[] {
    // Données de fallback avec des prix approximatifs
    const basePrices = [
      { 
        id: 'bitcoin', 
        symbol: 'BTC', 
        name: 'Bitcoin', 
        current_price: 65000, 
        price_change_percentage_24h: 0, 
        market_cap: 1200000000000, 
        image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png' 
      },
      { 
        id: 'ethereum', 
        symbol: 'ETH', 
        name: 'Ethereum', 
        current_price: 3200, 
        price_change_percentage_24h: 0, 
        market_cap: 380000000000, 
        image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png' 
      },
      { 
        id: 'algorand', 
        symbol: 'ALGO', 
        name: 'Algorand', 
        current_price: 0.25, 
        price_change_percentage_24h: 0, 
        market_cap: 2000000000, 
        image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4030.png' 
      },
      { 
        id: 'solana', 
        symbol: 'SOL', 
        name: 'Solana', 
        current_price: 150, 
        price_change_percentage_24h: 0, 
        market_cap: 65000000000, 
        image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png' 
      },
    ]

    const exchangeRates = { USD: 1, CHF: 0.91, EUR: 0.85 }
    const rate = exchangeRates[currency]

    return basePrices.map((crypto) => ({
      ...crypto,
      current_price: crypto.current_price * rate,
      market_cap: crypto.market_cap * rate
    }))
  }

  formatPrice(price: number, currency: Currency = 'CHF'): string {
    const locales = { CHF: 'fr-CH', EUR: 'de-DE', USD: 'en-US' }
    return new Intl.NumberFormat(locales[currency], {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: price < 1 ? 4 : 2,
      maximumFractionDigits: price < 1 ? 4 : 2
    }).format(price)
  }

  formatMarketCap(marketCap: number, currency: Currency = 'CHF'): string {
    const currencySymbol = currency === 'EUR' ? '€' : currency === 'USD' ? '$' : 'CHF'
    if (marketCap >= 1e12) return `${(marketCap / 1e12).toFixed(2)}T ${currencySymbol}`
    if (marketCap >= 1e9) return `${(marketCap / 1e9).toFixed(2)}B ${currencySymbol}`
    if (marketCap >= 1e6) return `${(marketCap / 1e6).toFixed(2)}M ${currencySymbol}`
    return `${marketCap.toFixed(2)} ${currencySymbol}`
  }

  getCurrencySymbol(currency: Currency): string {
    const symbols = { CHF: 'CHF', EUR: '€', USD: '$' }
    return symbols[currency]
  }

  // Méthode pour vérifier la santé de l'API
  async checkAPIHealth(): Promise<boolean> {
    try {
      const response = await fetch('/api/crypto-prices', {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      })
      return response.ok
    } catch {
      return false
    }
  }
}

export const cryptoService = CryptoPriceService.getInstance()
