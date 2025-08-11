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
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { 
  ArrowLeft, Plus, Edit, Trash2, FileText, Download, Calendar, Calculator, 
  Receipt, TrendingUp, PieChart, BarChart3, AlertTriangle, CheckCircle, 
  Settings, Database, Shield, RefreshCw, Eye, Clock, DollarSign,
  Target, Zap, Filter, Search, Upload, ExternalLink, Bell, Save
} from 'lucide-react'
import { FiscalReportManager } from "@/lib/fiscal-reports"

interface VATRate {
  id: string
  name: string
  rate: number
  description: string
  isDefault: boolean
  createdAt: string
  country?: string
  category?: string
  validFrom?: string
  validTo?: string
}

interface VATCalculation {
  amount: number
  vatRate: number
  vatAmount: number
  totalAmount: number
  amountExcludingVAT: number
}

interface ComplianceCheck {
  id: string
  type: 'rate_validation' | 'threshold_check' | 'declaration_due' | 'audit_trail'
  status: 'passed' | 'warning' | 'failed'
  message: string
  timestamp: string
  severity: 'low' | 'medium' | 'high'
}

interface VATSettings {
  defaultCountry: string
  companyVATNumber: string
  declarationFrequency: 'monthly' | 'quarterly' | 'yearly'
  thresholds: {
    smallBusiness: number
    standardRate: number
  }
  notifications: {
    declarationReminder: boolean
    complianceAlerts: boolean
    rateChanges: boolean
  }
}

interface TPEVatManagementProps {
  onNavigate: (page: string) => void
}

export function TPEVatManagement({ onNavigate }: TPEVatManagementProps) {
  // États existants
  const [vatRates, setVatRates] = useState<VATRate[]>([])
  const [newRate, setNewRate] = useState({ name: "", rate: "", description: "", country: "", category: "" })
  const [editingRate, setEditingRate] = useState<VATRate | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [reportPeriod, setReportPeriod] = useState("month")
  const [reportYear, setReportYear] = useState(new Date().getFullYear().toString())
  const [reportMonth, setReportMonth] = useState((new Date().getMonth() + 1).toString())
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [lastReport, setLastReport] = useState<any>(null)

  // Nouveaux états pour fonctionnalités avancées
  const [activeTab, setActiveTab] = useState("dashboard")
  const [vatCalculation, setVatCalculation] = useState<VATCalculation>({
    amount: 0,
    vatRate: 20,
    vatAmount: 0,
    totalAmount: 0,
    amountExcludingVAT: 0
  })
  const [complianceChecks, setComplianceChecks] = useState<ComplianceCheck[]>([])
  const [vatSettings, setVatSettings] = useState<VATSettings>({
    defaultCountry: 'FR',
    companyVATNumber: '',
    declarationFrequency: 'monthly',
    thresholds: {
      smallBusiness: 85800,
      standardRate: 20
    },
    notifications: {
      declarationReminder: true,
      complianceAlerts: true,
      rateChanges: true
    }
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [showSettingsDialog, setShowSettingsDialog] = useState(false)
  const [showCalculatorDialog, setShowCalculatorDialog] = useState(false)
  const [showComplianceDialog, setShowComplianceDialog] = useState(false)
  const [isRunningCompliance, setIsRunningCompliance] = useState(false)
  const [dashboardStats, setDashboardStats] = useState({
    totalVATCollected: 0,
    totalTransactions: 0,
    averageVATRate: 0,
    complianceScore: 0,
    nextDeclarationDue: '',
    pendingIssues: 0
  })

  const fiscalManager = FiscalReportManager.getInstance()

  useEffect(() => {
    loadVATRates()
    loadVATSettings()
    calculateDashboardStats()
    runInitialComplianceCheck()
  }, [])

  useEffect(() => {
    calculateVAT()
  }, [vatCalculation.amount, vatCalculation.vatRate])

  const loadVATRates = () => {
    const saved = localStorage.getItem('vat-rates')
    if (saved) {
      setVatRates(JSON.parse(saved))
    } else {
      // Taux par défaut enrichis
      const defaultRates: VATRate[] = [
        {
          id: '1',
          name: 'TVA Standard',
          rate: 20,
          description: 'Taux normal de TVA',
          isDefault: true,
          createdAt: new Date().toISOString(),
          country: 'FR',
          category: 'standard'
        },
        {
          id: '2',
          name: 'TVA Réduite',
          rate: 10,
          description: 'Taux réduit de TVA',
          isDefault: false,
          createdAt: new Date().toISOString(),
          country: 'FR',
          category: 'reduced'
        },
        {
          id: '3',
          name: 'TVA Super Réduite',
          rate: 5.5,
          description: 'Taux super réduit de TVA',
          isDefault: false,
          createdAt: new Date().toISOString(),
          country: 'FR',
          category: 'super_reduced'
        },
        {
          id: '4',
          name: 'TVA Restauration',
          rate: 10,
          description: 'Taux applicable à la restauration',
          isDefault: false,
          createdAt: new Date().toISOString(),
          country: 'FR',
          category: 'hospitality'
        }
      ]
      setVatRates(defaultRates)
      localStorage.setItem('vat-rates', JSON.stringify(defaultRates))
    }
  }

  const loadVATSettings = () => {
    const saved = localStorage.getItem('vat-settings')
    if (saved) {
      setVatSettings(JSON.parse(saved))
    }
  }

  const saveVATSettings = (settings: VATSettings) => {
    localStorage.setItem('vat-settings', JSON.stringify(settings))
    setVatSettings(settings)
  }

  const calculateDashboardStats = () => {
    // Simulation de calculs de statistiques
    const mockStats = {
      totalVATCollected: 15420.50,
      totalTransactions: 234,
      averageVATRate: 18.7,
      complianceScore: 92,
      nextDeclarationDue: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR'),
      pendingIssues: 2
    }
    setDashboardStats(mockStats)
  }

  const calculateVAT = () => {
    const amount = vatCalculation.amount
    const rate = vatCalculation.vatRate / 100
    
    const amountExcludingVAT = amount / (1 + rate)
    const vatAmount = amount - amountExcludingVAT
    const totalAmount = amount
    
    setVatCalculation(prev => ({
      ...prev,
      vatAmount,
      totalAmount,
      amountExcludingVAT
    }))
  }

  const runInitialComplianceCheck = () => {
    const checks: ComplianceCheck[] = [
      {
        id: '1',
        type: 'rate_validation',
        status: 'passed',
        message: 'Tous les taux de TVA sont conformes',
        timestamp: new Date().toISOString(),
        severity: 'low'
      },
      {
        id: '2',
        type: 'declaration_due',
        status: 'warning',
        message: 'Déclaration TVA due dans 15 jours',
        timestamp: new Date().toISOString(),
        severity: 'medium'
      },
      {
        id: '3',
        type: 'threshold_check',
        status: 'failed',
        message: 'Seuil de franchise dépassé - Inscription TVA requise',
        timestamp: new Date().toISOString(),
        severity: 'high'
      }
    ]
    setComplianceChecks(checks)
  }

  const runComplianceCheck = async () => {
    setIsRunningCompliance(true)
    
    // Simulation d'une vérification complète
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const newChecks: ComplianceCheck[] = [
      ...complianceChecks,
      {
        id: Date.now().toString(),
        type: 'audit_trail',
        status: 'passed',
        message: 'Audit trail complet et conforme',
        timestamp: new Date().toISOString(),
        severity: 'low'
      }
    ]
    
    setComplianceChecks(newChecks)
    setIsRunningCompliance(false)
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
      createdAt: new Date().toISOString(),
      country: newRate.country || 'FR',
      category: newRate.category || 'custom'
    }

    saveVATRates([...vatRates, rate])
    setNewRate({ name: "", rate: "", description: "", country: "", category: "" })
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

  // Filtrer les taux selon les critères de recherche
  const filteredRates = vatRates.filter(rate => {
    const matchesSearch = rate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rate.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || rate.category === filterCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto p-6">
        {/* Header Premium */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate("tpe-settings")}
              className="hover:bg-white/20 rounded-xl"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Centre de Gestion TVA
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Gestion complète, conformité et rapports fiscaux avancés
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant={dashboardStats.complianceScore > 90 ? "default" : "destructive"} className="px-3 py-1">
              <Shield className="h-4 w-4 mr-1" />
              Conformité {dashboardStats.complianceScore}%
            </Badge>
            <Button
              onClick={() => setShowSettingsDialog(true)}
              variant="outline"
              className="rounded-xl"
            >
              <Settings className="h-4 w-4 mr-2" />
              Paramètres
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl p-1">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2 rounded-xl">
              <PieChart className="h-4 w-4" />
              <span>Tableau de bord</span>
            </TabsTrigger>
            <TabsTrigger value="rates" className="flex items-center space-x-2 rounded-xl">
              <Calculator className="h-4 w-4" />
              <span>Taux TVA</span>
            </TabsTrigger>
            <TabsTrigger value="calculator" className="flex items-center space-x-2 rounded-xl">
              <DollarSign className="h-4 w-4" />
              <span>Calculateur</span>
            </TabsTrigger>
            <TabsTrigger value="compliance" className="flex items-center space-x-2 rounded-xl">
              <Shield className="h-4 w-4" />
              <span>Conformité</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center space-x-2 rounded-xl">
              <FileText className="h-4 w-4" />
              <span>Rapports</span>
            </TabsTrigger>
            <TabsTrigger value="audit" className="flex items-center space-x-2 rounded-xl">
              <Eye className="h-4 w-4" />
              <span>Audit</span>
            </TabsTrigger>
          </TabsList>

          {/* Onglet Tableau de bord */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Statistiques principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium">TVA Collectée</p>
                      <p className="text-2xl font-bold">{dashboardStats.totalVATCollected.toFixed(2)} €</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-200" />
                  </div>
                  <div className="mt-4">
                    <Progress value={75} className="bg-green-400" />
                    <p className="text-xs text-green-100 mt-1">+12% ce mois</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Transactions</p>
                      <p className="text-2xl font-bold">{dashboardStats.totalTransactions}</p>
                    </div>
                    <Receipt className="h-8 w-8 text-blue-200" />
                  </div>
                  <div className="mt-4">
                    <Progress value={60} className="bg-blue-400" />
                    <p className="text-xs text-blue-100 mt-1">+8% ce mois</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm font-medium">Taux Moyen</p>
                      <p className="text-2xl font-bold">{dashboardStats.averageVATRate.toFixed(1)}%</p>
                    </div>
                    <Target className="h-8 w-8 text-purple-200" />
                  </div>
                  <div className="mt-4">
                    <Progress value={dashboardStats.averageVATRate} className="bg-purple-400" />
                    <p className="text-xs text-purple-100 mt-1">Stable</p>
                  </div>
                </CardContent>
              </Card>

              <Card className={`bg-gradient-to-br ${dashboardStats.complianceScore > 90 ? 'from-emerald-500 to-emerald-600' : 'from-amber-500 to-amber-600'} text-white border-0`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-emerald-100 text-sm font-medium">Conformité</p>
                      <p className="text-2xl font-bold">{dashboardStats.complianceScore}%</p>
                    </div>
                    <Shield className="h-8 w-8 text-emerald-200" />
                  </div>
                  <div className="mt-4">
                    <Progress value={dashboardStats.complianceScore} className="bg-emerald-400" />
                    <p className="text-xs text-emerald-100 mt-1">{dashboardStats.pendingIssues} problèmes</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Alertes et notifications */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="h-5 w-5 text-amber-500" />
                    <span>Alertes Importantes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert className="border-amber-200 bg-amber-50">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <AlertTitle>Déclaration TVA Due</AlertTitle>
                    <AlertDescription>
                      Votre déclaration TVA est due le {dashboardStats.nextDeclarationDue}
                    </AlertDescription>
                  </Alert>
                  
                  {dashboardStats.pendingIssues > 0 && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <AlertTitle>Problèmes de Conformité</AlertTitle>
                      <AlertDescription>
                        {dashboardStats.pendingIssues} problème(s) nécessitent votre attention
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-blue-500" />
                    <span>Actions Rapides</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={() => setActiveTab("calculator")}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculateur TVA
                  </Button>
                  <Button
                    onClick={() => setActiveTab("compliance")}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Vérification Conformité
                  </Button>
                  <Button
                    onClick={() => setActiveTab("reports")}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Générer Rapport
                  </Button>
                  <Button
                    onClick={() => setShowSettingsDialog(true)}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Configuration
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Onglet Taux de TVA */}
          <TabsContent value="rates" className="space-y-6">
            {/* Barre d'outils */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between space-x-4">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Rechercher un taux..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                      <SelectTrigger className="w-48">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Filtrer par catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les catégories</SelectItem>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="reduced">Réduit</SelectItem>
                        <SelectItem value="super_reduced">Super réduit</SelectItem>
                        <SelectItem value="hospitality">Restauration</SelectItem>
                        <SelectItem value="custom">Personnalisé</SelectItem>
                      </SelectContent>
                    </Select>
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
                        <div className="grid grid-cols-2 gap-4">
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
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="country">Pays</Label>
                            <Select value={newRate.country} onValueChange={(value) => setNewRate({ ...newRate, country: value })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un pays" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="FR">France</SelectItem>
                                <SelectItem value="DE">Allemagne</SelectItem>
                                <SelectItem value="IT">Italie</SelectItem>
                                <SelectItem value="ES">Espagne</SelectItem>
                                <SelectItem value="BE">Belgique</SelectItem>
                                <SelectItem value="CH">Suisse</SelectItem>
                                <SelectItem value="XK">Kosovo</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="category">Catégorie</Label>
                            <Select value={newRate.category} onValueChange={(value) => setNewRate({ ...newRate, category: value })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner une catégorie" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="standard">Standard</SelectItem>
                                <SelectItem value="reduced">Réduit</SelectItem>
                                <SelectItem value="super_reduced">Super réduit</SelectItem>
                                <SelectItem value="hospitality">Restauration</SelectItem>
                                <SelectItem value="custom">Personnalisé</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={newRate.description}
                            onChange={(e) => setNewRate({ ...newRate, description: e.target.value })}
                            placeholder="Description détaillée du taux"
                            rows={3}
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
              </CardContent>
            </Card>

            {/* Tableau des taux amélioré */}
            <Card>
              <CardHeader>
                <CardTitle>Taux de TVA configurés ({filteredRates.length})</CardTitle>
                <CardDescription>
                  Gérez les différents taux de TVA applicables à votre activité
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredRates.length === 0 ? (
                  <div className="text-center py-8">
                    <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Aucun taux trouvé avec ces critères</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Taux</TableHead>
                        <TableHead>Catégorie</TableHead>
                        <TableHead>Pays</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRates.map((rate) => (
                        <TableRow key={rate.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <TableCell className="font-medium">{rate.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-mono">
                              {rate.rate}%
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="capitalize">
                              {rate.category?.replace('_', ' ') || 'Non défini'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-gray-600">
                              {rate.country || 'Non défini'}
                            </span>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {rate.description}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {rate.isDefault && (
                                <Badge variant="default">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Par défaut
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingRate(rate)
                                  setShowEditDialog(true)
                                }}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              {!rate.isDefault && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleSetDefault(rate.id)}
                                    className="h-8 px-2 text-xs"
                                  >
                                    Défaut
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteRate(rate.id)}
                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
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
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Calculateur TVA */}
          <TabsContent value="calculator" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calculator className="h-5 w-5 text-blue-500" />
                    <span>Calculateur TVA Avancé</span>
                  </CardTitle>
                  <CardDescription>
                    Calculez automatiquement la TVA avec différents taux et devises
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="calc-amount">Montant</Label>
                    <Input
                      id="calc-amount"
                      type="number"
                      step="0.01"
                      value={vatCalculation.amount}
                      onChange={(e) => setVatCalculation(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                      placeholder="0.00"
                      className="text-lg font-mono"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="calc-rate">Taux de TVA</Label>
                    <Select 
                      value={vatCalculation.vatRate.toString()} 
                      onValueChange={(value) => setVatCalculation(prev => ({ ...prev, vatRate: parseFloat(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {vatRates.map(rate => (
                          <SelectItem key={rate.id} value={rate.rate.toString()}>
                            {rate.name} - {rate.rate}%
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setVatCalculation(prev => ({ ...prev, amount: 0, vatAmount: 0, totalAmount: 0, amountExcludingVAT: 0 }))}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                    <Button onClick={calculateVAT}>
                      <Zap className="h-4 w-4 mr-2" />
                      Calculer
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Receipt className="h-5 w-5 text-green-500" />
                    <span>Résultats du Calcul</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Montant HT</p>
                      <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                        {vatCalculation.amountExcludingVAT.toFixed(2)} €
                      </p>
                    </div>
                    
                    <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
                      <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">TVA ({vatCalculation.vatRate}%)</p>
                      <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                        {vatCalculation.vatAmount.toFixed(2)} €
                      </p>
                    </div>
                    
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <p className="text-sm text-green-600 dark:text-green-400 font-medium">Total TTC</p>
                      <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                        {vatCalculation.totalAmount.toFixed(2)} €
                      </p>
                    </div>
                  </div>

                  <Separator />
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Détail du calcul</h4>
                    <div className="text-sm space-y-1 font-mono bg-gray-50 dark:bg-gray-800 p-3 rounded">
                      <div className="flex justify-between">
                        <span>Base HT:</span>
                        <span>{vatCalculation.amountExcludingVAT.toFixed(2)} €</span>
                      </div>
                      <div className="flex justify-between">
                        <span>TVA {vatCalculation.vatRate}%:</span>
                        <span>{vatCalculation.vatAmount.toFixed(2)} €</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold">
                        <span>Total TTC:</span>
                        <span>{vatCalculation.totalAmount.toFixed(2)} €</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Onglet Conformité */}
          <TabsContent value="compliance" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="h-5 w-5 text-blue-500" />
                      <span>Vérification de Conformité</span>
                    </CardTitle>
                    <CardDescription>
                      Vérifiez automatiquement la conformité de votre configuration TVA
                    </CardDescription>
                  </div>
                  <Button 
                    onClick={runComplianceCheck}
                    disabled={isRunningCompliance}
                    className="flex items-center space-x-2"
                  >
                    <RefreshCw className={`h-4 w-4 ${isRunningCompliance ? 'animate-spin' : ''}`} />
                    <span>{isRunningCompliance ? 'Vérification...' : 'Lancer Vérification'}</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {complianceChecks.map((check) => (
                    <Alert 
                      key={check.id} 
                      className={`${
                        check.status === 'passed' ? 'border-green-200 bg-green-50' :
                        check.status === 'warning' ? 'border-amber-200 bg-amber-50' :
                        'border-red-200 bg-red-50'
                      }`}
                    >
                      {check.status === 'passed' ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : check.status === 'warning' ? (
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                      )}
                      <AlertTitle className="capitalize">{check.type.replace('_', ' ')}</AlertTitle>
                      <AlertDescription>
                        {check.message}
                        <span className="block text-xs text-gray-500 mt-1">
                          {new Date(check.timestamp).toLocaleString('fr-FR')}
                        </span>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
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
          {/* Onglet Audit */}
          <TabsContent value="audit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-5 w-5 text-purple-500" />
                  <span>Journal d'Audit</span>
                </CardTitle>
                <CardDescription>
                  Traçabilité complète des opérations et modifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Activité Récente</h4>
                      <Badge variant="outline">{new Date().toLocaleDateString('fr-FR')}</Badge>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-2 bg-white dark:bg-gray-700 rounded">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Taux TVA modifié</p>
                          <p className="text-xs text-gray-500">TVA Restauration: 10% → 10.5%</p>
                        </div>
                        <span className="text-xs text-gray-400">{new Date().toLocaleTimeString('fr-FR')}</span>
                      </div>
                      <div className="flex items-center space-x-3 p-2 bg-white dark:bg-gray-700 rounded">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Rapport fiscal généré</p>
                          <p className="text-xs text-gray-500">Période: Janvier 2024</p>
                        </div>
                        <span className="text-xs text-gray-400">14:32</span>
                      </div>
                      <div className="flex items-center space-x-3 p-2 bg-white dark:bg-gray-700 rounded">
                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Vérification conformité</p>
                          <p className="text-xs text-gray-500">Score: 92% - 2 alertes</p>
                        </div>
                        <span className="text-xs text-gray-400">14:15</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-blue-100 text-sm">Opérations</p>
                            <p className="text-2xl font-bold">1,247</p>
                          </div>
                          <Database className="h-8 w-8 text-blue-200" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-green-100 text-sm">Intégrité</p>
                            <p className="text-2xl font-bold">100%</p>
                          </div>
                          <Shield className="h-8 w-8 text-green-200" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-purple-100 text-sm">Rétention</p>
                            <p className="text-2xl font-bold">7 ans</p>
                          </div>
                          <Clock className="h-8 w-8 text-purple-200" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modal de Configuration */}
        <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Configuration TVA</span>
              </DialogTitle>
              <DialogDescription>
                Configurez les paramètres globaux de gestion TVA
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company-vat">Numéro TVA Entreprise</Label>
                  <Input
                    id="company-vat"
                    value={vatSettings.companyVATNumber}
                    onChange={(e) => setVatSettings(prev => ({ ...prev, companyVATNumber: e.target.value }))}
                    placeholder="FR12345678901"
                  />
                </div>
                <div>
                  <Label htmlFor="default-country">Pays par défaut</Label>
                  <Select 
                    value={vatSettings.defaultCountry} 
                    onValueChange={(value) => setVatSettings(prev => ({ ...prev, defaultCountry: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FR">France</SelectItem>
                      <SelectItem value="DE">Allemagne</SelectItem>
                      <SelectItem value="IT">Italie</SelectItem>
                      <SelectItem value="ES">Espagne</SelectItem>
                      <SelectItem value="BE">Belgique</SelectItem>
                      <SelectItem value="CH">Suisse</SelectItem>
                      <SelectItem value="XK">Kosovo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="declaration-frequency">Fréquence des déclarations</Label>
                <Select 
                  value={vatSettings.declarationFrequency} 
                  onValueChange={(value: 'monthly' | 'quarterly' | 'yearly') => 
                    setVatSettings(prev => ({ ...prev, declarationFrequency: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Mensuelle</SelectItem>
                    <SelectItem value="quarterly">Trimestrielle</SelectItem>
                    <SelectItem value="yearly">Annuelle</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Rappels de déclaration</p>
                      <p className="text-sm text-gray-500">Recevoir des alertes avant les échéances</p>
                    </div>
                    <Switch
                      checked={vatSettings.notifications.declarationReminder}
                      onCheckedChange={(checked) => 
                        setVatSettings(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, declarationReminder: checked }
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Alertes de conformité</p>
                      <p className="text-sm text-gray-500">Notifications en cas de problème</p>
                    </div>
                    <Switch
                      checked={vatSettings.notifications.complianceAlerts}
                      onCheckedChange={(checked) => 
                        setVatSettings(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, complianceAlerts: checked }
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Changements de taux</p>
                      <p className="text-sm text-gray-500">Alertes lors de modifications réglementaires</p>
                    </div>
                    <Switch
                      checked={vatSettings.notifications.rateChanges}
                      onCheckedChange={(checked) => 
                        setVatSettings(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, rateChanges: checked }
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowSettingsDialog(false)}>
                  Annuler
                </Button>
                <Button onClick={() => {
                  saveVATSettings(vatSettings)
                  setShowSettingsDialog(false)
                }}>
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

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
