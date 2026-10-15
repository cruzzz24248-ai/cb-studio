/* CB STUDIO WEB — SCRIPT ÚNICO (versión estable) */
document.addEventListener('DOMContentLoaded', () => {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasIO = 'IntersectionObserver' in window;

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
      burger.setAttribute('aria-label', open ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
    };
    const isOpen = () => nav.classList.contains('active');
    burger.addEventListener('click', (e) => { e.stopPropagation(); setMenu(!isOpen()); });
    $$('.nav-link, .mobile-only-btn').forEach((l) => l.addEventListener('click', () => setMenu(false)));
    document.addEventListener('click', (e) => { if (isOpen() && !header.contains(e.target)) setMenu(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && isOpen()) { setMenu(false); burger.focus(); } });
    addEventListener('resize', () => { if (innerWidth > 900 && isOpen()) setMenu(false); });
  }

  // ---------- HERO: TILT 3D (solo con mouse) ----------
  const card = $('.hero-diagonal-card');
  if (card && !reduce && matchMedia('(hover: hover) and (min-width: 851px)').matches) {
    let raf = 0;
    card.addEventListener('mousemove', (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(1000px) rotateY(${x * 3}deg) rotateX(${-y * 3}deg)`;
        raf = 0;
      });
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  }

  // ---------- REVEALS (un solo sistema, basado en clases) ----------
  if (hasIO && !reduce) {
    const groups = [
      ['.pillar-item', 'reveal'], ['.solutions-header', 'reveal'], ['.solution-card', 'reveal'],
      ['.includes li', 'reveal'], ['.work .section-tag, .work .section-title, .work-intro', 'reveal'],
      ['.work-card', 'reveal'], ['.work-more', 'reveal'], ['.process-step-item', 'reveal'],
      ['.faq .section-tag, .faq .section-title', 'reveal'], ['.faq-item', 'reveal'],
      ['.about-visual, .about-header, .about-body', 'reveal'], ['.cta-header, .cta-action, .cta-quote', 'reveal'],
      ['.contact-info > *', 'reveal'], ['.contact-form .form-group', 'reveal']
    ];
    const io = new IntersectionObserver((entries) => {
      entries.filter((e) => e.isIntersecting).forEach((e, n) => {
        const el = e.target;
        io.unobserve(el);
        el.style.transitionDelay = Math.min(n, 4) * 110 + 'ms';
        el.classList.add('active');
        // Libera el elemento para que el hover vuelva a funcionar
        setTimeout(() => { el.classList.remove('reveal', 'reveal-x', 'active'); el.style.transitionDelay = ''; }, 1400 + n * 110);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
    const seen = new Set();
    groups.forEach(([sel, cls]) => $$(sel).forEach((el, i) => {
      if (seen.has(el)) return;
      seen.add(el);
      el.classList.add(...cls.split(' '));
      io.observe(el);
    }));
  }

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
    if (f && box.clientWidth) f.style.transform = `scale(${box.clientWidth / 1280})`;
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

  // ---------- FORMULARIO (Formspree) ----------
  const form = $('#form-cb');
  if (form) {
    const btn = form.querySelector('button[type="submit"]'), status = form.querySelector('.form-status');
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
});
