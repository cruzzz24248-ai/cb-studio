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
    viv: () => unit(12, 68, 1, win(22, 22, 40, 34) + win(78, 22, 40, 34) + door(148)) +
      `<path d="M4 68V52L232 60V68Z" fill="#3C322B" stroke="${S}" stroke-width="2" stroke-linejoin="round"/><rect x="184" y="46" width="9" height="14" fill="#5E4636" stroke="${S}" stroke-width="2"/><path d="M188.5 41c-4-5 4-8 0-13" fill="none" stroke="#5E5147" stroke-opacity=".45" stroke-width="2" stroke-linecap="round"/><path d="M142 98h6" stroke="${S}" stroke-width="2"/><circle cx="145" cy="101" r="3.5" fill="${G}" stroke="${S}" stroke-width="1.5"/>`,
    ofi: () => unit(12, 68, 1, win(16, 22, 110, 34, 0) + `<path d="M43 22v34M71 22v34M99 22v34" stroke="${S}" stroke-width="2"/>` + win(148, 16, 44, 60, 0)) +
      box(150, 54, 44, 14, '#5E4636') + `<path d="M158 58v6M166 58v6M174 58v6M182 58v6" stroke="${G}" stroke-width="2"/><path d="M40 68V44" stroke="${S}" stroke-width="2.5"/><path d="M34 44h12" stroke="${S}" stroke-width="2.5" stroke-linecap="round"/>`,
    alo: () => unit(8, 92, .72, win(22, 20, 70, 38, 0) + win(112, 16, 76, 60, 0)) +
      box(2, 85, 168, 7, '#3C322B') + box(164, 146, 72, 6, '#B18A62') +
      box(170, 100, 5, 46, '#765943') + box(225, 100, 5, 46, '#765943') + box(164, 94, 72, 7, '#765943') +
      [172, 184, 196, 208, 220, 228].map((x) => box(x, 89, 4, 5, '#765943')).join('') +
      `<path d="M174 104Q202 116 228 104" fill="none" stroke="${S}" stroke-width="1.5"/>` + [186, 200, 214].map((x) => `<circle cx="${x}" cy="${x === 200 ? 112 : 110}" r="2.8" fill="${G}" stroke="${S}" stroke-width="1"/>`).join(''),
    loc: () => unit(12, 68, 1, box(14, 10, 126, 13, '#3C322B') + `<path d="M22 16.5h44" stroke="${G}" stroke-width="3" stroke-linecap="round"/>` +
      [0, 1, 2, 3, 4, 5].map((i) => { const c = i % 2 ? '#F5F1E9' : '#B18A62'; return box(14 + i * 21, 25, 21, 12, c) + `<path d="M${14 + i * 21} 37a10.5 10 0 0 0 21 0Z" fill="${c}" stroke="${S}" stroke-width="2"/>`; }).join('') +
      box(20, 50, 114, 22, G) + box(24, 62, 106, 10, '#765943') + `<circle cx="46" cy="58" r="4" fill="#F5F1E9" stroke="${S}" stroke-width="1.5"/><circle cx="66" cy="58" r="4" fill="#F5F1E9" stroke="${S}" stroke-width="1.5"/>` + door(152) + box(160, 24, 24, 10, '#F5F1E9') + `<path d="M164 29h16" stroke="${S}" stroke-width="2"/>`),
    duo: () => unit(12, 96.6, .66, win(22, 18, 96, 42, 0) + door(148)) + unit(12, 41.2, .66, win(22, 22, 40, 34) + win(78, 22, 40, 34) + door(160)) +
      box(153, 89, 32, 4, '#B18A62') + `<path d="M183 99H153M155 70V89" fill="none" stroke="${S}" stroke-width="2"/><path d="M183 94V152H228V142H219V132H210V122H201V112H192V102H183Z" fill="#765943" stroke="${S}" stroke-width="2" stroke-linejoin="round"/><path d="M184 70V89M184 70L228 126M207 98V116" fill="none" stroke="${S}" stroke-width="2" stroke-linecap="round"/>`
  };
  const ART = {
    cfg: () => unit(10, 24, .62, win(22, 22, 40, 34) + door(148)) + [['#765943', 22], ['#B18A62', 46], ['#3C322B', 70]].map(([c, x]) => `<circle cx="${x}" cy="90" r="8" fill="${c}" stroke="${S}" stroke-width="2.5"/>`).join('') + `<circle cx="22" cy="90" r="12" fill="none" stroke="#B18A62" stroke-width="2.5"/><rect x="154" y="12" width="36" height="86" rx="8" fill="#FBF9F4" stroke="${S}" stroke-width="2.5"/>` + [0, 1, 2].map((i) => `<rect x="162" y="22${i * 0}" width="0" height="0"/><rect x="161" y="${22 + i * 20}" width="9" height="9" rx="2" fill="${i < 2 ? G : '#FBF9F4'}" stroke="${S}" stroke-width="2"/><path d="M174 ${26.5 + i * 20}h9" stroke="${S}" stroke-width="2.5" stroke-linecap="round"/>`).join('') + `<rect x="160" y="82" width="24" height="10" rx="5" fill="${S}"/><path d="M167 87h10" stroke="${G}" stroke-width="3" stroke-linecap="round"/>`,
    fin: () => box(20, 26, 28, 56, '#B18A62') + `<circle cx="34" cy="16" r="7" fill="${G}" stroke="${S}" stroke-width="2.5"/>` + [0, 1, 2, 3, 4, 5, 6].map((i) => box(56 + i * 19, 52, 14, 30, '#765943')).join('') + `<path d="M12 82H192" stroke="${S}" stroke-width="2.5"/><path d="M20 96H188" stroke="${S}" stroke-opacity=".35" stroke-width="3" stroke-linecap="round"/><circle cx="104" cy="96" r="6" fill="#B18A62" stroke="${S}" stroke-width="2.5"/>`,
    ren: () => `<path d="M96 88L120 76L144 60L166 40L188 20V98H96Z" fill="#B18A62" fill-opacity=".22"/><path d="M96 88L120 76L144 60L166 40L188 20" fill="none" stroke="#B18A62" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>` + [[120, 76], [144, 60], [166, 40]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.5" fill="#FBF9F4" stroke="${S}" stroke-width="2"/>`).join('') + `<circle cx="188" cy="20" r="6" fill="${S}"/>` + unit(14, 71, .3, win(22, 22, 40, 34) + door(148)) + `<path d="M8 98H194M8 98V8" fill="none" stroke="${S}" stroke-width="2"/>`
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
