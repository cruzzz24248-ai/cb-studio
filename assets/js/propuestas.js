/* ==========================================================================
   CB STUDIO — propuestas.js
   Lógica de las páginas de propuesta por rubro (selector de módulos, mini demos
   y envío por WhatsApp). Los datos del rubro vienen de /assets/data/rubros/*.js
   (window.CB_RUBRO) y el número de WhatsApp de <script id="cb-config">.
   ========================================================================== */
(() => {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const { UI, GRUPOS, NIVELES, DEMOS } = window.CB_RUBRO;
  const sel = new Set();

  let wa = '';
  try { wa = JSON.parse($('#cb-config').textContent).wa; } catch (_) { /* sin config */ }
  const waUrl = (text) => `https://wa.me/${wa}?text=${encodeURIComponent(text)}`;

  /* Nombre de la empresa desde el link: ?empresa=Nombre */
  const emp = (new URLSearchParams(location.search).get('empresa') || '').trim().slice(0, 40);
  if (emp) {
    $('#empresa').textContent = emp;
    $('#cname').textContent = emp;
    $('#inp-empresa').value = emp;
  }

  /* La grúa baja el contenedor cuando la figura entra en pantalla
     (en celular queda debajo del texto y la animación pasaba sin que se viera) */
  const fig = document.querySelector('.ph-art');
  if (fig && 'IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    fig.classList.add('espera');
    const io = new IntersectionObserver((es) => {
      if (es.some((e) => e.isIntersecting)) { fig.classList.add('vista'); io.disconnect(); }
    }, { threshold: 0.5 });
    io.observe(fig);
  }

  /* Una ventana del contenedor por cada grupo de módulos */
  const NS = 'http://www.w3.org/2000/svg';
  GRUPOS.forEach((_, i) => {
    const g = document.createElementNS(NS, 'g');
    g.setAttribute('class', 'win');
    g.id = `w${i}`;
    g.innerHTML = `<rect x="${44 + i * 62}" y="118" width="52" height="84" rx="2"/><path class="gl" d="M${50 + i * 62} 196L${74 + i * 62} 124H${84 + i * 62}L${60 + i * 62} 196Z"/><path d="M${70 + i * 62} 118V202M${44 + i * 62} 160H${96 + i * 62}"/>`;
    $('#wins').appendChild(g);
  });

  /* Lista de módulos */
  $('#lista').innerHTML = GRUPOS.map(([g, mods], gi) => `
    <div class="grupo"><h3><svg class="gi" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 3v18M3 12h18"/></svg>${g}</h3>${mods.map(([n, d, v, demo], mi) => `
      <label class="mod"><input type="checkbox" data-g="${gi}" data-m="${mi}">
        <div><b>${n}</b><span>${d}</span></div>
        <em class="nivel">${[1, 2, 3].map((k) => `<i class="${k <= v ? 'f' : ''}"></i>`).join('')}${NIVELES[v]}${demo ? `<button type="button" class="try" data-demo="${demo}">${UI.try}</button>` : ''}</em>
      </label>`).join('')}</div>`).join('');

  const nombres = () => [...sel].sort().map((k) => { const [g, m] = k.split('-'); return GRUPOS[g][1][m][0]; });

  const actualizar = () => {
    const n = sel.size;
    const activos = new Set([...sel].map((k) => k.split('-')[0]));
    GRUPOS.forEach((_, i) => $(`#w${i}`).classList.toggle('on', activos.has(String(i))));
    $('#avance').textContent = n ? UI.areas(activos.size, GRUPOS.length) : UI.none;
    $('#cuenta').textContent = UI.count(n);
    $('#bar').hidden = !n;
    $('#enviar-btn').disabled = !n;
    $('#resumen').textContent = n ? nombres().join(' · ') : UI.min;
  };

  document.addEventListener('change', (e) => {
    const c = e.target.closest('input[data-g]');
    if (!c) return;
    const k = `${c.dataset.g}-${c.dataset.m}`;
    if (c.checked) sel.add(k); else sel.delete(k);
    actualizar();
  });

  /* Atajos: solo lo esencial / todo / limpiar */
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-p]');
    if (!b) return;
    document.querySelectorAll('input[data-g]').forEach((c) => {
      const nivel = GRUPOS[c.dataset.g][1][c.dataset.m][2];
      c.checked = b.dataset.p === 'all' || (b.dataset.p === '1' && nivel === 1);
      const k = `${c.dataset.g}-${c.dataset.m}`;
      if (c.checked) sel.add(k); else sel.delete(k);
    });
    actualizar();
  });

  /* Mini demos */
  document.addEventListener('click', (e) => {
    const b = e.target.closest('.try');
    if (!b) return;
    e.preventDefault();
    const [titulo, html, calc] = DEMOS[b.dataset.demo];
    $('#demo-t').textContent = titulo;
    $('#demo-b').innerHTML = `${html()}<p class="fine">${UI.note}</p>`;
    $('#demo-b').oninput = calc;
    calc();
    $('#demo').showModal();
  });

  /* Envío por WhatsApp */
  $('#form').addEventListener('submit', (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    window.open(waUrl(UI.msg(f.get('nombre'), f.get('empresa'), nombres(), f.get('nota'))), '_blank', 'noopener');
  });
})();
