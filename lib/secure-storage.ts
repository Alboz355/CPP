// Secure storage utility for sensitive data
// Uses IndexedDB with encryption for better security than plain localStorage

import CryptoJS from 'crypto-js'

const DB_NAME = 'CryptoWalletSecureStorage'
const DB_VERSION = 1
const STORE_NAME = 'secureData'
const ENC_KEY_STORAGE_KEY = '__enc_key_v1'

const isBrowser = () =>
  typeof window !== 'undefined' &&
  typeof localStorage !== 'undefined' &&
  typeof indexedDB !== 'undefined'

// Generate or retrieve a persistent encryption key
const getEncryptionKey = (): string => {
  if (!isBrowser()) return 'server-fallback-key'

  let key = localStorage.getItem(ENC_KEY_STORAGE_KEY)
  if (!key) {
    key = CryptoJS.lib.WordArray.random(256 / 8).toString()
    localStorage.setItem(ENC_KEY_STORAGE_KEY, key)
  }

  return key
}

// Encrypt data
const encryptData = (data: string): string => {
  const key = getEncryptionKey()
  return CryptoJS.AES.encrypt(data, key).toString()
}

// Decrypt data
const decryptData = (encryptedData: string): string => {
  const key = getEncryptionKey()
  const bytes = CryptoJS.AES.decrypt(encryptedData, key)
  return bytes.toString(CryptoJS.enc.Utf8)
}

// IndexedDB operations
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (!isBrowser()) {
      reject(new Error('IndexedDB unavailable'))
      return
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' })
      }
    }
  })
}

export class SecureStorage {
  // Store sensitive data securely
  static async setItem(key: string, value: string): Promise<void> {
    if (!isBrowser()) return

    try {
      const db = await openDB()
      const transaction = db.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)

      const encryptedValue = encryptData(value)
      await new Promise<void>((resolve, reject) => {
        const request = store.put({ key, value: encryptedValue })
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.warn('SecureStorage: Failed to store data, falling back to encrypted localStorage', error)
      const encryptedValue = encryptData(value)
      localStorage.setItem(`secure_${key}`, encryptedValue)
    }
  }

  // Retrieve sensitive data securely
  static async getItem(key: string): Promise<string | null> {
    if (!isBrowser()) return null

    try {
      const db = await openDB()
      const transaction = db.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)

      const result = await new Promise<any>((resolve, reject) => {
        const request = store.get(key)
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })

      if (result) {
        return decryptData(result.value)
      }
      return null
    } catch (error) {
      console.warn('SecureStorage: Failed to retrieve data, falling back to encrypted localStorage', error)
      const encryptedValue = localStorage.getItem(`secure_${key}`)
      if (encryptedValue) {
        try {
          return decryptData(encryptedValue)
        } catch {
          return null
        }
      }
      return null
    }
  }

  // Remove sensitive data
  static async removeItem(key: string): Promise<void> {
    if (!isBrowser()) return

    try {
      const db = await openDB()
      const transaction = db.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)

      await new Promise<void>((resolve, reject) => {
        const request = store.delete(key)
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.warn('SecureStorage: Failed to remove data, falling back to localStorage', error)
      localStorage.removeItem(`secure_${key}`)
    }
  }

  // Clear all secure data
  static async clear(): Promise<void> {
    if (!isBrowser()) return

    try {
      const db = await openDB()
      const transaction = db.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)

      await new Promise<void>((resolve, reject) => {
        const request = store.clear()
        request.onsuccess = () => resolve()
        request.onerror = () => reject(request.error)
      })
    } catch (error) {
      console.warn('SecureStorage: Failed to clear data, falling back to localStorage', error)
      Object.keys(localStorage).forEach((storageKey) => {
        if (storageKey.startsWith('secure_')) {
          localStorage.removeItem(storageKey)
        }
      })
    }
  }
}

export class BasicSecureStorage {
  private static encode(value: string): string {
    return btoa(encodeURIComponent(value))
  }

  private static decode(encodedValue: string): string {
    return decodeURIComponent(atob(encodedValue))
  }

  static setItem(key: string, value: string): void {
    if (typeof localStorage === 'undefined') return
    const encodedValue = this.encode(value)
    localStorage.setItem(`basic_secure_${key}`, encodedValue)
  }

  static getItem(key: string): string | null {
    if (typeof localStorage === 'undefined') return null
    const encodedValue = localStorage.getItem(`basic_secure_${key}`)
    if (encodedValue !== null) {
      try {
        return this.decode(encodedValue)
      } catch {
        return null
      }
    }
    return null
  }

  static removeItem(key: string): void {
    if (typeof localStorage === 'undefined') return
    localStorage.removeItem(`basic_secure_${key}`)
  }

  static clear(): void {
    if (typeof localStorage === 'undefined') return
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('basic_secure_')) {
        localStorage.removeItem(key)
      }
    })
  }
}
