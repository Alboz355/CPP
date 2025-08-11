import { NextRequest, NextResponse } from 'next/server'

// Cache pour les taux de change (1 heure)
let rateCache: { data: any; timestamp: number } | null = null
const CACHE_DURATION = 60 * 60 * 1000 // 1 heure

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
    // Vérification origine
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

    // Vérifier cache
    if (rateCache && Date.now() - rateCache.timestamp < CACHE_DURATION) {
      console.log('📊 Utilisation taux de change en cache')
      const headers = new Headers({
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
        'X-Content-Type-Options': 'nosniff',
      })

      if (origin && allowedOrigins.includes(origin)) {
        headers.set('Access-Control-Allow-Origin', origin)
      }

      return NextResponse.json(rateCache.data, { headers })
    }

    console.log('📡 Récupération taux de change USD->CHF...')

    // Utiliser une API gratuite pour les taux de change (exemple: exchangerate-api.com)
    // En production, vous devriez utiliser une API payante plus fiable
    let exchangeRates = {
      USD: 1,
      CHF: 0.91,
      EUR: 0.85
    }

    try {
      // API gratuite pour taux USD vers CHF (sans clé requise)
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD', {
        next: { revalidate: 3600 } // Cache 1 heure
      })

      if (response.ok) {
        const data = await response.json()
        if (data.rates) {
          exchangeRates = {
            USD: 1,
            CHF: data.rates.CHF || 0.91,
            EUR: data.rates.EUR || 0.85
          }
          console.log(`✅ Taux récupérés: 1 USD = ${exchangeRates.CHF} CHF`)
        }
      }
    } catch (apiError) {
      console.warn('⚠️ Erreur API taux de change, utilisation valeurs par défaut:', apiError)
      // Utiliser les valeurs par défaut définies plus haut
    }

    const responseData = {
      rates: exchangeRates,
      timestamp: Date.now(),
      source: 'exchangerate-api',
      baseCurrency: 'USD'
    }

    // Mettre en cache
    rateCache = {
      data: responseData,
      timestamp: Date.now()
    }

    // Headers de réponse
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=1800', // 1h cache, 30min stale
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block'
    })

    if (origin && allowedOrigins.includes(origin)) {
      headers.set('Access-Control-Allow-Origin', origin)
    }

    return NextResponse.json(responseData, { headers })

  } catch (error) {
    console.error('❌ Erreur API exchange-rates:', error)

    // En cas d'erreur, retourner des taux par défaut
    const fallbackData = {
      rates: {
        USD: 1,
        CHF: 0.91,
        EUR: 0.85
      },
      timestamp: Date.now(),
      source: 'fallback',
      baseCurrency: 'USD',
      error: process.env.NODE_ENV === 'development' 
        ? (error instanceof Error ? error.message : 'Unknown error')
        : 'Service temporarily unavailable'
    }

    return NextResponse.json(fallbackData, { status: 200 })
  }
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin')
  const allowedOrigins = ['https://crypto-wallet.app', 'https://www.crypto-wallet.app', 'http://localhost:3000']
  
  const headers = new Headers({
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  })

  if (origin && allowedOrigins.includes(origin)) {
    headers.set('Access-Control-Allow-Origin', origin)
  }

  return new NextResponse(null, { status: 200, headers })
}