// Configuration sécurisée - AUCUNE clé API ne doit être exposée côté client
// Toutes les clés sensibles doivent être gérées côté serveur uniquement

export const INFURA_PROJECT_ID = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID || ''
export const INFURA_ETH_HTTP = INFURA_PROJECT_ID ? `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}` : ''

// SÉCURITÉ CRITIQUE: Ces clés ne doivent JAMAIS être exposées côté client
// Elles doivent être utilisées uniquement dans les API routes côté serveur
export const CMC_API_KEY = process.env.CMC_API_KEY || '' // Server-only
export const BLOCKCYPHER_TOKEN = process.env.BLOCKCYPHER_TOKEN || '' // Server-only
export const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || '' // Server-only

// URLs publiques seulement (sans clés)
export const ALGORAND_API_BASE = process.env.NEXT_PUBLIC_ALGORAND_API_BASE || 'https://mainnet-api.4160.nodely.dev'
export const SOLANA_HTTP_URL = process.env.NEXT_PUBLIC_SOLANA_HTTP_URL || 'https://api.mainnet-beta.solana.com'

// Configuration de l'application
export const APP_CONFIG = {
  // URLs publiques autorisées
  ALLOWED_ORIGINS: ['https://crypto-wallet.app', 'https://www.crypto-wallet.app'],
  
  // Limites de sécurité
  MAX_TRANSACTION_AMOUNT: 10000, // CHF
  MAX_DAILY_TRANSACTIONS: 50,
  
  // Configuration réseau
  NETWORK: process.env.NODE_ENV === 'production' ? 'mainnet' : 'testnet',
  
  // Feature flags
  FEATURES: {
    BIOMETRIC_AUTH: true,
    PRICE_ALERTS: true,
    BACKUP_CODES: true
  }
} as const
