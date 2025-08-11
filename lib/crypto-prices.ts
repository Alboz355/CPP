// Service de gestion des prix des cryptomonnaies - VERSION RÉELLE
// Utilise CoinMarketCap et taux de change réels

export interface CryptoPrice {
  id: string
  symbol: string
  name: string
  current_price: number
  market_cap: number
  price_change_percentage_24h: number
  last_updated?: string
  image?: string
}

export type Currency = "CHF" | "EUR" | "USD"

export class CryptoPriceService {
  private static instance: CryptoPriceService
  private cache: Map<string, { data: CryptoPrice[]; timestamp: number }> = new Map()
  private ratesCache: { rates: any; timestamp: number } | null = null
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
  private readonly RATES_CACHE_DURATION = 60 * 60 * 1000 // 1 heure

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
      console.log(`📊 Utilisation prix crypto en cache (${currency})`)
      return cached.data
    }

    try {
      console.log(`🚀 Récupération prix cryptos réels (${currency})...`)

      // Récupérer les prix depuis notre API sécurisée
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

      console.log(`✅ ${data.length} prix reçus de CoinMarketCap`)

      // Si les prix sont en CHF et qu'on veut une autre devise, convertir
      if (currency !== 'CHF' && json.currency === 'CHF') {
        const rates = await this.getExchangeRates()
        const conversionRate = this.getConversionRate('CHF', currency, rates)
        
        data = data.map((crypto: any) => ({
          ...crypto,
          current_price: crypto.current_price * conversionRate,
          market_cap: crypto.market_cap * conversionRate
        }))
        
        console.log(`🔄 Prix convertis CHF -> ${currency} (taux: ${conversionRate})`)
      }
      
      // Si les prix sont en USD et qu'on veut CHF ou EUR, convertir
      else if (json.currency === 'USD' && currency !== 'USD') {
        const rates = await this.getExchangeRates()
        const conversionRate = rates[currency] || 1
        
        data = data.map((crypto: any) => ({
          ...crypto,
          current_price: crypto.current_price * conversionRate,
          market_cap: crypto.market_cap * conversionRate
        }))
        
        console.log(`🔄 Prix convertis USD -> ${currency} (taux: ${conversionRate})`)
      }

      if (data.length === 0) {
        throw new Error('No crypto data received')
      }

      // Mettre en cache
      this.cache.set(cacheKey, { data, timestamp: Date.now() })
      console.log(`💾 Prix mis en cache pour ${currency}`)
      
      return data

    } catch (error) {
      console.error('❌ Error fetching crypto prices:', error)
      
      // Retourner des données de fallback pour ne pas casser l'UX
      const fallbackData = await this.getFallbackPrices(currency)
      console.log(`🆘 Utilisation données de fallback pour ${currency}`)
      return fallbackData
    }
  }

  private async getExchangeRates(): Promise<Record<Currency, number>> {
    // Vérifier le cache des taux
    if (this.ratesCache && Date.now() - this.ratesCache.timestamp < this.RATES_CACHE_DURATION) {
      return this.ratesCache.rates
    }

    try {
      console.log('📡 Récupération taux de change...')
      const response = await fetch('/api/exchange-rates')
      
      if (response.ok) {
        const data = await response.json()
        const rates = data.rates || { USD: 1, CHF: 0.91, EUR: 0.85 }
        
        // Mettre en cache
        this.ratesCache = {
          rates,
          timestamp: Date.now()
        }
        
        console.log('✅ Taux de change récupérés:', rates)
        return rates
      }
    } catch (error) {
      console.warn('⚠️ Erreur récupération taux, utilisation valeurs par défaut:', error)
    }

    // Valeurs par défaut
    const defaultRates = { USD: 1, CHF: 0.91, EUR: 0.85 }
    this.ratesCache = {
      rates: defaultRates,
      timestamp: Date.now()
    }
    return defaultRates
  }

  private getConversionRate(fromCurrency: Currency, toCurrency: Currency, rates: Record<string, number>): number {
    if (fromCurrency === toCurrency) return 1
    
    // Si on convertit depuis CHF
    if (fromCurrency === 'CHF') {
      if (toCurrency === 'USD') return 1 / rates.CHF
      if (toCurrency === 'EUR') return rates.EUR / rates.CHF
    }
    
    // Si on convertit depuis USD
    if (fromCurrency === 'USD') {
      return rates[toCurrency] || 1
    }
    
    // Si on convertit depuis EUR
    if (fromCurrency === 'EUR') {
      if (toCurrency === 'USD') return 1 / rates.EUR
      if (toCurrency === 'CHF') return rates.CHF / rates.EUR
    }
    
    return 1
  }

  private async getFallbackPrices(currency: Currency): Promise<CryptoPrice[]> {
    // Données de fallback avec des prix approximatifs en USD
    const basePrices = [
      { 
        id: 'bitcoin', 
        symbol: 'BTC', 
        name: 'Bitcoin', 
        current_price: 65000, 
        price_change_percentage_24h: 2.1, 
        market_cap: 1280000000000, 
        image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png' 
      },
      { 
        id: 'ethereum', 
        symbol: 'ETH', 
        name: 'Ethereum', 
        current_price: 3200, 
        price_change_percentage_24h: 1.5, 
        market_cap: 385000000000, 
        image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png' 
      },
      { 
        id: 'algorand', 
        symbol: 'ALGO', 
        name: 'Algorand', 
        current_price: 0.25, 
        price_change_percentage_24h: -0.8, 
        market_cap: 2100000000, 
        image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4030.png' 
      },
      { 
        id: 'solana', 
        symbol: 'SOL', 
        name: 'Solana', 
        current_price: 150, 
        price_change_percentage_24h: 3.4, 
        market_cap: 67000000000, 
        image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png' 
      },
    ]

    // Convertir si nécessaire
    if (currency !== 'USD') {
      const rates = await this.getExchangeRates()
      const conversionRate = rates[currency] || 1

      return basePrices.map((crypto) => ({
        ...crypto,
        current_price: crypto.current_price * conversionRate,
        market_cap: crypto.market_cap * conversionRate
      }))
    }

    return basePrices
  }

  // Récupérer le prix d'une crypto spécifique
  async getCryptoPrice(symbol: string, currency: Currency = 'CHF'): Promise<number> {
    try {
      const prices = await this.getCryptoPrices(currency)
      const crypto = prices.find(p => p.symbol === symbol.toUpperCase())
      return crypto ? crypto.current_price : 0
    } catch (error) {
      console.error(`Erreur récupération prix ${symbol}:`, error)
      return 0
    }
  }

  // Calculer la valeur en CHF d'une quantité de crypto
  async calculateValue(amount: number, cryptoSymbol: string, targetCurrency: Currency = 'CHF'): Promise<number> {
    if (amount === 0) return 0
    
    try {
      const price = await this.getCryptoPrice(cryptoSymbol, targetCurrency)
      const value = amount * price
      console.log(`💰 ${amount} ${cryptoSymbol} = ${value.toFixed(2)} ${targetCurrency}`)
      return value
    } catch (error) {
      console.error(`Erreur calcul valeur ${cryptoSymbol}:`, error)
      return 0
    }
  }

  formatPrice(price: number, currency: Currency = 'CHF'): string {
    const locales = { CHF: 'fr-CH', EUR: 'de-DE', USD: 'en-US' }
    return new Intl.NumberFormat(locales[currency], {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: price < 1 ? 4 : 2,
      maximumFractionDigits: price < 1 ? 6 : 2
    }).format(price)
  }

  formatMarketCap(marketCap: number, currency: Currency = 'CHF'): string {
    const currencySymbol = currency === 'EUR' ? '€' : currency === 'USD' ? '$' : 'CHF'
    if (marketCap >= 1e12) return `${(marketCap / 1e12).toFixed(2)}T ${currencySymbol}`
    if (marketCap >= 1e9) return `${(marketCap / 1e9).toFixed(2)}B ${currencySymbol}`
    if (marketCap >= 1e6) return `${(marketCap / 1e6).toFixed(2)}M ${currencySymbol}`
    return `${marketCap.toLocaleString()} ${currencySymbol}`
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

  // Nettoyer le cache
  clearCache(): void {
    this.cache.clear()
    this.ratesCache = null
    console.log('🧹 Cache crypto-prices nettoyé')
  }
}

export const cryptoService = CryptoPriceService.getInstance()
