import { NextRequest, NextResponse } from 'next/server'

// Rate limiting
const rateLimit = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_REQUESTS_PER_WINDOW = 3 // Plus restrictif car calcul intensif

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

export async function POST(request: NextRequest) {
  try {
    // Vérification de sécurité
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

    // Récupérer les données du wallet depuis le body
    const body = await request.json()
    const { addresses, currency = 'USD' } = body

    if (!addresses || typeof addresses !== 'object') {
      return NextResponse.json({ error: 'Missing or invalid addresses object' }, { status: 400 })
    }

    console.log('💰 Calcul solde wallet total en', currency)
    console.log('📍 Adresses:', Object.keys(addresses))

    // Récupérer les prix des cryptos
    const pricesResponse = await fetch(`${request.nextUrl.origin}/api/crypto-prices`)
    if (!pricesResponse.ok) {
      throw new Error('Failed to fetch crypto prices')
    }
    const pricesData = await pricesResponse.json()
    
    // Créer un map des prix par symbol
    const prices: Record<string, number> = {}
    pricesData.data.forEach((crypto: any) => {
      prices[crypto.symbol] = crypto.current_price
    })

    console.log('📊 Prix récupérés:', prices)

    // Récupérer les soldes pour chaque crypto AVEC USDC
    const balancePromises = []
    const cryptoNetworks = {
      bitcoin: 'bitcoin',
      ethereum: 'ethereum',
      algorand: 'algorand',
      solana: 'solana',
      usdc: 'usdc' // Ajout USDC support
    }

    // Paralléliser les requêtes de solde TEMPS RÉEL
    for (const [cryptoType, address] of Object.entries(addresses)) {
      if (address && cryptoNetworks[cryptoType as keyof typeof cryptoNetworks]) {
        const network = cryptoNetworks[cryptoType as keyof typeof cryptoNetworks]
        console.log(`🔍 Requête solde TEMPS RÉEL ${network}: ${address}`)

        balancePromises.push(
          fetch(`${request.nextUrl.origin}/api/blockchain?network=${network}&address=${address}`, {
            cache: 'no-cache' // Force nouvelles données blockchain
          })
            .then(res => res.json())
            .then(data => ({
              crypto: cryptoType,
              network,
              address,
              balance: parseFloat(data.balance || '0'),
              error: data.error || null,
              additionalInfo: data.additionalInfo || {},
              source: data.source
            }))
            .catch(error => ({
              crypto: cryptoType,
              network,
              address,
              balance: 0,
              error: error.message,
              additionalInfo: {},
              source: 'error'
            }))
        )
      }
    }

    // Attendre toutes les réponses blockchain
    const balanceResults = await Promise.all(balancePromises)
    console.log('📈 Résultats soldes TEMPS RÉEL:', balanceResults.map(r => `${r.crypto}: ${r.balance}`))

    // Calculer les valeurs en devise cible avec PRIX TEMPS RÉEL
    let totalValue = 0
    const breakdown: any = {}

    for (const result of balanceResults) {
      const { crypto, balance, error } = result
      const cryptoSymbol = crypto === 'bitcoin' ? 'BTC' :
                          crypto === 'ethereum' ? 'ETH' :
                          crypto === 'algorand' ? 'ALGO' :
                          crypto === 'solana' ? 'SOL' :
                          crypto === 'usdc' ? 'USDC' : crypto.toUpperCase()

      const price = prices[cryptoSymbol] || 0
      const value = balance * price
      totalValue += value

      breakdown[crypto] = {
        balance,
        balanceFormatted: `${balance} ${cryptoSymbol}`,
        price,
        priceFormatted: formatCurrency(price, currency),
        value,
        valueFormatted: formatCurrency(value, currency),
        error,
        symbol: cryptoSymbol,
        address: result.address,
        additionalInfo: result.additionalInfo,
        source: result.source
      }

      if (balance > 0) {
        console.log(`💎 ${cryptoSymbol}: ${balance} × ${formatCurrency(price, currency)} = ${formatCurrency(value, currency)} (TEMPS RÉEL)`)
      }
    }

    // Calculer les statistiques avec source temps réel
    const stats = {
      totalCryptos: balanceResults.length,
      cryptosWithBalance: balanceResults.filter(r => r.balance > 0).length,
      totalValue,
      totalValueFormatted: formatCurrency(totalValue, currency),
      currency,
      lastUpdated: new Date().toISOString(),
      dataSource: 'live-realtime', // Indiquer que c'est temps réel
      priceSource: pricesData.source
    }

    console.log(`🔥 TOTAL TEMPS RÉEL: ${formatCurrency(totalValue, currency)} (${stats.cryptosWithBalance}/${stats.totalCryptos} cryptos actives)`)

    // Headers de réponse avec cache court
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=60, stale-while-revalidate=30', // 1 MINUTE cache
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block'
    })

    if (origin && allowedOrigins.includes(origin)) {
      headers.set('Access-Control-Allow-Origin', origin)
    }

    return NextResponse.json({
      success: true,
      data: {
        stats,
        breakdown,
        balances: balanceResults,
        timestamp: Date.now(),
        source: 'live-blockchain-calculation-realtime'
      }
    }, { headers })

  } catch (error) {
    console.error('❌ Erreur API wallet-balance:', error)
    
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? error instanceof Error ? error.message : 'Unknown error'
      : 'Internal server error'

    return NextResponse.json({ 
      success: false,
      error: errorMessage,
      timestamp: Date.now()
    }, { status: 500 })
  }
}

function formatCurrency(amount: number, currency: string): string {
  const locales = { CHF: 'fr-CH', EUR: 'de-DE', USD: 'en-US' }
  const locale = locales[currency as keyof typeof locales] || 'fr-CH'
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin')
  const allowedOrigins = ['https://crypto-wallet.app', 'https://www.crypto-wallet.app', 'http://localhost:3000']
  
  const headers = new Headers({
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  })

  if (origin && allowedOrigins.includes(origin)) {
    headers.set('Access-Control-Allow-Origin', origin)
  }

  return new NextResponse(null, { status: 200, headers })
}