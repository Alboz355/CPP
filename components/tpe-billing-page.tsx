"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { 
  ArrowLeft, Plus, FileText, Euro, Percent, Search, Filter, Download, 
  Send, Eye, Edit, Trash2, Copy, Settings, Users, BarChart3, 
  Calendar, Clock, CheckCircle, AlertTriangle, Mail, Printer,
  Save, RefreshCw, ExternalLink, Target, Zap, Receipt, DollarSign, Upload
} from "lucide-react"
import type { AppState } from "@/app/page"

interface BillingPageProps {
  onNavigate: (page: AppState) => void
}

interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  vatRate: number
  discount: number
}

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  vatNumber?: string
  company?: string
  createdAt: string
}

interface Invoice {
  id: string
  number: string
  date: string
  dueDate: string
  customer: Customer
  items: InvoiceItem[]
  subtotal: number
  vatAmount: number
  discountAmount: number
  total: number
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  notes: string
  paymentMethod?: string
  paidAt?: string
  createdAt: string
}

interface BillingStats {
  totalInvoices: number
  totalRevenue: number
  pendingAmount: number
  overdueAmount: number
  averageInvoiceValue: number
  paymentRate: number
}

export function TPEBillingPage({ onNavigate }: BillingPageProps) {
  // États principaux
  const [activeTab, setActiveTab] = useState("dashboard")
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [billingStats, setBillingStats] = useState<BillingStats>({
    totalInvoices: 0,
    totalRevenue: 0,
    pendingAmount: 0,
    overdueAmount: 0,
    averageInvoiceValue: 0,
    paymentRate: 0
  })

  // États pour la création de facture
  const [invoiceData, setInvoiceData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
    customerCompany: "",
    customerVatNumber: "",
    items: [{ id: crypto.randomUUID(), description: "", quantity: 1, unitPrice: 0, vatRate: 20, discount: 0 }] as InvoiceItem[],
    notes: "",
    dueDate: "",
    paymentTerms: 30
  })

  // États pour la gestion
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showCustomerDialog, setShowCustomerDialog] = useState(false)
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [showPreviewDialog, setShowPreviewDialog] = useState(false)

  // États pour les clients
  const [customerSearchTerm, setCustomerSearchTerm] = useState("")
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [showEditCustomerDialog, setShowEditCustomerDialog] = useState(false)
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    company: "",
    vatNumber: ""
  })

  // États pour les analyses
  const [analyticsDateRange, setAnalyticsDateRange] = useState("30")
  const [analyticsData, setAnalyticsData] = useState({
    monthlyRevenue: [] as Array<{month: string, revenue: number, invoices: number}>,
    topCustomers: [] as Array<{customer: string, total: number, invoices: number}>,
    revenueByStatus: [] as Array<{status: string, amount: number, percentage: number}>
  })

  // États pour les paramètres
  const [billingSettings, setBillingSettings] = useState({
    companyName: "Crypto Store Lausanne",
    companyAddress: "123 Rue du Commerce, 1000 Lausanne",
    companyPhone: "+41 21 123 45 67",
    companyEmail: "contact@cryptostore.ch",
    companyVAT: "CHE-123.456.789",
    invoicePrefix: "FAC",
    defaultPaymentTerms: 30,
    defaultVATRate: 7.7,
    currency: "CHF",
    language: "fr",
    logoUrl: "",
    footerText: "Merci pour votre confiance",
    bankDetails: {
      iban: "CH93 0076 2011 6238 5295 7",
      bank: "UBS Switzerland AG",
      swift: "UBSWCHZH80A"
    }
  })
  const [showSettingsDialog, setShowSettingsDialog] = useState(false)

  useEffect(() => {
    loadBillingData()
    calculateStats()
    loadBillingSettings()
    generateAnalyticsData()
  }, [])

  useEffect(() => {
    generateAnalyticsData()
  }, [invoices, analyticsDateRange])

  const loadBillingData = () => {
    const savedInvoices = JSON.parse(localStorage.getItem('tpe-invoices') || '[]')
    const savedCustomers = JSON.parse(localStorage.getItem('tpe-customers') || '[]')
    
    setInvoices(savedInvoices)
    setCustomers(savedCustomers)
    
    // Ajouter des données de démonstration si vide
    if (savedInvoices.length === 0) {
      const demoInvoices = generateDemoInvoices()
      setInvoices(demoInvoices)
      localStorage.setItem('tpe-invoices', JSON.stringify(demoInvoices))
    }
    
    if (savedCustomers.length === 0) {
      const demoCustomers = generateDemoCustomers()
      setCustomers(demoCustomers)
      localStorage.setItem('tpe-customers', JSON.stringify(demoCustomers))
    }
  }

  const generateDemoInvoices = (): Invoice[] => {
    return [
      {
        id: '1',
        number: 'FAC-2024-001',
        date: new Date().toISOString(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        customer: {
          id: '1',
          name: 'Jean Dupont',
          email: 'jean.dupont@email.com',
          phone: '+33 6 12 34 56 78',
          address: '123 Rue de la Paix, 75001 Paris',
          company: 'Entreprise Dupont',
          createdAt: new Date().toISOString()
        },
        items: [
          {
            id: '1',
            description: 'Consultation crypto',
            quantity: 2,
            unitPrice: 150,
            vatRate: 20,
            discount: 0
          }
        ],
        subtotal: 300,
        vatAmount: 60,
        discountAmount: 0,
        total: 360,
        status: 'sent',
        notes: 'Merci pour votre confiance',
        createdAt: new Date().toISOString()
      }
    ]
  }

  const generateDemoCustomers = (): Customer[] => {
    return [
      {
        id: '1',
        name: 'Jean Dupont',
        email: 'jean.dupont@email.com',
        phone: '+33 6 12 34 56 78',
        address: '123 Rue de la Paix, 75001 Paris',
        company: 'Entreprise Dupont',
        vatNumber: 'FR12345678901',
        createdAt: new Date().toISOString()
      }
    ]
  }

  const calculateStats = () => {
    // Simulation des statistiques
    setBillingStats({
      totalInvoices: 45,
      totalRevenue: 12750.80,
      pendingAmount: 3240.50,
      overdueAmount: 890.00,
      averageInvoiceValue: 283.35,
      paymentRate: 87.5
    })
  }

  const addItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [...invoiceData.items, { 
        id: crypto.randomUUID(), 
        description: "", 
        quantity: 1, 
        unitPrice: 0, 
        vatRate: 20, 
        discount: 0 
      }]
    })
  }

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...invoiceData.items]
    newItems[index] = { ...newItems[index], [field]: value }
    setInvoiceData({ ...invoiceData, items: newItems })
  }

  const removeItem = (index: number) => {
    if (invoiceData.items.length > 1) {
      const newItems = invoiceData.items.filter((_, i) => i !== index)
      setInvoiceData({ ...invoiceData, items: newItems })
    }
  }

  const calculateSubtotal = () => {
    return invoiceData.items.reduce((sum, item) => {
      const itemSubtotal = item.quantity * item.unitPrice
      const discountAmount = (itemSubtotal * item.discount) / 100
      return sum + (itemSubtotal - discountAmount)
    }, 0)
  }

  const calculateVATTotal = () => {
    return invoiceData.items.reduce((sum, item) => {
      const itemSubtotal = item.quantity * item.unitPrice
      const discountAmount = (itemSubtotal * item.discount) / 100
      const discountedAmount = itemSubtotal - discountAmount
      return sum + (discountedAmount * item.vatRate) / 100
    }, 0)
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateVATTotal()
  }

  const generateInvoiceNumber = () => {
    const year = new Date().getFullYear()
    const count = invoices.length + 1
    return `FAC-${year}-${count.toString().padStart(3, '0')}`
  }

  const createInvoice = () => {
    const invoice: Invoice = {
      id: crypto.randomUUID(),
      number: generateInvoiceNumber(),
      date: new Date().toISOString(),
      dueDate: new Date(Date.now() + invoiceData.paymentTerms * 24 * 60 * 60 * 1000).toISOString(),
      customer: {
        id: crypto.randomUUID(),
        name: invoiceData.customerName,
        email: invoiceData.customerEmail,
        phone: invoiceData.customerPhone,
        address: invoiceData.customerAddress,
        company: invoiceData.customerCompany,
        vatNumber: invoiceData.customerVatNumber,
        createdAt: new Date().toISOString()
      },
      items: invoiceData.items,
      subtotal: calculateSubtotal(),
      vatAmount: calculateVATTotal(),
      discountAmount: 0,
      total: calculateTotal(),
      status: 'draft',
      notes: invoiceData.notes,
      createdAt: new Date().toISOString()
    }

    const updatedInvoices = [...invoices, invoice]
    setInvoices(updatedInvoices)
    localStorage.setItem('tpe-invoices', JSON.stringify(updatedInvoices))

    // Réinitialiser le formulaire
    setInvoiceData({
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      customerAddress: "",
      customerCompany: "",
      customerVatNumber: "",
      items: [{ id: crypto.randomUUID(), description: "", quantity: 1, unitPrice: 0, vatRate: 20, discount: 0 }],
      notes: "",
      dueDate: "",
      paymentTerms: 30
    })

    setShowCreateDialog(false)
    alert(`Facture ${invoice.number} créée avec succès !`)
  }

  const updateInvoiceStatus = (invoiceId: string, status: Invoice['status']) => {
    const updatedInvoices = invoices.map(inv => 
      inv.id === invoiceId 
        ? { ...inv, status, paidAt: status === 'paid' ? new Date().toISOString() : inv.paidAt }
        : inv
    )
    setInvoices(updatedInvoices)
    localStorage.setItem('tpe-invoices', JSON.stringify(updatedInvoices))
  }

  const deleteInvoice = (invoiceId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
      const updatedInvoices = invoices.filter(inv => inv.id !== invoiceId)
      setInvoices(updatedInvoices)
      localStorage.setItem('tpe-invoices', JSON.stringify(updatedInvoices))
    }
  }

  const duplicateInvoice = (invoice: Invoice) => {
    const newInvoice: Invoice = {
      ...invoice,
      id: crypto.randomUUID(),
      number: generateInvoiceNumber(),
      date: new Date().toISOString(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'draft',
      createdAt: new Date().toISOString()
    }

    const updatedInvoices = [...invoices, newInvoice]
    setInvoices(updatedInvoices)
    localStorage.setItem('tpe-invoices', JSON.stringify(updatedInvoices))
    alert(`Facture ${newInvoice.number} dupliquée avec succès !`)
  }

  const exportInvoice = (invoice: Invoice, format: 'pdf' | 'email') => {
    if (format === 'pdf') {
      // Simulation d'export PDF
      alert(`Export PDF de la facture ${invoice.number} en cours...`)
    } else {
      // Simulation d'envoi par email
      alert(`Envoi par email de la facture ${invoice.number} à ${invoice.customer.email}`)
    }
  }

  // === FONCTIONS POUR LES CLIENTS ===
  const createCustomer = () => {
    if (!newCustomer.name || !newCustomer.email) {
      alert('Le nom et l\'email sont obligatoires')
      return
    }

    const customer: Customer = {
      id: crypto.randomUUID(),
      name: newCustomer.name,
      email: newCustomer.email,
      phone: newCustomer.phone,
      address: newCustomer.address,
      company: newCustomer.company,
      vatNumber: newCustomer.vatNumber,
      createdAt: new Date().toISOString()
    }

    const updatedCustomers = [...customers, customer]
    setCustomers(updatedCustomers)
    localStorage.setItem('tpe-customers', JSON.stringify(updatedCustomers))

    setNewCustomer({
      name: "",
      email: "",
      phone: "",
      address: "",
      company: "",
      vatNumber: ""
    })
    setShowCustomerDialog(false)
    alert(`Client ${customer.name} créé avec succès !`)
  }

  const updateCustomer = () => {
    if (!editingCustomer) return

    const updatedCustomers = customers.map(c => 
      c.id === editingCustomer.id ? editingCustomer : c
    )
    setCustomers(updatedCustomers)
    localStorage.setItem('tpe-customers', JSON.stringify(updatedCustomers))

    setEditingCustomer(null)
    setShowEditCustomerDialog(false)
    alert('Client mis à jour avec succès !')
  }

  const deleteCustomer = (customerId: string) => {
    // Vérifier si le client a des factures
    const hasInvoices = invoices.some(inv => inv.customer.id === customerId)
    if (hasInvoices) {
      alert('Impossible de supprimer ce client car il a des factures associées')
      return
    }

    if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      const updatedCustomers = customers.filter(c => c.id !== customerId)
      setCustomers(updatedCustomers)
      localStorage.setItem('tpe-customers', JSON.stringify(updatedCustomers))
    }
  }

  const getCustomerStats = (customerId: string) => {
    const customerInvoices = invoices.filter(inv => inv.customer.id === customerId)
    const totalAmount = customerInvoices.reduce((sum, inv) => sum + inv.total, 0)
    const paidAmount = customerInvoices
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.total, 0)
    const pendingAmount = customerInvoices
      .filter(inv => inv.status === 'sent')
      .reduce((sum, inv) => sum + inv.total, 0)

    return {
      totalInvoices: customerInvoices.length,
      totalAmount,
      paidAmount,
      pendingAmount,
      lastInvoiceDate: customerInvoices.length > 0 ? 
        new Date(Math.max(...customerInvoices.map(inv => new Date(inv.date).getTime()))) : null
    }
  }

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
    (customer.company && customer.company.toLowerCase().includes(customerSearchTerm.toLowerCase()))
  )

  // === FONCTIONS POUR LES ANALYSES ===
  const generateAnalyticsData = () => {
    const days = parseInt(analyticsDateRange)
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const filteredInvoices = invoices.filter(inv => 
      new Date(inv.date) >= startDate
    )

    // Revenus mensuels
    const monthlyData = new Map()
    filteredInvoices.forEach(inv => {
      const month = new Date(inv.date).toLocaleDateString('fr-FR', { 
        year: 'numeric', 
        month: 'short' 
      })
      if (!monthlyData.has(month)) {
        monthlyData.set(month, { revenue: 0, invoices: 0 })
      }
      const data = monthlyData.get(month)
      data.revenue += inv.total
      data.invoices += 1
    })

    const monthlyRevenue = Array.from(monthlyData.entries()).map(([month, data]) => ({
      month,
      revenue: data.revenue,
      invoices: data.invoices
    }))

    // Top clients
    const customerData = new Map()
    filteredInvoices.forEach(inv => {
      const customerName = inv.customer.name
      if (!customerData.has(customerName)) {
        customerData.set(customerName, { total: 0, invoices: 0 })
      }
      const data = customerData.get(customerName)
      data.total += inv.total
      data.invoices += 1
    })

    const topCustomers = Array.from(customerData.entries())
      .map(([customer, data]) => ({
        customer,
        total: data.total,
        invoices: data.invoices
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)

    // Revenus par statut
    const statusData = new Map()
    filteredInvoices.forEach(inv => {
      if (!statusData.has(inv.status)) {
        statusData.set(inv.status, 0)
      }
      statusData.set(inv.status, statusData.get(inv.status) + inv.total)
    })

    const totalRevenue = Array.from(statusData.values()).reduce((sum, amount) => sum + amount, 0)
    const revenueByStatus = Array.from(statusData.entries()).map(([status, amount]) => ({
      status,
      amount,
      percentage: totalRevenue > 0 ? (amount / totalRevenue) * 100 : 0
    }))

    setAnalyticsData({
      monthlyRevenue,
      topCustomers,
      revenueByStatus
    })
  }

  const exportAnalytics = (format: 'csv' | 'pdf') => {
    if (format === 'csv') {
      const csvContent = [
        ['Période', 'Revenus', 'Factures'],
        ...analyticsData.monthlyRevenue.map(item => [
          item.month, 
          item.revenue.toFixed(2), 
          item.invoices.toString()
        ])
      ].map(row => row.join(',')).join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `analyses-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
    } else {
      alert('Export PDF des analyses en cours...')
    }
  }

  // === FONCTIONS POUR LES PARAMÈTRES ===
  const loadBillingSettings = () => {
    const saved = localStorage.getItem('billing-settings')
    if (saved) {
      setBillingSettings(JSON.parse(saved))
    }
  }

  const saveBillingSettings = () => {
    localStorage.setItem('billing-settings', JSON.stringify(billingSettings))
    alert('Paramètres sauvegardés avec succès !')
    setShowSettingsDialog(false)
  }

  const resetSettings = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?')) {
      const defaultSettings = {
        companyName: "Crypto Store Lausanne",
        companyAddress: "123 Rue du Commerce, 1000 Lausanne",
        companyPhone: "+41 21 123 45 67",
        companyEmail: "contact@cryptostore.ch",
        companyVAT: "CHE-123.456.789",
        invoicePrefix: "FAC",
        defaultPaymentTerms: 30,
        defaultVATRate: 7.7,
        currency: "CHF",
        language: "fr",
        logoUrl: "",
        footerText: "Merci pour votre confiance",
        bankDetails: {
          iban: "CH93 0076 2011 6238 5295 7",
          bank: "UBS Switzerland AG",
          swift: "UBSWCHZH80A"
        }
      }
      setBillingSettings(defaultSettings)
      localStorage.setItem('billing-settings', JSON.stringify(defaultSettings))
    }
  }

  const exportSettings = () => {
    const dataStr = JSON.stringify(billingSettings, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `parametres-facturation-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const settings = JSON.parse(e.target?.result as string)
        setBillingSettings(settings)
        localStorage.setItem('billing-settings', JSON.stringify(settings))
        alert('Paramètres importés avec succès !')
      } catch (error) {
        alert('Erreur lors de l\'importation des paramètres')
      }
    }
    reader.readAsText(file)
  }

  // Filtrer les factures
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter
    return matchesSearch && matchesStatus
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
              onClick={() => onNavigate("tpe")}
              className="hover:bg-white/20 rounded-xl"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Centre de Facturation
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Gestion complète des factures et clients
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="px-3 py-1">
              <Receipt className="h-4 w-4 mr-1" />
              {billingStats.totalInvoices} factures
            </Badge>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle Facture
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    <Plus className="h-5 w-5" />
                    <span>Créer une nouvelle facture</span>
                  </DialogTitle>
                  <DialogDescription>
                    Remplissez les informations pour générer une facture professionnelle
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="customerName">Nom du client</Label>
                      <Input
                        id="customerName"
                        value={invoiceData.customerName}
                        onChange={(e) => setInvoiceData({ ...invoiceData, customerName: e.target.value })}
                        placeholder="Nom complet du client"
                      />
                    </div>
                    <div>
                      <Label htmlFor="customerEmail">Email</Label>
                      <Input
                        id="customerEmail"
                        type="email"
                        value={invoiceData.customerEmail}
                        onChange={(e) => setInvoiceData({ ...invoiceData, customerEmail: e.target.value })}
                        placeholder="email@exemple.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Articles</h3>
                    {invoiceData.items.map((item, index) => (
                      <div key={item.id} className="grid grid-cols-5 gap-4 p-4 border rounded-lg">
                        <div className="col-span-2">
                          <Label>Description</Label>
                          <Input
                            value={item.description}
                            onChange={(e) => updateItem(index, "description", e.target.value)}
                            placeholder="Description de l'article"
                          />
                        </div>
                        <div>
                          <Label>Quantité</Label>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value) || 1)}
                            min="1"
                          />
                        </div>
                        <div>
                          <Label>Prix unitaire (€)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(e) => updateItem(index, "unitPrice", parseFloat(e.target.value) || 0)}
                            min="0"
                          />
                        </div>
                        <div className="flex items-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeItem(index)}
                            disabled={invoiceData.items.length === 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button onClick={addItem} variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter un article
                    </Button>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Récapitulatif</h3>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Sous-total:</span>
                        <span>{calculateSubtotal().toFixed(2)} €</span>
                      </div>
                      <div className="flex justify-between">
                        <span>TVA:</span>
                        <span>{calculateVATTotal().toFixed(2)} €</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg border-t pt-1">
                        <span>Total:</span>
                        <span>{calculateTotal().toFixed(2)} €</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                      Annuler
                    </Button>
                    <Button 
                      onClick={createInvoice}
                      disabled={!invoiceData.customerName || invoiceData.items.some(item => !item.description)}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Créer la facture
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl p-1">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2 rounded-xl">
              <BarChart3 className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="invoices" className="flex items-center space-x-2 rounded-xl">
              <FileText className="h-4 w-4" />
              <span>Factures</span>
            </TabsTrigger>
            <TabsTrigger value="customers" className="flex items-center space-x-2 rounded-xl">
              <Users className="h-4 w-4" />
              <span>Clients</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2 rounded-xl">
              <Target className="h-4 w-4" />
              <span>Analyses</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2 rounded-xl">
              <Settings className="h-4 w-4" />
              <span>Paramètres</span>
            </TabsTrigger>
          </TabsList>

          {/* Onglet Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium">Chiffre d'affaires</p>
                      <p className="text-2xl font-bold">{billingStats.totalRevenue.toFixed(2)} €</p>
                    </div>
                    <Euro className="h-8 w-8 text-green-200" />
                  </div>
                  <div className="mt-4">
                    <Progress value={75} className="bg-green-400" />
                    <p className="text-xs text-green-100 mt-1">+15% ce mois</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Factures</p>
                      <p className="text-2xl font-bold">{billingStats.totalInvoices}</p>
                    </div>
                    <FileText className="h-8 w-8 text-blue-200" />
                  </div>
                  <div className="mt-4">
                    <Progress value={60} className="bg-blue-400" />
                    <p className="text-xs text-blue-100 mt-1">+8 ce mois</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-amber-100 text-sm font-medium">En attente</p>
                      <p className="text-2xl font-bold">{billingStats.pendingAmount.toFixed(2)} €</p>
                    </div>
                    <Clock className="h-8 w-8 text-amber-200" />
                  </div>
                  <div className="mt-4">
                    <Progress value={45} className="bg-amber-400" />
                    <p className="text-xs text-amber-100 mt-1">5 factures</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm font-medium">Taux de paiement</p>
                      <p className="text-2xl font-bold">{billingStats.paymentRate.toFixed(1)}%</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-purple-200" />
                  </div>
                  <div className="mt-4">
                    <Progress value={billingStats.paymentRate} className="bg-purple-400" />
                    <p className="text-xs text-purple-100 mt-1">Excellent</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Actions rapides et alertes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-blue-500" />
                    <span>Actions Rapides</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={() => setShowCreateDialog(true)}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Créer une facture
                  </Button>
                  <Button
                    onClick={() => setActiveTab("customers")}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Gérer les clients
                  </Button>
                  <Button
                    onClick={() => setActiveTab("analytics")}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Voir les analyses
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    <span>Alertes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {billingStats.overdueAmount > 0 && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <AlertTitle>Factures en retard</AlertTitle>
                      <AlertDescription>
                        {billingStats.overdueAmount.toFixed(2)} € en factures impayées
                      </AlertDescription>
                    </Alert>
                  )}
                  <Alert className="border-blue-200 bg-blue-50">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    <AlertTitle>Système opérationnel</AlertTitle>
                    <AlertDescription>
                      Toutes les fonctionnalités sont disponibles
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Onglet Factures */}
          <TabsContent value="invoices" className="space-y-6">
            {/* Barre d'outils factures */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
                  <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Rechercher une facture..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-48">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Filtrer par statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="draft">Brouillons</SelectItem>
                        <SelectItem value="sent">Envoyées</SelectItem>
                        <SelectItem value="paid">Payées</SelectItem>
                        <SelectItem value="overdue">En retard</SelectItem>
                        <SelectItem value="cancelled">Annulées</SelectItem>
                      </SelectContent>
                    </Select>
                    <Badge variant="outline" className="px-3 py-1">
                      {filteredInvoices.length} facture{filteredInvoices.length > 1 ? 's' : ''}
                    </Badge>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        const csvContent = [
                          ['Numéro', 'Client', 'Date', 'Échéance', 'Montant', 'Statut'],
                          ...filteredInvoices.map(inv => [
                            inv.number,
                            inv.customer.name,
                            new Date(inv.date).toLocaleDateString('fr-FR'),
                            new Date(inv.dueDate).toLocaleDateString('fr-FR'),
                            inv.total.toFixed(2),
                            inv.status
                          ])
                        ].map(row => row.join(',')).join('\n')

                        const blob = new Blob([csvContent], { type: 'text/csv' })
                        const url = window.URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = url
                        a.download = `factures-${new Date().toISOString().split('T')[0]}.csv`
                        a.click()
                        window.URL.revokeObjectURL(url)
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                    <Button
                      onClick={() => setShowCreateDialog(true)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Nouvelle Facture
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistiques rapides */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Total factures</p>
                      <p className="text-2xl font-bold">{filteredInvoices.length}</p>
                    </div>
                    <FileText className="h-8 w-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Montant total</p>
                      <p className="text-2xl font-bold">
                        {filteredInvoices.reduce((sum, inv) => sum + inv.total, 0).toFixed(2)} €
                      </p>
                    </div>
                    <Euro className="h-8 w-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-500 to-orange-600 text-white border-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-amber-100 text-sm">En attente</p>
                      <p className="text-2xl font-bold">
                        {filteredInvoices.filter(inv => inv.status === 'sent').length}
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-amber-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Payées</p>
                      <p className="text-2xl font-bold">
                        {filteredInvoices.filter(inv => inv.status === 'paid').length}
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-purple-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Liste des factures */}
            {filteredInvoices.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchTerm || statusFilter !== "all" ? 'Aucune facture trouvée' : 'Aucune facture créée'}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm || statusFilter !== "all" 
                      ? 'Aucune facture ne correspond à vos critères de recherche' 
                      : 'Commencez par créer votre première facture'}
                  </p>
                  {!searchTerm && statusFilter === "all" && (
                    <Button onClick={() => setShowCreateDialog(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Créer une facture
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredInvoices.map((invoice) => (
                  <Card key={invoice.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-3">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{invoice.number}</h3>
                              <p className="text-sm text-gray-600">{invoice.customer.name}</p>
                              {invoice.customer.company && (
                                <p className="text-sm text-gray-500">{invoice.customer.company}</p>
                              )}
                            </div>
                            <Badge variant={
                              invoice.status === 'paid' ? 'default' :
                              invoice.status === 'sent' ? 'secondary' :
                              invoice.status === 'overdue' ? 'destructive' :
                              invoice.status === 'cancelled' ? 'outline' :
                              'outline'
                            }>
                              {invoice.status === 'draft' && 'Brouillon'}
                              {invoice.status === 'sent' && 'Envoyée'}
                              {invoice.status === 'paid' && 'Payée'}
                              {invoice.status === 'overdue' && 'En retard'}
                              {invoice.status === 'cancelled' && 'Annulée'}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Date d'émission</p>
                              <p className="font-medium">{new Date(invoice.date).toLocaleDateString('fr-FR')}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Date d'échéance</p>
                              <p className="font-medium">{new Date(invoice.dueDate).toLocaleDateString('fr-FR')}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Articles</p>
                              <p className="font-medium">{invoice.items.length} article{invoice.items.length > 1 ? 's' : ''}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Montant total</p>
                              <p className="font-medium text-lg text-green-600">{invoice.total.toFixed(2)} €</p>
                            </div>
                          </div>

                          {invoice.items.length > 0 && (
                            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm font-medium text-gray-700 mb-2">Articles :</p>
                              <div className="space-y-1">
                                {invoice.items.slice(0, 2).map((item, index) => (
                                  <p key={index} className="text-sm text-gray-600">
                                    {item.quantity}x {item.description} - {(item.quantity * item.unitPrice).toFixed(2)} €
                                  </p>
                                ))}
                                {invoice.items.length > 2 && (
                                  <p className="text-sm text-gray-500 italic">
                                    +{invoice.items.length - 2} autre{invoice.items.length > 3 ? 's' : ''} article{invoice.items.length > 3 ? 's' : ''}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col space-y-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedInvoice(invoice)
                              setShowPreviewDialog(true)
                            }}
                            className="flex items-center space-x-1"
                          >
                            <Eye className="h-4 w-4" />
                            <span>Voir</span>
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => duplicateInvoice(invoice)}
                            className="flex items-center space-x-1"
                          >
                            <Copy className="h-4 w-4" />
                            <span>Dupliquer</span>
                          </Button>

                          {invoice.status !== 'paid' && (
                            <Select
                              value={invoice.status}
                              onValueChange={(value) => updateInvoiceStatus(invoice.id, value as Invoice['status'])}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="draft">Brouillon</SelectItem>
                                <SelectItem value="sent">Envoyée</SelectItem>
                                <SelectItem value="paid">Payée</SelectItem>
                                <SelectItem value="overdue">En retard</SelectItem>
                                <SelectItem value="cancelled">Annulée</SelectItem>
                              </SelectContent>
                            </Select>
                          )}

                          <div className="flex space-x-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => exportInvoice(invoice, 'pdf')}
                              className="flex items-center space-x-1"
                            >
                              <Download className="h-4 w-4" />
                              <span>PDF</span>
                            </Button>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => exportInvoice(invoice, 'email')}
                              className="flex items-center space-x-1"
                            >
                              <Mail className="h-4 w-4" />
                              <span>Email</span>
                            </Button>
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteInvoice(invoice.id)}
                            className="text-red-600 hover:text-red-700 flex items-center space-x-1"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Supprimer</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Modal de prévisualisation de facture */}
            <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    <Eye className="h-5 w-5" />
                    <span>Aperçu de la facture</span>
                  </DialogTitle>
                </DialogHeader>
                {selectedInvoice && (
                  <div className="bg-white border rounded-lg p-8 shadow-sm">
                    {/* En-tête de la facture */}
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900">{billingSettings.companyName}</h2>
                        <div className="text-gray-600 mt-2 whitespace-pre-line">
                          {billingSettings.companyAddress}
                        </div>
                        <div className="text-gray-600 mt-2">
                          {billingSettings.companyPhone} • {billingSettings.companyEmail}
                        </div>
                        {billingSettings.companyVAT && (
                          <div className="text-gray-600 mt-1">
                            TVA: {billingSettings.companyVAT}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <h3 className="text-2xl font-bold text-gray-900">FACTURE</h3>
                        <p className="text-gray-600 text-lg">{selectedInvoice.number}</p>
                        <div className="mt-2 space-y-1">
                          <p className="text-gray-600">Date: {new Date(selectedInvoice.date).toLocaleDateString('fr-FR')}</p>
                          <p className="text-gray-600">Échéance: {new Date(selectedInvoice.dueDate).toLocaleDateString('fr-FR')}</p>
                        </div>
                        <Badge variant={
                          selectedInvoice.status === 'paid' ? 'default' :
                          selectedInvoice.status === 'sent' ? 'secondary' :
                          selectedInvoice.status === 'overdue' ? 'destructive' :
                          'outline'
                        } className="mt-2">
                          {selectedInvoice.status === 'draft' && 'Brouillon'}
                          {selectedInvoice.status === 'sent' && 'Envoyée'}
                          {selectedInvoice.status === 'paid' && 'Payée'}
                          {selectedInvoice.status === 'overdue' && 'En retard'}
                          {selectedInvoice.status === 'cancelled' && 'Annulée'}
                        </Badge>
                      </div>
                    </div>

                    {/* Informations client */}
                    <div className="border-t border-b py-6 mb-8">
                      <h4 className="font-semibold text-lg mb-3">Facturé à:</h4>
                      <div className="text-gray-700">
                        <p className="font-medium">{selectedInvoice.customer.name}</p>
                        {selectedInvoice.customer.company && (
                          <p>{selectedInvoice.customer.company}</p>
                        )}
                        <p className="whitespace-pre-line">{selectedInvoice.customer.address}</p>
                        <p>{selectedInvoice.customer.email}</p>
                        {selectedInvoice.customer.phone && <p>{selectedInvoice.customer.phone}</p>}
                        {selectedInvoice.customer.vatNumber && (
                          <p className="mt-1">TVA: {selectedInvoice.customer.vatNumber}</p>
                        )}
                      </div>
                    </div>

                    {/* Articles */}
                    <div className="mb-8">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b-2 border-gray-300">
                            <th className="text-left py-3 font-semibold">Description</th>
                            <th className="text-right py-3 font-semibold">Quantité</th>
                            <th className="text-right py-3 font-semibold">Prix unitaire</th>
                            <th className="text-right py-3 font-semibold">TVA</th>
                            <th className="text-right py-3 font-semibold">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedInvoice.items.map((item, index) => {
                            const itemTotal = item.quantity * item.unitPrice
                            const vatAmount = (itemTotal * item.vatRate) / 100
                            return (
                              <tr key={index} className="border-b">
                                <td className="py-3">{item.description}</td>
                                <td className="text-right py-3">{item.quantity}</td>
                                <td className="text-right py-3">{item.unitPrice.toFixed(2)} €</td>
                                <td className="text-right py-3">{item.vatRate}%</td>
                                <td className="text-right py-3 font-medium">{(itemTotal + vatAmount).toFixed(2)} €</td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Totaux */}
                    <div className="flex justify-end mb-8">
                      <div className="w-80">
                        <div className="space-y-2">
                          <div className="flex justify-between py-1">
                            <span>Sous-total:</span>
                            <span className="font-medium">{selectedInvoice.subtotal.toFixed(2)} €</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span>TVA:</span>
                            <span className="font-medium">{selectedInvoice.vatAmount.toFixed(2)} €</span>
                          </div>
                          {selectedInvoice.discountAmount > 0 && (
                            <div className="flex justify-between py-1 text-green-600">
                              <span>Remise:</span>
                              <span className="font-medium">-{selectedInvoice.discountAmount.toFixed(2)} €</span>
                            </div>
                          )}
                          <div className="flex justify-between py-3 border-t-2 border-gray-300 text-xl font-bold">
                            <span>Total:</span>
                            <span>{selectedInvoice.total.toFixed(2)} €</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Informations de paiement */}
                    {billingSettings.bankDetails.iban && (
                      <div className="border-t pt-6 mb-6">
                        <h4 className="font-semibold text-lg mb-3">Informations de paiement:</h4>
                        <div className="text-gray-700 space-y-1">
                          <p>IBAN: {billingSettings.bankDetails.iban}</p>
                          <p>Banque: {billingSettings.bankDetails.bank}</p>
                          {billingSettings.bankDetails.swift && <p>SWIFT: {billingSettings.bankDetails.swift}</p>}
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {selectedInvoice.notes && (
                      <div className="border-t pt-6 mb-6">
                        <h4 className="font-semibold text-lg mb-3">Notes:</h4>
                        <p className="text-gray-700 whitespace-pre-line">{selectedInvoice.notes}</p>
                      </div>
                    )}

                    {/* Pied de page */}
                    {billingSettings.footerText && (
                      <div className="border-t pt-6 text-center text-gray-600">
                        <p className="whitespace-pre-line">{billingSettings.footerText}</p>
                      </div>
                    )}
                  </div>
                )}
                <div className="flex justify-end space-x-2 mt-6">
                  <Button variant="outline" onClick={() => setShowPreviewDialog(false)}>
                    Fermer
                  </Button>
                  {selectedInvoice && (
                    <>
                      <Button
                        onClick={() => exportInvoice(selectedInvoice, 'pdf')}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Télécharger PDF
                      </Button>
                      <Button
                        onClick={() => exportInvoice(selectedInvoice, 'email')}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Envoyer par email
                      </Button>
                    </>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Onglet Clients */}
          <TabsContent value="customers" className="space-y-6">
            {/* Barre d'outils clients */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between space-x-4">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Rechercher un client..."
                        value={customerSearchTerm}
                        onChange={(e) => setCustomerSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Badge variant="outline" className="px-3 py-1">
                      {filteredCustomers.length} client{filteredCustomers.length > 1 ? 's' : ''}
                    </Badge>
                  </div>
                  <Dialog open={showCustomerDialog} onOpenChange={setShowCustomerDialog}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Nouveau Client
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="flex items-center space-x-2">
                          <Users className="h-5 w-5" />
                          <span>Créer un nouveau client</span>
                        </DialogTitle>
                        <DialogDescription>
                          Ajoutez un nouveau client à votre base de données
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="customerName">Nom complet *</Label>
                          <Input
                            id="customerName"
                            value={newCustomer.name}
                            onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                            placeholder="Jean Dupont"
                          />
                        </div>
                        <div>
                          <Label htmlFor="customerEmail">Email *</Label>
                          <Input
                            id="customerEmail"
                            type="email"
                            value={newCustomer.email}
                            onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                            placeholder="jean@exemple.com"
                          />
                        </div>
                        <div>
                          <Label htmlFor="customerPhone">Téléphone</Label>
                          <Input
                            id="customerPhone"
                            value={newCustomer.phone}
                            onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                            placeholder="+41 21 123 45 67"
                          />
                        </div>
                        <div>
                          <Label htmlFor="customerCompany">Entreprise</Label>
                          <Input
                            id="customerCompany"
                            value={newCustomer.company}
                            onChange={(e) => setNewCustomer({ ...newCustomer, company: e.target.value })}
                            placeholder="Nom de l'entreprise"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label htmlFor="customerAddress">Adresse</Label>
                          <Textarea
                            id="customerAddress"
                            value={newCustomer.address}
                            onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                            placeholder="123 Rue de la Paix, 1000 Lausanne"
                            rows={2}
                          />
                        </div>
                        <div className="col-span-2">
                          <Label htmlFor="customerVatNumber">Numéro TVA</Label>
                          <Input
                            id="customerVatNumber"
                            value={newCustomer.vatNumber}
                            onChange={(e) => setNewCustomer({ ...newCustomer, vatNumber: e.target.value })}
                            placeholder="CHE-123.456.789"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2 mt-6">
                        <Button variant="outline" onClick={() => setShowCustomerDialog(false)}>
                          Annuler
                        </Button>
                        <Button onClick={createCustomer} disabled={!newCustomer.name || !newCustomer.email}>
                          <Save className="h-4 w-4 mr-2" />
                          Créer le client
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            {/* Liste des clients */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCustomers.map((customer) => {
                const stats = getCustomerStats(customer.id)
                return (
                  <Card key={customer.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{customer.name}</CardTitle>
                          {customer.company && (
                            <p className="text-sm text-gray-600 font-medium">{customer.company}</p>
                          )}
                          <p className="text-sm text-gray-500">{customer.email}</p>
                          {customer.phone && (
                            <p className="text-sm text-gray-500">{customer.phone}</p>
                          )}
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingCustomer(customer)
                              setShowEditCustomerDialog(true)
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteCustomer(customer.id)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Factures:</span>
                          <span className="font-medium">{stats.totalInvoices}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Total:</span>
                          <span className="font-medium text-green-600">{stats.totalAmount.toFixed(2)} €</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Payé:</span>
                          <span className="font-medium">{stats.paidAmount.toFixed(2)} €</span>
                        </div>
                        {stats.pendingAmount > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">En attente:</span>
                            <span className="font-medium text-amber-600">{stats.pendingAmount.toFixed(2)} €</span>
                          </div>
                        )}
                        {customer.vatNumber && (
                          <Badge variant="outline" className="text-xs mt-2">
                            TVA: {customer.vatNumber}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {filteredCustomers.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun client trouvé</h3>
                  <p className="text-gray-500 mb-4">
                    {customerSearchTerm ? 'Aucun client ne correspond à votre recherche' : 'Commencez par ajouter votre premier client'}
                  </p>
                  {!customerSearchTerm && (
                    <Button onClick={() => setShowCustomerDialog(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter un client
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Modal d'édition client */}
            <Dialog open={showEditCustomerDialog} onOpenChange={setShowEditCustomerDialog}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    <Edit className="h-5 w-5" />
                    <span>Modifier le client</span>
                  </DialogTitle>
                </DialogHeader>
                {editingCustomer && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Nom complet</Label>
                      <Input
                        value={editingCustomer.name}
                        onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={editingCustomer.email}
                        onChange={(e) => setEditingCustomer({ ...editingCustomer, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Téléphone</Label>
                      <Input
                        value={editingCustomer.phone}
                        onChange={(e) => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label>Entreprise</Label>
                      <Input
                        value={editingCustomer.company || ''}
                        onChange={(e) => setEditingCustomer({ ...editingCustomer, company: e.target.value })}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Adresse</Label>
                      <Textarea
                        value={editingCustomer.address}
                        onChange={(e) => setEditingCustomer({ ...editingCustomer, address: e.target.value })}
                        rows={2}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Numéro TVA</Label>
                      <Input
                        value={editingCustomer.vatNumber || ''}
                        onChange={(e) => setEditingCustomer({ ...editingCustomer, vatNumber: e.target.value })}
                      />
                    </div>
                  </div>
                )}
                <div className="flex justify-end space-x-2 mt-6">
                  <Button variant="outline" onClick={() => setShowEditCustomerDialog(false)}>
                    Annuler
                  </Button>
                  <Button onClick={updateCustomer}>
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Contrôles d'analyse */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <Label>Période d'analyse:</Label>
                      <Select value={analyticsDateRange} onValueChange={setAnalyticsDateRange}>
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7">7 derniers jours</SelectItem>
                          <SelectItem value="30">30 derniers jours</SelectItem>
                          <SelectItem value="90">3 derniers mois</SelectItem>
                          <SelectItem value="180">6 derniers mois</SelectItem>
                          <SelectItem value="365">12 derniers mois</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => exportAnalytics('csv')}
                      className="flex items-center space-x-2"
                    >
                      <Download className="h-4 w-4" />
                      <span>Export CSV</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => exportAnalytics('pdf')}
                      className="flex items-center space-x-2"
                    >
                      <Download className="h-4 w-4" />
                      <span>Export PDF</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Métriques principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-indigo-100 text-sm font-medium">Revenus période</p>
                      <p className="text-2xl font-bold">
                        {analyticsData.monthlyRevenue.reduce((sum, item) => sum + item.revenue, 0).toFixed(2)} €
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-indigo-200" />
                  </div>
                  <div className="mt-4">
                    <p className="text-xs text-indigo-100">
                      {analyticsData.monthlyRevenue.reduce((sum, item) => sum + item.invoices, 0)} factures
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-emerald-100 text-sm font-medium">Revenus moyens</p>
                      <p className="text-2xl font-bold">
                        {analyticsData.monthlyRevenue.length > 0 
                          ? (analyticsData.monthlyRevenue.reduce((sum, item) => sum + item.revenue, 0) / analyticsData.monthlyRevenue.length).toFixed(2)
                          : '0.00'} €
                      </p>
                    </div>
                    <Target className="h-8 w-8 text-emerald-200" />
                  </div>
                  <div className="mt-4">
                    <p className="text-xs text-emerald-100">Par période</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-red-600 text-white border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm font-medium">Clients actifs</p>
                      <p className="text-2xl font-bold">{analyticsData.topCustomers.length}</p>
                    </div>
                    <Users className="h-8 w-8 text-orange-200" />
                  </div>
                  <div className="mt-4">
                    <p className="text-xs text-orange-100">Avec factures</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-cyan-100 text-sm font-medium">Taux de conversion</p>
                      <p className="text-2xl font-bold">
                        {analyticsData.revenueByStatus.find(s => s.status === 'paid')?.percentage.toFixed(1) || '0.0'}%
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-cyan-200" />
                  </div>
                  <div className="mt-4">
                    <p className="text-xs text-cyan-100">Factures payées</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Graphiques et analyses */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Évolution des revenus */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-blue-500" />
                    <span>Évolution des revenus</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {analyticsData.monthlyRevenue.length > 0 ? (
                    <div className="space-y-4">
                      {analyticsData.monthlyRevenue.map((item, index) => {
                        const maxRevenue = Math.max(...analyticsData.monthlyRevenue.map(i => i.revenue))
                        const percentage = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0
                        return (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">{item.month}</span>
                              <span className="text-gray-600">{item.revenue.toFixed(2)} € ({item.invoices} factures)</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Aucune donnée pour cette période</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Top clients */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-green-500" />
                    <span>Top clients</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {analyticsData.topCustomers.length > 0 ? (
                    <div className="space-y-4">
                      {analyticsData.topCustomers.map((customer, index) => {
                        const maxTotal = Math.max(...analyticsData.topCustomers.map(c => c.total))
                        const percentage = maxTotal > 0 ? (customer.total / maxTotal) * 100 : 0
                        return (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center text-xs">
                                  {index + 1}
                                </Badge>
                                <span className="font-medium">{customer.customer}</span>
                              </div>
                              <span className="text-sm text-gray-600">
                                {customer.total.toFixed(2)} € ({customer.invoices} factures)
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Aucun client pour cette période</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Analyse par statut */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-purple-500" />
                  <span>Répartition par statut</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analyticsData.revenueByStatus.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {analyticsData.revenueByStatus.map((status, index) => {
                      const statusLabels = {
                        draft: { label: 'Brouillons', color: 'bg-gray-500' },
                        sent: { label: 'Envoyées', color: 'bg-blue-500' },
                        paid: { label: 'Payées', color: 'bg-green-500' },
                        overdue: { label: 'En retard', color: 'bg-red-500' },
                        cancelled: { label: 'Annulées', color: 'bg-gray-400' }
                      }
                      const statusInfo = statusLabels[status.status as keyof typeof statusLabels] || 
                                        { label: status.status, color: 'bg-gray-500' }
                      
                      return (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className={`w-3 h-3 rounded-full ${statusInfo.color}`} />
                            <span className="font-medium text-sm">{statusInfo.label}</span>
                          </div>
                          <p className="text-2xl font-bold">{status.amount.toFixed(2)} €</p>
                          <p className="text-sm text-gray-600">{status.percentage.toFixed(1)}% du total</p>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Aucune donnée de statut disponible</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Insights et recommandations */}
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-blue-500" />
                  <span>Insights & Recommandations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.topCustomers.length > 0 && (
                    <Alert className="border-blue-200 bg-blue-50">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <AlertTitle>Meilleur client</AlertTitle>
                      <AlertDescription>
                        {analyticsData.topCustomers[0].customer} représente votre meilleur client avec {analyticsData.topCustomers[0].total.toFixed(2)} € de revenus.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {analyticsData.revenueByStatus.find(s => s.status === 'overdue') && (
                    <Alert className="border-amber-200 bg-amber-50">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      <AlertTitle>Factures en retard</AlertTitle>
                      <AlertDescription>
                        Vous avez {analyticsData.revenueByStatus.find(s => s.status === 'overdue')?.amount.toFixed(2)} € en factures impayées. 
                        Pensez à relancer vos clients.
                      </AlertDescription>
                    </Alert>
                  )}

                  {analyticsData.monthlyRevenue.length >= 2 && (
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertTitle>Tendance</AlertTitle>
                      <AlertDescription>
                        {analyticsData.monthlyRevenue[analyticsData.monthlyRevenue.length - 1].revenue > 
                         analyticsData.monthlyRevenue[analyticsData.monthlyRevenue.length - 2].revenue
                          ? 'Vos revenus sont en hausse ! Continuez sur cette lancée.'
                          : 'Vos revenus ont baissé récemment. Analysez les causes possibles.'}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            {/* Actions rapides paramètres */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Settings className="h-5 w-5 text-gray-500" />
                    <span className="font-medium">Configuration de la facturation</span>
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="file"
                      accept=".json"
                      onChange={importSettings}
                      className="hidden"
                      id="import-settings"
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('import-settings')?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Importer
                    </Button>
                    <Button
                      variant="outline"
                      onClick={exportSettings}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Exporter
                    </Button>
                    <Button
                      variant="outline"
                      onClick={resetSettings}
                      className="text-red-600 hover:text-red-700"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Réinitialiser
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Informations entreprise */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    <span>Informations Entreprise</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="companyName">Nom de l'entreprise</Label>
                    <Input
                      id="companyName"
                      value={billingSettings.companyName}
                      onChange={(e) => setBillingSettings({...billingSettings, companyName: e.target.value})}
                      placeholder="Nom de votre entreprise"
                    />
                  </div>
                  <div>
                    <Label htmlFor="companyAddress">Adresse</Label>
                    <Textarea
                      id="companyAddress"
                      value={billingSettings.companyAddress}
                      onChange={(e) => setBillingSettings({...billingSettings, companyAddress: e.target.value})}
                      placeholder="Adresse complète de votre entreprise"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="companyPhone">Téléphone</Label>
                      <Input
                        id="companyPhone"
                        value={billingSettings.companyPhone}
                        onChange={(e) => setBillingSettings({...billingSettings, companyPhone: e.target.value})}
                        placeholder="+41 21 123 45 67"
                      />
                    </div>
                    <div>
                      <Label htmlFor="companyEmail">Email</Label>
                      <Input
                        id="companyEmail"
                        type="email"
                        value={billingSettings.companyEmail}
                        onChange={(e) => setBillingSettings({...billingSettings, companyEmail: e.target.value})}
                        placeholder="contact@entreprise.ch"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="companyVAT">Numéro TVA</Label>
                    <Input
                      id="companyVAT"
                      value={billingSettings.companyVAT}
                      onChange={(e) => setBillingSettings({...billingSettings, companyVAT: e.target.value})}
                      placeholder="CHE-123.456.789"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Paramètres de facturation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-green-500" />
                    <span>Paramètres Factures</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="invoicePrefix">Préfixe factures</Label>
                      <Input
                        id="invoicePrefix"
                        value={billingSettings.invoicePrefix}
                        onChange={(e) => setBillingSettings({...billingSettings, invoicePrefix: e.target.value})}
                        placeholder="FAC"
                      />
                    </div>
                    <div>
                      <Label htmlFor="defaultPaymentTerms">Échéance (jours)</Label>
                      <Input
                        id="defaultPaymentTerms"
                        type="number"
                        value={billingSettings.defaultPaymentTerms}
                        onChange={(e) => setBillingSettings({...billingSettings, defaultPaymentTerms: parseInt(e.target.value) || 30})}
                        min="1"
                        max="365"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="defaultVATRate">TVA par défaut (%)</Label>
                      <Input
                        id="defaultVATRate"
                        type="number"
                        step="0.1"
                        value={billingSettings.defaultVATRate}
                        onChange={(e) => setBillingSettings({...billingSettings, defaultVATRate: parseFloat(e.target.value) || 0})}
                        min="0"
                        max="50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="currency">Devise</Label>
                      <Select
                        value={billingSettings.currency}
                        onValueChange={(value) => setBillingSettings({...billingSettings, currency: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CHF">CHF - Franc Suisse</SelectItem>
                          <SelectItem value="EUR">EUR - Euro</SelectItem>
                          <SelectItem value="USD">USD - Dollar US</SelectItem>
                          <SelectItem value="GBP">GBP - Livre Sterling</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="language">Langue</Label>
                    <Select
                      value={billingSettings.language}
                      onValueChange={(value) => setBillingSettings({...billingSettings, language: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                        <SelectItem value="it">Italiano</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="footerText">Pied de page</Label>
                    <Textarea
                      id="footerText"
                      value={billingSettings.footerText}
                      onChange={(e) => setBillingSettings({...billingSettings, footerText: e.target.value})}
                      placeholder="Message de fin de facture"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Informations bancaires */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-purple-500" />
                  <span>Informations Bancaires</span>
                </CardTitle>
                <CardDescription>
                  Ces informations apparaîtront sur vos factures pour faciliter les paiements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="iban">IBAN</Label>
                    <Input
                      id="iban"
                      value={billingSettings.bankDetails.iban}
                      onChange={(e) => setBillingSettings({
                        ...billingSettings,
                        bankDetails: {...billingSettings.bankDetails, iban: e.target.value}
                      })}
                      placeholder="CH93 0076 2011 6238 5295 7"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bank">Nom de la banque</Label>
                    <Input
                      id="bank"
                      value={billingSettings.bankDetails.bank}
                      onChange={(e) => setBillingSettings({
                        ...billingSettings,
                        bankDetails: {...billingSettings.bankDetails, bank: e.target.value}
                      })}
                      placeholder="UBS Switzerland AG"
                    />
                  </div>
                  <div>
                    <Label htmlFor="swift">Code SWIFT/BIC</Label>
                    <Input
                      id="swift"
                      value={billingSettings.bankDetails.swift}
                      onChange={(e) => setBillingSettings({
                        ...billingSettings,
                        bankDetails: {...billingSettings.bankDetails, swift: e.target.value}
                      })}
                      placeholder="UBSWCHZH80A"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Aperçu de la facture */}
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-5 w-5 text-purple-500" />
                  <span>Aperçu Facture</span>
                </CardTitle>
                <CardDescription>
                  Voici comment vos factures apparaîtront avec ces paramètres
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-white border rounded-lg p-6 shadow-sm">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{billingSettings.companyName}</h2>
                      <div className="text-gray-600 mt-2 whitespace-pre-line">
                        {billingSettings.companyAddress}
                      </div>
                      <div className="text-gray-600 mt-1">
                        {billingSettings.companyPhone} • {billingSettings.companyEmail}
                      </div>
                      {billingSettings.companyVAT && (
                        <div className="text-gray-600 mt-1">
                          TVA: {billingSettings.companyVAT}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <h3 className="text-xl font-bold text-gray-900">FACTURE</h3>
                      <p className="text-gray-600">{billingSettings.invoicePrefix}-2024-001</p>
                      <p className="text-gray-600">Date: {new Date().toLocaleDateString('fr-FR')}</p>
                      <p className="text-gray-600">
                        Échéance: {new Date(Date.now() + billingSettings.defaultPaymentTerms * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-b py-4 mb-6">
                    <h4 className="font-semibold mb-2">Facturé à:</h4>
                    <div className="text-gray-600">
                      Client Exemple<br />
                      123 Rue du Client<br />
                      1000 Ville
                    </div>
                  </div>

                  <table className="w-full mb-6">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Description</th>
                        <th className="text-right py-2">Quantité</th>
                        <th className="text-right py-2">Prix unitaire</th>
                        <th className="text-right py-2">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-2">Service exemple</td>
                        <td className="text-right py-2">1</td>
                        <td className="text-right py-2">100.00 {billingSettings.currency}</td>
                        <td className="text-right py-2">100.00 {billingSettings.currency}</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="flex justify-end">
                    <div className="w-64">
                      <div className="flex justify-between py-1">
                        <span>Sous-total:</span>
                        <span>100.00 {billingSettings.currency}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span>TVA ({billingSettings.defaultVATRate}%):</span>
                        <span>{(100 * billingSettings.defaultVATRate / 100).toFixed(2)} {billingSettings.currency}</span>
                      </div>
                      <div className="flex justify-between py-2 border-t font-bold">
                        <span>Total:</span>
                        <span>{(100 * (1 + billingSettings.defaultVATRate / 100)).toFixed(2)} {billingSettings.currency}</span>
                      </div>
                    </div>
                  </div>

                  {billingSettings.bankDetails.iban && (
                    <div className="mt-6 pt-4 border-t">
                      <h4 className="font-semibold mb-2">Informations de paiement:</h4>
                      <div className="text-sm text-gray-600">
                        <p>IBAN: {billingSettings.bankDetails.iban}</p>
                        <p>Banque: {billingSettings.bankDetails.bank}</p>
                        {billingSettings.bankDetails.swift && <p>SWIFT: {billingSettings.bankDetails.swift}</p>}
                      </div>
                    </div>
                  )}

                  {billingSettings.footerText && (
                    <div className="mt-6 pt-4 border-t text-center text-gray-600 text-sm">
                      {billingSettings.footerText}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Actions de sauvegarde */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900">Sauvegarder les paramètres</h3>
                    <p className="text-blue-700">Vos modifications seront appliquées à toutes les nouvelles factures</p>
                  </div>
                  <Button
                    onClick={saveBillingSettings}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
