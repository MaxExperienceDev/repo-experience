const PWA_App = {
  refreshing: false,

  init() {
    if (!('serviceWorker' in navigator)) return;

    window.addEventListener('load', () => this.register());

    navigator.serviceWorker.addEventListener(
      'controllerchange',
      () => this.handleControllerChange()
    );

    window.addEventListener('focus', () => this.checkForUpdates());
  },

  register() {
    navigator.serviceWorker
      .register('./sw.js', { scope: './' })
      .then(reg => {
        console.log('SW: registrado correctamente');
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
      const reloadOnHide = () => {
        if (document.visibilityState === 'hidden') {
          window.location.reload();
          document.removeEventListener('visibilitychange', reloadOnHide);
        }
      };
      document.addEventListener('visibilitychange', reloadOnHide);
    } else {
      window.location.reload();
    }
  },

  checkForUpdates() {
    navigator.serviceWorker.getRegistration().then(reg => {
      if (reg) reg.update();
    });
  }
};

PWA_App.init();