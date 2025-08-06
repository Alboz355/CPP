// --- INTERFACES ---
export interface WalletBalance {
  bitcoin: number
  ethereum: number
  algorand: number
}

export interface WalletAddresses {
  bitcoin: string
  ethereum: string
  algorand: string
}

export interface Transaction {
  id: string
  type: "sent" | "received"
  crypto: "bitcoin" | "ethereum" | "algorand"
  amount: string
  address: string
  timestamp: number
  status: "pending" | "confirmed" | "failed"
  hash?: string
}

export interface WalletData {
  mnemonic: string
  addresses: {
    bitcoin: string
    ethereum: string
    algorand: string
  }
  balances: {
    bitcoin: number
    ethereum: number
    algorand: number
  }
}

// BIP39 wordlist (first 100 words for demo - in production use complete list)
const BIP39_WORDLIST = [
  "abandon",
  "ability",
  "able",
  "about",
  "above",
  "absent",
  "absorb",
  "abstract",
  "absurd",
  "abuse",
  "access",
  "accident",
  "account",
  "accuse",
  "achieve",
  "acid",
  "acoustic",
  "acquire",
  "across",
  "act",
  "action",
  "actor",
  "actress",
  "actual",
  "adapt",
  "add",
  "addict",
  "address",
  "adjust",
  "admit",
  "adult",
  "advance",
  "advice",
  "aerobic",
  "affair",
  "afford",
  "afraid",
  "again",
  "agent",
  "agree",
  "ahead",
  "aim",
  "air",
  "airport",
  "aisle",
  "alarm",
  "album",
  "alcohol",
  "alert",
  "alien",
  "all",
  "alley",
  "allow",
  "almost",
  "alone",
  "alpha",
  "already",
  "also",
  "alter",
  "always",
  "amateur",
  "amazing",
  "among",
  "amount",
  "amused",
  "analyst",
  "anchor",
  "ancient",
  "anger",
  "angle",
  "angry",
  "animal",
  "ankle",
  "announce",
  "annual",
  "another",
  "answer",
  "antenna",
  "antique",
  "anxiety",
  "any",
  "apart",
  "apology",
  "appear",
  "apple",
  "approve",
  "april",
  "arch",
  "arctic",
  "area",
  "arena",
  "argue",
  "arm",
  "armed",
  "armor",
  "army",
  "around",
  "arrange",
  "arrest",
  "arrive",
  "arrow",
  "art",
  "article",
  "artist",
  "artwork",
  "ask",
  "aspect",
  "assault",
  "asset",
  "assist",
]

// Crypto utility functions
function sha256(data: string): string {
  // Simplified SHA256 implementation for demo
  let hash = 0
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16).padStart(8, "0")
}

function pbkdf2(password: string, salt: string, iterations: number): string {
  // Simplified PBKDF2 implementation for demo
  let result = password + salt
  for (let i = 0; i < iterations; i++) {
    result = sha256(result)
  }
  return result
}

function generateEntropy(bits: number): string {
  // Generate random entropy
  const bytes = bits / 8
  let entropy = ""
  for (let i = 0; i < bytes; i++) {
    entropy += Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, "0")
  }
  return entropy
}

function entropyToMnemonic(entropy: string): string {
  // Convert entropy to mnemonic using BIP39
  const entropyBits = entropy.length * 4
  const checksumBits = entropyBits / 32
  const totalBits = entropyBits + checksumBits

  // Add checksum
  const hash = sha256(entropy)
  const checksum = hash.substring(0, Math.ceil(checksumBits / 4))
  const fullEntropy = entropy + checksum

  // Convert to mnemonic
  const words = []
  const wordCount = totalBits / 11

  for (let i = 0; i < wordCount; i++) {
    const startBit = i * 11
    const endBit = startBit + 11
    const wordIndex =
      Number.parseInt(fullEntropy.substring(Math.floor(startBit / 4), Math.ceil(endBit / 4)), 16) %
      BIP39_WORDLIST.length
    words.push(BIP39_WORDLIST[wordIndex])
  }

  return words.join(" ")
}

function mnemonicToSeed(mnemonic: string, passphrase = ""): string {
  // Convert mnemonic to seed using PBKDF2
  const salt = "mnemonic" + passphrase
  return pbkdf2(mnemonic, salt, 2048)
}

function derivePrivateKey(seed: string, path: string): string {
  // Simplified key derivation (BIP32-like)
  const combined = seed + path
  return sha256(combined)
}

function privateKeyToPublicKey(privateKey: string): string {
  // Simplified public key generation
  return sha256(privateKey + "public")
}

// Address generation functions
function generateBitcoinAddress(publicKey: string): string {
  // Simplified Bitcoin address generation (P2PKH)
  const hash160 = sha256(publicKey).substring(0, 40)
  const version = "00"
  const payload = version + hash160
  const checksum = sha256(sha256(payload)).substring(0, 8)
  const fullPayload = payload + checksum

  // Base58 encoding simulation
  return (
    "1" +
    btoa(fullPayload)
      .replace(/[^A-Za-z0-9]/g, "")
      .substring(0, 25)
  )
}

function generateEthereumAddress(publicKey: string): string {
  // Simplified Ethereum address generation
  const hash = sha256(publicKey)
  return "0x" + hash.substring(0, 40)
}

function generateAlgorandAddress(publicKey: string): string {
  // Simplified Algorand address generation
  const hash = sha256(publicKey)
  return hash.substring(0, 58).toUpperCase()
}

// Export the missing generateCryptoAddress function
export function generateCryptoAddress(crypto: "bitcoin" | "ethereum" | "algorand", publicKey?: string): string {
  // If no public key provided, generate a random one for demo purposes
  const demoPublicKey = publicKey || sha256(Math.random().toString())
  
  switch (crypto) {
    case "bitcoin":
      return generateBitcoinAddress(demoPublicKey)
    case "ethereum":
      return generateEthereumAddress(demoPublicKey)
    case "algorand":
      return generateAlgorandAddress(demoPublicKey)
    default:
      throw new Error(`Unsupported cryptocurrency: ${crypto}`)
  }
}

// Main wallet functions
export function generateWallet(): {
  mnemonic: string
  addresses: { bitcoin: string; ethereum: string; algorand: string }
} {
  try {
    // Generate 128 bits of entropy for 12-word mnemonic
    const entropy = generateEntropy(128)
    const mnemonic = entropyToMnemonic(entropy)
    const seed = mnemonicToSeed(mnemonic)

    // Derive keys for different cryptocurrencies
    const btcPrivateKey = derivePrivateKey(seed, "m/44'/0'/0'/0/0")
    const ethPrivateKey = derivePrivateKey(seed, "m/44'/60'/0'/0/0")
    const algoPrivateKey = derivePrivateKey(seed, "m/44'/283'/0'/0/0")

    // Generate public keys
    const btcPublicKey = privateKeyToPublicKey(btcPrivateKey)
    const ethPublicKey = privateKeyToPublicKey(ethPrivateKey)
    const algoPublicKey = privateKeyToPublicKey(algoPrivateKey)

    // Generate addresses
    const addresses = {
      bitcoin: generateBitcoinAddress(btcPublicKey),
      ethereum: generateEthereumAddress(ethPublicKey),
      algorand: generateAlgorandAddress(algoPublicKey),
    }

    return { mnemonic, addresses }
  } catch (error) {
    console.error("Error generating wallet:", error)
    throw new Error("Failed to generate wallet")
  }
}

export function importWallet(mnemonic: string): {
  mnemonic: string
  addresses: { bitcoin: string; ethereum: string; algorand: string }
} {
  try {
    // Validate mnemonic
    const words = mnemonic.trim().split(/\s+/)
    if (words.length !== 12 && words.length !== 24) {
      throw new Error("Invalid mnemonic: must be 12 or 24 words")
    }

    // Validate words are in wordlist
    for (const word of words) {
      if (!BIP39_WORDLIST.includes(word.toLowerCase())) {
        throw new Error(`Invalid word in mnemonic: ${word}`)
      }
    }

    const seed = mnemonicToSeed(mnemonic)

    // Derive keys for different cryptocurrencies
    const btcPrivateKey = derivePrivateKey(seed, "m/44'/0'/0'/0/0")
    const ethPrivateKey = derivePrivateKey(seed, "m/44'/60'/0'/0/0")
    const algoPrivateKey = derivePrivateKey(seed, "m/44'/283'/0'/0/0")

    // Generate public keys
    const btcPublicKey = privateKeyToPublicKey(btcPrivateKey)
    const ethPublicKey = privateKeyToPublicKey(ethPrivateKey)
    const algoPublicKey = privateKeyToPublicKey(algoPrivateKey)

    // Generate addresses
    const addresses = {
      bitcoin: generateBitcoinAddress(btcPublicKey),
      ethereum: generateEthereumAddress(ethPublicKey),
      algorand: generateAlgorandAddress(algoPublicKey),
    }

    return { mnemonic, addresses }
  } catch (error) {
    console.error("Error importing wallet:", error)
    throw error
  }
}

// Utility functions
export function validateMnemonic(mnemonic: string): boolean {
  try {
    const words = mnemonic.trim().split(/\s+/)
    if (words.length !== 12 && words.length !== 24) {
      return false
    }

    for (const word of words) {
      if (!BIP39_WORDLIST.includes(word.toLowerCase())) {
        return false
      }
    }

    return true
  } catch {
    return false
  }
}

export function formatAddress(address: string, length = 8): string {
  if (!address || address.length <= length * 2) {
    return address
  }
  return `${address.slice(0, length)}...${address.slice(-length)}`
}

export function formatBalance(balance: number, symbol: string): string {
  if (balance === 0) return `0 ${symbol}`

  if (balance < 0.001) {
    return `${balance.toFixed(8)} ${symbol}`
  } else if (balance < 1) {
    return `${balance.toFixed(6)} ${symbol}`
  } else {
    return `${balance.toFixed(4)} ${symbol}`
  }
}

export function formatCurrency(amount: number, currency = "EUR"): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function generateTransactionId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export function isValidAddress(address: string, type: "bitcoin" | "ethereum" | "algorand"): boolean {
  switch (type) {
    case "bitcoin":
      return /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,87}$/.test(address)
    case "ethereum":
      return /^0x[a-fA-F0-9]{40}$/.test(address)
    case "algorand":
      return /^[A-Z2-7]{58}$/.test(address)
    default:
      return false
  }
}

// PIN management
export async function hashPin(pin: string): Promise<string> {
  try {
    const encoder = new TextEncoder()
    const data = encoder.encode(pin + "cryptopay_salt_2024")
    const hashBuffer = await crypto.subtle.digest("SHA-256", data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  } catch (error) {
    console.error("Error hashing PIN:", error)
    return sha256(pin + "cryptopay_salt_2024")
  }
}

export async function verifyPin(inputPin: string, hashedPin: string): Promise<boolean> {
  try {
    const hashedInput = await hashPin(inputPin)
    return hashedInput === hashedPin
  } catch (error) {
    console.error("Error verifying PIN:", error)
    return false
  }
}

// Transaction management
export function getTransactionHistory(): Transaction[] {
  try {
    const stored = localStorage.getItem("transaction-history")
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Error loading transaction history:", error)
    return []
  }
}

export function addTransaction(transaction: Omit<Transaction, "id" | "timestamp">): void {
  try {
    const history = getTransactionHistory()
    const newTransaction: Transaction = {
      ...transaction,
      id: generateTransactionId(),
      timestamp: Date.now(),
    }
    history.unshift(newTransaction)
    if (history.length > 100) {
      history.splice(100)
    }
    localStorage.setItem("transaction-history", JSON.stringify(history))
  } catch (error) {
    console.error("Error adding transaction:", error)
  }
}

// Alias functions for compatibility
export function createWallet(): WalletData {
  const wallet = generateWallet()
  return {
    mnemonic: wallet.mnemonic,
    addresses: wallet.addresses,
    balances: {
      bitcoin: 0,
      ethereum: 0,
      algorand: 0,
    },
  }
}

// Additional utility functions
export function generateSeedPhrase(wordCount: 12 | 24 = 12): string {
  const entropy = generateEntropy(wordCount === 12 ? 128 : 256)
  return entropyToMnemonic(entropy)
}

export function seedPhraseToAddresses(mnemonic: string): WalletAddresses {
  const wallet = importWallet(mnemonic)
  return wallet.addresses
}

export function formatCryptoAmount(amount: number, crypto: "bitcoin" | "ethereum" | "algorand"): string {
  switch (crypto) {
    case "bitcoin":
      return `${amount.toFixed(8)} BTC`
    case "ethereum":
      return `${amount.toFixed(6)} ETH`
    case "algorand":
      return `${amount.toFixed(6)} ALGO`
    default:
      return `${amount} ${crypto.toUpperCase()}`
  }
}

// Conversion utilities
export function satoshiToBTC(satoshi: number): number {
  return satoshi / 100000000
}

export function btcToSatoshi(btc: number): number {
  return Math.round(btc * 100000000)
}

export function weiToETH(wei: number): number {
  return wei / 1000000000000000000
}

export function ethToWei(eth: number): number {
  return Math.round(eth * 1000000000000000000)
}

// Security utilities
export function generateSecureRandom(length: number): string {
  const chars = "0123456789abcdef"
  let result = ""
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }
  return result
}

export function validatePrivateKey(privateKey: string): boolean {
  return /^[0-9a-fA-F]{64}$/.test(privateKey)
}

export function validatePublicKey(publicKey: string): boolean {
  return /^[0-9a-fA-F]{64}$/.test(publicKey)
}

// Network utilities
export function getNetworkForCrypto(crypto: "bitcoin" | "ethereum" | "algorand"): string {
  switch (crypto) {
    case "bitcoin":
      return "mainnet"
    case "ethereum":
      return "mainnet"
    case "algorand":
      return "mainnet"
    default:
      return "unknown"
  }
}

// Key derivation utilities
export function deriveMasterKey(seed: string): string {
  return sha256(seed + "master")
}

export function deriveChildKey(parentKey: string, index: number): string {
  return sha256(parentKey + index.toString())
}

export function generateKeyPair(privateKey: string): { privateKey: string; publicKey: string } {
  return {
    privateKey,
    publicKey: privateKeyToPublicKey(privateKey),
  }
}
