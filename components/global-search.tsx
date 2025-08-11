'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Settings, Wallet, CreditCard, BarChart3, Shield, Bell, User, FileText, HelpCircle, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { getTranslation } from '@/lib/i18n'

interface GlobalSearchProps {
  isOpen: boolean
  onClose: () => void
  onNavigate: (page: string) => void
}

interface SearchResult {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  page: string
  category: string
}

export function GlobalSearch({ isOpen, onClose, onNavigate }: GlobalSearchProps) {
  const { language } = useLanguage()
  const t = getTranslation(language)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const allPages: SearchResult[] = [
    {
      id: 'dashboard',
      title: t.dashboard.title,
      description: t.dashboard.subtitle,
      icon: <BarChart3 className="h-4 w-4" />,
      page: 'dashboard',
      category: 'navigation'
    },
    {
      id: 'send',
      title: t.navigation.send,
      description: 'Envoyer des cryptomonnaies',
      icon: <ArrowRight className="h-4 w-4" />,
      page: 'send',
      category: 'transactions'
    },
    {
      id: 'receive',
      title: t.navigation.receive,
      description: 'Recevoir des cryptomonnaies',
      icon: <Wallet className="h-4 w-4" />,
      page: 'receive',
      category: 'transactions'
    },
    {
      id: 'settings',
      title: t.navigation.settings,
      description: 'Paramètres et configuration',
      icon: <Settings className="h-4 w-4" />,
      page: 'settings',
      category: 'system'
    },
    {
      id: 'security',
      title: 'Sécurité',
      description: 'Paramètres de sécurité et PIN',
      icon: <Shield className="h-4 w-4" />,
      page: 'settings',
      category: 'system'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Alertes et notifications',
      icon: <Bell className="h-4 w-4" />,
      page: 'settings',
      category: 'system'
    },
    {
      id: 'profile',
      title: 'Profil',
      description: 'Informations personnelles',
      icon: <User className="h-4 w-4" />,
      page: 'settings',
      category: 'system'
    },
    {
      id: 'transactions',
      title: 'Historique',
      description: 'Historique des transactions',
      icon: <FileText className="h-4 w-4" />,
      page: 'history',
      category: 'transactions'
    },
    {
      id: 'support',
      title: 'Support',
      description: 'Aide et support',
      icon: <HelpCircle className="h-4 w-4" />,
      page: 'support',
      category: 'system'
    }
  ]

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (query.trim() === '') {
      setResults([])
      return
    }

    const filtered = allPages.filter(page => 
      page.title.toLowerCase().includes(query.toLowerCase()) ||
      page.description.toLowerCase().includes(query.toLowerCase()) ||
      page.category.toLowerCase().includes(query.toLowerCase())
    )
    setResults(filtered)
  }, [query])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  const handleResultClick = (result: SearchResult) => {
    onNavigate(result.page)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[9999]">
      <Card className="w-full max-w-2xl mx-4 bg-card dark:bg-card">
        <CardHeader>
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/10 rounded-full flex items-center justify-center">
                <Search className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-xl">Recherche Globale</CardTitle>
                <CardDescription>
                  Recherchez dans toutes les fonctionnalités de l'application
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex items-center gap-3 p-4 border-b border-border">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Rechercher pages, transactions, paramètres..."
              className="border-0 focus-visible:ring-0 text-lg bg-transparent"
            />
          </div>

          {query && results.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucun résultat trouvé pour "{query}"</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="max-h-96 overflow-y-auto">
              {results.map((result, index) => {
                return (
                  <div
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      index === 0
                        ? 'bg-accent text-accent-foreground'
                        : 'hover:bg-accent/50'
                    }`}
                  >
                    <div className="p-2 bg-muted dark:bg-muted rounded-lg">
                      {result.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{result.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {result.description}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {result.category}
                    </Badge>
                  </div>
                )
              })}
            </div>
          )}

          {!query && (
            <div className="p-4 text-center text-muted-foreground">
              <div className="flex items-center justify-center gap-2 text-sm">
                <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl</kbd>
                <span>+</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs">K</kbd>
                <span>pour ouvrir</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
