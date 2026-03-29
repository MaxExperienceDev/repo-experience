// ============================================================
// sw.js — Refactor Resiliente Determinista
// ============================================================

'use strict';

/* =========================
   BUILD-INJECTED CONSTANTS
========================= */

var VERSION = '2026.03.28.22.41.55';
const CACHE_NAME = `cache-v${VERSION}`;
var CORE_ASSETS = [
  "./assets/css/style.css",
  "./assets/img/icons/apple-splash-1170x2532.png",
  "./assets/img/icons/apple-splash-1179x2556.png",
  "./assets/img/icons/apple-splash-1290x2796.png",
  "./assets/img/icons/apple-splash-750x1334.png",
  "./assets/img/icons/apple-touch-icon.png",
  "./assets/img/icons/favicon.ico",
  "./assets/img/icons/icon-192-maskable.png",
  "./assets/img/icons/icon-192.png",
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

/* =========================
   NETWORK WITH TIMEOUT
========================= */

const networkWithTimeout = (request, timeout = 3000) => {
  return Promise.race([
    fetch(request),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Network timeout')), timeout)
    )
  ]);
};

/* =========================
   INSTALL — RESILIENT
========================= */

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    if (CORE_ASSETS.length) {
      await Promise.allSettled(
        CORE_ASSETS.map(asset => cache.add(asset))
      );
    }
    await self.skipWaiting();
  })());
});

/* =========================
   ACTIVATE — GC + INTEGRITY
========================= */

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    // 1️⃣ Eliminar caches antiguas
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter(key => key !== CACHE_NAME)
        .map(key => caches.delete(key))
    );
    // 2️⃣ Validación de integridad
    if (CORE_ASSETS.length) {
      const cache = await caches.open(CACHE_NAME);
      const entries = await cache.keys();
      if (entries.length < CORE_ASSETS.length) {
        await Promise.allSettled(
          CORE_ASSETS.map(asset => cache.add(asset))
        );
      }
    }
    await self.clients.claim();
  })());
});

/* =========================
   FETCH — NETWORK FIRST
========================= */

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET' || !/^https?:/i.test(req.url)) return;
  const url = new URL(req.url);
  const isStatic =
    /\.(js|css|png|jpg|jpeg|svg|webp|avif|ico|ttf|woff2?|html|json)$/i
    .test(url.pathname);
  const networkRequest = isStatic
    ? new Request(
        url.href + (url.search ? '&' : '?') + `v=${VERSION}`,
        { cache: 'reload' }
      )
    : req;
  event.respondWith((async () => {
    try {
      const networkRes = await networkWithTimeout(networkRequest, 3000);
      if (networkRes && networkRes.ok && networkRes.type === 'basic') {
        const cache = await caches.open(CACHE_NAME);
        // Escritura no bloqueante con key correcta
        cache.put(networkRequest, networkRes.clone()).catch(() => {});
      }
      return networkRes;
    } catch {
      const cachedRes = await caches.match(networkRequest);
      if (cachedRes) return cachedRes;
      if (req.mode === 'navigate') {
        return caches.match(OFFLINE_URL);
      }
      return new Response('Offline content not available', {
        status: 503,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
  })());
});