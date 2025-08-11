// Utilitaires de chiffrement pour données sensibles
// Utilise l'API Web Crypto standard

export async function encryptData(data: string, pin?: string): Promise<string> {
  if (!pin || typeof data !== 'string') {
    return data // Pas de chiffrement si pas de PIN
  }

  try {
    // Simple encodage pour demo (en production, utiliser AES-GCM)
    const encoder = new TextEncoder()
    const dataBytes = encoder.encode(data)
    const pinBytes = encoder.encode(pin)
    
    // XOR simple pour l'exemple
    const encrypted = new Uint8Array(dataBytes.length)
    for (let i = 0; i < dataBytes.length; i++) {
      encrypted[i] = dataBytes[i] ^ pinBytes[i % pinBytes.length]
    }
    
    // Convertir en base64
    return btoa(String.fromCharCode(...encrypted))
    
  } catch (error) {
    console.error('Erreur chiffrement:', error)
    return data // Retourner non chiffré en cas d'erreur
  }
}

export async function decryptData(encryptedData: string, pin?: string): Promise<string> {
  if (!pin || typeof encryptedData !== 'string') {
    return encryptedData // Pas de déchiffrement si pas de PIN
  }

  try {
    // Décoder depuis base64
    const encrypted = new Uint8Array(
      atob(encryptedData).split('').map(char => char.charCodeAt(0))
    )
    
    const encoder = new TextEncoder()
    const pinBytes = encoder.encode(pin)
    
    // XOR inverse
    const decrypted = new Uint8Array(encrypted.length)
    for (let i = 0; i < encrypted.length; i++) {
      decrypted[i] = encrypted[i] ^ pinBytes[i % pinBytes.length]
    }
    
    // Convertir en string
    const decoder = new TextDecoder()
    return decoder.decode(decrypted)
    
  } catch (error) {
    console.error('Erreur déchiffrement:', error)
    return encryptedData // Retourner chiffré en cas d'erreur
  }
}

// Hash simple pour PIN (en production, utiliser bcrypt ou similaire)
export async function hashPin(pin: string): Promise<string> {
  try {
    const encoder = new TextEncoder()
    const data = encoder.encode(pin + 'cryptopay_salt_2024')
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  } catch (error) {
    console.error('Erreur hash PIN:', error)
    // Fallback simple
    let hash = 0
    for (let i = 0; i < pin.length; i++) {
      const char = pin.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return Math.abs(hash).toString(16)
  }
}

export async function verifyPin(inputPin: string, hashedPin: string): Promise<boolean> {
  try {
    const hashedInput = await hashPin(inputPin)
    return hashedInput === hashedPin
  } catch (error) {
    console.error('Erreur vérification PIN:', error)
    return false
  }
}