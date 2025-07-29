// Toast notification utility using sonner
import { toast } from "sonner"

export class NotificationService {
  // Success notifications
  static success(message: string, description?: string) {
    if (description) {
      toast.success(message, { description })
    } else {
      toast.success(message)
    }
  }

  // Error notifications
  static error(message: string, description?: string) {
    if (description) {
      toast.error(message, { description })
    } else {
      toast.error(message)
    }
  }

  // Info notifications
  static info(message: string, description?: string) {
    if (description) {
      toast.info(message, { description })
    } else {
      toast.info(message)
    }
  }

  // Warning notifications
  static warning(message: string, description?: string) {
    if (description) {
      toast.warning(message, { description })
    } else {
      toast.warning(message)
    }
  }

  // Loading notifications
  static loading(message: string) {
    return toast.loading(message)
  }

  // Promise-based notifications
  static promise<T>(
    promise: Promise<T>,
    loading: string,
    success: string | ((data: T) => string),
    error: string | ((error: any) => string)
  ) {
    return toast.promise(promise, {
      loading,
      success,
      error,
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
}

// Short aliases for convenience
export const notify = NotificationService