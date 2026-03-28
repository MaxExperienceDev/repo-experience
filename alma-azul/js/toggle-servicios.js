// toggle-servicios.js

document.addEventListener("DOMContentLoaded", () => {
  const botonServicios = document.getElementById("toggle-servicios-btn");
  const wrapperServicios = document.getElementById("servicios-wrapper");

  if (!botonServicios || !wrapperServicios) return;

  botonServicios.addEventListener("click", () => {
    const activo = wrapperServicios.classList.toggle("open");

    botonServicios.setAttribute("aria-expanded", activo);
    botonServicios.textContent = activo ? "Ocultar Servicios" : "Ver Servicios";
  });
});

