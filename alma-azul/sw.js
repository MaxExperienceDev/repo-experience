'use strict';

var VERSION = '2026.03.31.00.58.18';
const CACHE_NAME = `cache-v${VERSION}`;
var CORE_ASSETS = [
  "./assets/css/style.css",
  "./assets/img/icons/apple-splash-1170x2532.png",
  "./assets/img/icons/apple-splash-1179x2556.png",
  "./assets/img/icons/apple-splash-1290x2796.png",
  "./assets/img/icons/apple-splash-750x1334.png",
  "./assets/img/icons/apple-touch-icon-180.png",
  "./assets/img/icons/favicon.ico",
  "./assets/img/icons/icon-192-maskable.png",
  "./assets/img/icons/icon-192.png",
  "./assets/img/icons/icon-512-maskable.png",
  "./assets/img/icons/icon-512.png",
  "./assets/img/icons/icon-android.png",
  "./assets/img/icons/og.png",
  "./assets/img/icons/screenshot-contact.png",
  "./assets/img/icons/screenshot-home.png",
  "./assets/img/icons/screenshot-services.png",
  "./assets/img/images/logo.jpg",
  "./assets/img/social/facebook.svg",
  "./assets/img/social/instagram.svg",
  "./assets/img/social/x.svg",
  "./index.html",
  "./js/app.js",
  "./js/botones.js",
  "./js/pwa-install-handler.js",
  "./js/qrcode.js",
  "./js/qrcode.min.js",
  "./js/toggle-servicios.js",
  "./offline.html"
];

const OFFLINE_URL = './offline.html';

const networkWithTimeout = (request, timeout = 3000) => {
  return Promise.race([
    fetch(request),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Network timeout')), timeout)
    )
  ]);
};

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    if (CORE_ASSETS.length) {
      await Promise.allSettled(CORE_ASSETS.map(a => cache.add(a)));
    }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET' || !req.url.startsWith(self.location.origin)) return;

  const isStatic = /\.(js|css|png|jpg|jpeg|svg|webp|avif|ico|ttf|woff2?|html|json)$/i.test(new URL(req.url).pathname);

  event.respondWith((async () => {
    try {
      const networkRes = await networkWithTimeout(req, 3000);

      if (networkRes && networkRes.ok) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(req, networkRes.clone()).catch(() => {});
      }

      return networkRes;
    } catch {
      const cachedRes = await caches.match(req);
      if (cachedRes) return cachedRes;

      if (req.mode === 'navigate') {
        return caches.match(OFFLINE_URL);
      }

      return new Response('Offline', { status: 503 });
    }
  })());
});
