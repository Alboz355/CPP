"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Clock,
  Edit,
  History,
  UserPlus,
  ArrowLeft,
  Save,
} from "lucide-react"

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  totalTransactions: number
  totalVolume: number
  lastTransaction: string
  status: "active" | "inactive"
  avatar?: string
  joinDate: string
}

interface TPESearchPageProps {
  onNavigate: (page: string) => void
  onBack: () => void
}

// Données de test
const mockCustomers: Customer[] = [
  {
    id: "CUST001",
    name: "Marie Dubois",
    email: "marie.dubois@email.com",
    phone: "+41 79 123 45 67",
    address: "Rue de la Paix 15, 1003 Lausanne",
    totalTransactions: 12,
    totalVolume: 25680.5,
    lastTransaction: "2024-01-15 14:30",
    status: "active",
    joinDate: "2023-08-15",
  },
  {
    id: "CUST002",
    name: "Jean Martin",
    email: "jean.martin@email.com",
    phone: "+41 79 234 56 78",
    address: "Avenue du Léman 8, 1005 Lausanne",
    totalTransactions: 8,
    totalVolume: 15420.0,
    lastTransaction: "2024-01-15 13:45",
    status: "active",
    joinDate: "2023-09-22",
  },
  {
    id: "CUST003",
    name: "Anna Schmidt",
    email: "anna.schmidt@email.com",
    phone: "+41 79 345 67 89",
    address: "Chemin des Fleurs 22, 1004 Lausanne",
    totalTransactions: 5,
    totalVolume: 8950.75,
    lastTransaction: "2024-01-15 12:20",
    status: "active",
    joinDate: "2023-10-10",
  },
  {
    id: "CUST004",
    name: "Pierre Müller",
    email: "pierre.muller@email.com",
    phone: "+41 79 456 78 90",
    address: "Route de Berne 33, 1010 Lausanne",
    totalTransactions: 15,
    totalVolume: 42150.25,
    lastTransaction: "2024-01-14 16:15",
    status: "inactive",
    joinDate: "2023-07-05",
  },
]

export function TPESearchPage({ onNavigate, onBack }: TPESearchPageProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [customers, setCustomers] = useState(mockCustomers)
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  })

  // Filtrer les clients
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer)
  }

  const handleAddCustomer = () => {
    if (newCustomer.name && newCustomer.email) {
      const customer: Customer = {
        id: `CUST${String(customers.length + 1).padStart(3, "0")}`,
        ...newCustomer,
        totalTransactions: 0,
        totalVolume: 0,
        lastTransaction: "",
        status: "active",
        joinDate: new Date().toISOString().split("T")[0],
      }
      setCustomers([...customers, customer])
      setNewCustomer({ name: "", email: "", phone: "", address: "" })
      setShowNewCustomerForm(false)
    }
  }

  const handleEditCustomer = () => {
    if (selectedCustomer) {
      const updatedCustomers = customers.map((c) => (c.id === selectedCustomer.id ? selectedCustomer : c))
      setCustomers(updatedCustomers)
      setShowEditForm(false)
    }
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background">
      {/* Header avec bouton retour */}
      <div className="bg-card dark:bg-card border-b border-border p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Retour au TPE</span>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">🔍 Recherche Client</h1>
              <p className="text-muted-foreground">Trouvez rapidement vos clients existants</p>
            </div>
          </div>
          <Dialog open={showNewCustomerForm} onOpenChange={setShowNewCustomerForm}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <UserPlus className="h-4 w-4 mr-2" />
                Nouveau Client
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card dark:bg-card">
              <DialogHeader>
                <DialogTitle>Ajouter un nouveau client</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <Input
                    id="name"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                    placeholder="Ex: Marie Dubois"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                    placeholder="Ex: marie.dubois@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                    placeholder="Ex: +41 79 123 45 67"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Textarea
                    id="address"
                    value={newCustomer.address}
                    onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                    placeholder="Ex: Rue de la Paix 15, 1003 Lausanne"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddCustomer} className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    Ajouter
                  </Button>
                  <Button variant="outline" onClick={() => setShowNewCustomerForm(false)} className="flex-1">
                    Annuler
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Panel de recherche */}
          <div className="lg:col-span-1 space-y-4">
            {/* Barre de recherche */}
            <Card className="bg-card dark:bg-card">
              <CardContent className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par nom, email, téléphone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-background dark:bg-background"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Liste des clients */}
            <Card className="bg-card dark:bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <User className="h-5 w-5" />
                  Clients ({filteredCustomers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((customer) => (
                      <div
                        key={customer.id}
                        onClick={() => handleCustomerSelect(customer)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                          selectedCustomer?.id === customer.id
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "border-border hover:border-muted-foreground bg-background dark:bg-background"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs bg-muted dark:bg-muted">
                              {customer.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold text-sm text-foreground truncate">{customer.name}</p>
                              <Badge className={`text-xs ${getStatusColor(customer.status)}`}>
                                {customer.status === "active" ? "🟢" : "⚪"}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground truncate">{customer.email}</p>
                            <p className="text-xs text-muted-foreground">{customer.totalTransactions} transactions</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Aucun client trouvé</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Panel de détails */}
          <div className="lg:col-span-2">
            {selectedCustomer ? (
              <Card className="bg-card dark:bg-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarFallback className="text-2xl bg-muted dark:bg-muted">
                          {selectedCustomer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="text-2xl font-bold text-foreground">{selectedCustomer.name}</h2>
                        <p className="text-muted-foreground">ID: {selectedCustomer.id}</p>
                        <Badge className={getStatusColor(selectedCustomer.status)}>
                          {selectedCustomer.status === "active" ? "🟢 Actif" : "⚪ Inactif"}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-card dark:bg-card">
                          <DialogHeader>
                            <DialogTitle>Modifier le client</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="edit-name">Nom complet</Label>
                              <Input
                                id="edit-name"
                                value={selectedCustomer.name}
                                onChange={(e) => setSelectedCustomer({ ...selectedCustomer, name: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-email">Email</Label>
                              <Input
                                id="edit-email"
                                type="email"
                                value={selectedCustomer.email}
                                onChange={(e) => setSelectedCustomer({ ...selectedCustomer, email: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-phone">Téléphone</Label>
                              <Input
                                id="edit-phone"
                                value={selectedCustomer.phone}
                                onChange={(e) => setSelectedCustomer({ ...selectedCustomer, phone: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-address">Adresse</Label>
                              <Textarea
                                id="edit-address"
                                value={selectedCustomer.address}
                                onChange={(e) => setSelectedCustomer({ ...selectedCustomer, address: e.target.value })}
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button onClick={handleEditCustomer} className="flex-1">
                                <Save className="h-4 w-4 mr-2" />
                                Sauvegarder
                              </Button>
                              <Button variant="outline" onClick={() => setShowEditForm(false)} className="flex-1">
                                Annuler
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" size="sm">
                        <History className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="info" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-muted dark:bg-muted">
                      <TabsTrigger value="info">Informations</TabsTrigger>
                      <TabsTrigger value="stats">Statistiques</TabsTrigger>
                      <TabsTrigger value="actions">Actions</TabsTrigger>
                    </TabsList>

                    <TabsContent value="info" className="space-y-4 mt-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 p-3 bg-muted dark:bg-muted rounded-lg">
                            <Mail className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm text-muted-foreground">Email</p>
                              <p className="font-medium text-foreground">{selectedCustomer.email}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-3 bg-muted dark:bg-muted rounded-lg">
                            <Phone className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm text-muted-foreground">Téléphone</p>
                              <p className="font-medium text-foreground">{selectedCustomer.phone}</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-start gap-3 p-3 bg-muted dark:bg-muted rounded-lg">
                            <MapPin className="h-5 w-5 text-muted-foreground mt-1" />
                            <div>
                              <p className="text-sm text-muted-foreground">Adresse</p>
                              <p className="font-medium text-foreground">{selectedCustomer.address}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-3 bg-muted dark:bg-muted rounded-lg">
                            <Clock className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm text-muted-foreground">Client depuis</p>
                              <p className="font-medium text-foreground">
                                {new Date(selectedCustomer.joinDate).toLocaleDateString("fr-CH")}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="stats" className="space-y-4 mt-6">
                      <div className="grid md:grid-cols-3 gap-4">
                        <Card className="bg-background dark:bg-background">
                          <CardContent className="p-4 text-center">
                            <CreditCard className="h-8 w-8 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                            <p className="text-2xl font-bold text-foreground">{selectedCustomer.totalTransactions}</p>
                            <p className="text-sm text-muted-foreground">Transactions</p>
                          </CardContent>
                        </Card>

                        <Card className="bg-background dark:bg-background">
                          <CardContent className="p-4 text-center">
                            <CreditCard className="h-8 w-8 mx-auto mb-2 text-green-600 dark:text-green-400" />
                            <p className="text-2xl font-bold text-foreground">
                              {selectedCustomer.totalVolume.toLocaleString()} CHF
                            </p>
                            <p className="text-sm text-muted-foreground">Volume Total</p>
                          </CardContent>
                        </Card>

                        <Card className="bg-background dark:bg-background">
                          <CardContent className="p-4 text-center">
                            <Clock className="h-8 w-8 mx-auto mb-2 text-orange-600 dark:text-orange-400" />
                            <p className="text-lg font-bold text-foreground">
                              {selectedCustomer.lastTransaction
                                ? selectedCustomer.lastTransaction.split(" ")[0]
                                : "Aucune"}
                            </p>
                            <p className="text-sm text-muted-foreground">Dernière Transaction</p>
                          </CardContent>
                        </Card>
                      </div>

                      {selectedCustomer.totalTransactions > 0 && (
                        <Card className="bg-background dark:bg-background">
                          <CardHeader>
                            <CardTitle className="text-lg text-foreground">Moyenne par Transaction</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                              {(selectedCustomer.totalVolume / selectedCustomer.totalTransactions).toLocaleString()} CHF
                            </div>
                            <p className="text-muted-foreground mt-1">
                              Basé sur {selectedCustomer.totalTransactions} transactions
                            </p>
                          </CardContent>
                        </Card>
                      )}
                    </TabsContent>

                    <TabsContent value="actions" className="space-y-4 mt-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <Button
                          className="w-full h-16 bg-green-600 hover:bg-green-700"
                          onClick={() => onNavigate("tpe-payment")}
                        >
                          <div className="text-center">
                            <CreditCard className="h-6 w-6 mx-auto mb-1" />
                            <div>Nouveau Paiement</div>
                          </div>
                        </Button>

                        <Button
                          variant="outline"
                          className="w-full h-16 bg-background dark:bg-background"
                          onClick={() => onNavigate("tpe-history")}
                        >
                          <div className="text-center">
                            <History className="h-6 w-6 mx-auto mb-1" />
                            <div>Voir Historique</div>
                          </div>
                        </Button>

                        <Button variant="outline" className="w-full h-16 bg-background dark:bg-background">
                          <div className="text-center">
                            <Mail className="h-6 w-6 mx-auto mb-1" />
                            <div>Envoyer Email</div>
                          </div>
                        </Button>

                        <Button
                          variant="outline"
                          className="w-full h-16 bg-background dark:bg-background"
                          onClick={() => setShowEditForm(true)}
                        >
                          <div className="text-center">
                            <Edit className="h-6 w-6 mx-auto mb-1" />
                            <div>Modifier Profil</div>
                          </div>
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-card dark:bg-card">
                <CardContent className="p-12 text-center">
                  <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">Sélectionnez un Client</h3>
                  <p className="text-muted-foreground">Recherchez et sélectionnez un client pour voir ses détails</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
