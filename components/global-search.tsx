"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Search, X, Clock, CreditCard, Settings, Send, Download, BarChart3, Users, Calculator, History, Wallet } from 'lucide-react'

interface SearchResult {
  id: string
  title: string
  description: string
  type: 'page' | 'transaction' | 'address' | 'setting'
  icon: React.ReactNode
  action: () => void
  category: string
}

interface GlobalSearchProps {
  isOpen: boolean
  onClose: () => void
  onNavigate: (page: string) => void
}

export function GlobalSearch({ isOpen, onClose, onNavigate }: GlobalSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  // Données de recherche
  const searchData: SearchResult[] = [
    {
      id: 'dashboard',
      title: 'Tableau de bord',
      description: 'Vue d\'ensemble de votre portefeuille',
      type: 'page',
      icon: <BarChart3 className="h-4 w-4" />,
      action: () => onNavigate('dashboard'),
      category: 'Navigation'
    },
    {
      id: 'send',
      title: 'Envoyer',
      description: 'Envoyer des cryptomonnaies',
      type: 'page',
      icon: <Send className="h-4 w-4" />,
      action: () => onNavigate('send'),
      category: 'Actions'
    },
    {
      id: 'receive',
      title: 'Recevoir',
      description: 'Recevoir des cryptomonnaies',
      type: 'page',
      icon: <Download className="h-4 w-4" />,
      action: () => onNavigate('receive'),
      category: 'Actions'
    },
    {
      id: 'history',
      title: 'Historique',
      description: 'Historique des transactions',
      type: 'page',
      icon: <History className="h-4 w-4" />,
      action: () => onNavigate('history'),
      category: 'Navigation'
    },
    {
      id: 'tpe',
      title: 'Mode TPE',
      description: 'Terminal de paiement électronique',
      type: 'page',
      icon: <CreditCard className="h-4 w-4" />,
      action: () => onNavigate('tpe'),
      category: 'TPE'
    },
    {
      id: 'tpe-search',
      title: 'Recherche Client',
      description: 'Rechercher un client existant',
      type: 'page',
      icon: <Users className="h-4 w-4" />,
      action: () => onNavigate('tpe-search'),
      category: 'TPE'
    },
    {
      id: 'tpe-billing',
      title: 'Facturation',
      description: 'Créer une facture',
      type: 'page',
      icon: <Calculator className="h-4 w-4" />,
      action: () => onNavigate('tpe-billing'),
      category: 'TPE'
    },
    {
      id: 'settings',
      title: 'Paramètres',
      description: 'Configuration de l\'application',
      type: 'page',
      icon: <Settings className="h-4 w-4" />,
      action: () => onNavigate('settings'),
      category: 'Navigation'
    }
  ]

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const filtered = searchData.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
    )

    setResults(filtered)
    setSelectedIndex(0)
  }, [query])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      results[selectedIndex].action()
      onClose()
    }
  }

  const handleResultClick = (result: SearchResult) => {
    result.action()
    onClose()
  }

  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.category]) {
      acc[result.category] = []
    }
    acc[result.category].push(result)
    return acc
  }, {} as Record<string, SearchResult[]>)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-20 z-50">
      <Card className="w-full max-w-2xl mx-4 bg-card dark:bg-card">
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
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {query && results.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucun résultat trouvé pour "{query}"</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="max-h-96 overflow-y-auto">
              {Object.entries(groupedResults).map(([category, categoryResults], categoryIndex) => (
                <div key={category}>
                  {categoryIndex > 0 && <Separator />}
                  <div className="p-2">
                    <p className="text-xs font-medium text-muted-foreground px-3 py-2">
                      {category}
                    </p>
                    {categoryResults.map((result, index) => {
                      const globalIndex = results.indexOf(result)
                      return (
                        <div
                          key={result.id}
                          onClick={() => handleResultClick(result)}
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                            globalIndex === selectedIndex
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
                            {result.type}
                          </Badge>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
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
