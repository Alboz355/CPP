let isInitialized = false

export function initObservability() {
  if (isInitialized) return
  try {
    const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN || ''
    if (!dsn) {
      // Aucune observabilité configurée
      isInitialized = true
      return
    }
    // Placeholder léger: on pourrait brancher ici un SDK externe via CDN si souhaité.
    // Pour l’instant, on évite toute importation afin de ne pas casser le build.
    // Exemple (désactivé): injecter un script CDN si CSP le permet.
    // console.info('[Observability] DSN fourni, mais SDK non chargé (configurer CDN et CSP pour l’activer).')
    isInitialized = true
  } catch {
    // No-op
    isInitialized = true
  }
}
