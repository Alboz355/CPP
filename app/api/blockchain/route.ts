import { NextRequest, NextResponse } from 'next/server'
import { BLOCKCYPHER_TOKEN, ETHERSCAN_API_KEY } from '@/lib/config'

// Rate limiting
const rateLimit = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5 // Plus restrictif pour les données blockchain

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

    // Validation des paramètres
    const { searchParams } = new URL(request.url)
    const network = searchParams.get('network') // bitcoin, ethereum, etc.
    const address = searchParams.get('address')
    
    if (!network || !address) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    // Validation basique de l'adresse pour prévenir les attaques
    if (address.length > 100 || !/^[a-zA-Z0-9]+$/.test(address)) {
      return NextResponse.json({ error: 'Invalid address format' }, { status: 400 })
    }

    let balance = '0'
    let transactions = []

    try {
      switch (network.toLowerCase()) {
        case 'bitcoin':
          if (!BLOCKCYPHER_TOKEN) {
            throw new Error('Bitcoin API not configured')
          }
          
          const btcResponse = await fetch(
            `https://api.blockcypher.com/v1/btc/main/addrs/${address}/balance?token=${BLOCKCYPHER_TOKEN}`,
            { next: { revalidate: 60 } } // Cache 1 minute
          )
          
          if (btcResponse.ok) {
            const btcData = await btcResponse.json()
            balance = (btcData.balance / 100000000).toString() // Satoshis to BTC
          }
          break

        case 'ethereum':
          if (!ETHERSCAN_API_KEY) {
            throw new Error('Ethereum API not configured')
          }
          
          const ethResponse = await fetch(
            `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${ETHERSCAN_API_KEY}`,
            { next: { revalidate: 60 } }
          )
          
          if (ethResponse.ok) {
            const ethData = await ethResponse.json()
            if (ethData.status === '1') {
              balance = (parseInt(ethData.result) / Math.pow(10, 18)).toString() // Wei to ETH
            }
          }
          break

        case 'algorand':
          // API publique Algorand - pas de clé nécessaire
          const algoResponse = await fetch(
            `https://mainnet-api.4160.nodely.dev/v2/accounts/${address}`,
            { next: { revalidate: 60 } }
          )
          
          if (algoResponse.ok) {
            const algoData = await algoResponse.json()
            balance = (algoData.amount / 1000000).toString() // microAlgos to ALGO
          }
          break

        default:
          return NextResponse.json({ error: 'Unsupported network' }, { status: 400 })
      }
    } catch (apiError) {
      console.error(`API error for ${network}:`, apiError)
      // Retourner 0 plutôt qu'une erreur pour éviter de casser l'UX
      balance = '0'
    }

    // Headers de sécurité
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=60, stale-while-revalidate=30',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block'
    })

    if (origin && allowedOrigins.includes(origin)) {
      headers.set('Access-Control-Allow-Origin', origin)
    }

    return NextResponse.json({ 
      network,
      address,
      balance,
      transactions,
      timestamp: Date.now()
    }, { headers })

  } catch (error) {
    console.error('Erreur API blockchain:', error)
    
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
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  })

  if (origin && allowedOrigins.includes(origin)) {
    headers.set('Access-Control-Allow-Origin', origin)
  }

  return new NextResponse(null, { status: 200, headers })
}