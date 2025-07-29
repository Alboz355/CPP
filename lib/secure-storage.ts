// Secure storage utilities for sensitive data
import { toast } from "sonner"

// Simple encryption utility (in production, use more robust encryption)
class SimpleEncryption {
  private static key = "crypto-wallet-secure-key" // In production, use a more secure key derivation

  static encrypt(data: string): string {
    try {
      // Simple XOR encryption for demo (use crypto-js or similar in production)
      const key = this.key
      let encrypted = ""
      for (let i = 0; i < data.length; i++) {
        encrypted += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length))
      }
      return btoa(encrypted) // Base64 encode
    } catch (error) {
      console.error("Encryption error:", error)
      throw new Error("Failed to encrypt data")
    }
  }

  static decrypt(encryptedData: string): string {
    try {
      const data = atob(encryptedData) // Base64 decode
      const key = this.key
      let decrypted = ""
      for (let i = 0; i < data.length; i++) {
        decrypted += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length))
      }
      return decrypted
    } catch (error) {
      console.error("Decryption error:", error)
      throw new Error("Failed to decrypt data")
    }
  }
}

// Secure storage interface
export class SecureStorage {
  // Store encrypted data in localStorage (better than plain text)
  static setItem(key: string, value: string): void {
    try {
      const encrypted = SimpleEncryption.encrypt(value)
      localStorage.setItem(`secure_${key}`, encrypted)
    } catch (error) {
      console.error("Secure storage error:", error)
      toast.error("Erreur lors de la sauvegarde sécurisée")
      throw error
    }
  }

  // Retrieve and decrypt data
  static getItem(key: string): string | null {
    try {
      const encrypted = localStorage.getItem(`secure_${key}`)
      if (!encrypted) return null
      return SimpleEncryption.decrypt(encrypted)
    } catch (error) {
      console.error("Secure storage retrieval error:", error)
      toast.error("Erreur lors de la récupération des données sécurisées")
      return null
    }
  }

  // Remove secure data
  static removeItem(key: string): void {
    try {
      localStorage.removeItem(`secure_${key}`)
    } catch (error) {
      console.error("Secure storage removal error:", error)
    }
  }

  // Check if key exists
  static hasItem(key: string): boolean {
    return localStorage.getItem(`secure_${key}`) !== null
  }

  // Clear all secure data
  static clear(): void {
    try {
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.startsWith('secure_')) {
          localStorage.removeItem(key)
        }
      })
    } catch (error) {
      console.error("Secure storage clear error:", error)
    }
  }
}

// Helper functions for common sensitive data
export class WalletSecureStorage {
  // Store wallet data
  static setWallet(wallet: any): void {
    SecureStorage.setItem("wallet", JSON.stringify(wallet))
  }

  // Get wallet data
  static getWallet(): any | null {
    const walletData = SecureStorage.getItem("wallet")
    if (!walletData) return null
    try {
      return JSON.parse(walletData)
    } catch (error) {
      console.error("Error parsing wallet data:", error)
      return null
    }
  }

  // Store PIN
  static setPin(pin: string): void {
    SecureStorage.setItem("pin", pin)
  }

  // Get PIN
  static getPin(): string | null {
    return SecureStorage.getItem("pin")
  }

  // Store mnemonic (most sensitive data)
  static setMnemonic(mnemonic: string): void {
    SecureStorage.setItem("mnemonic", mnemonic)
  }

  // Get mnemonic
  static getMnemonic(): string | null {
    return SecureStorage.getItem("mnemonic")
  }

  // Remove all wallet data
  static clearWallet(): void {
    SecureStorage.removeItem("wallet")
    SecureStorage.removeItem("pin")
    SecureStorage.removeItem("mnemonic")
  }

  // Check if wallet exists
  static hasWallet(): boolean {
    return SecureStorage.hasItem("wallet") && SecureStorage.hasItem("pin")
  }
}