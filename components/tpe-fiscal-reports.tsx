"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, Download, Calculator, TrendingUp, Euro, Calendar, BarChart3 } from 'lucide-react'

interface Transaction {
  id: string
  date: string
  type: 'sale' | 'purchase'
  amount: number
  vatRate: number
  vatAmount: number
  description: string
  category: string
}

interface FiscalReport {
  period: string
  totalSales: number
  totalPurchases: number
  vatCollected: number
  vatPaid: number
  netVat: number
  transactions: Transaction[]
}

interface VATBreakdown {
  rate: number
  salesAmount: number
  vatAmount: number
  transactionCount: number
}

export function TPEFiscalReports() {
  const [selectedPeriod, setSelectedPeriod] = useState('current-month')
  const [reportType, setReportType] = useState('summary')
  const [report, setReport] = useState<FiscalReport | null>(null)
  const [vatBreakdown, setVatBreakdown] = useState<VATBreakdown[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  // Données de démonstration
  const mockTransactions: Transaction[] = [
    {
      id: '1',
      date: '2024-01-15',
      type: 'sale',
      amount: 120.00,
      vatRate: 20,
      vatAmount: 20.00,
      description: 'Vente produit A',
      category: 'Produits'
    },
    {
      id: '2',
      date: '2024-01-16',
      type: 'sale',
      amount: 55.00,
      vatRate: 10,
      vatAmount: 5.00,
      description: 'Service consultation',
      category: 'Services'
    },
    {
      id: '3',
      date: '2024-01-17',
      type: 'purchase',
      amount: 80.00,
      vatRate: 20,
      vatAmount: 13.33,
      description: 'Achat matériel',
      category: 'Achats'
    },
    {
      id: '4',
      date: '2024-01-18',
      type: 'sale',
      amount: 200.00,
      vatRate: 20,
      vatAmount: 33.33,
      description: 'Vente produit B',
      category: 'Produits'
    },
    {
      id: '5',
      date: '2024-01-19',
      type: 'sale',
      amount: 75.00,
      vatRate: 5.5,
      vatAmount: 3.91,
      description: 'Vente livre',
      category: 'Livres'
    }
  ]

  useEffect(() => {
    generateReport()
  }, [selectedPeriod, reportType])

  const generateReport = async () => {
    setIsGenerating(true)
    
    // Simulation d'un délai de génération
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Filtrer les transactions selon la période
    const filteredTransactions = mockTransactions.filter(transaction => {
      const transactionDate = new Date(transaction.date)
      const now = new Date()
      
      switch (selectedPeriod) {
        case 'current-month':
          return transactionDate.getMonth() === now.getMonth() && 
                 transactionDate.getFullYear() === now.getFullYear()
        case 'last-month':
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1)
          return transactionDate.getMonth() === lastMonth.getMonth() && 
                 transactionDate.getFullYear() === lastMonth.getFullYear()
        case 'current-quarter':
          const currentQuarter = Math.floor(now.getMonth() / 3)
          const transactionQuarter = Math.floor(transactionDate.getMonth() / 3)
          return transactionQuarter === currentQuarter && 
                 transactionDate.getFullYear() === now.getFullYear()
        case 'current-year':
          return transactionDate.getFullYear() === now.getFullYear()
        default:
          return true
      }
    })

    // Calculer les totaux
    const totalSales = filteredTransactions
      .filter(t => t.type === 'sale')
      .reduce((sum, t) => sum + t.amount, 0)

    const totalPurchases = filteredTransactions
      .filter(t => t.type === 'purchase')
      .reduce((sum, t) => sum + t.amount, 0)

    const vatCollected = filteredTransactions
      .filter(t => t.type === 'sale')
      .reduce((sum, t) => sum + t.vatAmount, 0)

    const vatPaid = filteredTransactions
      .filter(t => t.type === 'purchase')
      .reduce((sum, t) => sum + t.vatAmount, 0)

    // Calculer la répartition par taux de TVA
    const vatBreakdownMap = new Map<number, VATBreakdown>()
    
    filteredTransactions
      .filter(t => t.type === 'sale')
      .forEach(transaction => {
        const existing = vatBreakdownMap.get(transaction.vatRate) || {
          rate: transaction.vatRate,
          salesAmount: 0,
          vatAmount: 0,
          transactionCount: 0
        }
        
        existing.salesAmount += transaction.amount
        existing.vatAmount += transaction.vatAmount
        existing.transactionCount += 1
        
        vatBreakdownMap.set(transaction.vatRate, existing)
      })

    const newReport: FiscalReport = {
      period: getPeriodLabel(selectedPeriod),
      totalSales,
      totalPurchases,
      vatCollected,
      vatPaid,
      netVat: vatCollected - vatPaid,
      transactions: filteredTransactions
    }

    setReport(newReport)
    setVatBreakdown(Array.from(vatBreakdownMap.values()))
    setIsGenerating(false)
  }

  const getPeriodLabel = (period: string): string => {
    switch (period) {
      case 'current-month': return 'Mois en cours'
      case 'last-month': return 'Mois précédent'
      case 'current-quarter': return 'Trimestre en cours'
      case 'current-year': return 'Année en cours'
      default: return 'Période sélectionnée'
    }
  }

  const exportToCSV = () => {
    if (!report) return

    const csvContent = [
      ['Date', 'Type', 'Description', 'Montant HT', 'Taux TVA', 'Montant TVA', 'Montant TTC'],
      ...report.transactions.map(t => [
        t.date,
        t.type === 'sale' ? 'Vente' : 'Achat',
        t.description,
        (t.amount - t.vatAmount).toFixed(2),
        `${t.vatRate}%`,
        t.vatAmount.toFixed(2),
        t.amount.toFixed(2)
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rapport-fiscal-${selectedPeriod}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportToPDF = () => {
    // Simulation d'export PDF
    alert('Export PDF en cours de développement')
  }

  if (isGenerating) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Génération du rapport en cours...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Contrôles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Rapports Fiscaux
          </CardTitle>
          <CardDescription>
            Générez et exportez vos déclarations fiscales automatiquement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium">Période</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current-month">Mois en cours</SelectItem>
                  <SelectItem value="last-month">Mois précédent</SelectItem>
                  <SelectItem value="current-quarter">Trimestre en cours</SelectItem>
                  <SelectItem value="current-year">Année en cours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Type de rapport</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summary">Résumé</SelectItem>
                  <SelectItem value="detailed">Détaillé</SelectItem>
                  <SelectItem value="vat-only">TVA uniquement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button onClick={generateReport} variant="outline">
                <Calculator className="h-4 w-4 mr-2" />
                Régénérer
              </Button>
              <Button onClick={exportToCSV} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                CSV
              </Button>
              <Button onClick={exportToPDF} variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {report && (
        <>
          {/* Résumé fiscal */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Chiffre d'affaires</p>
                    <p className="text-2xl font-bold text-green-600">
                      {report.totalSales.toFixed(2)} €
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">TVA collectée</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {report.vatCollected.toFixed(2)} €
                    </p>
                  </div>
                  <Euro className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">TVA déductible</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {report.vatPaid.toFixed(2)} €
                    </p>
                  </div>
                  <Calculator className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">TVA nette</p>
                    <p className={`text-2xl font-bold ${report.netVat >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {report.netVat.toFixed(2)} €
                    </p>
                  </div>
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    report.netVat >= 0 ? 'bg-red-100' : 'bg-green-100'
                  }`}>
                    <Euro className={`h-5 w-5 ${report.netVat >= 0 ? 'text-red-600' : 'text-green-600'}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Répartition par taux de TVA */}
          <Card>
            <CardHeader>
              <CardTitle>Répartition par taux de TVA</CardTitle>
              <CardDescription>
                Détail des ventes par taux de TVA pour la période {report.period}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vatBreakdown.map((breakdown, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="text-lg px-3 py-1">
                        {breakdown.rate}%
                      </Badge>
                      <div>
                        <p className="font-medium">
                          {breakdown.transactionCount} transaction{breakdown.transactionCount > 1 ? 's' : ''}
                        </p>
                        <p className="text-sm text-gray-600">
                          Montant HT: {(breakdown.salesAmount - breakdown.vatAmount).toFixed(2)} €
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{breakdown.vatAmount.toFixed(2)} €</p>
                      <p className="text-sm text-gray-600">TVA collectée</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Détail des transactions */}
          {reportType === 'detailed' && (
            <Card>
              <CardHeader>
                <CardTitle>Détail des transactions</CardTitle>
                <CardDescription>
                  Liste complète des transactions pour la période {report.period}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Montant HT</TableHead>
                      <TableHead className="text-right">Taux TVA</TableHead>
                      <TableHead className="text-right">TVA</TableHead>
                      <TableHead className="text-right">Montant TTC</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {report.transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          {new Date(transaction.date).toLocaleDateString('fr-FR')}
                        </TableCell>
                        <TableCell>
                          <Badge variant={transaction.type === 'sale' ? 'default' : 'secondary'}>
                            {transaction.type === 'sale' ? 'Vente' : 'Achat'}
                          </Badge>
                        </TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell className="text-right">
                          {(transaction.amount - transaction.vatAmount).toFixed(2)} €
                        </TableCell>
                        <TableCell className="text-right">{transaction.vatRate}%</TableCell>
                        <TableCell className="text-right">
                          {transaction.vatAmount.toFixed(2)} €
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {transaction.amount.toFixed(2)} €
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {/* Déclaration fiscale */}
          <Card>
            <CardHeader>
              <CardTitle>Déclaration fiscale</CardTitle>
              <CardDescription>
                Résumé prêt pour votre déclaration de TVA
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span>Base imposable (ventes HT):</span>
                  <span className="font-medium">
                    {(report.totalSales - report.vatCollected).toFixed(2)} €
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>TVA collectée:</span>
                  <span className="font-medium">{report.vatCollected.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span>TVA déductible:</span>
                  <span className="font-medium">{report.vatPaid.toFixed(2)} €</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>TVA à payer:</span>
                  <span className={report.netVat >= 0 ? 'text-red-600' : 'text-green-600'}>
                    {Math.abs(report.netVat).toFixed(2)} €
                    {report.netVat < 0 && ' (crédit)'}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={exportToCSV} className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter la déclaration
                </Button>
                <Button onClick={exportToPDF} variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Générer PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
