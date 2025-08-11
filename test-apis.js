#!/usr/bin/env node

/**
 * Script de test pour vérifier toutes les APIs avec les vraies clés
 * Usage: node test-apis.js
 */

console.log('🧪 Test des APIs CryptoPay Pro\n')

// Test des APIs une par une
async function testAPIs() {
  const baseUrl = 'http://localhost:3000'
  
  console.log('1️⃣ Test API Prix Cryptomonnaies...')
  try {
    const response = await fetch(`${baseUrl}/api/crypto-prices`)
    const data = await response.json()
    
    if (data.data && data.data.length > 0) {
      console.log('   ✅ Prix reçus:', data.data.length, 'cryptos')
      console.log('   💰 BTC:', data.data.find(c => c.symbol === 'BTC')?.current_price.toFixed(2), 'CHF')
      console.log('   📊 Source:', data.source)
    } else {
      console.log('   ❌ Aucune donnée reçue')
    }
  } catch (error) {
    console.log('   ❌ Erreur:', error.message)
  }

  console.log('\n2️⃣ Test API Taux de Change...')
  try {
    const response = await fetch(`${baseUrl}/api/exchange-rates`)
    const data = await response.json()
    
    if (data.rates) {
      console.log('   ✅ Taux reçus')
      console.log('   💱 USD -> CHF:', data.rates.CHF)
      console.log('   💱 USD -> EUR:', data.rates.EUR)
    } else {
      console.log('   ❌ Aucun taux reçu')
    }
  } catch (error) {
    console.log('   ❌ Erreur:', error.message)
  }

  console.log('\n3️⃣ Test API Blockchain (Bitcoin)...')
  try {
    // Adresse Bitcoin de test (publique)
    const testAddress = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa' // Genesis block
    const response = await fetch(`${baseUrl}/api/blockchain?network=bitcoin&address=${testAddress}`)
    const data = await response.json()
    
    if (data.balance !== undefined) {
      console.log('   ✅ Solde récupéré:', data.balance, 'BTC')
      console.log('   📍 Adresse:', data.address)
      console.log('   🔗 Réseau:', data.network)
    } else {
      console.log('   ❌ Aucun solde reçu')
    }
  } catch (error) {
    console.log('   ❌ Erreur:', error.message)
  }

  console.log('\n4️⃣ Test API Calcul Wallet...')
  try {
    const testWallet = {
      addresses: {
        bitcoin: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
        ethereum: '0x0000000000000000000000000000000000000000',
        algorand: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        solana: '11111111111111111111111111111111'
      }
    }
    
    const response = await fetch(`${baseUrl}/api/wallet-balance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testWallet)
    })
    const data = await response.json()
    
    if (data.success && data.data) {
      console.log('   ✅ Calcul réussi')
      console.log('   💰 Total:', data.data.stats.totalValueFormatted)
      console.log('   📊 Cryptos:', data.data.stats.totalCryptos)
    } else {
      console.log('   ❌ Erreur calcul:', data.error || 'Inconnue')
    }
  } catch (error) {
    console.log('   ❌ Erreur:', error.message)
  }

  console.log('\n🎉 Tests terminés !')
  console.log('\n💡 Pour lancer l\'app:')
  console.log('   npm run dev')
  console.log('   Puis ouvrir http://localhost:3000')
}

// Vérifier si le serveur est démarré
async function checkServer() {
  try {
    const response = await fetch('http://localhost:3000/api/crypto-prices')
    if (response.ok) {
      return true
    }
  } catch (error) {
    return false
  }
  return false
}

// Main
async function main() {
  const serverRunning = await checkServer()
  
  if (!serverRunning) {
    console.log('❌ Serveur non démarré !')
    console.log('\n💡 Pour démarrer:')
    console.log('   npm run dev')
    console.log('   Puis relancer: node test-apis.js')
    return
  }

  await testAPIs()
}

// Run si appelé directement
if (require.main === module) {
  main().catch(console.error)
}