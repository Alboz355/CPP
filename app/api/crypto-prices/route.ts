import { NextRequest, NextResponse } from 'next/server'
import { CMC_API_KEY } from '@/lib/config'

// Rate limiting
const rateLimit = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_REQUESTS_PER_WINDOW = 20 // Plus de requêtes pour refresh fréquent

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

    // VÉRIFICATION OBLIGATOIRE DE LA CLÉ API
    if (!CMC_API_KEY || CMC_API_KEY === 'your-coinmarketcap-api-key') {
      console.error('🚨 CMC_API_KEY non configurée ou invalide!')
      return NextResponse.json({ 
        error: 'API Key not configured',
        message: 'Veuillez configurer votre clé CoinMarketCap'
      }, { status: 503 })
    }

    console.log('🔥 RÉCUPÉRATION PRIX RÉELS depuis CoinMarketCap avec clé:', CMC_API_KEY.substring(0, 8) + '...')

    // REQUÊTE RÉELLE À COINMARKETCAP - AUCUNE SIMULATION !
    const symbols = ['BTC', 'ETH', 'ALGO', 'SOL', 'USDC']
    const cmcUrl = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbols.join(',')}&convert=USD`
    
    console.log('📡 Requête CMC:', cmcUrl)
    
    const response = await fetch(cmcUrl, {
      headers: {
        'X-CMC_PRO_API_KEY': CMC_API_KEY,
        'Accept': 'application/json',
      },
      next: { revalidate: 60 } // Cache 1 MINUTE seulement !
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('🚨 ERREUR CoinMarketCap:', response.status, response.statusText)
      console.error('🚨 Détails erreur:', errorText)
      
      // EN CAS D'ERREUR CMC, STOPPER IMMÉDIATEMENT - PAS DE FALLBACK !
      return NextResponse.json({ 
        error: `CoinMarketCap API error: ${response.status}`,
        details: process.env.NODE_ENV === 'development' ? errorText : 'API unavailable',
        timestamp: Date.now()
      }, { status: 503 })
    }

    const data = await response.json()
    console.log('✅ DONNÉES RÉELLES reçues de CoinMarketCap!')
    
    if (!data.data) {
      console.error('🚨 Aucune donnée dans la réponse CMC!')
      return NextResponse.json({ 
        error: 'No data received from CoinMarketCap',
        timestamp: Date.now()
      }, { status: 503 })
    }

    // Mapping des symboles avec vraies images CMC
    const cryptoInfo = {
      'BTC': { id: 'bitcoin', name: 'Bitcoin', image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png' },
      'ETH': { id: 'ethereum', name: 'Ethereum', image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png' },
      'ALGO': { id: 'algorand', name: 'Algorand', image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4030.png' },
      'SOL': { id: 'solana', name: 'Solana', image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png' },
      'USDC': { id: 'usd-coin', name: 'USD Coin', image: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png' }
    }

    // Transformer les VRAIES données CoinMarketCap
    const realData = symbols.map(symbol => {
      const coinData = data.data[symbol]
      const info = cryptoInfo[symbol as keyof typeof cryptoInfo]
      
      if (!coinData || !coinData.quote?.USD) {
        console.warn(`⚠️ Données manquantes pour ${symbol} - IGNORÉ`)
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
        image: info.image,
        cmc_rank: coinData.cmc_rank,
        volume_24h: quote.volume_24h
      }
      
      console.log(`💎 ${symbol}: $${quote.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })} USD (${quote.percent_change_24h > 0 ? '📈' : '📉'} ${quote.percent_change_24h.toFixed(2)}%)`)
      return result
    }).filter(Boolean) // Supprimer les valeurs null

    if (realData.length === 0) {
      console.error('🚨 AUCUNE donnée cryptos valide reçue!')
      return NextResponse.json({ 
        error: 'No valid crypto data received from CoinMarketCap',
        timestamp: Date.now()
      }, { status: 503 })
    }

    console.log(`🔥 ${realData.length} cryptomonnaies RÉELLES traitées avec succès!`)
    console.log(`💰 BTC ACTUEL: $${data.data?.BTC?.quote?.USD?.price?.toLocaleString('en-US') || 'N/A'} USD`)

    // Headers avec cache très court (1 minute)
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=60, stale-while-revalidate=30', // 1 MINUTE CACHE !
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block'
    })

    if (origin && allowedOrigins.includes(origin)) {
      headers.set('Access-Control-Allow-Origin', origin)
    }

    return NextResponse.json({ 
      data: realData,
      timestamp: Date.now(),
      source: 'coinmarketcap-live',
      currency: 'USD',
      lastUpdate: new Date().toISOString(),
      freshData: true, // Indiquer que ce sont des données fraîches
      cacheInfo: 'Cache 1 minute - données temps réel'
    }, { headers })

  } catch (error) {
    console.error('🚨 ERREUR CRITIQUE API crypto-prices:', error)
    
    // EN CAS D'ERREUR RÉSEAU, RETOURNER UNE ERREUR - PAS DE SIMULATION !
    return NextResponse.json({ 
      error: 'CoinMarketCap API unavailable',
      message: 'Impossible de récupérer les prix réels. Vérifiez votre connexion et votre clé API.',
      timestamp: Date.now(),
      apiError: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : 'Service unavailable'
    }, { status: 503 })
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