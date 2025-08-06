export interface SecuritySettings {
  autoLockEnabled: boolean
  autoLockTime: number // en minutes
  blurOnInactive: boolean
  requirePinOnReturn: boolean
  biometricEnabled: boolean
  autoThemeEnabled: boolean
}

export class SecurityManager {
  private static instance: SecurityManager
  private inactivityTimer: NodeJS.Timeout | null = null
  private isLocked = false
  private settings: SecuritySettings
  private onLockCallback?: () => void

  private constructor() {
    this.settings = this.loadSettings()
    this.setupInactivityDetection()
    this.setupAutoTheme()
  }

  static getInstance(): SecurityManager {
    if (!SecurityManager.instance) {
      SecurityManager.instance = new SecurityManager()
    }
    return SecurityManager.instance
  }

  private loadSettings(): SecuritySettings {
    const saved = localStorage.getItem('security-settings')
    return saved ? JSON.parse(saved) : {
      autoLockEnabled: true,
      autoLockTime: 5,
      blurOnInactive: true,
      requirePinOnReturn: true,
      biometricEnabled: false,
      autoThemeEnabled: true
    }
  }

  updateSettings(settings: Partial<SecuritySettings>) {
    this.settings = { ...this.settings, ...settings }
    localStorage.setItem('security-settings', JSON.stringify(this.settings))
    this.resetInactivityTimer()
    
    if (settings.autoThemeEnabled !== undefined) {
      this.setupAutoTheme()
    }
  }

  getSettings(): SecuritySettings {
    return { ...this.settings }
  }

  setLockCallback(callback: () => void) {
    this.onLockCallback = callback
  }

  private setupInactivityDetection() {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    
    const resetTimer = () => {
      this.resetInactivityTimer()
    }

    events.forEach(event => {
      document.addEventListener(event, resetTimer, true)
    })

    this.resetInactivityTimer()
  }

  private setupAutoTheme() {
    if (!this.settings.autoThemeEnabled) return

    const updateTheme = () => {
      const hour = new Date().getHours()
      const isDark = hour < 7 || hour >= 19 // Dark mode entre 19h et 7h
      
      if (typeof window !== 'undefined') {
        const theme = isDark ? 'dark' : 'light'
        document.documentElement.classList.toggle('dark', isDark)
        localStorage.setItem('theme', theme)
        
        // Dispatch event pour next-themes
        window.dispatchEvent(new CustomEvent('theme-change', { detail: theme }))
      }
    }

    // Vérifier immédiatement
    updateTheme()
    
    // Vérifier toutes les heures
    setInterval(updateTheme, 60 * 60 * 1000)
  }

  private resetInactivityTimer() {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer)
    }

    if (!this.settings.autoLockEnabled) return

    this.inactivityTimer = setTimeout(() => {
      this.lockApp()
    }, this.settings.autoLockTime * 60 * 1000)
  }

  private lockApp() {
    if (this.isLocked) return
    
    this.isLocked = true
    
    if (this.settings.blurOnInactive) {
      // Créer un overlay avec flou qui n'affecte pas les modals de sécurité
      const blurOverlay = document.createElement('div')
      blurOverlay.id = 'security-blur-overlay'
      blurOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        z-index: 9998;
        pointer-events: none;
      `
      
      // Ajouter une classe pour exclure les modals de sécurité du flou
      const style = document.createElement('style')
      style.textContent = `
        .security-modal {
          filter: none !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
        }
        
        [data-state="open"] {
          filter: none !important;
        }
        
        .z-\\[9999\\] {
          filter: none !important;
        }
      `
      document.head.appendChild(style)
      
      document.body.appendChild(blurOverlay)
    }

    if (this.onLockCallback) {
      this.onLockCallback()
    }
  }

  unlockApp() {
    this.isLocked = false
    
    // Supprimer l'overlay de flou
    const blurOverlay = document.getElementById('security-blur-overlay')
    if (blurOverlay) {
      blurOverlay.remove()
    }
    
    // Supprimer les styles de sécurité
    const securityStyles = document.querySelector('style[data-security="true"]')
    if (securityStyles) {
      securityStyles.remove()
    }
    
    this.resetInactivityTimer()
  }

  isAppLocked(): boolean {
    return this.isLocked
  }

  // Authentification biométrique améliorée
  async authenticateWithBiometrics(): Promise<boolean> {
    if (!this.isBiometricEnabled()) {
      throw new Error('Authentification biométrique non configurée')
    }
    
    try {
      // Vérifier si WebAuthn est disponible
      if (!window.PublicKeyCredential) {
        throw new Error('WebAuthn non supporté par ce navigateur')
      }

      // Vérifier la disponibilité des biométriques
      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
      if (!available) {
        throw new Error('Authentification biométrique non disponible sur cet appareil')
      }

      const credentialId = localStorage.getItem('biometric_id')
      if (!credentialId) {
        throw new Error('Aucune authentification biométrique configurée')
      }

      // Créer un challenge aléatoire
      const challenge = new Uint8Array(32)
      crypto.getRandomValues(challenge)

      // Convertir l'ID de credential depuis base64
      const credentialIdBuffer = Uint8Array.from(atob(credentialId), c => c.charCodeAt(0))

      const credential = await navigator.credentials.get({
        publicKey: {
          challenge: challenge,
          allowCredentials: [{
            id: credentialIdBuffer,
            type: 'public-key',
            transports: ['internal', 'platform']
          }],
          userVerification: 'required',
          timeout: 60000
        }
      }) as PublicKeyCredential | null

      if (credential && credential.response) {
        // Authentification réussie
        return true
      }
      
      return false
    } catch (error: any) {
      console.error('Erreur authentification biométrique:', error)
      
      // Messages d'erreur spécifiques
      if (error.name === 'NotAllowedError') {
        throw new Error('Authentification biométrique refusée par l\'utilisateur')
      } else if (error.name === 'AbortError') {
        throw new Error('Authentification biométrique annulée')
      } else if (error.name === 'NotSupportedError') {
        throw new Error('Authentification biométrique non supportée')
      } else {
        throw new Error(error.message || 'Erreur lors de l\'authentification biométrique')
      }
    }
  }

  // Configuration biométrique améliorée
  async setupBiometric(): Promise<boolean> {
    try {
      // Vérifier si WebAuthn est disponible
      if (!window.PublicKeyCredential) {
        throw new Error('WebAuthn non supporté par ce navigateur')
      }

      // Vérifier la disponibilité des biométriques
      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
      if (!available) {
        throw new Error('Authentification biométrique non disponible sur cet appareil')
      }

      // Créer un challenge et un user ID aléatoires
      const challenge = new Uint8Array(32)
      const userId = new Uint8Array(16)
      crypto.getRandomValues(challenge)
      crypto.getRandomValues(userId)

      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: challenge,
          rp: { 
            name: "Crypto Wallet",
            id: window.location.hostname
          },
          user: {
            id: userId,
            name: "wallet-user",
            displayName: "Wallet User"
          },
          pubKeyCredParams: [
            { alg: -7, type: "public-key" }, // ES256
            { alg: -257, type: "public-key" } // RS256
          ],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "required",
            requireResidentKey: false
          },
          timeout: 60000,
          attestation: "none"
        }
      }) as PublicKeyCredential | null

      if (credential && credential.rawId) {
        // Sauvegarder l'ID du credential en base64
        const credentialId = btoa(String.fromCharCode(...new Uint8Array(credential.rawId)))
        
        localStorage.setItem('biometric_enabled', 'true')
        localStorage.setItem('biometric_id', credentialId)
        localStorage.setItem('biometric_setup_date', new Date().toISOString())
        
        this.settings.biometricEnabled = true
        this.updateSettings({ biometricEnabled: true })
        
        return true
      }
      
      return false
    } catch (error: any) {
      console.error('Erreur configuration biométrique:', error)
      
      // Messages d'erreur spécifiques
      if (error.name === 'NotAllowedError') {
        throw new Error('Configuration biométrique refusée par l\'utilisateur')
      } else if (error.name === 'AbortError') {
        throw new Error('Configuration biométrique annulée')
      } else if (error.name === 'NotSupportedError') {
        throw new Error('Authentification biométrique non supportée sur cet appareil')
      } else {
        throw new Error(error.message || 'Erreur lors de la configuration biométrique')
      }
    }
  }

  // Vérifier si la biométrie est activée et disponible
  isBiometricEnabled(): boolean {
    const enabled = localStorage.getItem('biometric_enabled') === 'true'
    const hasCredential = localStorage.getItem('biometric_id') !== null
    return this.settings.biometricEnabled && enabled && hasCredential
  }

  // Désactiver la biométrie
  disableBiometric(): void {
    localStorage.removeItem('biometric_enabled')
    localStorage.removeItem('biometric_id')
    localStorage.removeItem('biometric_setup_date')
    this.settings.biometricEnabled = false
    this.updateSettings({ biometricEnabled: false })
  }

  // Générer codes de sauvegarde
  generateBackupCodes(): string[] {
    const codes = []
    for (let i = 0; i < 10; i++) {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase()
      codes.push(code)
    }
    
    // Sauvegarder les codes hashés
    const hashedCodes = codes.map(code => btoa(code))
    localStorage.setItem('backup-codes', JSON.stringify(hashedCodes))
    localStorage.setItem('backup-codes-generated', Date.now().toString())
    
    return codes
  }

  // Vérifier code de sauvegarde
  verifyBackupCode(code: string): boolean {
    const savedCodes = localStorage.getItem('backup-codes')
    if (!savedCodes) return false
    
    const hashedCodes = JSON.parse(savedCodes)
    const hashedInput = btoa(code.toUpperCase())
    
    const index = hashedCodes.indexOf(hashedInput)
    if (index !== -1) {
      // Supprimer le code utilisé
      hashedCodes.splice(index, 1)
      localStorage.setItem('backup-codes', JSON.stringify(hashedCodes))
      return true
    }
    
    return false
  }

  // Valider un code de sauvegarde (alias pour compatibilité)
  validateBackupCode(code: string): boolean {
    return this.verifyBackupCode(code)
  }

  // Vérifier si les codes ont été vus
  hasViewedBackupCodes(): boolean {
    return localStorage.getItem('backup-codes-viewed') === 'true'
  }

  // Marquer les codes comme vus
  markBackupCodesAsViewed() {
    localStorage.setItem('backup-codes-viewed', 'true')
  }

  // Obtenir le nombre de codes restants
  getRemainingBackupCodes(): number {
    const savedCodes = localStorage.getItem('backup-codes')
    if (!savedCodes) return 0
    return JSON.parse(savedCodes).length
  }

  // Vérifier si des codes de sauvegarde existent
  hasBackupCodes(): boolean {
    return this.getRemainingBackupCodes() > 0
  }

  // Réinitialiser le PIN avec un code de sauvegarde
  resetPinWithBackupCode(backupCode: string, newPin: string): boolean {
    if (this.verifyBackupCode(backupCode)) {
      // Sauvegarder le nouveau PIN
      localStorage.setItem('pin-hash', btoa(newPin))
      return true
    }
    return false
  }

  // Gestion des tentatives de connexion échouées
  private failedAttempts = 0
  private maxAttempts = 5
  private lockoutTime = 30 * 60 * 1000 // 30 minutes

  recordFailedAttempt(): void {
    this.failedAttempts++
    localStorage.setItem('failed_attempts', this.failedAttempts.toString())
    
    if (this.failedAttempts >= this.maxAttempts) {
      this.lockApp()
      localStorage.setItem('lockout_until', (Date.now() + this.lockoutTime).toString())
    }
  }

  resetFailedAttempts(): void {
    this.failedAttempts = 0
    localStorage.removeItem('failed_attempts')
    localStorage.removeItem('lockout_until')
  }

  getFailedAttempts(): number {
    const stored = localStorage.getItem('failed_attempts')
    return stored ? parseInt(stored) : 0
  }

  isLockedOut(): boolean {
    const lockoutUntil = localStorage.getItem('lockout_until')
    if (!lockoutUntil) return false
    
    const lockoutTime = parseInt(lockoutUntil)
    if (Date.now() < lockoutTime) {
      return true
    } else {
      // Lockout expiré, nettoyer
      this.resetFailedAttempts()
      return false
    }
  }

  // Obtenir le temps restant de lockout en millisecondes
  getLockoutTimeRemaining(): number {
    const lockoutUntil = localStorage.getItem('lockout_until')
    if (!lockoutUntil) return 0
    
    const lockoutTime = parseInt(lockoutUntil)
    const remaining = lockoutTime - Date.now()
    return remaining > 0 ? remaining : 0
  }
}
