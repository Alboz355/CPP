export interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  currency: string
  type: 'buy' | 'sell' | 'transfer'
  vatRate?: number
  vatAmount?: number
  amountExcludingVAT?: number
  totalAmount?: number
}

export interface FiscalReport {
  period: {
    start: string
    end: string
  }
  summary: {
    totalRevenue: number
    totalVAT: number
    totalTransactions: number
    capitalGains: number
    capitalLosses: number
  }
  vatBreakdown: Array<{
    rate: number
    amount: number
    baseAmount: number
  }>
  transactions: Transaction[]
  declaration: {
    revenueSubjectToVAT: number
    vatCollected: number
    vatDeductible: number
    netVATDue: number
  }
}

export class FiscalReportManager {
  private static instance: FiscalReportManager

  static getInstance(): FiscalReportManager {
    if (!FiscalReportManager.instance) {
      FiscalReportManager.instance = new FiscalReportManager()
    }
    return FiscalReportManager.instance
  }

  async generateFiscalReport(startDate: Date, endDate: Date): Promise<FiscalReport> {
    // Récupérer les transactions de la période
    const transactions = this.getTransactionsForPeriod(startDate, endDate)
    
    // Calculer les totaux
    const summary = this.calculateSummary(transactions)
    
    // Calculer la répartition TVA
    const vatBreakdown = this.calculateVATBreakdown(transactions)
    
    // Générer la déclaration
    const declaration = this.generateDeclaration(summary, vatBreakdown)

    return {
      period: {
        start: startDate.toLocaleDateString('fr-FR'),
        end: endDate.toLocaleDateString('fr-FR')
      },
      summary,
      vatBreakdown,
      transactions,
      declaration
    }
  }

  private getTransactionsForPeriod(startDate: Date, endDate: Date): Transaction[] {
    // Simuler des transactions pour la démonstration
    const mockTransactions: Transaction[] = [
      {
        id: '1',
        date: new Date(2024, 0, 15).toISOString(),
        description: 'Vente Bitcoin',
        amount: 1000,
        currency: 'EUR',
        type: 'sell',
        vatRate: 20,
        vatAmount: 200,
        amountExcludingVAT: 833.33,
        totalAmount: 1000
      },
      {
        id: '2',
        date: new Date(2024, 0, 20).toISOString(),
        description: 'Vente Ethereum',
        amount: 500,
        currency: 'EUR',
        type: 'sell',
        vatRate: 20,
        vatAmount: 100,
        amountExcludingVAT: 416.67,
        totalAmount: 500
      },
      {
        id: '3',
        date: new Date(2024, 0, 25).toISOString(),
        description: 'Commission de trading',
        amount: 50,
        currency: 'EUR',
        type: 'sell',
        vatRate: 10,
        vatAmount: 4.55,
        amountExcludingVAT: 45.45,
        totalAmount: 50
      }
    ]

    // Filtrer par période
    return mockTransactions.filter(transaction => {
      const transactionDate = new Date(transaction.date)
      return transactionDate >= startDate && transactionDate <= endDate
    })
  }

  private calculateSummary(transactions: Transaction[]) {
    let totalRevenue = 0
    let totalVAT = 0
    let capitalGains = 0
    let capitalLosses = 0

    transactions.forEach(transaction => {
      if (transaction.amountExcludingVAT) {
        totalRevenue += transaction.amountExcludingVAT
      }
      if (transaction.vatAmount) {
        totalVAT += transaction.vatAmount
      }

      // Calcul simplifié des gains/pertes en capital
      if (transaction.type === 'sell') {
        const gain = transaction.amount * 0.1 // Simulation d'un gain de 10%
        if (gain > 0) {
          capitalGains += gain
        } else {
          capitalLosses += Math.abs(gain)
        }
      }
    })

    return {
      totalRevenue,
      totalVAT,
      totalTransactions: transactions.length,
      capitalGains,
      capitalLosses
    }
  }

  private calculateVATBreakdown(transactions: Transaction[]) {
    const vatMap = new Map<number, { amount: number; baseAmount: number }>()

    transactions.forEach(transaction => {
      if (transaction.vatRate && transaction.vatAmount && transaction.amountExcludingVAT) {
        const existing = vatMap.get(transaction.vatRate) || { amount: 0, baseAmount: 0 }
        vatMap.set(transaction.vatRate, {
          amount: existing.amount + transaction.vatAmount,
          baseAmount: existing.baseAmount + transaction.amountExcludingVAT
        })
      }
    })

    return Array.from(vatMap.entries()).map(([rate, data]) => ({
      rate,
      amount: data.amount,
      baseAmount: data.baseAmount
    }))
  }

  private generateDeclaration(summary: any, vatBreakdown: any[]) {
    const revenueSubjectToVAT = summary.totalRevenue
    const vatCollected = summary.totalVAT
    const vatDeductible = 0 // À calculer selon les achats professionnels
    const netVATDue = vatCollected - vatDeductible

    return {
      revenueSubjectToVAT,
      vatCollected,
      vatDeductible,
      netVATDue
    }
  }

  exportToCSV(report: FiscalReport, filename: string) {
    const csvContent = this.generateCSVContent(report)
    this.downloadFile(csvContent, `${filename}.csv`, 'text/csv')
  }

  exportToPDF(report: FiscalReport, filename: string) {
    // Simulation d'export PDF
    const pdfContent = this.generatePDFContent(report)
    this.downloadFile(pdfContent, `${filename}.pdf`, 'application/pdf')
  }

  private generateCSVContent(report: FiscalReport): string {
    let csv = 'Date,Description,Montant HT,Taux TVA,TVA,Total TTC\n'
    
    report.transactions.forEach(transaction => {
      csv += `${new Date(transaction.date).toLocaleDateString('fr-FR')},`
      csv += `"${transaction.description}",`
      csv += `${transaction.amountExcludingVAT?.toFixed(2) || '0.00'},`
      csv += `${transaction.vatRate || 0}%,`
      csv += `${transaction.vatAmount?.toFixed(2) || '0.00'},`
      csv += `${transaction.totalAmount?.toFixed(2) || '0.00'}\n`
    })

    csv += '\n\nRésumé fiscal:\n'
    csv += `Chiffre d'affaires HT,${report.summary.totalRevenue.toFixed(2)}\n`
    csv += `TVA collectée,${report.summary.totalVAT.toFixed(2)}\n`
    csv += `TVA nette due,${report.declaration.netVATDue.toFixed(2)}\n`

    return csv
  }

  private generatePDFContent(report: FiscalReport): string {
    // Simulation - dans un vrai projet, utiliser une librairie PDF comme jsPDF
    return `Rapport Fiscal - ${report.period.start} au ${report.period.end}
    
Résumé:
- Chiffre d'affaires HT: ${report.summary.totalRevenue.toFixed(2)} €
- TVA collectée: ${report.summary.totalVAT.toFixed(2)} €
- TVA nette due: ${report.declaration.netVATDue.toFixed(2)} €

Transactions:
${report.transactions.map(t => 
  `${new Date(t.date).toLocaleDateString('fr-FR')} - ${t.description}: ${t.totalAmount?.toFixed(2)} €`
).join('\n')}
`
  }

  private downloadFile(content: string, filename: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Méthodes pour la gestion FIFO des cryptomonnaies
  calculateFIFOGains(transactions: Transaction[]): number {
    // Implémentation simplifiée du calcul FIFO
    const buyTransactions = transactions.filter(t => t.type === 'buy').sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )
    const sellTransactions = transactions.filter(t => t.type === 'sell').sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )

    let totalGains = 0
    let buyIndex = 0
    let remainingBuyAmount = buyTransactions[0]?.amount || 0

    sellTransactions.forEach(sell => {
      let remainingSellAmount = sell.amount

      while (remainingSellAmount > 0 && buyIndex < buyTransactions.length) {
        const buy = buyTransactions[buyIndex]
        const amountToProcess = Math.min(remainingSellAmount, remainingBuyAmount)
        
        // Calcul du gain/perte
        const buyPrice = buy.amount / buy.amount // Prix unitaire d'achat
        const sellPrice = sell.amount / sell.amount // Prix unitaire de vente
        const gain = (sellPrice - buyPrice) * amountToProcess
        
        totalGains += gain
        
        remainingSellAmount -= amountToProcess
        remainingBuyAmount -= amountToProcess
        
        if (remainingBuyAmount === 0) {
          buyIndex++
          remainingBuyAmount = buyTransactions[buyIndex]?.amount || 0
        }
      }
    })

    return totalGains
  }
}
