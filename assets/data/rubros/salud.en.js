/* ==========================================================================
   CB STUDIO — datos de la propuesta «salud y bienestar» (en)
   Nivel de cada módulo: 1 básico · 2 intermedio · 3 avanzado.
   Todo es estático: sin base de datos ni panel. Lo que usa un servicio externo
   (agenda, videollamada, pagos, analítica) lo dice en la descripción del módulo.
   ========================================================================== */
window.CB_RUBRO = (() => {
  const $ = (s) => document.querySelector(s);

  const RUBRO = 'health and wellness';
  const UI = {
  none: 'You haven’t picked anything yet',
  areas: (a, n) => `${a} of ${n} areas lit up`,
  count: n => n + (n === 1 ? ' module' : ' modules'),
  min: 'Pick at least one module to send it.',
  try: 'Try demo',
  note: 'This is a sample with example values. On your site it would use your services and schedules.',
  msg: (nom, emp, lista, nota) => `Hi, I’m ${nom} from ${emp}. I built my selection for a health and wellness website and I’m interested in these modules:\n\n` + lista.map(n => '• ' + n).join('\n') + (nota ? `\n\n${nota}` : '') + '\n\nCould you put together a mockup for us?'
  };

  /* nivel: 1 básico, 2 intermedio, 3 avanzado */
  const GRUPOS = [
    ['Presentation', [
      ['Professional profile', 'Photo, training, approach and license number so people get to know you before the first visit.', 1],
      ['Services and areas of work', 'What you treat, how you work and who you work with, explained clearly.', 1],
      ['What the first visit is like', 'What to expect, how long it lasts and what to bring, so people arrive with fewer doubts.', 1],
      ['Team of professionals', 'A profile for each professional, each with their own appointment request.', 2]]],
    ['Appointments and visits', [
      ['Online appointment booking', 'Pick a day and time from the site, using an external scheduling service.', 2, 'agenda'],
      ['Online video visits', 'The online option explained, with the link to the room on the day of the appointment.', 1],
      ['Pre-visit form', 'Reason for the visit and basic details: it arrives on WhatsApp and nothing is stored on the site.', 2],
      ['Online payment or deposit with Mercado Pago', 'Reserve an appointment by paying a deposit with a payment button.', 3]]],
    ['Guidance tools', [
      ['Guidance quiz', 'A few simple questions to suggest where to start. It doesn’t replace a consultation.', 2, 'cuest'],
      ['Health insurance finder', 'A search so people can check whether you work with theirs.', 1, 'os'],
      ['Plans and session packs', 'Single sessions, packs and follow-ups, with prices in view.', 2],
      ['Format comparison', 'In person, online, individual or group, side by side.', 1]]],
    ['Content', [
      ['Articles and blog', 'Posts that answer common questions and show your approach.', 2],
      ['Downloadable resources', 'Guides, exercises or checklists in PDF for the people who follow you.', 1],
      ['Workshops and groups', 'Upcoming dates, spots available and how to sign up.', 2],
      ['Videos and audio', 'Introductions, meditations or exercises embedded from YouTube or Vimeo.', 2]]],
    ['Trust', [
      ['License, training and certifications', 'What backs up your work, visible and clear.', 1],
      ['Testimonials that protect privacy', 'Real opinions, shared with each person’s permission.', 1],
      ['Frequently asked questions', 'Answers doubts before they arrive as messages.', 1],
      ['Confidentiality and privacy notice', 'How personal data and the details of each visit are protected.', 1]]],
    ['Technical base', [
      ['Map and photos of the practice', 'How to get there, access, parking and photos of the space.', 1],
      ['Multiple languages', 'Spanish, English and Portuguese, with SEO for each.', 2],
      ['Local SEO', 'To show up when people search for your specialty in your area.', 1],
      ['Inquiry analytics', 'See which services get the most views and where people come from.', 1]]]
  ];
  const NIVELES = ['', 'Basic', 'Intermediate', 'Advanced'];

  /* ---------- Mini demos (valores de ejemplo, no reales) ---------- */
  const opts = (a, f) => a.map((x, i) => `<option value="${i}">${f(x)}</option>`).join('');
  const DIAS = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i + 1);
    return d.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });
  });
  const HORAS = ['9:00 AM', '10:30 AM', '3:00 PM', '5:30 PM'];
  const MODOS = ['In person', 'Online (video call)'];
  const Q1 = ['I’d like to talk about what I’m going through', 'I’d like to improve my eating habits', 'I have a physical discomfort', 'I’d like to look after my skin or appearance'];
  const R1 = ['a psychology or therapy session', 'a nutrition appointment', 'a physiotherapy or medical appointment', 'an aesthetics or dermatology appointment'];
  const Q2 = ['In person', 'Online', 'No preference'];
  const LISTA = ['Aetna', 'Blue Cross', 'Cigna', 'UnitedHealthcare'];

  const DEMOS = {
    agenda: ['Pick your appointment', () => `
      <label>Day<select id="a">${opts(DIAS, d => d)}</select></label>
      <label>Time<select id="b">${opts(HORAS, h => h)}</select></label>
      <label>Format<select id="c">${opts(MODOS, m => m)}</select></label>
      <p class="res" id="res"></p>`, () => {
      $('#res').innerHTML = `<b>${DIAS[$('#a').value]}</b> · ${HORAS[$('#b').value]}<br>${MODOS[$('#c').value]}<br><small>The person gets a confirmation on WhatsApp.</small>`;
    }],
    cuest: ['Guidance quiz', () => `
      <label>What brings you here<select id="a">${opts(Q1, q => q)}</select></label>
      <label>How would you prefer the visit<select id="b">${opts(Q2, q => q)}</select></label>
      <p class="res" id="res"></p>`, () => {
      $('#res').innerHTML = `You could start with <b>${R1[$('#a').value]}</b><br>Format: ${Q2[$('#b').value]}<br><small>This is guidance, not a diagnosis.</small>`;
    }],
    os: ['Health insurance finder', () => `
      <label>Search for your insurance or health plan<input id="a" type="search" placeholder="Type the name…" autocomplete="off"></label>
      <div class="res" id="res"></div>`, () => {
      const q = ($('#a').value || '').trim().toLowerCase();
      const r = LISTA.filter(n => n.toLowerCase().includes(q));
      $('#res').innerHTML = r.length ? '<ul>' + r.map(n => `<li>${n}</li>`).join('') + '</ul>' : '<small>No results. Message us anyway.</small>';
    }]
  };

  return { RUBRO, UI, GRUPOS, NIVELES, DEMOS };
})();
