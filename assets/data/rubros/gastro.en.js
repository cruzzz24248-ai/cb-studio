/* ==========================================================================
   CB STUDIO — datos de la propuesta «gastronomía» (en)
   Nivel de cada módulo: 1 básico · 2 intermedio · 3 avanzado.
   Todo es estático: sin base de datos ni panel. Lo que usa un servicio externo
   (planilla de Google, pagos) lo dice en la descripción del módulo.
   ========================================================================== */
window.CB_RUBRO = (() => {
  const $ = (s) => document.querySelector(s);

  const RUBRO = 'gastronomy';
  const UI = {
  none: 'You haven’t picked anything yet',
  areas: (a, n) => `${a} of ${n} areas lit up`,
  count: n => n + (n === 1 ? ' module' : ' modules'),
  min: 'Pick at least one module to send it.',
  try: 'Try demo',
  note: 'This is a sample with example values. On your site it would use your menu and prices.',
  msg: (nom, emp, lista, nota) => `Hi, I’m ${nom} from ${emp}. I built my selection for a gastronomy website and I’m interested in these modules:\n\n` + lista.map(n => '• ' + n).join('\n') + (nota ? `\n\n${nota}` : '') + '\n\nCould you put together a mockup for us?'
  };

  /* nivel: 1 básico, 2 intermedio, 3 avanzado */
  const GRUPOS = [
    ['Presentation and menu', [
      ['Our story and what we offer', 'Your story and what makes you different, so people choose you before they arrive.', 1],
      ['Digital menu with photos', 'Dishes, drinks and prices by category, clear and with photos that make people hungry.', 1],
      ['Vegan, gluten-free and spicy labels', 'Visible tags on each dish. The information is provided by the venue.', 2],
      ['Menu from a Google spreadsheet', 'Change prices and dishes in your spreadsheet and the site updates itself. Uses an external service (Google Sheets).', 3]]],
    ['Orders and reservations', [
      ['WhatsApp ordering with a cart', 'Pick dishes and quantities and send the finished order on WhatsApp.', 2, 'pedido'],
      ['Table reservations', 'Date, time and number of guests, sent on WhatsApp.', 2, 'reserva'],
      ['Delivery zones and fees', 'By zone, with delivery fee and minimum order in view.', 2],
      ['Payment or deposit with Mercado Pago', 'Charge for the order or a deposit with a payment button.', 3]]],
    ['Venue and location', [
      ['Opening hours and “open now”', 'Your opening hours and a notice showing whether you’re open right now.', 1, 'abierto'],
      ['Map, directions and photos of the venue', 'Address, map, parking and photos of the place.', 1],
      ['Where we are today', 'A weekly schedule of locations for food stands and food trucks.', 2],
      ['Rooms and spaces', 'Capacity, photos of each space and booking inquiries.', 2]]],
    ['Promotions and community', [
      ['Weekly deals and combos', 'Featured offers with dates, always in view.', 2],
      ['Featured reviews', 'Real customer opinions, chosen by you.', 1],
      ['Instagram built in', 'Your latest Instagram posts shown on the site.', 1],
      ['Catering and private events', 'Menus, quantities and quote requests.', 2]]],
    ['Trust and contact', [
      ['Frequently asked questions', 'Answers questions about hours, payments, delivery and reservations.', 1],
      ['Photo and video gallery', 'Dishes, venue and team in a lightweight gallery.', 1],
      ['Work with us', 'A form to receive applications by WhatsApp or email.', 1],
      ['Team and kitchen', 'Who cooks and serves, with their story.', 2]]],
    ['Technical base', [
      ['QR code for the tables', 'A QR code that leads to your menu, ready to print.', 1],
      ['Multiple languages', 'Spanish, English and Portuguese, with SEO for each.', 2],
      ['Local SEO', 'To show up when people search for where to eat in your area.', 1],
      ['Inquiry analytics', 'See which dishes get the most views and where people come from.', 1]]]
  ];
  const NIVELES = ['', 'Basic', 'Intermediate', 'Advanced'];

  /* ---------- Mini demos (valores de ejemplo, no reales) ---------- */
  const opts = (a, f) => a.map((x, i) => `<option value="${i}">${f(x)}</option>`).join('');
  const FMT = (n) => '$' + n.toLocaleString('en-US');
  const MENU = [['Classic hot dog', 5], ['Cheddar hot dog', 7], ['French fries', 4], ['Soda', 3]];
  const DIAS = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i + 1);
    return d.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });
  });
  const SEM = Array.from({ length: 7 }, (_, i) => {
    const s = new Date(2024, 0, 1 + i).toLocaleDateString('en-US', { weekday: 'long' });
    return s.charAt(0).toUpperCase() + s.slice(1);
  });
  const HORAS = ['8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM', '10:00 PM'];
  const HF = (h) => (h % 12 || 12) + ':00 ' + (h < 12 ? 'AM' : 'PM');
  const HORAS24 = Array.from({ length: 24 }, (_, h) => h);
  const PERSONAS = [1, 2, 3, 4, 5, 6, 7, 8];
  const CANT = [0, 1, 2, 3, 4, 5];

  const DEMOS = {
    pedido: ['Build your order', () =>
      MENU.map((m, i) => `<label>${m[0]} · ${FMT(m[1])}<select id="q${i}">${opts(CANT, n => n)}</select></label>`).join('') + '<p class="res" id="res"></p>', () => {
      let total = 0; const lineas = [];
      MENU.forEach((m, i) => { const q = Number($('#q' + i).value) || 0; if (q) { total += q * m[1]; lineas.push(`${q} × ${m[0]}`); } });
      $('#res').innerHTML = lineas.length ? `${lineas.join('<br>')}<br><b>${FMT(total)}</b><br><small>It’s sent ready-made on WhatsApp.</small>` : '<small>Pick quantities to see the order.</small>';
    }],
    reserva: ['Book your table', () => `
      <label>Day<select id="a">${opts(DIAS, d => d)}</select></label>
      <label>Time<select id="b">${opts(HORAS, h => h)}</select></label>
      <label>Guests<select id="c">${opts(PERSONAS, p => p)}</select></label>
      <p class="res" id="res"></p>`, () => {
      $('#res').innerHTML = `Table for <b>${PERSONAS[$('#c').value]}</b> · ${DIAS[$('#a').value]} · ${HORAS[$('#b').value]}<br><small>The venue receives it on WhatsApp.</small>`;
    }],
    abierto: ['Open now', () => `
      <label>Day<select id="a">${opts(SEM, d => d)}</select></label>
      <label>Time<select id="b">${opts(HORAS24, h => HF(h))}</select></label>
      <p class="res" id="res"></p>`, () => {
      const dia = Number($('#a').value) || 0, h = Number($('#b').value) || 0;
      const abierto = dia !== 0 && ((h >= 12 && h < 15) || (h >= 20 && h < 24));
      $('#res').innerHTML = `<b>${abierto ? 'Open' : 'Closed'}</b><br><small>Tuesday to Sunday · 12 PM to 3 PM and 8 PM to midnight</small>`;
    }]
  };

  return { RUBRO, UI, GRUPOS, NIVELES, DEMOS };
})();
