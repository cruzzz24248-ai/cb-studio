/* ==========================================================================
   CB STUDIO WEB — SCRIPT ÚNICO
   Header y menú · Hero 3D · Reveals · Scroll suave · Formulario · Vista previa
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- HEADER Y MENÚ MÓVIL ----------
  const header = $('#header');
  const burger = $('#hamburger-btn');
  const nav = $('#nav-menu');

  const updateHeader = () => header && header.classList.toggle('scrolled', window.scrollY > 30);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  if (header && burger && nav) {
    const setMenu = (open) => {
      nav.classList.toggle('active', open);
      burger.classList.toggle('active', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
    };
    burger.addEventListener('click', (e) => { e.stopPropagation(); setMenu(!nav.classList.contains('active')); });
    $$('.nav-link, .mobile-only-btn').forEach(l => l.addEventListener('click', () => setMenu(false)));
    document.addEventListener('click', (e) => { if (!header.contains(e.target) && nav.classList.contains('active')) setMenu(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('active')) { setMenu(false); burger.focus(); } });
    window.addEventListener('resize', () => { if (window.innerWidth > 900 && nav.classList.contains('active')) setMenu(false); });
  }

  // ---------- HERO: EFECTO 3D TILT ----------
  const heroCard = $('.hero-diagonal-card');
  if (heroCard && window.innerWidth > 850 && !reduceMotion) {
    let frame = null;
    heroCard.addEventListener('mousemove', (e) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const r = heroCard.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        heroCard.style.transform = `perspective(1000px) rotateY(${x * 3}deg) rotateX(${-y * 3}deg)`;
        frame = null;
      });
    });
    heroCard.addEventListener('mouseleave', () => { heroCard.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)'; });
  }

  // ---------- REVEALS (aparición al hacer scroll) ----------
  const reveal = (selector, { translate = 'translateY(20px)', duration = '0.6s', delay = 100, threshold = 0.15 } = {}) => {
    const els = $$(selector);
    if (!els.length || reduceMotion || !('IntersectionObserver' in window)) return;
    const ease = 'cubic-bezier(0.16, 1, 0.3, 1)';
    els.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = translate;
      el.style.transition = `opacity ${duration} ${ease}, transform ${duration} ${ease}`;
    });
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        setTimeout(() => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0) translateX(0)';
          // Devuelve el control a la hoja de estilos para que funcione el hover
          setTimeout(() => { el.style.transform = ''; el.style.transition = ''; }, 800);
        }, els.indexOf(el) * delay);
        obs.unobserve(el);
      });
    }, { threshold });
    els.forEach(el => obs.observe(el));
  };

  reveal('.pillar-item', { translate: 'translateY(15px)', delay: 120, threshold: 0.2 });
  reveal('.solution-card');
  reveal('.work-card', { threshold: 0.1 });
  reveal('.process-step-item', { translate: 'translateX(15px)', duration: '0.5s', delay: 120, threshold: 0.2 });
  reveal('.about-visual, .about-header, .about-body', { delay: 120, threshold: 0.2 });
  reveal('.cta-header, .cta-action, .cta-quote', { delay: 120 });

  // ---------- SCROLL SUAVE CON COMPENSACIÓN DEL HEADER ----------
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (!id || id === '#') return;
    const target = $(id);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.pageYOffset - (header ? header.offsetHeight : 0);
    window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
  }));

  // ---------- FORMULARIO (Formspree) ----------
  const form = $('#form-cb');
  if (form) {
    const btn = form.querySelector('button[type="submit"]');
    const status = form.querySelector('.form-status');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const label = btn.innerHTML;
      btn.disabled = true; btn.textContent = 'ENVIANDO…';
      status.className = 'form-status'; status.textContent = '';
      try {
        const r = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        if (!r.ok) throw new Error();
        form.reset();
        status.className = 'form-status is-ok';
        status.textContent = '¡Gracias! Recibimos tu consulta y te respondemos en menos de 24 horas.';
      } catch (_) {
        status.className = 'form-status is-error';
        status.innerHTML = 'No pudimos enviar el mensaje. Escribinos por <a href="https://wa.me/5493525632567" target="_blank" rel="noopener noreferrer">WhatsApp</a>.';
      }
      btn.disabled = false; btn.innerHTML = label;
    });
  }

  // ---------- VISTA PREVIA DE TRABAJOS (escala el iframe al ancho disponible) ----------
  const fitPreviews = () => $$('.work-frame').forEach(box => {
    const f = box.querySelector('iframe');
    if (f && box.clientWidth) f.style.transform = `scale(${box.clientWidth / 1280})`;
  });
  fitPreviews();
  window.addEventListener('load', fitPreviews);
  window.addEventListener('resize', fitPreviews);
});
