// -*- efectos.js -*-

// ------------------- Servicios -------------------
var toggleBtn = document.querySelector('.toggle-btn');
if (toggleBtn) {
  toggleBtn.addEventListener('click', function () {
    toggleBtn.style.boxShadow = '0 0 25px 10px rgba(0, 79, 107, 0.5)';
    if (navigator.vibrate) navigator.vibrate(50);

    setTimeout(function () {
      toggleBtn.style.boxShadow = '';
    }, 200);
  });
}

// ------------------- Teléfono -------------------
var telBtn = document.querySelector('.llamada_tel.contact-button');
if (telBtn) {
  telBtn.addEventListener('click', function () {
    telBtn.style.boxShadow = '0 0 25px 10px rgba(0, 79, 107, 0.5)';
    if (navigator.vibrate) navigator.vibrate(50);

    setTimeout(function () {
      telBtn.style.boxShadow = '';
      window.location.href = 'tel:0987627485';
    }, 200);
  });
}

// ------------------- WhatsApp -------------------
var chatBtn = document.querySelector('.contacto_chat.contact-button');
if (chatBtn) {
  chatBtn.addEventListener('click', function () {
    chatBtn.style.boxShadow = '0 0 25px 10px rgba(37, 211, 102, 0.5)';
    if (navigator.vibrate) navigator.vibrate(50);

    setTimeout(function () {
      chatBtn.style.boxShadow = '';
      window.location.href = 'https://wa.me/593987627485';
    }, 200);
  });
}

// ------------------- Facebook -------------------
var facebookBtn = document.querySelector('#facebook-btn');
if (facebookBtn) {
  facebookBtn.addEventListener('click', function () {
    facebookBtn.style.boxShadow = '0 0 25px 10px rgba(217, 195, 180, 0.5)';
    if (navigator.vibrate) navigator.vibrate(50);

    setTimeout(function () {
      facebookBtn.style.boxShadow = '';
      window.open('https://www.facebook.com/share/17hxsCGUB3/', '_blank');
    }, 200);
  });
}

// ------------------- X -------------------
var xBtn = document.querySelector('#x-btn');
if (xBtn) {
  xBtn.addEventListener('click', function () {
    xBtn.style.boxShadow = '0 0 25px 10px rgba(217, 195, 180, 0.5)';
    if (navigator.vibrate) navigator.vibrate(50);

    setTimeout(function () {
      xBtn.style.boxShadow = '';
      window.open('https://x.com/', '_blank');
    }, 200);
  });
}

// ------------------- Instagram -------------------
var instagramBtn = document.querySelector('#instagram-btn');
if (instagramBtn) {
  instagramBtn.addEventListener('click', function () {
    instagramBtn.style.boxShadow = '0 0 25px 10px rgba(217, 195, 180, 0.5)';
    if (navigator.vibrate) navigator.vibrate(50);

    setTimeout(function () {
      instagramBtn.style.boxShadow = '';
      window.open('https://www.instagram.com/', '_blank');
    }, 200);
  });
}

// ------------------- QR -------------------
var qrBtn = document.querySelector('.qr_code.contact-button');
if (qrBtn) {
  qrBtn.addEventListener('click', function () {
    qrBtn.style.boxShadow = '0 0 25px 10px rgba(0, 79, 107, 0.5)';
    if (navigator.vibrate) navigator.vibrate(50);

    setTimeout(function () {
      qrBtn.style.boxShadow = '';
      if (window.colapsables && window.colapsables.toggleQR) {
        window.colapsables.toggleQR();
      }
    }, 200);
  });
}

// ------------------- PWA -------------------
var installBtn = document.querySelector('#install-button');
if (installBtn) {
  installBtn.addEventListener('click', function () {
    installBtn.style.boxShadow = '0 0 25px 10px rgba(0, 79, 107, 0.5)';
    if (navigator.vibrate) navigator.vibrate(50);

    setTimeout(function () {
      installBtn.style.boxShadow = '';
      if (window.deferredPrompt) {
        window.deferredPrompt.prompt();
        window.deferredPrompt.userChoice.finally(function () {
          window.deferredPrompt = null;
        });
      }
    }, 200);
  });
}