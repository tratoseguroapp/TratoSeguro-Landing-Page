/* forms.js
   Responsabilidad: el Bloque 4 (formularios de registro).
   1. Toggle comprador / proveedor (cards de acceso + anclas del hero).
   2. Validación nativa (sin alerts): campos obligatorios y formato de email.
   3. Envío a Formspree vía fetch (sin recargar), con mensaje inline de éxito/error.
   No sabe nada de la navbar ni de las animaciones de scroll. */

(function () {
  'use strict';

  /* === Endpoints de Formspree ===
     PENDIENTE: reemplazar por los IDs reales de cada formulario.
     Formato: https://formspree.io/f/XXXXXXXX  */
  const ENDPOINTS = {
    comprador: 'https://formspree.io/f/xwvjavlr',
    proveedor: 'https://formspree.io/f/mbdeqdgq'
  };

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const btnComprador = document.getElementById('btn-comprador');
  const btnProveedor = document.getElementById('btn-proveedor');
  const formComprador = document.getElementById('form-comprador');
  const formProveedor = document.getElementById('form-proveedor');
  const modal = document.getElementById('form-modal');

  if (!formComprador || !formProveedor) return;

  /* =============================================
     1. MODAL + TOGGLE comprador / proveedor
     ============================================= */

  let lastFocused = null;
  let successTimer = null; /* cancela el auto-cierre si el usuario cierra antes */

  /* Muestra el formulario correcto dentro del modal */
  const setForm = (target) => {
    const isComprador = target === 'comprador';
    formComprador.classList.toggle('is-hidden', !isComprador);
    formProveedor.classList.toggle('is-hidden', isComprador);
    if (btnComprador) btnComprador.classList.toggle('is-active', isComprador);
    if (btnProveedor) btnProveedor.classList.toggle('is-active', !isComprador);
  };

  const openModal = (target) => {
    setForm(target);
    if (!modal) return;
    lastFocused = document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('ts-modal-lock');
    /* Enfoca el primer campo para teclado/lectores de pantalla */
    const visible = target === 'proveedor' ? formProveedor : formComprador;
    const firstInput = visible.querySelector('input, button');
    if (firstInput) {
      try { firstInput.focus({ preventScroll: true }); } catch (_) { /* noop */ }
    }
  };

  const closeModal = () => {
    if (!modal) return;
    /* Cancela cualquier auto-cierre pendiente de la pantalla de éxito */
    if (successTimer !== null) { clearTimeout(successTimer); successTimer = null; }
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('ts-modal-lock');
    closeAllDropdowns();
    if (lastFocused && typeof lastFocused.focus === 'function') {
      try { lastFocused.focus({ preventScroll: true }); } catch (_) { /* noop */ }
    }
    /* Si el modal se cierra con la pantalla de éxito visible (cierre manual),
       restaura los formularios después de que la animación de cierre termine. */
    const successScreen = document.getElementById('ts-success-screen');
    if (successScreen && successScreen.classList.contains('is-visible')) {
      setTimeout(() => {
        successScreen.classList.remove('is-visible');
        [formComprador, formProveedor].forEach((f) => f.classList.remove('is-hidden'));
      }, 350);
    }
  };

  if (btnComprador) {
    btnComprador.addEventListener('click', () => openModal('comprador'));
  }
  if (btnProveedor) {
    btnProveedor.addEventListener('click', () => openModal('proveedor'));
  }

  /* Anclas del hero (#form-comprador / #form-proveedor): abren el modal con
     el formulario correcto. */
  document.querySelectorAll('a[href="#form-comprador"], a[href="#form-proveedor"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('href') === '#form-proveedor' ? 'proveedor' : 'comprador';
      openModal(target);
    });
  });

  /* Cierre: botón X, clic en el backdrop, tecla Escape */
  if (modal) {
    modal.querySelectorAll('[data-close]').forEach((el) => {
      el.addEventListener('click', closeModal);
    });
  }

  /* Estado inicial: comprador por defecto (modal cerrado) */
  setForm('comprador');

  /* =============================================
     2. DROPDOWNS PERSONALIZADOS
     ============================================= */

  const closeAllDropdowns = () => {
    document.querySelectorAll('.ts-select.is-open').forEach((sel) => {
      sel.classList.remove('is-open');
      const t = sel.querySelector('.ts-select-trigger');
      if (t) t.setAttribute('aria-expanded', 'false');
    });
  };

  const initDropdowns = () => {
    document.querySelectorAll('.ts-select').forEach((sel) => {
      const trigger = sel.querySelector('.ts-select-trigger');
      const panel   = sel.querySelector('.ts-select-panel');
      const labelEl = sel.querySelector('.ts-select-label');
      const placeholder = sel.getAttribute('data-placeholder') || 'Selecciona una opción';
      const type = sel.getAttribute('data-type');

      if (!trigger || !panel || !labelEl) return;

      const updateLabel = () => {
        const checked = Array.from(sel.querySelectorAll('input:checked'));
        if (checked.length === 0) {
          labelEl.textContent = placeholder;
          sel.classList.remove('has-value');
        } else if (type === 'single') {
          labelEl.textContent = checked[0].value;
          sel.classList.add('has-value');
        } else {
          const values = checked.map((i) => i.value);
          labelEl.textContent = values.length <= 2
            ? values.join(', ')
            : values[0] + ', ' + values[1] + ' y ' + (values.length - 2) + ' más';
          sel.classList.add('has-value');
        }
      };

      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const wasOpen = sel.classList.contains('is-open');
        closeAllDropdowns();
        if (!wasOpen) {
          sel.classList.add('is-open');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });

      panel.addEventListener('change', () => {
        updateLabel();
        if (type === 'single') {
          sel.classList.remove('is-open');
          trigger.setAttribute('aria-expanded', 'false');
        }
        /* Muestra/oculta el campo de texto libre cuando se marca "Otro" */
        const otroCheck = sel.querySelector('input[value="Otro"]');
        const otroWrap  = sel.closest('.ts-field') && sel.closest('.ts-field').querySelector('.ts-otro-wrap');
        if (otroCheck && otroWrap) {
          const show = otroCheck.checked;
          otroWrap.hidden = !show;
          if (!show) {
            const inp = otroWrap.querySelector('input');
            if (inp) inp.value = '';
          }
        }
      });

      sel._updateLabel = updateLabel;
      updateLabel();
    });
  };

  initDropdowns();

  document.addEventListener('click', closeAllDropdowns);
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    /* Escape cierra primero un desplegable abierto; si no hay, cierra el modal */
    if (document.querySelector('.ts-select.is-open')) {
      closeAllDropdowns();
    } else if (modal && modal.classList.contains('is-open')) {
      closeModal();
    }
  });

  /* =============================================
     3. VALIDACIÓN
     ============================================= */

  const setError = (el, message) => {
    if (!el) return;
    el.textContent = message || '';
    el.classList.toggle('is-visible', Boolean(message));
  };

  const clearFieldErrors = (form) => {
    form.querySelectorAll('[data-error]').forEach((el) => setError(el, ''));
    form.querySelectorAll('.float-field.has-error').forEach((el) => el.classList.remove('has-error'));
  };

  /* Devuelve true si el formulario es válido; marca los errores si no. */
  const validate = (form) => {
    let valid = true;
    let firstInvalid = null;

    clearFieldErrors(form);

    /* Nombre */
    const nombre = form.querySelector('input[name="nombre"]');
    if (nombre && nombre.value.trim() === '') {
      nombre.closest('.float-field').classList.add('has-error');
      firstInvalid = firstInvalid || nombre;
      valid = false;
    }

    /* Email */
    const email = form.querySelector('input[name="email"]');
    if (email && !EMAIL_RE.test(email.value.trim())) {
      email.closest('.float-field').classList.add('has-error');
      firstInvalid = firstInvalid || email;
      valid = false;
    }

    /* Fieldsets obligatorios (multi y single select) */
    form.querySelectorAll('.ts-field[data-required="true"]').forEach((field) => {
      const checked = field.querySelectorAll('input:checked').length;
      const errorEl = field.querySelector('[data-error]');
      if (checked === 0) {
        setError(errorEl, 'Selecciona al menos una opción.');
        firstInvalid = firstInvalid || field;
        valid = false;
      }
    });

    if (!valid && firstInvalid) {
      firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (typeof firstInvalid.focus === 'function') {
        try { firstInvalid.focus({ preventScroll: true }); } catch (_) { /* noop */ }
      }
    }

    return valid;
  };

  /* Limpia el error de un campo en cuanto el usuario lo corrige */
  [formComprador, formProveedor].forEach((form) => {
    form.addEventListener('input', (e) => {
      const field = e.target.closest('.ts-field');
      if (field) setError(field.querySelector('[data-error]'), '');
      const floatField = e.target.closest('.float-field');
      if (floatField) floatField.classList.remove('has-error');
    });
    form.addEventListener('change', (e) => {
      const field = e.target.closest('.ts-field');
      if (field) setError(field.querySelector('[data-error]'), '');
    });
  });

  /* =============================================
     4. ENVÍO a Formspree
     ============================================= */

  const showStatus = (form, message, type) => {
    const status = form.querySelector('[data-status]');
    if (!status) return;
    status.textContent = message;
    status.classList.remove('is-error', 'is-success');
    if (type) status.classList.add(type === 'error' ? 'is-error' : 'is-success');
  };

  const handleSubmit = async (form) => {
    const tipo = form.getAttribute('data-tipo');
    const endpoint = ENDPOINTS[tipo];
    const submitBtn = form.querySelector('.ts-submit');

    if (!validate(form)) return;

    /* Sin IDs reales aún: avisa en vez de enviar a un endpoint inexistente. */
    if (!endpoint || endpoint.indexOf('REEMPLAZAR_ID') !== -1) {
      showStatus(form, 'Formulario válido ✓ — falta conectar el ID de Formspree para enviar.', 'error');
      return;
    }

    const payload = {};
    const data = new FormData(form);
    for (const [key, value] of data.entries()) {
      if (key.endsWith('[]')) {
        const k = key.slice(0, -2);
        (payload[k] = payload[k] || []).push(value);
      } else {
        payload[key] = value;
      }
    }

    const originalText = submitBtn ? submitBtn.textContent : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando…';
    }
    showStatus(form, '', null);

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showStatus(form, '', null);
        form.reset();
        form.querySelectorAll('.ts-select').forEach((sel) => { if (sel._updateLabel) sel._updateLabel(); });
        form.querySelectorAll('.ts-otro-wrap').forEach((w) => {
          w.hidden = true;
          const inp = w.querySelector('input');
          if (inp) inp.value = '';
        });
        clearFieldErrors(form);

        /* Muestra la pantalla de éxito dentro del modal y cierra solo */
        const successScreen = document.getElementById('ts-success-screen');
        if (successScreen) {
          /* Oculta los dos formularios y muestra el check */
          [formComprador, formProveedor].forEach((f) => f.classList.add('is-hidden'));
          /* Fuerza re-render del SVG para que la animación arrange de nuevo */
          successScreen.classList.remove('is-visible');
          void successScreen.offsetWidth;
          successScreen.classList.add('is-visible');
          /* Cierra después de 2.5 s (check 0.55 s + texto 0.7 s + pausa).
             Se guarda en successTimer para poder cancelarlo si el usuario
             cierra el modal antes de que se cumpla el tiempo. */
          successTimer = setTimeout(() => {
            successTimer = null;
            /* closeModal ya maneja la restauración cuando success está visible */
            closeModal();
          }, 2500);
        } else {
          closeModal();
        }
      } else {
        const out = await res.json().catch(() => ({}));
        const msg = out && out.errors && out.errors.length
          ? out.errors.map((x) => x.message).join(' ')
          : 'No pudimos enviar el registro. Intenta de nuevo en un momento.';
        showStatus(form, msg, 'error');
      }
    } catch (_) {
      showStatus(form, 'Hubo un problema de conexión. Revisa tu internet e intenta de nuevo.', 'error');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    }
  };

  [formComprador, formProveedor].forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      handleSubmit(form);
    });
  });

})();
