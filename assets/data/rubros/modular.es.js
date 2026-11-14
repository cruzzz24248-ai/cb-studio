/* ==========================================================================
   CB STUDIO — datos de la propuesta «construcción modular» (es)
   Para un rubro nuevo: copiar este archivo, cambiar los textos y los módulos
   (GRUPOS) y las mini demos (DEMOS), y enlazarlo en la página del rubro.
   Nivel de cada módulo: 1 básico · 2 intermedio · 3 avanzado.
   ========================================================================== */
window.CB_RUBRO = (() => {
  const $ = (s) => document.querySelector(s);

  const RUBRO = 'construcción modular';
  const UI = {
    none: 'Todavía no elegiste nada',
    areas: (a, n) => `${a} de ${n} áreas con luz encendida`,
    count: n => n + (n === 1 ? ' módulo' : ' módulos'),
    min: 'Marcá al menos un módulo para poder enviarla.',
    try: 'Probar demo',
    note: 'Es una muestra con valores de ejemplo. En tu web usaría tus modelos y precios.',
    msg: (nom, emp, lista, nota) => `Hola, soy ${nom} de ${emp}. Armé mi selección para una web de construcción modular y me interesan estos módulos:\n\n` + lista.map(n => '• ' + n).join('\n') + (nota ? `\n\n${nota}` : '') + '\n\n¿Me armás una maqueta?'
  };

  /* nivel: 1 básico, 2 intermedio, 3 avanzado */
  const GRUPOS = [
    ['Catálogo', [
      ['Fichas de modelos', 'Una página por modelo con medidas, ambientes, fotos y planos.', 1],
      ['Configurador de proyecto', 'El cliente elige modelo, terminaciones y extras, y ve el resultado.', 2, 'cfg'],
      ['Comparador de modelos', 'Hasta tres modelos lado a lado.', 1, 'cmp']]],
    ['Herramientas para decidir', [
      ['Cotizador con PDF', 'El presupuesto se arma solo y se descarga o se envía por WhatsApp.', 3, 'cfg']
      ,['Seña online con Mercado Pago', 'Reservar un modelo pagando la seña desde la web.', 3],
      ['Simulador de financiación', 'Anticipo, cuotas y plazos a la vista.', 2, 'fin'],
      ['Calculadora de rentabilidad', 'Para alojamientos turísticos: inversión y años de recupero.', 2, 'ren']]],
    ['Obra', [
      ['Proceso paso a paso', 'De la idea a la entrega, explicado con dibujos.', 1],
      ['Seguimiento de obra', 'Línea de tiempo con fotos de cada etapa de fabricación.', 3]]],
    ['Alcance', [
      ['Mapa de obras entregadas', 'Proyectos filtrables por tipo y provincia.', 2],
      ['Sección para empresas', 'Campamentos, oficinas y desarrollos, con pedido por volumen.', 1]
      ,['Instagram integrado', 'Tus últimas obras de Instagram mostradas en la web.', 1],
      ['Formulario que califica al cliente', 'Terreno, presupuesto y plazo: llegan consultas listas para cotizar.', 2],
      ['Guía del terreno y normativa', 'Qué preparar, qué habilitar y una checklist descargable.', 1]]],
    ['Confianza', [
      ['Garantías y certificaciones', 'Lo que respalda la fabricación, de forma clara.', 1],
      ['Testimonios y video de fábrica', 'Clientes reales y el proceso a la vista.', 1],
      ['Preguntas frecuentes', 'Responde las dudas antes de que lleguen por mensaje.', 1]]],
    ['Base técnica', [
      ['Varios idiomas', 'Español, inglés y portugués, con SEO para cada uno.', 2],
      ['SEO local', 'Para aparecer cuando buscan construcción modular en tu zona.', 1],
      ['Estadísticas de consultas', 'Saber qué modelos miran más y de dónde llegan los clientes.', 1]]]
  ];
  const NIVELES = ['', 'Básico', 'Intermedio', 'Avanzado'];

  /* ---------- Mini demos (valores de ejemplo, no reales) ---------- */
  const usd = n => 'USD ' + Math.round(n).toLocaleString('es-AR');
  const MODELOS = [['Modelo chico', 18, 'Monoambiente', 1], ['Modelo medio', 36, '1 dormitorio', 1], ['Modelo grande', 60, '2 dormitorios', 1]];
  const LINEAS = [['Estándar', 1000], ['Premium', 1200], ['Deluxe', 1400]];
  const EXTRAS = [['Pérgola', 1800], ['Deck', 2400], ['Cerramientos de seguridad', 1200]];
  const rng = (id, t, min, max, step, v) => `<label>${t}: <b id="${id}-o"></b><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${v}"></label>`;
  const opts = (a, f) => a.map((x, i) => `<option value="${i}">${f(x)}</option>`).join('');

  const DEMOS = {
    cfg: ['Configurá tu módulo', () => `
      <label>Modelo<select id="a">${opts(MODELOS, m => m[0] + ' · ' + m[1] + ' m²')}</select></label>
      <label>Terminación<select id="b">${opts(LINEAS, l => l[0])}</select></label>
      <fieldset><legend>Extras</legend>${EXTRAS.map((e, i) => `<label class="ck"><input type="checkbox" class="ex" value="${i}"> ${e[0]}</label>`).join('')}</fieldset>
      <p class="res" id="res"></p>`, () => {
      const m = MODELOS[$('#a').value], l = LINEAS[$('#b').value];
      const ex = [...document.querySelectorAll('.ex:checked')].reduce((s, c) => s + EXTRAS[c.value][1], 0);
      $('#res').innerHTML = `<b>${usd(m[1] * l[1] + ex)}</b> estimado<br><small>${m[1]} m² · ${m[2]} · fabricación en 60 a 90 días</small>`;
    }],
    cmp: ['Comparador de modelos', () => `
      <div class="duo"><select id="a">${opts(MODELOS, m => m[0])}</select><select id="b">${opts(MODELOS, m => m[0]).replace('value="1"','value="1" selected')}</select></div>
      <table id="res"></table>`, () => {
      const A = MODELOS[$('#a').value], B = MODELOS[$('#b').value];
      const row = (t, f) => `<tr><th>${t}</th><td>${f(A)}</td><td>${f(B)}</td></tr>`;
      $('#res').innerHTML = row('Superficie', m => m[1] + ' m²') + row('Ambientes', m => m[2]) + row('Desde', m => usd(m[1] * 1000));
    }, 1],
    fin: ['Simulador de financiación', () => `
      ${rng('p', 'Valor del proyecto', 10000, 150000, 1000, 50000)}${rng('q', 'Anticipo', 20, 80, 5, 40)}${rng('n', 'Cuotas', 6, 48, 6, 24)}
      <p class="res" id="res"></p>`, () => {
      const P = +$('#p').value, q = +$('#q').value, n = +$('#n').value, s = P * (1 - q / 100), i = 0.015;
      $('#p-o').textContent = usd(P); $('#q-o').textContent = q + '%'; $('#n-o').textContent = n;
      $('#res').innerHTML = `Anticipo <b>${usd(P * q / 100)}</b><br>Cuota mensual <b>${usd(s * i / (1 - Math.pow(1 + i, -n)))}</b><br><small>Interés de ejemplo: 1,5% mensual</small>`;
    }],
    ren: ['Calculadora de rentabilidad', () => `
      ${rng('p', 'Inversión', 15000, 120000, 1000, 40000)}${rng('q', 'Precio por noche', 40, 300, 10, 120)}${rng('n', 'Ocupación', 20, 90, 5, 55)}
      <p class="res" id="res"></p>`, () => {
      const P = +$('#p').value, q = +$('#q').value, n = +$('#n').value, r = q * 365 * n / 100 * 0.7;
      $('#p-o').textContent = usd(P); $('#q-o').textContent = usd(q); $('#n-o').textContent = n + '%';
      $('#res').innerHTML = `Ingreso neto anual <b>${usd(r)}</b><br>Recupero en <b>${(P / r).toFixed(1)} años</b><br><small>Descuenta 30% de gastos. Valores de ejemplo.</small>`;
    }]
  };

  return { RUBRO, UI, GRUPOS, NIVELES, DEMOS };
})();
