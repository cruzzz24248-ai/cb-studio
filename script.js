/* CB STUDIO WEB — SCRIPT ÚNICO (versión estable) */
document.addEventListener('DOMContentLoaded', () => {
  const WHATSAPP_NUMBER = '5493525632567'; // formato internacional, sin + ni espacios
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasIO = 'IntersectionObserver' in window;

  // ---------- IDIOMA (es / en / pt-BR) ----------
  const htmlLang = (document.documentElement.lang || 'es').toLowerCase();
  const LANG = htmlLang.startsWith('pt') ? 'pt' : htmlLang.startsWith('en') ? 'en' : 'es';
  const I18N = {
    es: { menuOpen: 'Abrir menú de navegación', menuClose: 'Cerrar menú de navegación', top: 'Volver arriba',
          hello: '¡Hola, CB Studio Web! Quiero consultar por un proyecto.', name: 'Nombre', email: 'Correo', need: 'Qué necesito', details: 'Detalles del proyecto:',
          done: 'Se abrirá WhatsApp con el mensaje preparado. Revisalo y tocá Enviar.' },
    en: { menuOpen: 'Open navigation menu', menuClose: 'Close navigation menu', top: 'Back to top',
          hello: 'Hello CB Studio Web! I’d like to discuss a project.', name: 'Name', email: 'Email', need: 'What I need', details: 'Project details:',
          done: 'WhatsApp will open with your message ready. Review it and tap Send.' },
    pt: { menuOpen: 'Abrir menu de navegação', menuClose: 'Fechar menu de navegação', top: 'Voltar ao topo',
          hello: 'Olá, CB Studio Web! Quero falar sobre um projeto.', name: 'Nome', email: 'E-mail', need: 'O que preciso', details: 'Detalhes do projeto:',
          done: 'O WhatsApp será aberto com a mensagem pronta. Revise e toque em Enviar.' }
  };
  const T = I18N[LANG];

  // ---------- HEADER Y MENÚ MÓVIL ----------
  const header = $('#header'), burger = $('#hamburger-btn'), nav = $('#nav-menu');
  let scrolled = false;
  const updateHeader = () => {
    const s = scrollY > 30;
    if (s !== scrolled && header) { scrolled = s; header.classList.toggle('scrolled', s); }
  };
  updateHeader();
  addEventListener('scroll', updateHeader, { passive: true });

  if (header && burger && nav) {
    const setMenu = (open) => {
      nav.classList.toggle('active', open);
      burger.classList.toggle('active', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? T.menuClose : T.menuOpen);
    };
    const isOpen = () => nav.classList.contains('active');
    burger.addEventListener('click', (e) => { e.stopPropagation(); setMenu(!isOpen()); });
    $$('.nav-link, .mobile-only-btn').forEach((l) => l.addEventListener('click', () => setMenu(false)));
    document.addEventListener('click', (e) => { if (isOpen() && !header.contains(e.target)) setMenu(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && isOpen()) { setMenu(false); burger.focus(); } });
    addEventListener('resize', () => { if (innerWidth > 1120 && isOpen()) setMenu(false); });
  }

  // ---------- SELECTOR DE IDIOMA ----------
  const langDd = $('.lang-dd');
  if (langDd) {
    document.addEventListener('click', (e) => { if (langDd.open && !langDd.contains(e.target)) langDd.open = false; });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && langDd.open) { langDd.open = false; langDd.querySelector('summary').focus(); } });
    if (burger) burger.addEventListener('click', () => { langDd.open = false; });
  }

  // (Los reveals, el parallax y los efectos de cursor viven en el bloque MOTION, al final de este archivo)

  // ---------- BARRA DE PROGRESO ----------
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);
  let ticking = false;
  const setBar = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? Math.min(scrollY / max, 1) : 0})`;
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(setBar); } }, { passive: true });
  setBar();

  // ---------- MENÚ ACTIVO ----------
  if (hasIO) {
    const links = $$('.nav-link');
    const spy = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((l) => l.classList.toggle('is-current', l.getAttribute('href') === '#' + e.target.id));
    }), { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id], footer[id]').forEach((s) => spy.observe(s));
  }

  // ---------- VISTA PREVIA DE TRABAJOS ----------
  const fit = () => $$('.work-frame').forEach((box) => {
    const f = box.querySelector('iframe');
    if (!f || !box.clientWidth) return;
    const viewportWidth = box.classList.contains('work-frame--mobile') ? 390 : 1440;
    f.style.transform = `scale(${box.clientWidth / viewportWidth})`;
  });
  fit();
  if ('ResizeObserver' in window) { const ro = new ResizeObserver(fit); $$('.work-frame').forEach((b) => ro.observe(b)); }
  else addEventListener('resize', fit);

  // Las demos se cargan recién cuando están por verse (evita tirones al scrollear)
  const frames = $$('.work-frame iframe[data-src]');
  const load = (f) => { f.src = f.dataset.src; f.removeAttribute('data-src'); f.addEventListener('load', () => f.classList.add('is-loaded'), { once: true }); };
  if (hasIO) {
    const fio = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { fio.unobserve(e.target); load(e.target); } }), { rootMargin: '300px 0px' });
    frames.forEach((f) => fio.observe(f));
  } else frames.forEach(load);

  // ---------- VOLVER ARRIBA ----------
  const toTop = document.createElement('button');
  toTop.type = 'button';
  toTop.className = 'back-to-top';
  toTop.setAttribute('aria-label', T.top);
  toTop.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"></path></svg>';
  document.body.appendChild(toTop);
  const updateTop = () => toTop.classList.toggle('is-visible', scrollY > 900);
  addEventListener('scroll', updateTop, { passive: true });
  updateTop();
  toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));

  // ---------- CONTACTO DIRECTO POR WHATSAPP ----------
  const form = $('#form-cb');
  if (form) {
    const status = form.querySelector('.form-status');
    form.addEventListener('input', () => { if (status) { status.className = 'form-status'; status.textContent = ''; } });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const name = String(data.get('nombre') || '').trim();
      const email = String(data.get('email') || '').trim();
      const service = String(data.get('tipo_sitio') || '').trim();
      const message = String(data.get('mensaje') || '').trim();
      const lines = [T.hello, '', `${T.name}: ${name}`, ...(email ? [`${T.email}: ${email}`] : []), `${T.need}: ${service}`, '', T.details, message];
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=` + encodeURIComponent(lines.join('\n'));
      const opened = window.open(url, '_blank', 'noopener,noreferrer');
      if (status) {
        status.className = 'form-status is-ok';
        status.textContent = T.done;
      }
      // Si el navegador bloquea la ventana emergente, abrimos WhatsApp en la misma pestaña
      if (!opened) window.location.href = url;
    });
  }
});

/* ==========================================================================
   MOTION — reveals, parallax, cursor, header y navbar
   ========================================================================== */
/* CB STUDIO WEB — CAPA DE MOVIMIENTO
   Reemplaza el sistema de reveal anterior y recupera los efectos que
   el CSS ya esperaba (parallax del ojo, botones magnéticos, tilt de trabajos). */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasIO = 'IntersectionObserver' in window;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const root = document.documentElement;

  /* ---------- 1) SCROLL REVEAL ---------- */
  const TITLES = '.approach-title, .section-title, .process-title, .about-title, .cta-title, .contact-title';

  // [selector, tipo de entrada]
  const BLOCKS = [
    ['.section-tag, .work-intro, .approach-description, .about-description, .contact-description, .panel-lead, .faq-cta', 'soft'],
    ['.pillar-item', 'up'],
    ['.solutions-header', 'soft'],
    ['.solution-card', 'up'],
    ['.includes li', 'soft'],
    ['.work-card', 'scale'],
    ['.work-more', 'soft'],
    ['.panel-points li', 'left'],
    ['.panel-stats > div', 'up'],
    ['.panel-stage', 'scale'],
    ['.process-step-item', 'left'],
    ['.faq-item', 'soft'],
    ['.about-location', 'soft'],
    ['.cta-action, .cta-quote', 'up'],
    ['.form-group, .form-submit-btn, .form-note', 'soft']
  ];

  function splitTitle(el) {
    const parts = el.innerHTML.split(/<br\s*\/?>/i).map((s) => s.trim()).filter(Boolean);
    el.innerHTML = parts.map((p, i) => `<span class="ln"><span style="--i:${i}">${p} </span></span>`).join('');
    el.classList.add('mx-h');
  }

  if (hasIO && !reduce) {
    root.classList.add('mx');

    $$(TITLES).forEach(splitTitle);

    const seen = new Set();
    const targets = [];
    $$(TITLES).forEach((el) => { seen.add(el); targets.push({ el, kind: 'title' }); });
    BLOCKS.forEach(([sel, type]) => $$(sel).forEach((el) => {
      if (seen.has(el)) return;
      seen.add(el);
      el.classList.add('rv');
      el.dataset.rv = type;
      targets.push({ el, kind: 'block' });
    }));
    $$('.process-steps').forEach((el) => { targets.push({ el, kind: 'line' }); });
    $$('.pillar-icon svg').forEach((svg) => {
      $$('path, rect, circle', svg).forEach((p) => p.setAttribute('pathLength', '1'));
    });

    const kindOf = new Map(targets.map((t) => [t.el, t.kind]));

    const io = new IntersectionObserver((entries) => {
      entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left)
        .forEach((e, n) => {
          const el = e.target;
          const kind = kindOf.get(el);
          io.unobserve(el);
          const delay = Math.min(n, 5) * 90;
          el.style.setProperty('--d', delay + 'ms');
          el.classList.add('is-in');

          if (kind === 'block') {
            const svg = $('.pillar-icon svg', el);
            if (svg) svg.classList.add('is-drawn');
            // al terminar, se libera el elemento para que el hover vuelva a ser inmediato
            setTimeout(() => { el.classList.remove('rv', 'is-in'); el.removeAttribute('data-rv'); el.style.removeProperty('--d'); }, 1500 + delay);
          }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    targets.forEach((t) => io.observe(t.el));
  }

  /* ---------- 2c) IMÁGENES: placeholder vivo + aparición cuando ya cargaron ---------- */
  if (root.classList.contains('mx')) {
    $$('.process-img, .about-img').forEach((img) => {
      const box = img.parentElement;
      box.classList.add('img-box');
      let loaded = false, seen = false;
      const show = () => { if (loaded && seen) box.classList.add('is-ready'); };
      const onLoad = () => { loaded = true; show(); };
      if (img.complete && img.naturalWidth) onLoad();
      else { img.addEventListener('load', onLoad, { once: true }); img.addEventListener('error', onLoad, { once: true }); }
      const vio = new IntersectionObserver((es) => {
        if (es.some((e) => e.isIntersecting)) { seen = true; vio.disconnect(); show(); }
      }, { rootMargin: '0px 0px -4% 0px' });
      vio.observe(box);
      // red de seguridad: nunca queda oculta
      setTimeout(() => { loaded = seen = true; show(); }, 9000);
      // empieza a descargarla apenas termina la carga crítica, sin esperar al scroll
      const preload = () => { img.loading = 'eager'; img.fetchPriority = 'low'; };
      if (document.readyState === 'complete') preload(); else addEventListener('load', preload, { once: true });
    });
  }

  /* ---------- 2) CONTADOR DEL PANEL ---------- */
  const counters = $$('[data-count]');
  if (counters.length && hasIO && !reduce) {
    const cio = new IntersectionObserver((es) => es.forEach((e) => {
      if (!e.isIntersecting) return;
      cio.unobserve(e.target);
      const el = e.target;
      const end = Number(el.dataset.count) || 0;
      const t0 = performance.now();
      const dur = 1400;
      const tick = (t) => {
        const p = Math.min((t - t0) / dur, 1);
        el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      };
      el.textContent = '0';
      requestAnimationFrame(tick);
    }), { threshold: 0.6 });
    counters.forEach((c) => cio.observe(c));
  }

  /* ---------- 2b) WHATSAPP FLOTANTE: aparece al salir del hero ---------- */
  if (root.classList.contains('mx')) {
    const wa = () => root.classList.toggle('wa-on', scrollY > 520);
    wa();
    addEventListener('scroll', wa, { passive: true });
  }

  /* ---------- 3) HEADER: se oculta al bajar, vuelve al subir ---------- */
  const header = $('#header');
  const nav = $('#nav-menu');
  if (header && !reduce) {
    let lastY = scrollY, tick = false;
    const onScroll = () => {
      const y = scrollY;
      const menuOpen = nav && nav.classList.contains('active');
      if (menuOpen || y < 420) header.classList.remove('is-hidden');
      else if (y > lastY + 6) header.classList.add('is-hidden');
      else if (y < lastY - 6) header.classList.remove('is-hidden');
      lastY = y;
      tick = false;
    };
    addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(onScroll); } }, { passive: true });
    // si alguien navega con teclado, el header tiene que verse
    header.addEventListener('focusin', () => header.classList.remove('is-hidden'));
  }

  /* ---------- 4) HERO: el ojo responde al mouse y al scroll ---------- */
  const hero = $('#hero');
  const eye = $('.hero-eye-image');
  if (hero && eye && !reduce) {
    if (finePointer) {
      hero.addEventListener('pointermove', (e) => {
        const r = hero.getBoundingClientRect();
        eye.style.setProperty('--ex', (((e.clientX - r.left) / r.width) - 0.5) * 2);
        eye.style.setProperty('--ey', (((e.clientY - r.top) / r.height) - 0.5) * 2);
      });
      hero.addEventListener('pointerleave', () => { eye.style.setProperty('--ex', 0); eye.style.setProperty('--ey', 0); });
    }
    let t = false;
    const par = () => {
      const y = scrollY;
      if (y < innerHeight * 1.2) eye.style.setProperty('--sy', (-y * 0.06).toFixed(1) + 'px');
      t = false;
    };
    addEventListener('scroll', () => { if (!t) { t = true; requestAnimationFrame(par); } }, { passive: true });
  }

  /* ---------- 5) FRANJA: acelera según la velocidad del scroll ---------- */
  const track = $('.vibe-track');
  if (track && track.getAnimations && !reduce) {
    const anim = track.getAnimations()[0];
    if (anim) {
      let lastY = scrollY, rate = 1;
      const loop = () => {
        const v = Math.abs(scrollY - lastY);
        lastY = scrollY;
        const target = 1 + Math.min(v * 0.35, 5);
        rate += (target - rate) * 0.08;
        anim.playbackRate = rate;
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    }
  }

  /* ---------- 6) CURSOR: botones magnéticos, tilt de trabajos, luz en tarjetas ---------- */
  if (finePointer && !reduce) {
    $$('.btn-primary').forEach((b) => {
      b.addEventListener('pointermove', (e) => {
        const r = b.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * 0.18;
        const dy = (e.clientY - (r.top + r.height / 2)) * 0.28;
        b.style.setProperty('--mx', Math.max(-7, Math.min(7, dx)).toFixed(1) + 'px');
        b.style.setProperty('--my', Math.max(-5, Math.min(5, dy)).toFixed(1) + 'px');
      });
      b.addEventListener('pointerleave', () => { b.style.setProperty('--mx', '0px'); b.style.setProperty('--my', '0px'); });
    });

    $$('.work-card').forEach((c) => {
      c.addEventListener('pointermove', (e) => {
        const r = c.getBoundingClientRect();
        c.style.setProperty('--nx', (((e.clientX - r.left) / r.width) - 0.5) * 2);
        c.style.setProperty('--ny', (((e.clientY - r.top) / r.height) - 0.5) * 2);
      });
      c.addEventListener('pointerleave', () => { c.style.setProperty('--nx', 0); c.style.setProperty('--ny', 0); });
    });

    $$('.solution-card').forEach((c) => {
      c.addEventListener('pointermove', (e) => {
        const r = c.getBoundingClientRect();
        c.style.setProperty('--sx', (e.clientX - r.left) + 'px');
        c.style.setProperty('--sy2', (e.clientY - r.top) + 'px');
      });
    });
  }
})();
