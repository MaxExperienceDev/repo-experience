/**
 * PWA Core Manager
 * Controlador limpio del ciclo de vida del Service Worker.
 * Actualización silenciosa, atómica y sin ruido.
 */
const PWA_App = {
  refreshing: false,

  init() {
    if (!('serviceWorker' in navigator)) return;

    // Registro inicial
    window.addEventListener('load', () => this.register());

    // Cambio de control (nuevo SW activo)
    navigator.serviceWorker.addEventListener(
      'controllerchange',
      () => this.handleControllerChange()
    );

    // Chequeo al volver a la app (comportamiento nativo)
    window.addEventListener('focus', () => this.checkForUpdates());
  },

  register() {
    navigator.serviceWorker
      .register('/sw.js')
      .then(reg => {
        console.log('SW: registrado correctamente');
        // Forzar comparación inmediata contra servidor
        reg.update();
      })
      .catch(err => {
        console.error('SW: error de registro', err);
      });
  },

  handleControllerChange() {
    if (this.refreshing) return;
    this.refreshing = true;

    if (document.visibilityState === 'visible') {
      console.log('SW: nueva versión lista; se aplicará al salir');

      const reloadOnHide = () => {
        if (document.visibilityState === 'hidden') {
          window.location.reload();
          document.removeEventListener('visibilitychange', reloadOnHide);
        }
      };

      document.addEventListener('visibilitychange', reloadOnHide);
    } else {
      // Ya en background  recarga inmediata
      window.location.reload();
    }
  },

  checkForUpdates() {
    navigator.serviceWorker.getRegistration().then(reg => {
      if (reg) reg.update();
    });
  }
};

// Arranque
PWA_App.init();