export interface BackupData {
  timestamp: number
  version: string
  settings: any
  preferences: any
  customThemes: any
  notifications: any
}

export class BackupManager {
  private static instance: BackupManager
  private backupInterval: NodeJS.Timeout | null = null

  private constructor() {
    this.startAutoBackup()
  }

  static getInstance(): BackupManager {
    if (!BackupManager.instance) {
      BackupManager.instance = new BackupManager()
    }
    return BackupManager.instance
  }

  private startAutoBackup() {
    // Backup automatique toutes les 30 minutes
    this.backupInterval = setInterval(() => {
      this.createAutoBackup()
    }, 30 * 60 * 1000)

    // Backup initial après 5 minutes
    setTimeout(() => {
      this.createAutoBackup()
    }, 5 * 60 * 1000)
  }

  private createAutoBackup() {
    try {
      const backupData: BackupData = {
        timestamp: Date.now(),
        version: '1.0.0',
        settings: this.getSettings(),
        preferences: this.getPreferences(),
        customThemes: localStorage.getItem('custom-theme'),
        notifications: localStorage.getItem('notifications')
      }

      const backups = this.getBackupHistory()
      backups.unshift(backupData)
      
      // Garder seulement les 10 dernières sauvegardes
      if (backups.length > 10) {
        backups.splice(10)
      }

      localStorage.setItem('auto-backups', JSON.stringify(backups))
    } catch (error) {
      console.error('Erreur lors de la sauvegarde automatique:', error)
    }
  }

  private getSettings() {
    return {
      theme: localStorage.getItem('theme'),
      language: localStorage.getItem('language'),
      currency: localStorage.getItem('currency'),
      pageTransitions: localStorage.getItem('pageTransitions'),
      securitySettings: localStorage.getItem('security-settings')
    }
  }

  private getPreferences() {
    return {
      autoLock: localStorage.getItem('autoLock'),
      biometrics: localStorage.getItem('biometrics'),
      focusMode: localStorage.getItem('focus-mode')
    }
  }

  getBackupHistory(): BackupData[] {
    try {
      const backups = localStorage.getItem('auto-backups')
      return backups ? JSON.parse(backups) : []
    } catch {
      return []
    }
  }

  restoreBackup(backup: BackupData) {
    try {
      // Restaurer les paramètres
      Object.entries(backup.settings).forEach(([key, value]) => {
        if (value !== null) {
          localStorage.setItem(key, value as string)
        }
      })

      // Restaurer les préférences
      Object.entries(backup.preferences).forEach(([key, value]) => {
        if (value !== null) {
          localStorage.setItem(key, value as string)
        }
      })

      return true
    } catch (error) {
      console.error('Erreur lors de la restauration:', error)
      return false
    }
  }

  exportBackup(): string {
    const backupData: BackupData = {
      timestamp: Date.now(),
      version: '1.0.0',
      settings: this.getSettings(),
      preferences: this.getPreferences(),
      customThemes: localStorage.getItem('custom-theme'),
      notifications: localStorage.getItem('notifications')
    }

    return JSON.stringify(backupData, null, 2)
  }

  stopAutoBackup() {
    if (this.backupInterval) {
      clearInterval(this.backupInterval)
      this.backupInterval = null
    }
  }
}
