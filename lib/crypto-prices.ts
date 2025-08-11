// Service de gestion des prix des cryptomonnaies avec support multi-devises (CoinMarketCap)

import { CMC_API_KEY } from '@/lib/config'

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
  private readonly CACHE_DURATION = 60 * 1000 // 1 minute

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
      const convert = currency
      const symbols = ['BTC', 'ETH', 'ALGO', 'SOL']
      const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbols.join(',')}&convert=${convert}`
      const response = await fetch(url, {
        headers: {
          accept: 'application/json',
          'X-CMC_PRO_API_KEY': CMC_API_KEY,
        },
      })

      if (!response.ok) {
        throw new Error(`CMC HTTP ${response.status}`)
      }

      const json = await response.json()
      const data: CryptoPrice[] = []

      const map: Record<string, { id: string; name: string; image: string }> = {
        BTC: { id: 'bitcoin', name: 'Bitcoin', image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png' },
        ETH: { id: 'ethereum', name: 'Ethereum', image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png' },
        ALGO: { id: 'algorand', name: 'Algorand', image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4030.png' },
        SOL: { id: 'solana', name: 'Solana', image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png' },
      }

      for (const sym of symbols) {
        const entry = json.data?.[sym]
        const quote = entry?.quote?.[convert]
        if (entry && quote) {
          const meta = map[sym]
          data.push({
            id: meta.id,
            symbol: sym,
            name: meta.name,
            current_price: quote.price,
            price_change_percentage_24h: quote.percent_change_24h ?? 0,
            market_cap: quote.market_cap ?? 0,
            image: meta.image,
          })
        }
      }

      if (data.length === 0) throw new Error('CMC empty data')

      this.cache.set(cacheKey, { data, timestamp: Date.now() })
      return data
    } catch (error) {
      console.error('CMC error:', error)
      return this.getFallbackPrices(currency)
    }
  }

  private getFallbackPrices(currency: Currency): CryptoPrice[] {
    const basePrices = [
      { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', current_price: 65000, price_change_percentage_24h: 0, market_cap: 1200000000000, image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png' },
      { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', current_price: 3200, price_change_percentage_24h: 0, market_cap: 380000000000, image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png' },
      { id: 'algorand', symbol: 'ALGO', name: 'Algorand', current_price: 0.25, price_change_percentage_24h: 0, market_cap: 2000000000, image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4030.png' },
      { id: 'solana', symbol: 'SOL', name: 'Solana', current_price: 150, price_change_percentage_24h: 0, market_cap: 65000000000, image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png' },
    ]

    const exchangeRates = { USD: 1, CHF: 0.91, EUR: 0.85 }
    const rate = exchangeRates[currency]

    return basePrices.map((crypto) => ({ ...crypto, current_price: crypto.current_price * rate, market_cap: crypto.market_cap * rate }))
  }

  formatPrice(price: number, currency: Currency = 'CHF'): string {
    const locales = { CHF: 'fr-CH', EUR: 'de-DE', USD: 'en-US' }
    return new Intl.NumberFormat(locales[currency], { style: 'currency', currency: currency, minimumFractionDigits: price < 1 ? 4 : 2, maximumFractionDigits: price < 1 ? 4 : 2 }).format(price)
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
}

export const cryptoService = CryptoPriceService.getInstance()
