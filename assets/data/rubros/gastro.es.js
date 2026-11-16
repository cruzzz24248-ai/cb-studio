/* ==========================================================================
   CB STUDIO — datos de la propuesta «gastronomía» (es)
   Nivel de cada módulo: 1 básico · 2 intermedio · 3 avanzado.
   Todo es estático: sin base de datos ni panel. Lo que usa un servicio externo
   (planilla de Google, pagos) lo dice en la descripción del módulo.
   ========================================================================== */
window.CB_RUBRO = (() => {
  const $ = (s) => document.querySelector(s);

  const RUBRO = 'gastronomía';
  const UI = {
  none: 'Todavía no elegiste nada',
  areas: (a, n) => `${a} de ${n} áreas con luz encendida`,
  count: n => n + (n === 1 ? ' módulo' : ' módulos'),
  min: 'Marcá al menos un módulo para poder enviarla.',
  try: 'Probar demo',
  note: 'Es una muestra con valores de ejemplo. En tu web usaría tu carta y tus precios.',
  msg: (nom, emp, lista, nota) => `Hola, soy ${nom} de ${emp}. Armé mi selección para una web de gastronomía y me interesan estos módulos:\n\n` + lista.map(n => '• ' + n).join('\n') + (nota ? `\n\n${nota}` : '') + '\n\n¿Me armás una maqueta?'
  };

  /* nivel: 1 básico, 2 intermedio, 3 avanzado */
  const GRUPOS = [
    ['Presentación y carta', [
      ['Historia y propuesta', 'Tu historia y lo que te hace distinto, para que te elijan antes de llegar.', 1],
      ['Carta digital con fotos', 'Platos, bebidas y precios por categoría, claros y con fotos que dan hambre.', 1],
      ['Etiquetas vegano, sin TACC y picante', 'Marcas visibles en cada plato. La información la carga el local.', 2],
      ['Carta desde una planilla de Google', 'Cambiás precios y platos en tu planilla y la web se actualiza sola. Usa un servicio externo (Google Sheets).', 3]]],
    ['Pedidos y reservas', [
      ['Pedido por WhatsApp con carrito', 'Elegir platos y cantidades y enviar el pedido armado por WhatsApp.', 2, 'pedido'],
      ['Reserva de mesa', 'Fecha, hora y cantidad de personas, enviadas por WhatsApp.', 2, 'reserva'],
      ['Envíos con zonas y costos', 'Por zona, con costo de envío y pedido mínimo a la vista.', 2],
      ['Pago o seña con Mercado Pago', 'Cobrar el pedido o una seña con un botón de pago.', 3]]],
    ['Local y ubicación', [
      ['Horarios y «abierto ahora»', 'Los horarios del local y un aviso que muestra si está abierto en este momento.', 1, 'abierto'],
      ['Mapa, cómo llegar y fotos del local', 'Dirección, mapa, estacionamiento y fotos del lugar.', 1],
      ['Dónde estamos hoy', 'Agenda semanal de ubicaciones para puestos y food trucks.', 2],
      ['Salones y ambientes', 'Capacidad, fotos de cada ambiente y consultas para reservarlos.', 2]]],
    ['Promociones y comunidad', [
      ['Promos y combos de la semana', 'Ofertas destacadas con vigencia, siempre a la vista.', 2],
      ['Reseñas destacadas', 'Opiniones reales de clientes, elegidas por vos.', 1],
      ['Instagram integrado', 'Tus últimas publicaciones mostradas en la web.', 1],
      ['Catering y eventos privados', 'Menús, cantidades y pedido de presupuesto.', 2]]],
    ['Confianza y contacto', [
      ['Preguntas frecuentes', 'Responde dudas sobre horarios, pagos, envíos y reservas.', 1],
      ['Galería de fotos y videos', 'Platos, local y equipo en una galería liviana.', 1],
      ['Trabajá con nosotros', 'Formulario para recibir postulaciones por WhatsApp o correo.', 1],
      ['Equipo y cocina', 'Quiénes cocinan y atienden, con su historia.', 2]]],
    ['Base técnica', [
      ['QR para las mesas', 'Un código QR que lleva a tu carta, listo para imprimir.', 1],
      ['Varios idiomas', 'Español, inglés y portugués, con SEO para cada uno.', 2],
      ['SEO local', 'Para aparecer cuando buscan dónde comer en tu zona.', 1],
      ['Estadísticas de consultas', 'Saber qué platos miran más y de dónde llegan las personas.', 1]]]
  ];
  const NIVELES = ['', 'Básico', 'Intermedio', 'Avanzado'];

  /* ---------- Mini demos (valores de ejemplo, no reales) ---------- */
  const opts = (a, f) => a.map((x, i) => `<option value="${i}">${f(x)}</option>`).join('');
  const FMT = (n) => '$' + n.toLocaleString('es-AR');
  const MENU = [['Pancho clásico', 3500], ['Pancho con cheddar', 4200], ['Papas fritas', 2800], ['Gaseosa', 1500]];
  const DIAS = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i + 1);
    return d.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
  });
  const SEM = Array.from({ length: 7 }, (_, i) => {
    const s = new Date(2024, 0, 1 + i).toLocaleDateString('es-AR', { weekday: 'long' });
    return s.charAt(0).toUpperCase() + s.slice(1);
  });
  const HORAS = ['20:00', '20:30', '21:00', '21:30', '22:00'];
  const HF = (h) => h + ':00';
  const HORAS24 = Array.from({ length: 24 }, (_, h) => h);
  const PERSONAS = [1, 2, 3, 4, 5, 6, 7, 8];
  const CANT = [0, 1, 2, 3, 4, 5];

  const DEMOS = {
    pedido: ['Armá tu pedido', () =>
      MENU.map((m, i) => `<label>${m[0]} · ${FMT(m[1])}<select id="q${i}">${opts(CANT, n => n)}</select></label>`).join('') + '<p class="res" id="res"></p>', () => {
      let total = 0; const lineas = [];
      MENU.forEach((m, i) => { const q = Number($('#q' + i).value) || 0; if (q) { total += q * m[1]; lineas.push(`${q} × ${m[0]}`); } });
      $('#res').innerHTML = lineas.length ? `${lineas.join('<br>')}<br><b>${FMT(total)}</b><br><small>Se envía armado por WhatsApp.</small>` : '<small>Elegí cantidades para ver el pedido.</small>';
    }],
    reserva: ['Reservá tu mesa', () => `
      <label>Día<select id="a">${opts(DIAS, d => d)}</select></label>
      <label>Hora<select id="b">${opts(HORAS, h => h)}</select></label>
      <label>Personas<select id="c">${opts(PERSONAS, p => p)}</select></label>
      <p class="res" id="res"></p>`, () => {
      $('#res').innerHTML = `Mesa para <b>${PERSONAS[$('#c').value]}</b> · ${DIAS[$('#a').value]} · ${HORAS[$('#b').value]}<br><small>El local la recibe por WhatsApp.</small>`;
    }],
    abierto: ['Abierto ahora', () => `
      <label>Día<select id="a">${opts(SEM, d => d)}</select></label>
      <label>Hora<select id="b">${opts(HORAS24, h => HF(h))}</select></label>
      <p class="res" id="res"></p>`, () => {
      const dia = Number($('#a').value) || 0, h = Number($('#b').value) || 0;
      const abierto = dia !== 0 && ((h >= 12 && h < 15) || (h >= 20 && h < 24));
      $('#res').innerHTML = `<b>${abierto ? 'Abierto' : 'Cerrado'}</b><br><small>Martes a domingo · 12 a 15 h y 20 a 24 h</small>`;
    }]
  };

  return { RUBRO, UI, GRUPOS, NIVELES, DEMOS };
})();
