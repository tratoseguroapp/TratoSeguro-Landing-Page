/* animations.js
   Responsabilidad: animaciones de aparición (reveal).
   - Los elementos con la clase .animate-on-scroll empiezan ocultos (vía CSS,
     solo si existe la clase .js en <html>) y aparecen cuando entran al viewport.
   - Los que ya están visibles al cargar (hero) aparecen de inmediato, en
     secuencia, gracias a sus transition-delay escalonados.
   - Los de más abajo (diagrama, futuras secciones) aparecen progresivamente
     al hacer scroll.
   No sabe nada de la navbar (navigation.js) ni de formularios (forms.js). */

(function () {
  'use strict';

  // Asegura la marca de JS activo (también se añade en el <head> para evitar
  // el parpadeo). Si por alguna razón no estaba, aquí queda garantizada.
  document.documentElement.classList.add('js');

  const animated = document.querySelectorAll('.animate-on-scroll');
  if (!animated.length) return;

  // Sin soporte de IntersectionObserver: mostrar todo sin animación.
  if (!('IntersectionObserver' in window)) {
    animated.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // se anima una sola vez
        }
      });
    },
    {
      threshold: 0.15,
      // Dispara un pelín antes de que el borde inferior toque el elemento,
      // para que la aparición se sienta natural al ir bajando.
      rootMargin: '0px 0px -40px 0px',
    }
  );

  animated.forEach((el) => observer.observe(el));
})();

/* Hero mobile — efecto scroll-driven:
   El grupo de texto (headline + subtítulo + CTAs) arranca un poco más abajo y
   "sube" sobre la mitad inferior de la imagen a medida que se hace scroll. Al
   completar el recorrido queda en su sitio y la página sigue normal.
   Solo aplica en mobile (≤768px) y se desactiva con prefers-reduced-motion. */
(function () {
  'use strict';

  const group = document.querySelector('.hero-textgroup');
  if (!group) return;

  const mqMobile = window.matchMedia('(max-width: 768px)');
  const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  const RISE = 56;   // px que el grupo arranca por debajo de su posición final
  const DIST = 200;  // px de scroll en los que completa la subida
  let ticking = false;

  function apply() {
    ticking = false;
    if (!mqMobile.matches || mqReduce.matches) {
      group.style.transform = '';
      return;
    }
    const y = window.pageYOffset || document.documentElement.scrollTop || 0;
    const progress = Math.min(Math.max(y / DIST, 0), 1);
    const shift = RISE * (1 - progress);
    group.style.transform = 'translateY(' + shift.toFixed(1) + 'px)';
  }

  function onScroll() {
    if (!ticking) { ticking = true; window.requestAnimationFrame(apply); }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', apply);

  const onChange = () => apply();
  if (mqMobile.addEventListener) {
    mqMobile.addEventListener('change', onChange);
    mqReduce.addEventListener('change', onChange);
  } else if (mqMobile.addListener) {
    mqMobile.addListener(onChange);
    mqReduce.addListener(onChange);
  }

  apply();
})();

/* Bento Grid problems card hover effect:
   Updates the CSS variables for the radial shine effect based on cursor position. */
(function () {
  'use strict';
  
  const cards = document.querySelectorAll('.problema-card, .benefit-card');
  if (!cards.length) return;

  function onMouseMove(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', x + 'px');
    card.style.setProperty('--mouse-y', y + 'px');
  }

  cards.forEach((card) => {
    card.addEventListener('mousemove', onMouseMove, { passive: true });
  });
})();

