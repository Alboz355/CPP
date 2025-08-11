// Service de gestion des prix des cryptomonnaies - PRIX RÉELS UNIQUEMENT
// Actualisation toutes les minutes depuis CoinMarketCap

export interface CryptoPrice {
  id: string
  symbol: string
  name: string
  current_price: number
  market_cap: number
  price_change_percentage_24h: number
  last_updated?: string
  image?: string
  cmc_rank?: number
  volume_24h?: number
}

export type Currency = "USD" | "EUR" | "CHF"

export class CryptoPriceService {
  private static instance: CryptoPriceService
  private cache: Map<string, { data: CryptoPrice[]; timestamp: number }> = new Map()
  private ratesCache: { rates: any; timestamp: number } | null = null
  private readonly CACHE_DURATION = 60 * 1000 // 1 MINUTE SEULEMENT !
  private readonly RATES_CACHE_DURATION = 60 * 60 * 1000 // 1 heure pour les taux

  private constructor() {}

  static getInstance(): CryptoPriceService {
    if (!CryptoPriceService.instance) {
      CryptoPriceService.instance = new CryptoPriceService()
    }
    return CryptoPriceService.instance
  }

  async getCryptoPrices(currency: Currency = "USD"): Promise<CryptoPrice[]> {
    const cacheKey = `crypto-prices-${currency}`
    const cached = this.cache.get(cacheKey)

    // Cache très court - 1 minute max
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      const ageSeconds = Math.floor((Date.now() - cached.timestamp) / 1000)
      console.log(`📊 Prix en cache (${ageSeconds}s old) - ${currency}`)
      return cached.data
    }

    try {
      console.log(`🔥 RÉCUPÉRATION PRIX RÉELS temps réel (${currency})...`)

      // REQUÊTE RÉELLE à notre API sécurisée
      const response = await fetch('/api/crypto-prices', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        cache: 'no-cache' // Forcer refresh
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('🚨 ERREUR API:', response.status, errorData)
        throw new Error(`API Error ${response.status}: ${errorData.message || response.statusText}`)
      }

      const json = await response.json()
      
      if (!json.data || json.data.length === 0) {
        throw new Error('Aucune donnée crypto reçue')
      }

      let data = json.data

      console.log(`✅ ${data.length} prix RÉELS reçus de CoinMarketCap`)
      console.log(`🔥 BTC: $${data.find(c => c.symbol === 'BTC')?.current_price.toLocaleString('en-US')} USD`)
      console.log(`💎 Source: ${json.source} - Fresh: ${json.freshData ? 'OUI' : 'NON'}`)

      // Convertir depuis USD vers la devise demandée si nécessaire
      if (currency !== 'USD') {
        const rates = await this.getExchangeRates()
        const conversionRate = rates[currency] || 1
        
        data = data.map((crypto: any) => ({
          ...crypto,
          current_price: crypto.current_price * conversionRate,
          market_cap: crypto.market_cap * conversionRate,
          volume_24h: crypto.volume_24h ? crypto.volume_24h * conversionRate : undefined
        }))
        
        console.log(`🔄 Prix convertis USD -> ${currency} (taux: ${conversionRate})`)
      }

      // Mettre en cache SEULEMENT 1 minute
      this.cache.set(cacheKey, { data, timestamp: Date.now() })
      console.log(`💾 Prix RÉELS mis en cache pour ${currency} (1 minute)`)
      
      return data

    } catch (error) {
      console.error('🚨 ERREUR CRITIQUE récupération prix réels:', error)
      
      // PAS DE FALLBACK - ÉCHEC SI PAS DE VRAIES DONNÉES !
      throw new Error(`Impossible de récupérer les prix réels: ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
    }
  }

  private async getExchangeRates(): Promise<Record<Currency, number>> {
    // Vérifier le cache des taux
    if (this.ratesCache && Date.now() - this.ratesCache.timestamp < this.RATES_CACHE_DURATION) {
      return this.ratesCache.rates
    }

    try {
      console.log('📡 Récupération taux de change RÉELS...')
      const response = await fetch('/api/exchange-rates')
      
      if (response.ok) {
        const data = await response.json()
        const rates = data.rates || { USD: 1, CHF: 0.91, EUR: 0.85 }
        
        // Mettre en cache
        this.ratesCache = {
          rates,
          timestamp: Date.now()
        }
        
        console.log('✅ Taux de change RÉELS récupérés:', rates)
        return rates
      }
    } catch (error) {
      console.warn('⚠️ Erreur récupération taux, utilisation valeurs par défaut:', error)
    }

    // Valeurs par défaut minimum
    const defaultRates = { USD: 1, CHF: 0.91, EUR: 0.85 }
    this.ratesCache = {
      rates: defaultRates,
      timestamp: Date.now()
    }
    return defaultRates
  }

  // Récupérer le prix d'une crypto spécifique
  async getCryptoPrice(symbol: string, currency: Currency = 'USD'): Promise<number> {
    try {
      const prices = await this.getCryptoPrices(currency)
      const crypto = prices.find(p => p.symbol === symbol.toUpperCase())
      if (!crypto) {
        console.warn(`Prix non trouvé pour ${symbol}`)
        return 0
      }
      return crypto.current_price
    } catch (error) {
      console.error(`🚨 Erreur récupération prix ${symbol}:`, error)
      throw error // Propager l'erreur au lieu de retourner 0
    }
  }

  // Calculer la valeur d'une quantité de crypto
  async calculateValue(amount: number, cryptoSymbol: string, targetCurrency: Currency = 'USD'): Promise<number> {
    if (amount === 0) return 0
    
    try {
      const price = await this.getCryptoPrice(cryptoSymbol, targetCurrency)
      if (price === 0) {
        throw new Error(`Prix non disponible pour ${cryptoSymbol}`)
      }
      
      const value = amount * price
      console.log(`💰 ${amount} ${cryptoSymbol} = ${this.formatPrice(value, targetCurrency)} (prix: ${this.formatPrice(price, targetCurrency)})`)
      return value
    } catch (error) {
      console.error(`🚨 Erreur calcul valeur ${cryptoSymbol}:`, error)
      throw error // Propager l'erreur
    }
  }

  formatPrice(price: number, currency: Currency = 'USD'): string {
    const locales = { USD: 'en-US', EUR: 'de-DE', CHF: 'fr-CH' }
    const locale = locales[currency] || 'en-US'
    
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: price < 1 ? 4 : 2,
        maximumFractionDigits: price < 1 ? 6 : 2
      }).format(price)
    } catch (error) {
      // Fallback simple
      const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency + ' '
      return `${symbol}${price.toFixed(2)}`
    }
  }

  formatMarketCap(marketCap: number, currency: Currency = 'USD'): string {
    const symbol = currency === 'EUR' ? '€' : currency === 'USD' ? '$' : currency + ' '
    if (marketCap >= 1e12) return `${symbol}${(marketCap / 1e12).toFixed(2)}T`
    if (marketCap >= 1e9) return `${symbol}${(marketCap / 1e9).toFixed(2)}B`
    if (marketCap >= 1e6) return `${symbol}${(marketCap / 1e6).toFixed(2)}M`
    return `${symbol}${marketCap.toLocaleString()}`
  }

  getCurrencySymbol(currency: Currency): string {
    const symbols = { USD: '$', EUR: '€', CHF: 'CHF' }
    return symbols[currency]
  }

  // Méthode pour vérifier la santé de l'API CoinMarketCap
  async checkAPIHealth(): Promise<{ healthy: boolean; details: any }> {
    try {
      const response = await fetch('/api/crypto-prices', {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      })
      
      if (response.ok) {
        const data = await response.json()
        return {
          healthy: true,
          details: {
            source: data.source,
            cryptoCount: data.data?.length || 0,
            lastUpdate: data.lastUpdate,
            freshData: data.freshData
          }
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        return {
          healthy: false,
          details: {
            status: response.status,
            error: errorData.message || response.statusText
          }
        }
      }
    } catch (error) {
      return {
        healthy: false,
        details: {
          error: error instanceof Error ? error.message : 'Network error'
        }
      }
    }
  }

  // Nettoyer le cache pour forcer refresh
  clearCache(): void {
    this.cache.clear()
    this.ratesCache = null
    console.log('🧹 Cache NETTOYÉ - prochaine requête sera fraîche')
  }

  // Forcer refresh immédiat des prix
  async forceRefresh(currency: Currency = 'USD'): Promise<CryptoPrice[]> {
    console.log('⚡ REFRESH FORCÉ des prix depuis CoinMarketCap...')
    this.clearCache()
    return await this.getCryptoPrices(currency)
  }

  // Démarrer auto-refresh toutes les minutes
  startAutoRefresh(currency: Currency = 'USD', callback?: (prices: CryptoPrice[]) => void): number {
    console.log('🔄 AUTO-REFRESH démarré - prix mis à jour toutes les minutes')
    
    const intervalId = setInterval(async () => {
      try {
        console.log('⏰ Auto-refresh des prix (1 minute écoulée)...')
        const prices = await this.forceRefresh(currency)
        console.log(`✅ ${prices.length} prix mis à jour automatiquement`)
        
        if (callback) {
          callback(prices)
        }
      } catch (error) {
        console.error('🚨 Erreur auto-refresh:', error)
      }
    }, 60 * 1000) // 1 MINUTE !

    return intervalId
  }

  // Arrêter auto-refresh
  stopAutoRefresh(intervalId: number): void {
    clearInterval(intervalId)
    console.log('⏹️ Auto-refresh arrêté')
  }
}

export const cryptoService = CryptoPriceService.getInstance()
