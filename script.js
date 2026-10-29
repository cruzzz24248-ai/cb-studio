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
    addEventListener('resize', () => { if (innerWidth > 900 && isOpen()) setMenu(false); });
  }

  // ---------- SELECTOR DE IDIOMA ----------
  const langDd = $('.lang-dd');
  if (langDd) {
    document.addEventListener('click', (e) => { if (langDd.open && !langDd.contains(e.target)) langDd.open = false; });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && langDd.open) { langDd.open = false; langDd.querySelector('summary').focus(); } });
    if (burger) burger.addEventListener('click', () => { langDd.open = false; });
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
