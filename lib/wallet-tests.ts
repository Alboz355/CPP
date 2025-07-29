// Basic tests for critical wallet functions
import { MultiCryptoWallet } from './wallet-utils'
import { SecureStorage, WalletSecureStorage } from './secure-storage'

// Simple test runner
class SimpleTestRunner {
  private tests: Array<{ name: string; fn: () => void | Promise<void> }> = []
  private passed = 0
  private failed = 0

  test(name: string, fn: () => void | Promise<void>) {
    this.tests.push({ name, fn })
  }

  async run() {
    console.log('🧪 Running wallet tests...')
    
    for (const test of this.tests) {
      try {
        await test.fn()
        console.log(`✅ ${test.name}`)
        this.passed++
      } catch (error) {
        console.error(`❌ ${test.name}:`, error.message)
        this.failed++
      }
    }

    console.log(`\n📊 Test Results: ${this.passed} passed, ${this.failed} failed`)
    return this.failed === 0
  }
}

// Test cases
export async function runWalletTests() {
  const runner = new SimpleTestRunner()

  // Test wallet generation
  runner.test('Wallet generation', () => {
    const wallet = MultiCryptoWallet.generateWallet()
    
    if (!wallet.mnemonic || wallet.mnemonic.split(' ').length !== 12) {
      throw new Error('Invalid mnemonic generated')
    }
    
    if (!wallet.accounts || wallet.accounts.length === 0) {
      throw new Error('No accounts generated')
    }
    
    if (!wallet.masterSeed || wallet.masterSeed.length === 0) {
      throw new Error('No master seed generated')
    }
  })

  // Test wallet recovery
  runner.test('Wallet recovery', () => {
    const testMnemonic = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about'
    const wallet = MultiCryptoWallet.recoverWallet(testMnemonic)
    
    if (wallet.mnemonic !== testMnemonic) {
      throw new Error('Mnemonic mismatch')
    }
    
    if (!wallet.accounts || wallet.accounts.length === 0) {
      throw new Error('No accounts recovered')
    }
  })

  // Test address validation
  runner.test('Address validation', () => {
    // Ethereum address
    const validEthAddress = '0x1234567890123456789012345678901234567890'
    if (!MultiCryptoWallet.validateAddress(validEthAddress, 'ETH')) {
      throw new Error('Valid ETH address rejected')
    }
    
    const invalidEthAddress = '0x123'
    if (MultiCryptoWallet.validateAddress(invalidEthAddress, 'ETH')) {
      throw new Error('Invalid ETH address accepted')
    }
    
    // Bitcoin address
    const validBtcAddress = 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4'
    if (!MultiCryptoWallet.validateAddress(validBtcAddress, 'BTC')) {
      throw new Error('Valid BTC address rejected')
    }
  })

  // Test secure storage
  runner.test('Secure storage', () => {
    const testKey = 'test_key'
    const testValue = 'test_value_with_sensitive_data'
    
    // Store
    SecureStorage.setItem(testKey, testValue)
    
    // Retrieve
    const retrieved = SecureStorage.getItem(testKey)
    if (retrieved !== testValue) {
      throw new Error('Secure storage data mismatch')
    }
    
    // Check existence
    if (!SecureStorage.hasItem(testKey)) {
      throw new Error('Secure storage item not found')
    }
    
    // Remove
    SecureStorage.removeItem(testKey)
    if (SecureStorage.hasItem(testKey)) {
      throw new Error('Secure storage item not removed')
    }
  })

  // Test wallet secure storage
  runner.test('Wallet secure storage', () => {
    const testWallet = {
      name: 'Test Wallet',
      addresses: { eth: '0x123...', btc: 'bc1q...' }
    }
    const testPin = '123456'
    const testMnemonic = 'test mnemonic words'
    
    // Store wallet data
    WalletSecureStorage.setWallet(testWallet)
    WalletSecureStorage.setPin(testPin)
    WalletSecureStorage.setMnemonic(testMnemonic)
    
    // Retrieve wallet data
    const retrievedWallet = WalletSecureStorage.getWallet()
    const retrievedPin = WalletSecureStorage.getPin()
    const retrievedMnemonic = WalletSecureStorage.getMnemonic()
    
    if (JSON.stringify(retrievedWallet) !== JSON.stringify(testWallet)) {
      throw new Error('Wallet data mismatch')
    }
    
    if (retrievedPin !== testPin) {
      throw new Error('PIN mismatch')
    }
    
    if (retrievedMnemonic !== testMnemonic) {
      throw new Error('Mnemonic mismatch')
    }
    
    // Check wallet existence
    if (!WalletSecureStorage.hasWallet()) {
      throw new Error('Wallet existence check failed')
    }
    
    // Clear wallet
    WalletSecureStorage.clearWallet()
    if (WalletSecureStorage.hasWallet()) {
      throw new Error('Wallet not cleared')
    }
  })

  // Test primary address extraction
  runner.test('Primary address extraction', () => {
    const wallet = MultiCryptoWallet.generateWallet()
    
    const ethAddress = MultiCryptoWallet.getPrimaryAddress(wallet, 'ETH')
    const btcAddress = MultiCryptoWallet.getPrimaryAddress(wallet, 'BTC')
    const algoAddress = MultiCryptoWallet.getPrimaryAddress(wallet, 'ALGO')
    
    if (!ethAddress) {
      throw new Error('ETH primary address not found')
    }
    
    if (!btcAddress) {
      throw new Error('BTC primary address not found')
    }
    
    if (!algoAddress) {
      throw new Error('ALGO primary address not found')
    }
    
    // Validate addresses
    if (!MultiCryptoWallet.validateAddress(ethAddress, 'ETH')) {
      throw new Error('Generated ETH address is invalid')
    }
  })

  return await runner.run()
}

// Export for use in development/debugging
export { SimpleTestRunner }