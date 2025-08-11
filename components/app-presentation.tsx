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
    <div className="min-h-screen bg-[#F2F2F7] dark:bg-[#000000] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Progress Bar Style Apple */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="outline" className="bg-[#FFFFFF] dark:bg-[#1C1C1E] border-[#E5E5EA] dark:border-[#38383A] text-[#007AFF] font-medium">
              {userType === "client" ? "Mode Client" : "Mode Commerçant"}
            </Badge>
            <span className="text-sm text-[#8E8E93] font-medium">
              {currentSlide + 1} / {slides.length}
            </span>
          </div>
          <div className="w-full bg-[#E5E5EA] dark:bg-[#2C2C2E] rounded-full h-1">
            <div 
              className="h-1 bg-[#007AFF] rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Main Slide Style Apple */}
        <Card className="bg-[#FFFFFF] dark:bg-[#1C1C1E] border border-[#E5E5EA] dark:border-[#38383A] rounded-3xl shadow-sm overflow-hidden">
          <div className="bg-[#007AFF] p-8 text-white text-center">
            <div className="w-20 h-20 bg-white/15 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
              {currentSlideData.icon}
            </div>
            <h1 className="text-3xl font-semibold mb-4">{currentSlideData.title}</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">{currentSlideData.description}</p>
          </div>

          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-6">
              {currentSlideData.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-2xl border border-[#E5E5EA] dark:border-[#38383A]">
                  <div className="w-8 h-8 bg-[#34C759] rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-[#000000] dark:text-[#FFFFFF] font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation Style Apple */}
        <div className="flex items-center justify-between mt-8">
          <Button 
            variant="outline" 
            onClick={prevSlide} 
            disabled={currentSlide === 0} 
            className="bg-[#FFFFFF] dark:bg-[#1C1C1E] border-[#E5E5EA] dark:border-[#38383A] hover:bg-[#F2F2F7] dark:hover:bg-[#2C2C2E] rounded-xl h-11 px-6 disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4 mr-2 text-[#007AFF]" />
            <span className="text-[#007AFF] font-medium">Précédent</span>
          </Button>

          {/* Slide Indicators Style Apple */}
          <div className="flex items-center justify-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentSlide ? "bg-[#007AFF] scale-125" : "bg-[#E5E5EA] dark:bg-[#2C2C2E] hover:bg-[#8E8E93]"
                }`}
              />
            ))}
          </div>

          <Button
            onClick={nextSlide}
            className={`h-11 px-6 rounded-xl font-medium transition-all duration-200 ${
              currentSlide === slides.length - 1
                ? "bg-[#34C759] hover:bg-[#2FB344] text-white"
                : "bg-[#007AFF] hover:bg-[#0051D5] text-white"
            }`}
          >
            {currentSlide === slides.length - 1 ? (
              <>
                <span>Commencer</span>
                <CheckCircle className="h-4 w-4 ml-2" />
              </>
            ) : (
              <>
                <span>Suivant</span>
                <ChevronRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>

        {/* Skip Button Style Apple */}
        <div className="text-center mt-6">
          <Button 
            variant="ghost" 
            onClick={onComplete} 
            className="text-[#8E8E93] hover:text-[#007AFF] hover:bg-[#F2F2F7] dark:hover:bg-[#2C2C2E] rounded-xl h-11 px-6"
          >
            Passer l'introduction
          </Button>
        </div>
      </div>
    </div>
  )
}
