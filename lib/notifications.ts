// Toast notification utility using sonner
import { toast } from "sonner"

export class NotificationService {
  // Success notifications
  static success(message: string, description?: string, options?: NotificationOptions) {
    if (description) {
      toast.success(message, { 
        description,
        duration: options?.duration || 4000,
        action: options?.action,
        ...options
      })
    } else {
      toast.success(message, {
        duration: options?.duration || 4000,
        action: options?.action,
        ...options
      })
    }
  }

  // Error notifications
  static error(message: string, description?: string, options?: NotificationOptions) {
    if (description) {
      toast.error(message, { 
        description,
        duration: options?.duration || 6000,
        action: options?.action,
        ...options
      })
    } else {
      toast.error(message, {
        duration: options?.duration || 6000,
        action: options?.action,
        ...options
      })
    }
  }

  // Info notifications
  static info(message: string, description?: string, options?: NotificationOptions) {
    if (description) {
      toast.info(message, { 
        description,
        duration: options?.duration || 4000,
        action: options?.action,
        ...options
      })
    } else {
      toast.info(message, {
        duration: options?.duration || 4000,
        action: options?.action,
        ...options
      })
    }
  }

  // Warning notifications
  static warning(message: string, description?: string, options?: NotificationOptions) {
    if (description) {
      toast.warning(message, { 
        description,
        duration: options?.duration || 5000,
        action: options?.action,
        ...options
      })
    } else {
      toast.warning(message, {
        duration: options?.duration || 5000,
        action: options?.action,
        ...options
      })
    }
  }

  // Loading notifications
  static loading(message: string, options?: NotificationOptions) {
    return toast.loading(message, {
      duration: options?.duration || Infinity,
      ...options
    })
  }

  // Promise-based notifications
  static promise<T>(
    promise: Promise<T>,
    loading: string,
    success: string | ((data: T) => string),
    error: string | ((error: any) => string),
    options?: NotificationOptions
  ) {
    return toast.promise(promise, {
      loading,
      success,
      error,
      duration: options?.duration || 4000,
      ...options
    })
  }

  // Dismiss a specific toast
  static dismiss(toastId?: string | number) {
    toast.dismiss(toastId)
  }

  // Copy to clipboard with toast notification
  static async copyToClipboard(text: string, successMessage: string = "Copié dans le presse-papiers") {
    try {
      await navigator.clipboard.writeText(text)
      this.success(successMessage)
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      this.success(successMessage)
    }
  }

  // Transaction notifications
  static transactionSuccess(amount: string, crypto: string, txHash?: string) {
    const message = `Transaction réussie: ${amount} ${crypto}`
    const description = txHash ? `Hash: ${txHash.slice(0, 8)}...${txHash.slice(-8)}` : undefined
    
    this.success(message, description, {
      action: txHash ? {
        label: "Voir détails",
        onClick: () => {
          // Ouvrir les détails de la transaction
          console.log("Voir détails de la transaction:", txHash)
        }
      } : undefined
    })
  }

  static transactionError(error: string, retryAction?: () => void) {
    this.error("Échec de la transaction", error, {
      action: retryAction ? {
        label: "Réessayer",
        onClick: retryAction
      } : undefined
    })
  }

  // Security notifications
  static securityWarning(message: string, action?: () => void) {
    this.warning("Alerte de sécurité", message, {
      action: action ? {
        label: "Vérifier",
        onClick: action
      } : undefined
    })
  }

  // Network notifications
  static networkStatus(isOnline: boolean) {
    if (isOnline) {
      this.success("Connexion rétablie", "Vous êtes de nouveau en ligne")
    } else {
      this.warning("Connexion perdue", "Mode hors ligne activé")
    }
  }

  // Price alert notifications
  static priceAlert(crypto: string, price: string, direction: 'above' | 'below') {
    const message = `Alerte de prix: ${crypto}`
    const description = `Le prix est passé ${direction === 'above' ? 'au-dessus' : 'en-dessous'} de ${price}`
    
    this.info(message, description, {
      action: {
        label: "Voir détails",
        onClick: () => {
          // Ouvrir les détails de l'alerte
          console.log("Voir détails de l'alerte:", crypto, price)
        }
      }
    })
  }
}

interface NotificationOptions {
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
  [key: string]: any
}

// Short aliases for convenience
export const notify = NotificationService