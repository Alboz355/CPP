import { NextRequest, NextResponse } from 'next/server'
import { CMC_API_KEY } from '@/lib/config'

// Rate limiting simple (en production, utiliser Redis ou une solution plus robuste)
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

    // Récupérer les données depuis CoinMarketCap
    const response = await fetch(
      'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=50&convert=USD',
      {
        headers: {
          'X-CMC_PRO_API_KEY': CMC_API_KEY,
          'Accept': 'application/json',
        },
        next: { revalidate: 300 } // Cache pendant 5 minutes
      }
    )

    if (!response.ok) {
      throw new Error(`CoinMarketCap API error: ${response.status}`)
    }

    const data = await response.json()
    
    // Filtrer les données sensibles et retourner seulement ce qui est nécessaire
    const filteredData = data.data.map((crypto: any) => ({
      id: crypto.id,
      name: crypto.name,
      symbol: crypto.symbol,
      current_price: crypto.quote.USD.price,
      market_cap: crypto.quote.USD.market_cap,
      price_change_percentage_24h: crypto.quote.USD.percent_change_24h,
      last_updated: crypto.last_updated,
      // Ne pas inclure de données sensibles ou métadonnées internes
    }))

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
      timestamp: Date.now()
    }, { headers })

  } catch (error) {
    console.error('Erreur API crypto-prices:', error)
    
    // Ne pas exposer les détails de l'erreur en production
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? error instanceof Error ? error.message : 'Unknown error'
      : 'Internal server error'

    return NextResponse.json({ 
      error: errorMessage,
      timestamp: Date.now()
    }, { status: 500 })
  }
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin')
  const allowedOrigins = ['https://crypto-wallet.app', 'https://www.crypto-wallet.app', 'http://localhost:3000']
  
  const headers = new Headers({
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400', // 24 heures
  })

  if (origin && allowedOrigins.includes(origin)) {
    headers.set('Access-Control-Allow-Origin', origin)
  }

  return new NextResponse(null, { status: 200, headers })
}