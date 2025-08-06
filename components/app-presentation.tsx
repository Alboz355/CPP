"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, Wallet, BarChart3, Shield, CreditCard, Store, Zap, CheckCircle } from "lucide-react"
import type { UserType } from "@/components/onboarding-page"

interface AppPresentationProps {
  userType: UserType
  onComplete: () => void
}

interface Slide {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  features: string[]
  gradient: string
}

export function AppPresentation({ userType, onComplete }: AppPresentationProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [progress, setProgress] = useState(0)

  const clientSlides: Slide[] = [
    {
      id: "welcome",
      title: "Bienvenue dans votre Portefeuille Crypto",
      description:
        "Gérez vos cryptomonnaies en toute sécurité avec une interface intuitive et des fonctionnalités avancées.",
      icon: <Wallet className="h-12 w-12 text-white" />,
      features: [
        "Support multi-crypto (Bitcoin, Ethereum, Algorand)",
        "Interface utilisateur intuitive",
        "Sécurité de niveau bancaire",
        "Synchronisation multi-appareils",
      ],
      gradient: "from-blue-600 to-purple-600",
    },
    {
      id: "security",
      title: "Sécurité Maximale",
      description:
        "Vos clés privées sont chiffrées et stockées localement. Vous gardez le contrôle total de vos actifs.",
      icon: <Shield className="h-12 w-12 text-white" />,
      features: [
        "Chiffrement AES-256",
        "Clés privées stockées localement",
        "Authentification par PIN",
        "Phrase de récupération sécurisée",
      ],
      gradient: "from-green-600 to-teal-600",
    },
    {
      id: "features",
      title: "Fonctionnalités Complètes",
      description: "Envoyez, recevez et suivez vos cryptomonnaies avec des outils professionnels.",
      icon: <Zap className="h-12 w-12 text-white" />,
      features: [
        "Envoi et réception instantanés",
        "Historique détaillé des transactions",
        "Prix en temps réel",
        "Alertes de prix personnalisées",
      ],
      gradient: "from-orange-600 to-red-600",
    },
    {
      id: "ready",
      title: "Prêt à Commencer",
      description:
        "Votre portefeuille est configuré et prêt à l'emploi. Commencez à gérer vos cryptomonnaies dès maintenant !",
      icon: <CheckCircle className="h-12 w-12 text-white" />,
      features: ["Configuration terminée", "Portefeuille sécurisé", "Interface prête", "Support disponible 24/7"],
      gradient: "from-purple-600 to-pink-600",
    },
  ]

  const merchantSlides: Slide[] = [
    {
      id: "welcome",
      title: "Bienvenue dans votre TPE Crypto",
      description:
        "Acceptez les paiements en cryptomonnaies et développez votre activité avec des outils professionnels.",
      icon: <Store className="h-12 w-12 text-white" />,
      features: [
        "Terminal de paiement intégré",
        "Acceptation multi-crypto",
        "Facturation automatisée",
        "Reporting complet",
      ],
      gradient: "from-blue-600 to-indigo-600",
    },
    {
      id: "payments",
      title: "Paiements Simplifiés",
      description: "Encaissez vos paiements crypto rapidement avec un terminal de paiement professionnel.",
      icon: <CreditCard className="h-12 w-12 text-white" />,
      features: ["Interface TPE intuitive", "QR codes automatiques", "Confirmation instantanée", "Reçus numériques"],
      gradient: "from-green-600 to-emerald-600",
    },
    {
      id: "business",
      title: "Outils Professionnels",
      description: "Gérez votre activité avec des outils de facturation, reporting et gestion de la TVA.",
      icon: <BarChart3 className="h-12 w-12 text-white" />,
      features: [
        "Gestion de la TVA suisse",
        "Rapports financiers détaillés",
        "Historique des transactions",
        "Export comptable",
      ],
      gradient: "from-purple-600 to-violet-600",
    },
    {
      id: "ready",
      title: "Votre Commerce est Prêt",
      description:
        "Votre terminal de paiement crypto est configuré. Commencez à accepter les paiements dès maintenant !",
      icon: <CheckCircle className="h-12 w-12 text-white" />,
      features: ["TPE opérationnel", "Paiements activés", "Reporting configuré", "Support commercial 24/7"],
      gradient: "from-orange-600 to-amber-600",
    },
  ]

  const slides = userType === "client" ? clientSlides : merchantSlides

  useEffect(() => {
    setProgress(((currentSlide + 1) / slides.length) * 100)
  }, [currentSlide, slides.length])

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    } else {
      onComplete()
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const currentSlideData = slides[currentSlide]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline" className="bg-white/50">
              {userType === "client" ? "Mode Client" : "Mode Commerçant"}
            </Badge>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {currentSlide + 1} / {slides.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Main Slide */}
        <Card className="shadow-2xl border-0 overflow-hidden">
          <div className={`bg-gradient-to-r ${currentSlideData.gradient} p-8 text-white text-center`}>
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              {currentSlideData.icon}
            </div>
            <h1 className="text-3xl font-bold mb-4">{currentSlideData.title}</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">{currentSlideData.description}</p>
          </div>

          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-6">
              {currentSlideData.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Button variant="outline" onClick={prevSlide} disabled={currentSlide === 0} className="bg-white/50">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Précédent
          </Button>

          {/* Slide Indicators */}
          <div className="flex items-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide ? "bg-blue-600 scale-125" : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>

          <Button
            onClick={nextSlide}
            className={`${
              currentSlide === slides.length - 1
                ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            } text-white`}
          >
            {currentSlide === slides.length - 1 ? (
              <>
                Commencer
                <CheckCircle className="h-4 w-4 ml-2" />
              </>
            ) : (
              <>
                Suivant
                <ChevronRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>

        {/* Skip Button */}
        <div className="text-center mt-6">
          <Button variant="ghost" onClick={onComplete} className="text-gray-500 hover:text-gray-700">
            Passer l'introduction
          </Button>
        </div>
      </div>
    </div>
  )
}
