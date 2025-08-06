export interface CustomTheme {
  id: string
  name: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    foreground: string
    card: string
    border: string
    muted: string
  }
}

export const customThemes: CustomTheme[] = [
  {
    id: 'crypto-green',
    name: '🟢 Crypto Vert',
    colors: {
      primary: '#10b981',
      secondary: '#059669',
      accent: '#34d399',
      background: '#0f172a',
      foreground: '#f1f5f9',
      card: '#1e293b',
      border: '#334155',
      muted: '#475569'
    }
  },
  {
    id: 'professional-blue',
    name: '🔵 Bleu Professionnel',
    colors: {
      primary: '#3b82f6',
      secondary: '#1d4ed8',
      accent: '#60a5fa',
      background: '#f8fafc',
      foreground: '#0f172a',
      card: '#ffffff',
      border: '#e2e8f0',
      muted: '#64748b'
    }
  },
  {
    id: 'high-contrast',
    name: '⚫ Contraste Élevé',
    colors: {
      primary: '#ffffff',
      secondary: '#000000',
      accent: '#ffff00',
      background: '#000000',
      foreground: '#ffffff',
      card: '#1a1a1a',
      border: '#ffffff',
      muted: '#cccccc'
    }
  },
  {
    id: 'bitcoin-orange',
    name: '🟠 Bitcoin Orange',
    colors: {
      primary: '#f7931a',
      secondary: '#e8851c',
      accent: '#ffb347',
      background: '#1a1a1a',
      foreground: '#ffffff',
      card: '#2d2d2d',
      border: '#404040',
      muted: '#666666'
    }
  }
]

export function applyCustomTheme(themeId: string) {
  const theme = customThemes.find(t => t.id === themeId)
  if (!theme) return

  const root = document.documentElement
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value)
  })
}

export function removeCustomTheme() {
  const root = document.documentElement
  const theme = customThemes[0] // Default theme
  Object.keys(theme.colors).forEach(key => {
    root.style.removeProperty(`--${key}`)
  })
}
