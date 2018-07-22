const cacheName = 'yak-ide'

self.addEventListener('install', (event) => { // eslint-disable-line
  event.waitUntil(
    caches.open(cacheName).then(cache => cache.addAll([
      './yaklogo.gif',
      '3.png',
      '/',
    ])),
  )
})

self.addEventListener('fetch', (event) => { // eslint-disable-line
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true })
      .then((resp) => {
        if (resp) {
          return resp
        }

        const requestToCache = event.request.clone()
        return fetch(requestToCache).then((response) => {
          if (!response || response.status !== 200) {
            return response
          }

          const responseToCache = response.clone()
          caches.open(cacheName).then((cache) => {
            cache.put(requestToCache, responseToCache)
          })
          return response
        })
      }),
  )
})
