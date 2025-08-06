"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ArrowLeft, Plus, Edit, Trash2, FileText, Download, Calendar, Calculator, Receipt, TrendingUp } from 'lucide-react'
import { FiscalReportManager } from "@/lib/fiscal-reports"

interface VATRate {
  id: string
  name: string
  rate: number
  description: string
  isDefault: boolean
  createdAt: string
}

interface TPEVatManagementProps {
  onNavigate: (page: string) => void
}

export function TPEVatManagement({ onNavigate }: TPEVatManagementProps) {
  const [vatRates, setVatRates] = useState<VATRate[]>([])
  const [newRate, setNewRate] = useState({ name: "", rate: "", description: "" })
  const [editingRate, setEditingRate] = useState<VATRate | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [reportPeriod, setReportPeriod] = useState("month")
  const [reportYear, setReportYear] = useState(new Date().getFullYear().toString())
  const [reportMonth, setReportMonth] = useState((new Date().getMonth() + 1).toString())
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [lastReport, setLastReport] = useState<any>(null)

  const fiscalManager = FiscalReportManager.getInstance()

  useEffect(() => {
    loadVATRates()
  }, [])

  const loadVATRates = () => {
    const saved = localStorage.getItem('vat-rates')
    if (saved) {
      setVatRates(JSON.parse(saved))
    } else {
      // Taux par défaut
      const defaultRates: VATRate[] = [
        {
          id: '1',
          name: 'TVA Standard',
          rate: 20,
          description: 'Taux normal de TVA',
          isDefault: true,
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'TVA Réduite',
          rate: 10,
          description: 'Taux réduit de TVA',
          isDefault: false,
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          name: 'TVA Super Réduite',
          rate: 5.5,
          description: 'Taux super réduit de TVA',
          isDefault: false,
          createdAt: new Date().toISOString()
        }
      ]
      setVatRates(defaultRates)
      localStorage.setItem('vat-rates', JSON.stringify(defaultRates))
    }
  }

  const saveVATRates = (rates: VATRate[]) => {
    localStorage.setItem('vat-rates', JSON.stringify(rates))
    setVatRates(rates)
  }

  const handleAddRate = () => {
    if (!newRate.name || !newRate.rate) return

    const rate: VATRate = {
      id: Date.now().toString(),
      name: newRate.name,
      rate: parseFloat(newRate.rate),
      description: newRate.description,
      isDefault: false,
      createdAt: new Date().toISOString()
    }

    saveVATRates([...vatRates, rate])
    setNewRate({ name: "", rate: "", description: "" })
    setShowAddDialog(false)
  }

  const handleEditRate = () => {
    if (!editingRate) return

    const updatedRates = vatRates.map(rate =>
      rate.id === editingRate.id ? editingRate : rate
    )
    saveVATRates(updatedRates)
    setEditingRate(null)
    setShowEditDialog(false)
  }

  const handleDeleteRate = (id: string) => {
    const rate = vatRates.find(r => r.id === id)
    if (rate?.isDefault) return // Ne pas supprimer les taux par défaut

    const updatedRates = vatRates.filter(rate => rate.id !== id)
    saveVATRates(updatedRates)
  }

  const handleSetDefault = (id: string) => {
    const updatedRates = vatRates.map(rate => ({
      ...rate,
      isDefault: rate.id === id
    }))
    saveVATRates(updatedRates)
  }

  const generateFiscalReport = async () => {
    setIsGeneratingReport(true)
    
    try {
      const startDate = new Date(parseInt(reportYear), parseInt(reportMonth) - 1, 1)
      const endDate = new Date(parseInt(reportYear), parseInt(reportMonth), 0)
      
      const report = await fiscalManager.generateFiscalReport(startDate, endDate)
      setLastReport(report)
    } catch (error) {
      console.error('Erreur génération rapport:', error)
    } finally {
      setIsGeneratingReport(false)
    }
  }

  const exportReport = (format: 'csv' | 'pdf') => {
    if (!lastReport) return
    
    if (format === 'csv') {
      fiscalManager.exportToCSV(lastReport, `rapport-fiscal-${reportYear}-${reportMonth}`)
    } else {
      fiscalManager.exportToPDF(lastReport, `rapport-fiscal-${reportYear}-${reportMonth}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate("tpe-settings")}
              className="hover:bg-white/20"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Gestion TVA
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Configuration des taux de TVA et rapports fiscaux
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="rates" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="rates" className="flex items-center space-x-2">
              <Calculator className="h-4 w-4" />
              <span>Taux de TVA</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Rapports Fiscaux</span>
            </TabsTrigger>
          </TabsList>

          {/* Onglet Taux de TVA */}
          <TabsContent value="rates" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Taux de TVA configurés</CardTitle>
                    <CardDescription>
                      Gérez les différents taux de TVA applicables
                    </CardDescription>
                  </div>
                  <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter un taux
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Ajouter un taux de TVA</DialogTitle>
                        <DialogDescription>
                          Créez un nouveau taux de TVA personnalisé
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">Nom du taux</Label>
                          <Input
                            id="name"
                            value={newRate.name}
                            onChange={(e) => setNewRate({ ...newRate, name: e.target.value })}
                            placeholder="Ex: TVA Restauration"
                          />
                        </div>
                        <div>
                          <Label htmlFor="rate">Taux (%)</Label>
                          <Input
                            id="rate"
                            type="number"
                            step="0.1"
                            value={newRate.rate}
                            onChange={(e) => setNewRate({ ...newRate, rate: e.target.value })}
                            placeholder="Ex: 10"
                          />
                        </div>
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Input
                            id="description"
                            value={newRate.description}
                            onChange={(e) => setNewRate({ ...newRate, description: e.target.value })}
                            placeholder="Description du taux"
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                            Annuler
                          </Button>
                          <Button onClick={handleAddRate}>
                            Ajouter
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Taux</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vatRates.map((rate) => (
                      <TableRow key={rate.id}>
                        <TableCell className="font-medium">{rate.name}</TableCell>
                        <TableCell>{rate.rate}%</TableCell>
                        <TableCell>{rate.description}</TableCell>
                        <TableCell>
                          {rate.isDefault && (
                            <Badge variant="default">Par défaut</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingRate(rate)
                                setShowEditDialog(true)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            {!rate.isDefault && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleSetDefault(rate.id)}
                                >
                                  Définir par défaut
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteRate(rate.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Rapports Fiscaux */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Configuration du rapport */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Générer un rapport fiscal</span>
                  </CardTitle>
                  <CardDescription>
                    Sélectionnez la période pour générer votre déclaration fiscale
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="period">Période</Label>
                    <Select value={reportPeriod} onValueChange={setReportPeriod}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="month">Mensuel</SelectItem>
                        <SelectItem value="quarter">Trimestriel</SelectItem>
                        <SelectItem value="year">Annuel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="year">Année</Label>
                      <Select value={reportYear} onValueChange={setReportYear}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 5 }, (_, i) => {
                            const year = new Date().getFullYear() - i
                            return (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                    </div>

                    {reportPeriod === "month" && (
                      <div>
                        <Label htmlFor="month">Mois</Label>
                        <Select value={reportMonth} onValueChange={setReportMonth}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => (
                              <SelectItem key={i + 1} value={(i + 1).toString()}>
                                {new Date(0, i).toLocaleString('fr-FR', { month: 'long' })}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={generateFiscalReport}
                    disabled={isGeneratingReport}
                    className="w-full"
                  >
                    {isGeneratingReport ? (
                      "Génération en cours..."
                    ) : (
                      <>
                        <FileText className="h-4 w-4 mr-2" />
                        Générer le rapport
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Résumé du dernier rapport */}
              {lastReport && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5" />
                      <span>Résumé fiscal</span>
                    </CardTitle>
                    <CardDescription>
                      Période : {lastReport.period.start} - {lastReport.period.end}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                        <p className="text-sm text-green-600 dark:text-green-400">Chiffre d'affaires HT</p>
                        <p className="text-lg font-semibold text-green-700 dark:text-green-300">
                          {lastReport.summary.totalRevenue.toFixed(2)} €
                        </p>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        <p className="text-sm text-blue-600 dark:text-blue-400">TVA collectée</p>
                        <p className="text-lg font-semibold text-blue-700 dark:text-blue-300">
                          {lastReport.summary.totalVAT.toFixed(2)} €
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Répartition par taux de TVA</h4>
                      {lastReport.vatBreakdown.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <span>TVA {item.rate}%</span>
                          <span className="font-medium">{item.amount.toFixed(2)} €</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => exportReport('csv')}
                        className="flex-1"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export CSV
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => exportReport('pdf')}
                        className="flex-1"
                      >
                        <Receipt className="h-4 w-4 mr-2" />
                        Export PDF
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Tableau des transactions récentes */}
            {lastReport && lastReport.transactions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Détail des transactions</CardTitle>
                  <CardDescription>
                    Liste des transactions incluses dans le rapport
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Montant HT</TableHead>
                        <TableHead>Taux TVA</TableHead>
                        <TableHead>TVA</TableHead>
                        <TableHead>Total TTC</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lastReport.transactions.slice(0, 10).map((transaction: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{new Date(transaction.date).toLocaleDateString('fr-FR')}</TableCell>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell>{transaction.amountExcludingVAT.toFixed(2)} €</TableCell>
                          <TableCell>{transaction.vatRate}%</TableCell>
                          <TableCell>{transaction.vatAmount.toFixed(2)} €</TableCell>
                          <TableCell>{transaction.totalAmount.toFixed(2)} €</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {lastReport.transactions.length > 10 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      ... et {lastReport.transactions.length - 10} autres transactions
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Modal d'édition */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier le taux de TVA</DialogTitle>
              <DialogDescription>
                Modifiez les informations du taux de TVA
              </DialogDescription>
            </DialogHeader>
            {editingRate && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Nom du taux</Label>
                  <Input
                    id="edit-name"
                    value={editingRate.name}
                    onChange={(e) => setEditingRate({ ...editingRate, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-rate">Taux (%)</Label>
                  <Input
                    id="edit-rate"
                    type="number"
                    step="0.1"
                    value={editingRate.rate}
                    onChange={(e) => setEditingRate({ ...editingRate, rate: parseFloat(e.target.value) })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-description">Description</Label>
                  <Input
                    id="edit-description"
                    value={editingRate.description}
                    onChange={(e) => setEditingRate({ ...editingRate, description: e.target.value })}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleEditRate}>
                    Sauvegarder
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default TPEVatManagement
