/* ==========================================================================
   CB STUDIO — datos de la propuesta «construcción modular» (en)
   Para un rubro nuevo: copiar este archivo, cambiar los textos y los módulos
   (GRUPOS) y las mini demos (DEMOS), y enlazarlo en la página del rubro.
   Nivel de cada módulo: 1 básico · 2 intermedio · 3 avanzado.
   ========================================================================== */
window.CB_RUBRO = (() => {
  const $ = (s) => document.querySelector(s);

  const RUBRO = 'modular construction';
  const UI = {
    none: 'You haven’t picked anything yet',
    areas: (a, n) => `${a} of ${n} areas lit up`,
    count: n => n + (n === 1 ? ' module' : ' modules'),
    min: 'Pick at least one module to send it.',
    try: 'Try demo',
    note: 'This is a sample with example values. On your site it would use your models and prices.',
    msg: (nom, emp, lista, nota) => `Hi, I’m ${nom} from ${emp}. I saw your modular construction proposal and I’m interested in these modules:\n\n` + lista.map(n => '• ' + n).join('\n') + (nota ? `\n\n${nota}` : '') + '\n\nCould you put together a mockup for us?'
  };
  /* nivel: 1 básico, 2 intermedio, 3 avanzado */
  const GRUPOS = [
    ['Catalog', [
      ['Model pages', 'One page per model with sizes, rooms, photos and floor plans.', 1],
      ['Project configurator', 'Clients pick a model, finishes and extras, and see the result.', 2, 'cfg'],
      ['Model comparison', 'Up to three models side by side.', 1, 'cmp']]],
    ['Decision tools', [
      ['Quote builder with PDF', 'The quote builds itself and can be downloaded or sent by WhatsApp.', 3, 'cfg'],
      ['Online deposit payment', 'Reserve a model by paying the deposit on the site.', 3],
      ['Financing simulator', 'Down payment, installments and terms at a glance.', 2, 'fin'],
      ['ROI calculator', 'For tourist rentals: investment and payback in years.', 2, 'ren']]],
    ['Build', [
      ['Step-by-step process', 'From idea to delivery, explained with drawings.', 1],
      ['Build tracking', 'A timeline with photos of each manufacturing stage.', 3]]],
    ['Reach', [
      ['Map of delivered projects', 'Projects you can filter by type and region.', 2],
      ['Business section', 'Camps, offices and developments, with bulk orders.', 1],
      ['WhatsApp and Instagram built in', 'An inquiry button on every model and your latest projects shown on the site.', 1],
      ['Lead-qualifying form', 'Land, budget and timeline: inquiries arrive ready to quote.', 2],
      ['Land and regulations guide', 'What to prepare, what to permit, plus a downloadable checklist.', 1]]],
    ['Trust', [
      ['Warranties and certifications', 'What backs the manufacturing, stated clearly.', 1],
      ['Testimonials and factory video', 'Real clients and the process in plain sight.', 1],
      ['FAQ', 'Answers questions before they reach your inbox.', 1]]],
    ['Technical foundation', [
      ['Multiple languages', 'Spanish, English and Portuguese, with SEO for each.', 2],
      ['Local SEO', 'To show up when people search for modular construction in your area.', 1],
      ['Speed and hosting included', 'Fast on mobile, security certificate and backups.', 1],
      ['Inquiry analytics', 'See which models get the most views and where clients come from.', 1]]]
  ];
  const NIVELES = ['', 'Basic', 'Intermediate', 'Advanced'];

  /* ---------- Mini demos (valores de ejemplo, no reales) ---------- */
  const usd = n => 'USD ' + Math.round(n).toLocaleString('en-US');
  const MODELOS = [['Small model', 18, 'Studio', 1], ['Medium model', 36, '1 bedroom', 1], ['Large model', 60, '2 bedrooms', 1]];
  const LINEAS = [['Standard', 1000], ['Premium', 1200], ['Deluxe', 1400]];
  const EXTRAS = [['Pergola', 1800], ['Deck', 2400], ['Security shutters', 1200]];
  const rng = (id, t, min, max, step, v) => `<label>${t}: <b id="${id}-o"></b><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${v}"></label>`;
  const opts = (a, f) => a.map((x, i) => `<option value="${i}">${f(x)}</option>`).join('');

  const DEMOS = {
    cfg: ['Configure your unit', () => `
      <label>Model<select id="a">${opts(MODELOS, m => m[0] + ' · ' + m[1] + ' m²')}</select></label>
      <label>Finish<select id="b">${opts(LINEAS, l => l[0])}</select></label>
      <fieldset><legend>Extras</legend>${EXTRAS.map((e, i) => `<label class="ck"><input type="checkbox" class="ex" value="${i}"> ${e[0]}</label>`).join('')}</fieldset>
      <p class="res" id="res"></p>`, () => {
      const m = MODELOS[$('#a').value], l = LINEAS[$('#b').value];
      const ex = [...document.querySelectorAll('.ex:checked')].reduce((s, c) => s + EXTRAS[c.value][1], 0);
      $('#res').innerHTML = `<b>${usd(m[1] * l[1] + ex)}</b> estimated<br><small>${m[1]} m² · ${m[2]} · built in 60 to 90 days</small>`;
    }],
    cmp: ['Model comparison', () => `
      <div class="duo"><select id="a">${opts(MODELOS, m => m[0])}</select><select id="b">${opts(MODELOS, m => m[0]).replace('value="1"','value="1" selected')}</select></div>
      <table id="res"></table>`, () => {
      const A = MODELOS[$('#a').value], B = MODELOS[$('#b').value];
      const row = (t, f) => `<tr><th>${t}</th><td>${f(A)}</td><td>${f(B)}</td></tr>`;
      $('#res').innerHTML = row('Area', m => m[1] + ' m²') + row('Rooms', m => m[2]) + row('From', m => usd(m[1] * 1000));
    }, 1],
    fin: ['Financing simulator', () => `
      ${rng('p', 'Project value', 10000, 150000, 1000, 50000)}${rng('q', 'Down payment', 20, 80, 5, 40)}${rng('n', 'Installments', 6, 48, 6, 24)}
      <p class="res" id="res"></p>`, () => {
      const P = +$('#p').value, q = +$('#q').value, n = +$('#n').value, s = P * (1 - q / 100), i = 0.015;
      $('#p-o').textContent = usd(P); $('#q-o').textContent = q + '%'; $('#n-o').textContent = n;
      $('#res').innerHTML = `Down payment <b>${usd(P * q / 100)}</b><br>Monthly payment <b>${usd(s * i / (1 - Math.pow(1 + i, -n)))}</b><br><small>Sample interest: 1.5% per month</small>`;
    }],
    ren: ['ROI calculator', () => `
      ${rng('p', 'Investment', 15000, 120000, 1000, 40000)}${rng('q', 'Price per night', 40, 300, 10, 120)}${rng('n', 'Occupancy', 20, 90, 5, 55)}
      <p class="res" id="res"></p>`, () => {
      const P = +$('#p').value, q = +$('#q').value, n = +$('#n').value, r = q * 365 * n / 100 * 0.7;
      $('#p-o').textContent = usd(P); $('#q-o').textContent = usd(q); $('#n-o').textContent = n + '%';
      $('#res').innerHTML = `Net annual income <b>${usd(r)}</b><br>Payback in <b>${(P / r).toFixed(1)} years</b><br><small>Deducts 30% for costs. Sample values.</small>`;
    }]
  };

  return { RUBRO, UI, GRUPOS, NIVELES, DEMOS };
})();
