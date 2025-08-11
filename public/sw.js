// Service Worker pour CryptoPay Pro - Version de cache optimisée
const CACHE_NAME = 'cryptopay-pro-v1.2.0'
const API_CACHE_NAME = 'cryptopay-api-v1.0.0'

// Ressources critiques à mettre en cache immédiatement
const CORE_ASSETS = [
  '/',
  '/manifest.json',
  '/_next/static/css/app.css',
  '/_next/static/chunks/main.js',
  '/_next/static/chunks/pages/_app.js',
  '/_next/static/chunks/webpack.js',
  '/placeholder-logo.png',
  '/placeholder-logo.svg'
]

// Ressources API à mettre en cache avec stratégie stale-while-revalidate
const API_ROUTES = [
  '/api/crypto-prices',
  '/api/blockchain'
]

// Installation du service worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...')
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Caching core assets')
      return cache.addAll(CORE_ASSETS)
    }).then(() => {
      // Forcer l'activation immédiate
      return self.skipWaiting()
    })
  )
})

// Activation du service worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...')
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Supprimer les anciens caches
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
            console.log('Service Worker: Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => {
      // Prendre le contrôle de toutes les pages
      return self.clients.claim()
    })
  )
})

// Stratégies de cache pour différents types de requêtes
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Ignorer les requêtes non-HTTP
  if (!request.url.startsWith('http')) {
    return
  }

  // Stratégies spécifiques selon le type de ressource
  if (request.method === 'GET') {
    if (url.pathname.startsWith('/api/')) {
      // API: Stale-while-revalidate pour les données en temps réel
      event.respondWith(staleWhileRevalidate(request, API_CACHE_NAME))
    } else if (url.pathname.startsWith('/_next/static/')) {
      // Assets statiques: Cache first (ils sont versionnés)
      event.respondWith(cacheFirst(request, CACHE_NAME))
    } else if (url.pathname.match(/\.(js|css|woff|woff2|ttf|eot|ico|png|jpg|jpeg|svg|gif)$/)) {
      // Ressources statiques: Cache first avec fallback
      event.respondWith(cacheFirst(request, CACHE_NAME))
    } else {
      // Pages HTML: Network first avec fallback cache
      event.respondWith(networkFirst(request, CACHE_NAME))
    }
  }
})

// Stratégie Cache First - Pour les ressources statiques
async function cacheFirst(request, cacheName) {
  try {
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }
    
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.error('Cache first strategy failed:', error)
    return caches.match('/offline.html')
  }
}

// Stratégie Network First - Pour les pages HTML
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request)
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, networkResponse.clone())
    }
    
    return networkResponse
  } catch (error) {
    console.log('Network first failed, trying cache:', request.url)
    const cachedResponse = await caches.match(request)
    
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Fallback pour les pages
    if (request.destination === 'document') {
      return caches.match('/')
    }
    
    return new Response('Offline', { status: 503 })
  }
}

// Stratégie Stale While Revalidate - Pour les APIs
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cachedResponse = await cache.match(request)
  
  // Fetch depuis le réseau en arrière-plan
  const networkPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone())
    }
    return response
  }).catch(() => {
    // En cas d'erreur réseau, ne pas écraser le cache
    console.log('Network failed for:', request.url)
  })
  
  // Retourner immédiatement la version cachée si elle existe
  if (cachedResponse) {
    return cachedResponse
  }
  
  // Sinon, attendre la réponse réseau
  return networkPromise
}

// Gestion des messages du client principal
self.addEventListener('message', (event) => {
  const { type, payload } = event.data
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting()
      break
      
    case 'GET_VERSION':
      event.ports[0].postMessage({ version: CACHE_NAME })
      break
      
    case 'CLEAR_CACHE':
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        )
      }).then(() => {
        event.ports[0].postMessage({ success: true })
      })
      break
      
    default:
      console.log('Unknown message type:', type)
  }
})

// Nettoyage périodique du cache
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'cache-cleanup') {
    event.waitUntil(cleanupCache())
  }
})

async function cleanupCache() {
  const cacheNames = await caches.keys()
  
  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName)
    const requests = await cache.keys()
    
    // Supprimer les entrées de cache anciennes (plus de 7 jours)
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)
    
    for (const request of requests) {
      const response = await cache.match(request)
      if (response) {
        const dateHeader = response.headers.get('date')
        if (dateHeader) {
          const responseDate = new Date(dateHeader).getTime()
          if (responseDate < oneWeekAgo) {
            cache.delete(request)
          }
        }
      }
    }
  }
}

// Mise à jour automatique
self.addEventListener('updatefound', () => {
  console.log('Service Worker: Update found')
  
  // Notifier le client principal qu'une mise à jour est disponible
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({
        type: 'UPDATE_AVAILABLE',
        payload: { version: CACHE_NAME }
      })
    })
  })
})