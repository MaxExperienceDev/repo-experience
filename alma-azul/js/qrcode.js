// -*- qr.js -*-
document.addEventListener("DOMContentLoaded", () => {
  const qrContainer = document.getElementById("qr-container");
  const qrOutput    = document.getElementById("qr-output");
  const qrBtn       = document.querySelector('.qr_code.contact-button');

  // Generar QR solo si no existe
  if (qrOutput && typeof QRCode !== "undefined" && qrOutput.children.length === 0) {
    new QRCode(qrOutput, {
      text: location.href,  // Apunta a la URL actual
      width: 220,
      height: 220
    });
  }

  // Función para abrir/cerrar contenedor colapsable y actualizar texto del botón
  function toggleColapsable() {
    if (!qrContainer || !qrBtn) return;

    // Alternar clase .open para transición suave
    qrContainer.classList.toggle("open");

    // Actualizar texto del botón según estado
    const isOpen = qrContainer.classList.contains("open");
    qrBtn.textContent = isOpen ? "Cerrar Código QR" : "Abrir Código QR";
  }

  // Exponer globalmente para invocación desde efectos.js
  window.colapsables = {
    toggleQR: toggleColapsable
  };
});