"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Mail, Send, CheckCircle, AlertCircle, MessageCircle } from "lucide-react"
import emailjs from "@emailjs/browser"

interface SupportContactModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SupportContactModal({ isOpen, onClose }: SupportContactModalProps) {
  const [formData, setFormData] = useState({
    email: "",
    subject: "",
    category: "",
    message: "",
    priority: "normal",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  if (!isOpen) return null

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const validateForm = () => {
    if (!formData.email) return "L'adresse e-mail est requise"
    if (!formData.email.includes("@")) return "Adresse e-mail invalide"
    if (!formData.subject) return "L'objet est requis"
    if (!formData.category) return "Veuillez sélectionner une catégorie"
    if (!formData.message) return "Le message est requis"
    if (formData.message.length < 10) return "Le message doit contenir au moins 10 caractères"
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      // Configuration EmailJS avec vos vrais IDs
      const serviceId = "service_0cen23r"
      const templateId = "template_bg97ynr"
      const publicKey = "yfMJVUvA62CKF7Div"

      // Paramètres du template
      const templateParams = {
        from_name: formData.email,
        from_email: formData.email,
        to_name: "Support Crypto Wallet",
        to_email: "leartshabija@gmail.com",
        subject: formData.subject,
        category: categories.find((c) => c.value === formData.category)?.label || formData.category,
        priority: priorities.find((p) => p.value === formData.priority)?.label || formData.priority,
        message: formData.message,
        date: new Date().toLocaleString("fr-CH"),
        reply_to: formData.email,
      }

      // Envoyer l'email via EmailJS
      const response = await emailjs.send(serviceId, templateId, templateParams, publicKey)

      console.log("Email envoyé avec succès:", response)
      setIsSubmitted(true)
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error)
      setError("Erreur lors de l'envoi de l'email. Veuillez vérifier votre configuration EmailJS ou réessayer.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setFormData({
      email: "",
      subject: "",
      category: "",
      message: "",
      priority: "normal",
    })
    setIsSubmitting(false)
    setIsSubmitted(false)
    setError("")
    onClose()
  }

  const categories = [
    { value: "seed-phrase", label: "Problème avec la phrase de récupération" },
    { value: "wallet", label: "Problème de portefeuille" },
    { value: "transaction", label: "Problème de transaction" },
    { value: "tpe", label: "Mode TPE" },
    { value: "security", label: "Sécurité" },
    { value: "bug", label: "Bug ou erreur" },
    { value: "feature", label: "Demande de fonctionnalité" },
    { value: "other", label: "Autre" },
  ]

  const priorities = [
    { value: "low", label: "Faible" },
    { value: "normal", label: "Normal" },
    { value: "high", label: "Élevée" },
    { value: "urgent", label: "Urgent" },
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/10 rounded-full flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-xl">Support & Contact</CardTitle>
                <CardDescription>
                  Besoin d'aide ? Contactez notre équipe support 24/7
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Adresse e-mail */}
              <div className="space-y-2">
                <Label htmlFor="email">Votre adresse e-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre.email@exemple.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>

              {/* Catégorie */}
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Priorité */}
              <div className="space-y-2">
                <Label htmlFor="priority">Priorité</Label>
                <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        {priority.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Objet */}
              <div className="space-y-2">
                <Label htmlFor="subject">Objet *</Label>
                <Input
                  id="subject"
                  placeholder="Résumé de votre demande"
                  value={formData.subject}
                  onChange={(e) => handleInputChange("subject", e.target.value)}
                  required
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  placeholder="Décrivez votre problème ou votre question en détail..."
                  rows={6}
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">Minimum 10 caractères ({formData.message.length}/10)</p>
              </div>

              {/* Erreur */}
              {error && (
                <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                  </div>
                </div>
              )}

              {/* Information */}
              <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-lg p-4">
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <p className="font-medium mb-2">📧 Comment ça marche :</p>
                  <ul className="space-y-1">
                    <li>• Votre message sera envoyé directement par email</li>
                    <li>• Vous recevrez une confirmation une fois envoyé</li>
                    <li>• Nous vous répondrons dans les plus brefs délais</li>
                    <li>• L'email sera envoyé à leartshabija@gmail.com</li>
                  </ul>
                </div>
              </div>

              {/* Boutons */}
              <div className="flex space-x-3">
                <Button type="button" variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
                  Annuler
                </Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Envoyer
                    </>
                  )}
                </Button>
              </div>
            </form>
          ) : (
            /* Confirmation d'envoi */
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-green-800 dark:text-green-200 mb-2">
                  Email envoyé avec succès !
                </h3>
                <p className="text-green-700 dark:text-green-300 mb-4">
                  Votre message a été envoyé à notre équipe de support.
                </p>
                <p className="text-sm text-muted-foreground">
                  Nous vous répondrons dans les plus brefs délais à l'adresse :
                  <br />
                  <strong>{formData.email}</strong>
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-lg p-4">
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <p className="font-medium mb-2">📋 Résumé de votre demande :</p>
                  <ul className="space-y-1 text-left">
                    <li>
                      <strong>Catégorie :</strong> {categories.find((c) => c.value === formData.category)?.label}
                    </li>
                    <li>
                      <strong>Priorité :</strong> {priorities.find((p) => p.value === formData.priority)?.label}
                    </li>
                    <li>
                      <strong>Objet :</strong> {formData.subject}
                    </li>
                  </ul>
                </div>
              </div>

              <Button onClick={handleClose} className="w-full">
                Fermer
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
