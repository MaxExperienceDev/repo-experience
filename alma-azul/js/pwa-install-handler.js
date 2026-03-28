// -*- coding: utf-8 -*-

(function () {
  'use strict';

  /* =========================
     CONSTANTES
  ========================= */

  const STORAGE_KEYS = {
    iosEducated: 'pwa_ios_a2hs_educated'
  };

  const SW_PATH = '/sw.js';

  const state = {
    deferredPrompt: null,
    installBtn: document.getElementById('install-button'),
    iosModal: document.getElementById('ios-modal'),
    closeBtn: document.getElementById('ios-close'),
    indicator: document.querySelector('.ios-down-indicator')
  };

  if (!state.installBtn) return;

  /* =========================
     DETECCIÓN (MOBILE ONLY)
  ========================= */

  const isStandalone = () =>
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;

  const isAndroid = () =>
    /Android/i.test(navigator.userAgent) &&
    /Mobile/i.test(navigator.userAgent);

  const isIOS = () =>
    /iPhone/i.test(navigator.userAgent);

  /* =========================
     SERVICE WORKER
  ========================= */

  const handleRehydration = async () => {
    if (!('serviceWorker' in navigator)) return;

    try {
      const reg = await navigator.serviceWorker.getRegistration();

      if (!reg) {
        await navigator.serviceWorker.register(SW_PATH);
      } else {
        reg.update();
      }

    } catch {}
  };

  /* =========================
     UI — BUTTON
  ========================= */

  const hideButton = () => {
    state.installBtn.style.display = 'none';
  };

  const showButton = (type) => {

    if (isStandalone()) return;

    if (
      type === 'ios' &&
      localStorage.getItem(STORAGE_KEYS.iosEducated)
    ) return;

    state.installBtn.textContent =
      type === 'ios'
        ? 'Añadir a inicio'
        : 'Instalar aplicación';

    state.installBtn.dataset.platform = type;
    state.installBtn.style.display = 'block';

    if (type === 'ios' && state.indicator) {
      const isLandscape = window.innerWidth > window.innerHeight;
      state.indicator.textContent = isLandscape ? '⬆️' : '⬇️';
    }
  };

  /* =========================
     UI — MODAL (CORREGIDO)
  ========================= */

  const openModal = () => {
    if (!state.iosModal) return;

    state.iosModal.style.display = 'flex';
    state.iosModal.setAttribute('aria-hidden', 'false');
  };

  const closeModal = () => {
    if (!state.iosModal) return;

    state.iosModal.style.display = 'none';
    state.iosModal.setAttribute('aria-hidden', 'true');
  };

  /* =========================
     ANDROID EVENT
  ========================= */

  if (isAndroid()) {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();

      state.deferredPrompt = e;

      showButton('android');
    });
  }

  window.addEventListener('appinstalled', () => {
    hideButton();
    state.deferredPrompt = null;
  });

  /* =========================
     INTERACCIÓN
  ========================= */

  state.installBtn.addEventListener('click', async () => {

    if (isStandalone()) return;

    // ANDROID
    if (state.deferredPrompt) {
      state.deferredPrompt.prompt();
      await state.deferredPrompt.userChoice;

      hideButton();
      state.deferredPrompt = null;
      return;
    }

    // iOS
    if (isIOS()) {
      openModal();
    }

  });

  state.closeBtn?.addEventListener('click', () => {
    localStorage.setItem(STORAGE_KEYS.iosEducated, 'true');
    closeModal();
    hideButton();
  });

  /* =========================
     INIT
  ========================= */

  document.addEventListener('DOMContentLoaded', async () => {

    hideButton();
    closeModal(); // ← FIX CLAVE

    await handleRehydration();

    if (isStandalone()) return;

    if (isIOS()) {
      showButton('ios');
    }

  });

})();