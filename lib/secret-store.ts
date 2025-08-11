import { SecureStorage } from '@/lib/secure-storage'

function isElectron(): boolean {
  const isRenderer = typeof window !== 'undefined' && typeof window.process === 'object' && (window.process as any).type === 'renderer'
  const isMain = typeof process !== 'undefined' && !!(process as any).versions?.electron
  // @ts-ignore
  const isUserAgent = typeof navigator !== 'undefined' && /Electron/i.test(navigator.userAgent || '')
  return isRenderer || isMain || isUserAgent
}

async function importKeytarSafe(): Promise<any | null> {
  try {
    if (!isElectron()) return null
    // Utiliser eval pour éviter la résolution par le bundler côté navigateur
    const dynamicImport = (0, eval)("import")
    const mod = await dynamicImport('keytar')
    return mod?.default || mod
  } catch {
    return null
  }
}

export async function setSecret(key: string, value: string): Promise<void> {
  const keytar = await importKeytarSafe()
  if (keytar) {
    try {
      await keytar.setPassword('CryptoPayPro', key, value)
      return
    } catch {}
  }
  await SecureStorage.setItem(key, value)
}

export async function getSecret(key: string): Promise<string | null> {
  const keytar = await importKeytarSafe()
  if (keytar) {
    try {
      const v = await keytar.getPassword('CryptoPayPro', key)
      if (v) return v
    } catch {}
  }
  return await SecureStorage.getItem(key)
}

export async function removeSecret(key: string): Promise<void> {
  const keytar = await importKeytarSafe()
  if (keytar) {
    try {
      await keytar.deletePassword('CryptoPayPro', key)
      return
    } catch {}
  }
  await SecureStorage.removeItem(key)
}
