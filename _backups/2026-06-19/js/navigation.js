/* navigation.js
   Responsabilidad: comportamiento de la navbar.
   1. Borde + sombra sutil cuando se hace scroll (ausentes al tope de la página).
   2. Toggle del menú hamburguesa en mobile.
   No sabe nada de formularios ni de animaciones de scroll. */

(function () {
  'use strict';

  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('navbar-toggle');
  const links = document.getElementById('navbar-links');

  /* --- 1. Estado scrolled --- */
  if (navbar) {
    const SCROLL_THRESHOLD = 8; // px desde el tope antes de activar el borde

    const updateScrollState = () => {
      navbar.classList.toggle('is-scrolled', window.scrollY > SCROLL_THRESHOLD);
    };

    updateScrollState(); // estado correcto si la página carga ya desplazada
    window.addEventListener('scroll', updateScrollState, { passive: true });
  }

  /* --- 2. Toggle del menú hamburguesa --- */
  if (toggle && links) {
    const closeMenu = () => {
      links.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menú');
    };

    const openMenu = () => {
      links.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Cerrar menú');
    };

    toggle.addEventListener('click', () => {
      const isOpen = links.classList.contains('is-open');
      isOpen ? closeMenu() : openMenu();
    });

    // Cerrar el menú al pulsar cualquier link (navegación a un ancla).
    links.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });
  }

  /* --- 3. Link seleccionado (estado .active) --- */
  if (links) {
    const navAnchors = links.querySelectorAll('a');

    navAnchors.forEach((link) => {
      link.addEventListener('click', () => {
        navAnchors.forEach((a) => a.classList.remove('active'));
        link.classList.add('active');
      });
    });
  }

  /* --- 4. Glider: pill azul que se desliza entre los links --- */
  if (links) {
    const navAnchors = links.querySelectorAll('a');

    // Coloca el glider detrás del link indicado (posición, ancho, visible).
    const moveGliderTo = (el) => {
      links.style.setProperty('--glider-x', el.offsetLeft + 'px');
      links.style.setProperty('--glider-w', el.offsetWidth + 'px');
      links.style.setProperty('--glider-o', '1');
    };

    // Al salir: vuelve al link activo, o desaparece si no hay ninguno.
    const resetGlider = () => {
      const active = links.querySelector('a.active');
      if (active) {
        moveGliderTo(active);
      } else {
        links.style.setProperty('--glider-o', '0');
      }
    };

    navAnchors.forEach((link) => {
      link.addEventListener('mouseenter', () => moveGliderTo(link));
    });

    links.addEventListener('mouseleave', resetGlider);
  }
})();
