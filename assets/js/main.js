/* ==========================================================================
   CB STUDIO — main.js
   Un solo script para todo el sitio (se carga con `defer` en todas las páginas).
   Los textos y el número de WhatsApp llegan desde <script id="cb-config">,
   que genera src/build.py: acá adentro no hay textos por idioma.

   1 Utilidades y config   5 (libre)
   2 Menú y selector       6 Animaciones de entrada
   3 Scroll (un solo       7 Efectos de cursor
     listener)             8 Formulario → WhatsApp
   4 Menú activo
   ========================================================================== */
(() => {
  'use strict';

  /* 1 ── UTILIDADES Y CONFIG ─────────────────────────────────────────────── */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hasIO = 'IntersectionObserver' in window;

  let cfg = { wa: '', t: {} };
  try { cfg = JSON.parse($('#cb-config').textContent); } catch (_) { /* sin config: el sitio sigue funcionando */ }
  const T = cfg.t;
  const waUrl = (text) => `https://wa.me/${cfg.wa}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

  /* 2 ── MENÚ MÓVIL Y SELECTOR DE IDIOMA ─────────────────────────────────── */
  const header = $('#header');
  const burger = $('#hamburger-btn');
  const nav = $('#nav-menu');
  const langDd = $('.lang-dd');
  const menuOpen = () => !!nav && nav.classList.contains('active');

  if (header && burger && nav) {
    const setMenu = (open) => {
      nav.classList.toggle('active', open);
      burger.classList.toggle('active', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? T.menu_close : T.menu_open);
      if (open && langDd) langDd.open = false;
    };
    burger.addEventListener('click', (e) => { e.stopPropagation(); setMenu(!menuOpen()); });
    $$('.nav-link, .mobile-only-btn').forEach((l) => l.addEventListener('click', () => setMenu(false)));
    document.addEventListener('click', (e) => { if (menuOpen() && !header.contains(e.target)) setMenu(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menuOpen()) { setMenu(false); burger.focus(); } });
    addEventListener('resize', () => { if (innerWidth > 1120 && menuOpen()) setMenu(false); });
  }
  if (langDd) {
    document.addEventListener('click', (e) => { if (langDd.open && !langDd.contains(e.target)) langDd.open = false; });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && langDd.open) { langDd.open = false; $('summary', langDd).focus(); }
    });
  }

  /* 3 ── SCROLL: un solo listener para todo lo que depende de la posición ── */
  const progress = Object.assign(document.createElement('div'), { className: 'scroll-progress' });
  progress.setAttribute('aria-hidden', 'true');
  document.body.appendChild(progress);

  const toTop = Object.assign(document.createElement('button'), { type: 'button', className: 'back-to-top' });
  toTop.setAttribute('aria-label', T.to_top || '');
  toTop.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"></path></svg>';
  document.body.appendChild(toTop);
  toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));

  const eye = $('.hero-eye-image');
  const track = $('.vibe-track');
  const marquee = track && track.getAnimations ? track.getAnimations()[0] : null;
  let lastY = scrollY, vel = 0, rate = 1, easing = false, ticking = false;

  // La franja acelera con la velocidad del scroll y vuelve sola a su ritmo
  const ease = () => {
    vel *= 0.86;
    rate += (1 + Math.min(vel * 0.35, 5) - rate) * 0.1;
    marquee.playbackRate = rate;
    if (rate > 1.02 || vel > 0.4) requestAnimationFrame(ease);
    else { marquee.playbackRate = 1; rate = 1; easing = false; }
  };

  const update = () => {
    ticking = false;
    const y = scrollY;
    const max = root.scrollHeight - innerHeight;

    header.classList.toggle('scrolled', y > 30);
    if (!reduce) {
      if (menuOpen() || y < 420) header.classList.remove('is-hidden');
      else if (y > lastY + 6) header.classList.add('is-hidden');
      else if (y < lastY - 6) header.classList.remove('is-hidden');
    }
    progress.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
    root.classList.toggle('wa-on', y > 520);
    toTop.classList.toggle('is-visible', y > 900);
    if (eye && !reduce && y < innerHeight * 1.2) eye.style.setProperty('--sy', `${(-y * 0.06).toFixed(1)}px`);
    if (marquee && !reduce) {
      vel = Math.max(vel, Math.abs(y - lastY));
      if (!easing) { easing = true; requestAnimationFrame(ease); }
    }
    lastY = y;
  };
  if (header) {
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    header.addEventListener('focusin', () => header.classList.remove('is-hidden'));   // con teclado, el header siempre se ve
    update();
  }

  /* 4 ── MENÚ ACTIVO ─────────────────────────────────────────────────────── */
  if (hasIO) {
    const links = $$('.nav-link');
    const spy = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (!en.isIntersecting) return;
      links.forEach((l) => l.classList.toggle('is-current', l.getAttribute('href') === `#${en.target.id}`));
    }), { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id], footer[id]').forEach((s) => spy.observe(s));
  }

  /* 6 ── ANIMACIONES DE ENTRADA (solo si el navegador y la persona lo permiten) */
  // [selector, tipo de entrada]
  const BLOCKS = [
    ['.section-tag, .approach-description, .about-description, .contact-description, .props-lead, .faq-cta', 'soft'],
    ['.pillar-item', 'up'], ['.solutions-header', 'soft'], ['.solution-card', 'up'],
    ['.props-steps li', 'soft'], ['.prop-card', 'up'], ['.included-head', 'soft'], ['.included-item', 'soft'],
    ['.process-step-item', 'left'],
    ['.faq-item', 'soft'], ['.about-location, .about-values, .contact-direct', 'soft'],
    ['.form-group, .form-submit-btn, .form-note', 'soft'],
  ];

  if (hasIO && !reduce) {
    root.classList.add('mx');
    const targets = [];
    const seen = new Set();

    $$('[data-split]').forEach((el) => { el.classList.add('mx-h'); seen.add(el); targets.push({ el, kind: 'title' }); });
    BLOCKS.forEach(([sel, type]) => $$(sel).forEach((el) => {
      if (seen.has(el)) return;
      seen.add(el);
      el.classList.add('rv');
      el.dataset.rv = type;
      targets.push({ el, kind: 'block' });
    }));
    $$('.process-steps').forEach((el) => targets.push({ el, kind: 'line' }));
    $$('.pillar-icon svg :is(path, rect, circle)').forEach((p) => p.setAttribute('pathLength', '1'));

    const kindOf = new Map(targets.map((t) => [t.el, t.kind]));
    const io = new IntersectionObserver((entries) => {
      entries
        .filter((en) => en.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left)
        .forEach((en, n) => {
          const el = en.target;
          io.unobserve(el);
          const delay = Math.min(n, 5) * 90;
          el.style.setProperty('--d', `${delay}ms`);
          el.classList.add('is-in');
          if (kindOf.get(el) === 'block') {
            const icon = $('.pillar-icon svg', el);
            if (icon) icon.classList.add('is-drawn');
            // al terminar la entrada se libera el elemento, así el hover responde al instante
            setTimeout(() => { el.classList.remove('rv', 'is-in'); el.removeAttribute('data-rv'); el.style.removeProperty('--d'); }, 1500 + delay);
          }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    targets.forEach((t) => io.observe(t.el));

    // Imágenes: placeholder del color del papel y aparición suave cuando ya cargaron
    $$('.process-img, .about-img').forEach((img) => {
      const box = img.parentElement;
      box.classList.add('img-box');
      let loaded = false, visible = false;
      const show = () => { if (loaded && visible) box.classList.add('is-ready'); };
      const onLoad = () => { loaded = true; show(); };
      if (img.complete && img.naturalWidth) onLoad();
      else { img.addEventListener('load', onLoad, { once: true }); img.addEventListener('error', onLoad, { once: true }); }
      const vio = new IntersectionObserver((es) => { if (es.some((en) => en.isIntersecting)) { visible = true; vio.disconnect(); show(); } },
        { rootMargin: '0px 0px -4% 0px' });
      vio.observe(box);
      setTimeout(() => { loaded = visible = true; show(); }, 9000);          // red de seguridad: nunca queda oculta
      const preload = () => { img.loading = 'eager'; img.fetchPriority = 'low'; };   // se descarga apenas termina la carga crítica
      if (document.readyState === 'complete') preload(); else addEventListener('load', preload, { once: true });
    });
  }

  /* 7 ── EFECTOS DE CURSOR (solo mouse / trackpad) ───────────────────────── */
  if (finePointer && !reduce) {
    const hero = $('#hero');
    if (hero && eye) {
      hero.addEventListener('pointermove', (e) => {
        const r = hero.getBoundingClientRect();
        eye.style.setProperty('--ex', ((e.clientX - r.left) / r.width - 0.5) * 2);
        eye.style.setProperty('--ey', ((e.clientY - r.top) / r.height - 0.5) * 2);
      });
      hero.addEventListener('pointerleave', () => { eye.style.setProperty('--ex', 0); eye.style.setProperty('--ey', 0); });
    }
    const clamp = (v, m) => Math.max(-m, Math.min(m, v)).toFixed(1);
    $$('.btn-primary').forEach((b) => {
      b.addEventListener('pointermove', (e) => {
        const r = b.getBoundingClientRect();
        b.style.setProperty('--mx', `${clamp((e.clientX - (r.left + r.width / 2)) * 0.18, 7)}px`);
        b.style.setProperty('--my', `${clamp((e.clientY - (r.top + r.height / 2)) * 0.28, 5)}px`);
      });
      b.addEventListener('pointerleave', () => { b.style.setProperty('--mx', '0px'); b.style.setProperty('--my', '0px'); });
    });
    $$('.solution-card').forEach((c) => {
      c.addEventListener('pointermove', (e) => {
        const r = c.getBoundingClientRect();
        c.style.setProperty('--sx', `${e.clientX - r.left}px`);
        c.style.setProperty('--sy2', `${e.clientY - r.top}px`);
      });
    });
  }

  /* 8 ── FORMULARIO → WHATSAPP ───────────────────────────────────────────── */
  const form = $('#form-cb');
  if (form) {
    const status = $('.form-status', form);
    const say = (cls, text) => { if (status) { status.className = `form-status ${cls}`.trim(); status.textContent = text; } };
    form.addEventListener('input', () => say('', ''));
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const d = new FormData(form);
      const get = (k) => String(d.get(k) || '').trim();
      const lines = [T.wa_hello, '', `${T.wa_name}: ${get('nombre')}`, ...(get('email') ? [`${T.wa_email}: ${get('email')}`] : []),
        `${T.wa_need}: ${get('tipo_sitio')}`, '', T.wa_details, get('mensaje')];
      const url = waUrl(lines.join('\n'));
      const win = window.open(url, '_blank');
      if (win) win.opener = null;
      say('is-ok', T.wa_done);
      if (!win) location.href = url;             // si el navegador bloquea la ventana, abrimos en la misma pestaña
    });
  }
})();
