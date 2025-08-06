"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, FileText, Euro, Percent } from "lucide-react"
import type { AppState } from "@/app/page"

interface BillingPageProps {
  onNavigate: (page: AppState) => void
}

export function TPEBillingPage({ onNavigate }: BillingPageProps) {
  const [invoiceData, setInvoiceData] = useState({
    customerName: "",
    customerEmail: "",
    customerAddress: "",
    items: [{ description: "", quantity: 1, unitPrice: 0 }],
    vatRate: 20,
    notes: "",
  })

  const addItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [...invoiceData.items, { description: "", quantity: 1, unitPrice: 0 }],
    })
  }

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...invoiceData.items]
    newItems[index] = { ...newItems[index], [field]: value }
    setInvoiceData({ ...invoiceData, items: newItems })
  }

  const removeItem = (index: number) => {
    const newItems = invoiceData.items.filter((_, i) => i !== index)
    setInvoiceData({ ...invoiceData, items: newItems })
  }

  const calculateSubtotal = () => {
    return invoiceData.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  }

  const calculateVAT = () => {
    return (calculateSubtotal() * invoiceData.vatRate) / 100
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateVAT()
  }

  const generateInvoice = () => {
    const invoice = {
      id: `INV-${Date.now()}`,
      date: new Date().toISOString(),
      customer: {
        name: invoiceData.customerName,
        email: invoiceData.customerEmail,
        address: invoiceData.customerAddress,
      },
      items: invoiceData.items,
      subtotal: calculateSubtotal(),
      vatRate: invoiceData.vatRate,
      vatAmount: calculateVAT(),
      total: calculateTotal(),
      notes: invoiceData.notes,
      status: "pending",
    }

    // Sauvegarder la facture
    const existingInvoices = JSON.parse(localStorage.getItem("tpe-invoices") || "[]")
    existingInvoices.push(invoice)
    localStorage.setItem("tpe-invoices", JSON.stringify(existingInvoices))

    // Réinitialiser le formulaire
    setInvoiceData({
      customerName: "",
      customerEmail: "",
      customerAddress: "",
      items: [{ description: "", quantity: 1, unitPrice: 0 }],
      vatRate: 20,
      notes: "",
    })

    alert(`Facture ${invoice.id} créée avec succès !`)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 ios-safe-area">
      {/* Header */}
      <div className="flex items-center p-4 ios-safe-top border-b border-gray-700">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onNavigate("tpe")}
          className="touch-target mr-2 hover:bg-gray-800"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Facturation</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Informations client */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Informations Client
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="customerName" className="text-gray-300">
                Nom du client
              </Label>
              <Input
                id="customerName"
                value={invoiceData.customerName}
                onChange={(e) => setInvoiceData({ ...invoiceData, customerName: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Nom complet du client"
              />
            </div>
            <div>
              <Label htmlFor="customerEmail" className="text-gray-300">
                Email
              </Label>
              <Input
                id="customerEmail"
                type="email"
                value={invoiceData.customerEmail}
                onChange={(e) => setInvoiceData({ ...invoiceData, customerEmail: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="email@exemple.com"
              />
            </div>
            <div>
              <Label htmlFor="customerAddress" className="text-gray-300">
                Adresse
              </Label>
              <Textarea
                id="customerAddress"
                value={invoiceData.customerAddress}
                onChange={(e) => setInvoiceData({ ...invoiceData, customerAddress: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Adresse complète du client"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Articles */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center justify-between">
              <span className="flex items-center">
                <Euro className="h-5 w-5 mr-2" />
                Articles
              </span>
              <Button onClick={addItem} size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-1" />
                Ajouter
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {invoiceData.items.map((item, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-700 rounded-lg">
                <div className="md:col-span-2">
                  <Label className="text-gray-300">Description</Label>
                  <Input
                    value={item.description}
                    onChange={(e) => updateItem(index, "description", e.target.value)}
                    className="bg-gray-600 border-gray-500 text-white"
                    placeholder="Description de l'article"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Quantité</Label>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, "quantity", Number.parseInt(e.target.value) || 0)}
                    className="bg-gray-600 border-gray-500 text-white"
                    min="1"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Prix unitaire (€)</Label>
                  <div className="flex">
                    <Input
                      type="number"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(index, "unitPrice", Number.parseFloat(e.target.value) || 0)}
                      className="bg-gray-600 border-gray-500 text-white"
                      min="0"
                    />
                    {invoiceData.items.length > 1 && (
                      <Button variant="destructive" size="sm" onClick={() => removeItem(index)} className="ml-2">
                        ×
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Paramètres de facturation */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center">
              <Percent className="h-5 w-5 mr-2" />
              Paramètres
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="vatRate" className="text-gray-300">
                Taux de TVA (%)
              </Label>
              <Select
                value={invoiceData.vatRate.toString()}
                onValueChange={(value) => setInvoiceData({ ...invoiceData, vatRate: Number.parseInt(value) })}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="0">0% (Exonéré)</SelectItem>
                  <SelectItem value="5.5">5.5% (Taux réduit)</SelectItem>
                  <SelectItem value="10">10% (Taux intermédiaire)</SelectItem>
                  <SelectItem value="20">20% (Taux normal)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="notes" className="text-gray-300">
                Notes
              </Label>
              <Textarea
                id="notes"
                value={invoiceData.notes}
                onChange={(e) => setInvoiceData({ ...invoiceData, notes: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Notes additionnelles pour la facture"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Récapitulatif */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg text-white">Récapitulatif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-white">
              <div className="flex justify-between">
                <span>Sous-total:</span>
                <span>{calculateSubtotal().toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span>TVA ({invoiceData.vatRate}%):</span>
                <span>{calculateVAT().toFixed(2)} €</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t border-gray-600 pt-2">
                <span>Total:</span>
                <span>{calculateTotal().toFixed(2)} €</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            onClick={generateInvoice}
            className="flex-1 bg-green-600 hover:bg-green-700"
            disabled={!invoiceData.customerName || invoiceData.items.some((item) => !item.description)}
          >
            Générer la facture
          </Button>
        </div>
      </div>
    </div>
  )
}
