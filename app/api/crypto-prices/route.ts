import { NextRequest, NextResponse } from 'next/server'
import { CMC_API_KEY } from '@/lib/config'

// Rate limiting
const rateLimit = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const userLimit = rateLimit.get(ip)

  if (!userLimit || now > userLimit.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }

  if (userLimit.count >= MAX_REQUESTS_PER_WINDOW) {
    return false
  }

  userLimit.count++
  return true
}

export async function GET(request: NextRequest) {
  try {
    // Vérification de l'origine
    const origin = request.headers.get('origin')
    const allowedOrigins = ['https://crypto-wallet.app', 'https://www.crypto-wallet.app', 'http://localhost:3000']
    
    if (process.env.NODE_ENV === 'production' && !allowedOrigins.includes(origin || '')) {
      return NextResponse.json({ error: 'Origin not allowed' }, { status: 403 })
    }

    // Rate limiting
    const forwardedFor = request.headers.get('x-forwarded-for')
    const ip = forwardedFor ? forwardedFor.split(',')[0] : 'unknown'
    
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }

    // Vérifier que la clé API est configurée
    if (!CMC_API_KEY) {
      console.error('CMC_API_KEY non configurée')
      return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 })
    }

    console.log('🚀 Récupération prix cryptos RÉELS en USD depuis CoinMarketCap...')

    // Récupérer les données RÉELLES depuis CoinMarketCap en USD (prix actuels)
    const symbols = ['BTC', 'ETH', 'ALGO', 'SOL', 'USDC']
    const response = await fetch(
      `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbols.join(',')}&convert=USD`,
      {
        headers: {
          'X-CMC_PRO_API_KEY': CMC_API_KEY,
          'Accept': 'application/json',
        },
        next: { revalidate: 300 } // Cache pendant 5 minutes
      }
    )

    if (!response.ok) {
      console.error('Erreur CoinMarketCap:', response.status, response.statusText)
      throw new Error(`CoinMarketCap API error: ${response.status}`)
    }

    const data = await response.json()
    console.log('✅ Données reçues de CoinMarketCap:', data.data ? Object.keys(data.data) : 'No data')

    // Mapping des symboles vers les infos complètes avec USDC
    const cryptoInfo = {
      'BTC': { id: 'bitcoin', name: 'Bitcoin', image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png' },
      'ETH': { id: 'ethereum', name: 'Ethereum', image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png' },
      'ALGO': { id: 'algorand', name: 'Algorand', image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4030.png' },
      'SOL': { id: 'solana', name: 'Solana', image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png' },
      'USDC': { id: 'usd-coin', name: 'USD Coin', image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png' }
    }

    // Transformer les données CoinMarketCap en format attendu
    const filteredData = symbols.map(symbol => {
      const coinData = data.data[symbol]
      const info = cryptoInfo[symbol as keyof typeof cryptoInfo]
      
      if (!coinData || !coinData.quote?.USD) {
        console.warn(`Données manquantes pour ${symbol}`)
        return null
      }

      const quote = coinData.quote.USD
      
      const result = {
        id: info.id,
        name: info.name,
        symbol: symbol,
        current_price: quote.price,
        market_cap: quote.market_cap,
        price_change_percentage_24h: quote.percent_change_24h,
        last_updated: coinData.last_updated,
        image: info.image
      }
      
      console.log(`💰 ${symbol}: $${quote.price.toFixed(2)} USD`)
      return result
    }).filter(Boolean) // Supprimer les valeurs null

    console.log(`✅ ${filteredData.length} cryptomonnaies traitées avec succès`)
    console.log(`🔥 BTC actuel: $${data.data?.BTC?.quote?.USD?.price?.toFixed(2) || 'N/A'} USD`)

    // Headers de sécurité
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300, stale-while-revalidate=60', // 5 minutes cache
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block'
    })

    if (origin && allowedOrigins.includes(origin)) {
      headers.set('Access-Control-Allow-Origin', origin)
    }

    return NextResponse.json({ 
      data: filteredData,
      timestamp: Date.now(),
      source: 'coinmarketcap',
      currency: 'USD', // Prix en USD par défaut !
      lastUpdate: new Date().toISOString()
    }, { headers })

  } catch (error) {
    console.error('❌ Erreur API crypto-prices:', error)
    
    // En cas d'erreur, retourner des données de fallback avec VRAIS prix approximatifs actuels
    const fallbackData = [
      { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', current_price: 105000, market_cap: 2070000000000, price_change_percentage_24h: 2.1, image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png' },
      { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', current_price: 4100, market_cap: 493000000000, price_change_percentage_24h: 1.8, image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png' },
      { id: 'algorand', symbol: 'ALGO', name: 'Algorand', current_price: 0.38, market_cap: 3100000000, price_change_percentage_24h: -0.5, image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4030.png' },
      { id: 'solana', symbol: 'SOL', name: 'Solana', current_price: 220, market_cap: 105000000000, price_change_percentage_24h: 3.2, image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png' },
      { id: 'usd-coin', symbol: 'USDC', name: 'USD Coin', current_price: 1.0, market_cap: 78000000000, price_change_percentage_24h: 0.01, image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png' }
    ]

    return NextResponse.json({ 
      data: fallbackData,
      timestamp: Date.now(),
      source: 'fallback-updated-prices',
      currency: 'USD',
      lastUpdate: new Date().toISOString(),
      error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : 'Service temporarily unavailable'
    }, { status: 200 }) // Status 200 pour ne pas casser l'UX
  }
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin')
  const allowedOrigins = ['https://crypto-wallet.app', 'https://www.crypto-wallet.app', 'http://localhost:3000']
  
  const headers = new Headers({
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  })

  if (origin && allowedOrigins.includes(origin)) {
    headers.set('Access-Control-Allow-Origin', origin)
  }

  return new NextResponse(null, { status: 200, headers })
}