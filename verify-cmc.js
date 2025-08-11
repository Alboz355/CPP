#!/usr/bin/env node

/**
 * Script de vérification DIRECTE de la clé CoinMarketCap
 * Teste la clé API sans passer par l'application
 */

const fs = require('fs')
const path = require('path')

console.log('🔍 VÉRIFICATION DIRECTE COINMARKETCAP\n')

// Lire le fichier .env.local
function loadEnvLocal() {
  try {
    const envPath = path.join(__dirname, '.env.local')
    const envContent = fs.readFileSync(envPath, 'utf8')
    
    const envVars = {}
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=')
        if (key && valueParts.length > 0) {
          envVars[key] = valueParts.join('=')
        }
      }
    })
    
    return envVars
  } catch (error) {
    console.log('❌ Impossible de lire .env.local:', error.message)
    return {}
  }
}

async function testCMCDirect() {
  const env = loadEnvLocal()
  const CMC_API_KEY = env.CMC_API_KEY
  
  if (!CMC_API_KEY) {
    console.log('❌ CMC_API_KEY non trouvée dans .env.local')
    console.log('💡 Assurez-vous que .env.local contient:')
    console.log('   CMC_API_KEY=a9fac516-7d93-4479-a8cf-c2ef00e7cccf')
    return
  }
  
  console.log('🔑 Clé trouvée:', CMC_API_KEY.substring(0, 8) + '...')
  
  try {
    console.log('📡 Test DIRECT CoinMarketCap API...')
    
    const response = await fetch(
      'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=BTC,ETH,SOL,ALGO,USDC&convert=USD',
      {
        headers: {
          'X-CMC_PRO_API_KEY': CMC_API_KEY,
          'Accept': 'application/json',
        }
      }
    )
    
    console.log('📊 Status:', response.status, response.statusText)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.log('❌ Erreur CoinMarketCap:')
      console.log('   Status:', response.status)
      console.log('   Message:', errorText)
      
      if (response.status === 401) {
        console.log('\n💡 SOLUTION: Votre clé API est invalide')
        console.log('   - Vérifiez sur https://coinmarketcap.com/api/')
        console.log('   - Régénérez une nouvelle clé si nécessaire')
      } else if (response.status === 403) {
        console.log('\n💡 SOLUTION: Clé API expirée ou plan insuffisant')
        console.log('   - Vérifiez votre plan sur CoinMarketCap')
      }
      return
    }
    
    const data = await response.json()
    
    if (data.data) {
      console.log('✅ CONNEXION COINMARKETCAP RÉUSSIE !')
      console.log('\n💰 Prix actuels RÉELS:')
      
      Object.entries(data.data).forEach(([symbol, coinData]) => {
        const price = coinData.quote?.USD?.price
        const change = coinData.quote?.USD?.percent_change_24h
        
        if (price) {
          const formattedPrice = price.toLocaleString('en-US', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: symbol === 'USDC' ? 6 : 2 
          })
          console.log(`   ${symbol}: $${formattedPrice} (${change > 0 ? '📈' : '📉'} ${change.toFixed(2)}%)`)
        }
      })
      
      // Vérifier BTC
      const btcPrice = data.data.BTC?.quote?.USD?.price
      if (btcPrice > 100000) {
        console.log('\n🔥 ✅ BTC prix RÉALISTE (>100k):', btcPrice.toLocaleString())
      } else if (btcPrice > 80000) {
        console.log('\n🟡 BTC prix correct (>80k):', btcPrice.toLocaleString())
      } else {
        console.log('\n⚠️ BTC prix suspect:', btcPrice)
      }
      
      console.log('\n📊 Métadonnées:')
      console.log('   Timestamp:', new Date(data.status?.timestamp).toLocaleString('fr-FR'))
      console.log('   Crédits utilisés:', data.status?.credit_count)
      
    } else {
      console.log('❌ Pas de données reçues')
      console.log('Réponse:', JSON.stringify(data, null, 2))
    }
    
  } catch (error) {
    console.log('❌ Erreur réseau:', error.message)
    console.log('\n💡 Vérifiez votre connexion internet')
  }
}

// Main
async function main() {
  await testCMCDirect()
  
  console.log('\n🚀 Si le test passe, votre app aura les VRAIS prix !')
  console.log('🔄 Prix actualisés toutes les minutes automatiquement')
}

main().catch(console.error)