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

  /* Cada rubro con ilustración propia ubica sus ventanas en otro lugar; el nombre se achica si es largo */
  const KIND = !fig ? '' : fig.classList.contains('ph-art--salud') ? 'salud' : fig.classList.contains('ph-art--gastro') ? 'gastro' : '';
  const VENT = {
    salud: [[176, 114, 70, 52], [274, 114, 70, 52], [46, 196, 46, 56], [428, 196, 46, 56], [100, 196, 46, 56], [374, 196, 46, 56]],
    gastro: [[172, 176, 48, 64], [300, 176, 48, 64], [114, 176, 48, 64], [358, 176, 48, 64], [56, 176, 48, 64], [416, 176, 48, 64]]
  }[KIND];
  if (KIND && emp) $('#cname').setAttribute('font-size', Math.max(11, Math.min(KIND === 'gastro' ? 20 : 17, Math.floor((KIND === 'gastro' ? 520 : 300) / emp.length))));

  /* Una ventana del contenedor por cada grupo de módulos */
  const NS = 'http://www.w3.org/2000/svg';
  GRUPOS.forEach((_, i) => {
    const g = document.createElementNS(NS, 'g');
    g.setAttribute('class', 'win');
    g.id = `w${i}`;
    if (VENT && VENT[i]) {
      const [x, y, w, h] = VENT[i];
      g.innerHTML = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2"/><path d="M${x + w / 2} ${y}V${y + h}${KIND === 'salud' ? `M${x} ${y + h / 2}H${x + w}` : ''}"/>`;
    } else {
      g.innerHTML = `<rect x="${44 + i * 62}" y="118" width="52" height="84" rx="2"/><path class="gl" d="M${50 + i * 62} 196L${74 + i * 62} 124H${84 + i * 62}L${60 + i * 62} 196Z"/><path d="M${70 + i * 62} 118V202M${44 + i * 62} 160H${96 + i * 62}"/>`;
    }
    $('#wins').appendChild(g);
  });


  /* Presets (si el rubro los define) */
  if (UI.presets && $('.presets')) $('.presets').innerHTML = UI.presets.map(([k, t]) => `<button type="button" data-p="${k}">${t}</button>`).join('');

  /* Containers dibujados: sección «usos» y tarjetas de demos (solo si el rubro las define) */
  const S = '#211D1A', G = '#E6C79A';
  const unit = (x, y, k, inner) => `<g transform="translate(${x} ${y}) scale(${k})"><rect width="216" height="84" rx="3" fill="url(#cb-pc)"/><rect width="216" height="84" rx="3" fill="url(#cb-sh)"/><rect width="216" height="8" fill="${S}"/><rect y="76" width="216" height="8" fill="${S}"/>${inner}<g fill="#B18A62" stroke="${S}" stroke-width="2.5"><rect width="10" height="10"/><rect x="206" width="10" height="10"/><rect y="74" width="10" height="10"/><rect x="206" y="74" width="10" height="10"/></g></g>`;
  const win = (x, y, w, h, cr = 1) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${G}" stroke="${S}" stroke-width="2.5"/><path d="M${x + w / 2} ${y}v${h}${cr ? `M${x} ${y + h / 2}h${w}` : ''}" stroke="${S}" stroke-width="2"/>`;
  const door = (x) => `<rect x="${x}" y="16" width="40" height="60" fill="#4A3526" stroke="${S}" stroke-width="2.5"/><rect x="${x + 28}" y="44" width="5" height="14" rx="1" fill="${G}"/>`;
  const box = (x, y, w, h, f) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}" stroke="${S}" stroke-width="2"/>`;
  const TIPO = {
    viv: () => unit(12, 66, 1, win(22, 22, 40, 34) + win(78, 22, 40, 34) + door(148) + box(96, -6, 24, 6, '#5E4636')),
    ofi: () => unit(12, 66, 1, win(16, 22, 110, 34, 0) + `<path d="M43 22v34M71 22v34M99 22v34" stroke="${S}" stroke-width="2"/>` + win(148, 16, 44, 60, 0) + box(136, -8, 44, 8, '#5E4636') + `<circle cx="158" cy="-4" r="2.5" fill="${G}"/>`),
    alo: () => unit(8, 83, .8, win(22, 20, 70, 38, 0) + win(112, 16, 76, 60, 0) + box(216, 76, 70, 8, '#B18A62') + `<path d="M226 -10V76M278 -10V76" stroke="${S}" stroke-width="4"/>` + box(210, -14, 82, 7, '#765943') + [232, 252, 272].map((x) => `<circle cx="${x}" cy="0" r="3" fill="${G}"/>`).join('')),
    loc: () => unit(12, 66, 1, [0, 1, 2, 3, 4, 5].map((i) => box(14 + i * 26, 16, 26, 14, i % 2 ? '#F5F1E9' : '#B18A62')).join('') + box(20, 38, 114, 22, G) + box(14, 60, 126, 7, '#765943') + door(152)),
    duo: () => unit(30, 92, .72, win(22, 22, 40, 34) + win(78, 22, 40, 34) + door(148)) + unit(54, 31, .72, win(22, 22, 40, 34) + win(78, 22, 40, 34) + win(134, 22, 40, 34)) + `<path d="M190 152v-8h14v-8h14v-8h14v-8" fill="none" stroke="${S}" stroke-width="3"/>`
  };
  const ART = {
    cfg: () => unit(16, 18, .5, win(22, 22, 40, 34) + door(148)) + [['#765943', 34], ['#B18A62', 64], ['#3C322B', 94]].map(([c, x]) => `<circle cx="${x}" cy="84" r="9" fill="${c}" stroke="${S}" stroke-width="2.5"/>`).join('') + `<circle cx="34" cy="84" r="14" fill="none" stroke="#B18A62" stroke-width="2.5"/><rect x="132" y="22" width="56" height="26" rx="8" fill="${S}"/><path d="M142 35h36" stroke="${G}" stroke-width="4" stroke-linecap="round"/>`,
    fin: () => [0, 1, 2, 3, 4, 5, 6, 7].map((i) => box(20 + i * 22, i ? 62 : 30, 16, i ? 38 : 70, i ? '#765943' : '#B18A62')).join('') + `<path d="M10 100H190" stroke="${S}" stroke-width="2"/>`,
    ren: () => `<path d="M16 96L56 82L96 68L136 46L184 18" fill="none" stroke="#B18A62" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="184" cy="18" r="6" fill="${S}"/>` + unit(130, 76, .28, win(22, 22, 40, 34) + door(148)) + `<path d="M10 100H190" stroke="${S}" stroke-width="2"/>`
  };
  const DEFS = '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><pattern id="cb-pc" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="#765943"/><rect width="4" height="10" fill="#5E4636"/></pattern><linearGradient id="cb-sh" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></linearGradient></defs></svg>';
  const KEYS = ['viv', 'ofi', 'alo', 'loc', 'duo'];
  if (UI.tipos && $('#tipos')) {
    $('#tipos').innerHTML = `${DEFS}<h2>${UI.tiposT}</h2><p class="lead">${UI.tiposP}</p><div class="row">${UI.tipos.map(([n, d], i) => `<figure class="tipo"><svg viewBox="0 0 240 160" role="img" aria-label="${n}">${TIPO[KEYS[i]]()}<path d="M0 152H240" stroke="${S}" stroke-opacity=".35" stroke-width="2"/></svg><figcaption><b>${n}</b><span>${d}</span></figcaption></figure>`).join('')}</div>`;
  }
  if (UI.cards && $('#demos')) {
    $('#demos').innerHTML = `<h2>${UI.demosT}</h2><p class="lead">${UI.demosP}</p><div class="dgrid">${UI.cards.map(([k, t, d]) => `<article class="card"><svg viewBox="0 0 200 110" aria-hidden="true">${ART[k]()}</svg><h3>${t}</h3><p>${d}</p><button type="button" class="try" data-demo="${k}">${UI.try}</button></article>`).join('')}</div>`;
  }

  /* Lista de módulos */
  $('#lista').innerHTML = GRUPOS.map(([g, mods], gi) => `
    <div class="grupo"><h3><svg class="gi" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 3v18M3 12h18"/></svg>${g}</h3>${mods.map(([n, d, v, demo, pop], mi) => `
      <label class="mod"><input type="checkbox" data-g="${gi}" data-m="${mi}">
        <div><b>${n}${pop && UI.pop ? `<small class="pop">${UI.pop}</small>` : ''}</b><span>${d}</span></div>
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
    const libre = !!UI.send0;
    $('#enviar-btn').disabled = !n && !libre;
    if (libre) $('#enviar-btn').textContent = n ? UI.send : UI.send0;
    $('#resumen').textContent = n ? nombres().join(' · ') : UI.min;
  };

  actualizar();

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
      const [, , nivel, , pop] = GRUPOS[c.dataset.g][1][c.dataset.m];
      const p = b.dataset.p;
      c.checked = p === 'all' || (p === '1' && nivel === 1) || (p === 'pop' && !!pop);
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
    /* Sin espacios de más al principio o al final (el teclado del celular suele dejar uno) */
    const v = (k) => String(f.get(k) || '').replace(/\s+/g, ' ').trim();
    const nota = String(f.get('nota') || '').trim();
    const texto = sel.size || !UI.msg0 ? UI.msg(v('nombre'), v('empresa'), nombres(), nota) : UI.msg0(v('nombre'), v('empresa'), nota);
    window.open(waUrl(texto), '_blank', 'noopener');
  });
})();
