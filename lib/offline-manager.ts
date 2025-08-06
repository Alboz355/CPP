export class OfflineManager {
  private static instance: OfflineManager
  private isOnline = navigator.onLine
  private listeners: ((online: boolean) => void)[] = []
  private cachedData: Map<string, any> = new Map()

  private constructor() {
    this.setupEventListeners()
    this.loadCachedData()
  }

  static getInstance(): OfflineManager {
    if (!OfflineManager.instance) {
      OfflineManager.instance = new OfflineManager()
    }
    return OfflineManager.instance
  }

  private setupEventListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true
      this.notifyListeners(true)
    })

    window.addEventListener('offline', () => {
      this.isOnline = false
      this.notifyListeners(false)
    })
  }

  private loadCachedData() {
    try {
      const cached = localStorage.getItem('offline-cache')
      if (cached) {
        const data = JSON.parse(cached)
        Object.entries(data).forEach(([key, value]) => {
          this.cachedData.set(key, value)
        })
      }
    } catch (error) {
      console.error('Erreur lors du chargement du cache:', error)
    }
  }

  private saveCachedData() {
    try {
      const data: Record<string, any> = {}
      this.cachedData.forEach((value, key) => {
        data[key] = value
      })
      localStorage.setItem('offline-cache', JSON.stringify(data))
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du cache:', error)
    }
  }

  isOnlineStatus(): boolean {
    return this.isOnline
  }

  onStatusChange(callback: (online: boolean) => void) {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback)
    }
  }

  private notifyListeners(online: boolean) {
    this.listeners.forEach(callback => callback(online))
  }

  cacheData(key: string, data: any) {
    this.cachedData.set(key, {
      data,
      timestamp: Date.now()
    })
    this.saveCachedData()
  }

  getCachedData(key: string, maxAge = 5 * 60 * 1000): any | null {
    const cached = this.cachedData.get(key)
    if (!cached) return null

    if (Date.now() - cached.timestamp > maxAge) {
      this.cachedData.delete(key)
      this.saveCachedData()
      return null
    }

    return cached.data
  }

  clearCache() {
    this.cachedData.clear()
    localStorage.removeItem('offline-cache')
  }
}
