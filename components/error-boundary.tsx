"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null,
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error, errorInfo: null }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo)
    this.setState({ errorInfo })
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
    // Optionally, navigate to home or refresh the page
    window.location.reload()
  }

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
          {this.props.fallback || (
            <Card className="w-full max-w-md text-center shadow-lg">
              <CardHeader>
                <CardTitle className="text-red-500 text-2xl">Oups! Quelque chose s'est mal passé.</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Nous sommes désolés, une erreur inattendue est survenue.</p>
                {process.env.NODE_ENV === "development" && this.state.error && (
                  <details className="text-sm text-left p-2 bg-muted rounded-md overflow-auto max-h-48">
                    <summary className="font-semibold cursor-pointer">Détails de l'erreur</summary>
                    <pre className="mt-2 whitespace-pre-wrap break-all">
                      {this.state.error.toString()}
                      <br />
                      {this.state.errorInfo?.componentStack}
                    </pre>
                  </details>
                )}
                <Button onClick={this.handleReset} className="w-full">
                  Recharger l'application
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )
    }

    return this.props.children
  }
}
