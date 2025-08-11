import { NextRequest, NextResponse } from 'next/server'
import { BLOCKCYPHER_TOKEN, INFURA_PROJECT_ID, ALGORAND_API_BASE, SOLANA_HTTP_URL } from '@/lib/config'

// Rate limiting
const rateLimit = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5

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
    const network = searchParams.get('network') // bitcoin, ethereum, algorand, solana
    const address = searchParams.get('address')
    
    if (!network || !address) {
      return NextResponse.json({ error: 'Missing required parameters: network and address' }, { status: 400 })
    }

    // Validation de l'adresse selon le type de réseau
    if (!isValidAddress(address, network)) {
      return NextResponse.json({ error: 'Invalid address format for network' }, { status: 400 })
    }

    console.log(`🔍 Récupération solde réel pour ${network.toUpperCase()}: ${address}`)

    let balance = '0'
    let transactions: any[] = []
    let additionalInfo: any = {}

    try {
      switch (network.toLowerCase()) {
        case 'bitcoin':
          if (!BLOCKCYPHER_TOKEN) {
            throw new Error('Bitcoin API not configured')
          }
          
          console.log('📡 Requête Bitcoin via BlockCypher...')
          const btcResponse = await fetch(
            `https://api.blockcypher.com/v1/btc/main/addrs/${address}/balance?token=${BLOCKCYPHER_TOKEN}`,
            { next: { revalidate: 60 } }
          )
          
          if (btcResponse.ok) {
            const btcData = await btcResponse.json()
            balance = (btcData.balance / 100000000).toString() // Satoshis vers BTC
            additionalInfo = {
              totalReceived: (btcData.total_received / 100000000).toString(),
              totalSent: (btcData.total_sent / 100000000).toString(),
              nTx: btcData.n_tx,
              unconfirmedBalance: (btcData.unconfirmed_balance / 100000000).toString()
            }
            console.log(`✅ Bitcoin: ${balance} BTC (${btcData.n_tx} transactions)`)
          }
          break

        case 'ethereum':
          if (!INFURA_PROJECT_ID) {
            throw new Error('Ethereum API not configured')
          }
          
          console.log('📡 Requête Ethereum via Infura...')
          const ethResponse = await fetch(
            `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'eth_getBalance',
                params: [address, 'latest'],
                id: 1
              }),
              next: { revalidate: 60 }
            }
          )
          
          if (ethResponse.ok) {
            const ethData = await ethResponse.json()
            if (ethData.result) {
              const balanceWei = parseInt(ethData.result, 16)
              balance = (balanceWei / Math.pow(10, 18)).toString() // Wei vers ETH
              console.log(`✅ Ethereum: ${balance} ETH`)
              
              // Récupérer le nombre de transactions
              const txCountResponse = await fetch(
                `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
                {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    jsonrpc: '2.0',
                    method: 'eth_getTransactionCount',
                    params: [address, 'latest'],
                    id: 2
                  })
                }
              )
              
              if (txCountResponse.ok) {
                const txCountData = await txCountResponse.json()
                additionalInfo.nTx = parseInt(txCountData.result, 16)
              }
            }
          }
          break

        case 'algorand':
          console.log('📡 Requête Algorand via Nodely...')
          const algoResponse = await fetch(
            `${ALGORAND_API_BASE}/v2/accounts/${address}`,
            { 
              headers: { 'Accept': 'application/json' },
              next: { revalidate: 60 } 
            }
          )
          
          if (algoResponse.ok) {
            const algoData = await algoResponse.json()
            balance = (algoData.amount / 1000000).toString() // microAlgos vers ALGO
            additionalInfo = {
              minBalance: (algoData['min-balance'] / 1000000).toString(),
              rewardsBase: algoData['rewards-base'],
              round: algoData.round,
              status: algoData.status
            }
            console.log(`✅ Algorand: ${balance} ALGO (Round: ${algoData.round})`)
          }
          break

        case 'solana':
          console.log('📡 Requête Solana via Syndica...')
          const solResponse = await fetch(
            SOLANA_HTTP_URL,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                jsonrpc: '2.0',
                id: 1,
                method: 'getBalance',
                params: [address]
              }),
              next: { revalidate: 60 }
            }
          )
          
          if (solResponse.ok) {
            const solData = await solResponse.json()
            if (solData.result && solData.result.value !== undefined) {
              balance = (solData.result.value / Math.pow(10, 9)).toString() // Lamports vers SOL
              additionalInfo = {
                context: solData.result.context,
                lamports: solData.result.value
              }
              console.log(`✅ Solana: ${balance} SOL`)
            }
          }
          break

        default:
          return NextResponse.json({ error: 'Unsupported network' }, { status: 400 })
      }
    } catch (apiError) {
      console.error(`❌ API error for ${network}:`, apiError)
      // En cas d'erreur API, retourner 0 plutôt qu'une erreur pour ne pas casser l'UX
      balance = '0'
      additionalInfo.error = process.env.NODE_ENV === 'development' ? 
        (apiError instanceof Error ? apiError.message : 'Unknown API error') : 
        'Temporary API issue'
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

    const response = {
      network,
      address,
      balance,
      transactions,
      additionalInfo,
      timestamp: Date.now(),
      source: 'live-blockchain'
    }

    console.log(`📊 Réponse ${network}: balance=${balance}`)

    return NextResponse.json(response, { headers })

  } catch (error) {
    console.error('❌ Erreur API blockchain:', error)
    
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? error instanceof Error ? error.message : 'Unknown error'
      : 'Internal server error'

    return NextResponse.json({ 
      error: errorMessage,
      timestamp: Date.now()
    }, { status: 500 })
  }
}

// Fonction de validation des adresses
function isValidAddress(address: string, network: string): boolean {
  if (!address || address.length > 100) return false

  switch (network.toLowerCase()) {
    case 'bitcoin':
      // Adresses Bitcoin (Legacy, SegWit, Native SegWit)
      return /^([13][a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[a-z0-9]{39,59})$/.test(address)
    
    case 'ethereum':
      // Adresses Ethereum (hexadécimal avec 0x)
      return /^0x[a-fA-F0-9]{40}$/.test(address)
    
    case 'algorand':
      // Adresses Algorand (Base32, 58 caractères)
      return /^[A-Z2-7]{58}$/.test(address)
    
    case 'solana':
      // Adresses Solana (Base58, 32-44 caractères)
      return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)
    
    default:
      return false
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