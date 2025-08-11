// Utilitaires pour la gestion des portefeuilles crypto
import { encryptData, decryptData } from './encryption'

// Types pour les différentes cryptomonnaies
export interface CryptoBalance {
  bitcoin: number
  ethereum: number
  algorand: number
  solana: number
  usdc?: number // Ajout USDC
}

export interface WalletAddresses {
  bitcoin: string
  ethereum: string
  algorand: string
  solana: string
  usdc?: string // Ajout USDC
}

export interface WalletData {
  addresses: WalletAddresses
  balances: CryptoBalance
  mnemonic?: string
  isImported: boolean
  createdAt: string
  lastSynced?: string
}

// Formatage des soldes avec correction du problème d'affichage
export function formatBalance(balance: number, decimals: number = 8): string {
  if (balance === 0) return '0'
  if (balance === null || balance === undefined || isNaN(balance)) return '0'
  
  // Convertir en nombre si c'est une string
  const numBalance = typeof balance === 'string' ? parseFloat(balance) : balance
  
  if (numBalance === 0) return '0'
  
  // Pour les très petits montants, utiliser notation scientifique si nécessaire
  if (numBalance > 0 && numBalance < 0.00001) {
    return numBalance.toExponential(2)
  }
  
  // Pour les montants normaux, utiliser un formatage propre
  if (numBalance >= 1) {
    // Montants >= 1 : maximum 8 décimales, supprime les zéros inutiles
    return parseFloat(numBalance.toFixed(8)).toString()
  } else {
    // Montants < 1 : adapte le nombre de décimales selon la valeur
    if (numBalance >= 0.01) {
      return parseFloat(numBalance.toFixed(4)).toString()
    } else if (numBalance >= 0.0001) {
      return parseFloat(numBalance.toFixed(6)).toString()
    } else {
      return parseFloat(numBalance.toFixed(8)).toString()
    }
  }
}

// Formatage monétaire avec correction
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  if (amount === 0 || amount === null || amount === undefined || isNaN(amount)) {
    return currency === 'USD' ? '$0.00' : 
           currency === 'EUR' ? '€0.00' : 
           currency === 'CHF' ? 'CHF 0.00' : '0.00'
  }
  
  const locales = { 
    USD: 'en-US', 
    EUR: 'de-DE', 
    CHF: 'fr-CH' 
  }
  
  const locale = locales[currency as keyof typeof locales] || 'en-US'
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  } catch (error) {
    // Fallback si l'Intl ne fonctionne pas
    const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency + ' '
    return `${symbol}${amount.toFixed(2)}`
  }
}

// Validation des adresses crypto améliorée
export function validateAddress(address: string, network: string): boolean {
  if (!address || typeof address !== 'string') return false

  switch (network.toLowerCase()) {
    case 'bitcoin':
      // Bitcoin Legacy, SegWit, Native SegWit
      return /^([13][a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[a-z0-9]{39,59})$/.test(address)
    
    case 'ethereum':
    case 'usdc': // USDC utilise les adresses Ethereum
      // Adresses Ethereum (0x + 40 hex chars)
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

// Sauvegarde sécurisée du wallet
export async function saveWallet(walletData: WalletData, pin?: string): Promise<void> {
  try {
    // Chiffrer les données sensibles
    const dataToSave = {
      ...walletData,
      mnemonic: walletData.mnemonic ? await encryptData(walletData.mnemonic, pin) : undefined
    }
    
    localStorage.setItem('wallet_data', JSON.stringify(dataToSave))
    console.log('💾 Wallet sauvegardé avec succès')
  } catch (error) {
    console.error('❌ Erreur sauvegarde wallet:', error)
    throw new Error('Impossible de sauvegarder le wallet')
  }
}

// Chargement sécurisé du wallet
export async function loadWallet(pin?: string): Promise<WalletData | null> {
  try {
    const saved = localStorage.getItem('wallet_data')
    if (!saved) return null
    
    const walletData = JSON.parse(saved) as WalletData
    
    // Déchiffrer la phrase mnémonique si présente
    if (walletData.mnemonic && pin) {
      try {
        walletData.mnemonic = await decryptData(walletData.mnemonic, pin)
      } catch (error) {
        console.error('❌ Erreur déchiffrement mnemonic:', error)
        // Ne pas bloquer le chargement, juste retirer la mnemonic
        delete walletData.mnemonic
      }
    }
    
    console.log('📂 Wallet chargé avec succès')
    return walletData
    
  } catch (error) {
    console.error('❌ Erreur chargement wallet:', error)
    return null
  }
}

// Suppression sécurisée du wallet
export function clearWallet(): void {
  try {
    localStorage.removeItem('wallet_data')
    localStorage.removeItem('user_pin')
    console.log('🗑️ Wallet supprimé avec succès')
  } catch (error) {
    console.error('❌ Erreur suppression wallet:', error)
  }
}

// Génération d'adresses de réception avec QR code
export function generateReceiveData(network: string, address: string, amount?: number) {
  let uri = ''
  
  switch (network.toLowerCase()) {
    case 'bitcoin':
      uri = `bitcoin:${address}${amount ? `?amount=${amount}` : ''}`
      break
    case 'ethereum':
    case 'usdc':
      uri = `ethereum:${address}${amount ? `?value=${amount}` : ''}`
      break
    case 'algorand':
      uri = `algorand://${address}${amount ? `?amount=${amount}` : ''}`
      break
    case 'solana':
      uri = `solana:${address}${amount ? `?amount=${amount}` : ''}`
      break
    default:
      uri = address
  }
  
  return {
    address,
    uri,
    network,
    amount
  }
}

// Utilitaires pour les montants
export function parseAmount(amountStr: string): number {
  if (!amountStr) return 0
  const cleaned = amountStr.replace(/[^\d.-]/g, '')
  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? 0 : parsed
}

// Vérification de la suffisance du solde
export function hasSufficientBalance(balance: number, amount: number, fees: number = 0): boolean {
  return balance >= (amount + fees)
}

// Estimation des frais (approximative)
export function estimateFees(network: string, amount: number = 0): number {
  switch (network.toLowerCase()) {
    case 'bitcoin':
      return 0.0001 // ~0.0001 BTC
    case 'ethereum':
      return 0.005 // ~0.005 ETH
    case 'usdc':
      return 0.01 // ~0.01 ETH for ERC-20
    case 'algorand':
      return 0.001 // ~0.001 ALGO
    case 'solana':
      return 0.000005 // ~0.000005 SOL
    default:
      return 0
  }
}

// Export des fonctions utilitaires
export {
  encryptData,
  decryptData
}
