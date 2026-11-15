/* ==========================================================================
   CB STUDIO — datos de la propuesta «salud y bienestar» (es)
   Nivel de cada módulo: 1 básico · 2 intermedio · 3 avanzado.
   Todo es estático: sin base de datos ni panel. Lo que usa un servicio externo
   (agenda, videollamada, pagos, analítica) lo dice en la descripción del módulo.
   ========================================================================== */
window.CB_RUBRO = (() => {
  const $ = (s) => document.querySelector(s);

  const RUBRO = 'salud y bienestar';
  const UI = {
  none: 'Todavía no elegiste nada',
  areas: (a, n) => `${a} de ${n} áreas con luz encendida`,
  count: n => n + (n === 1 ? ' módulo' : ' módulos'),
  min: 'Marcá al menos un módulo para poder enviarla.',
  try: 'Probar demo',
  note: 'Es una muestra con valores de ejemplo. En tu web usaría tus servicios y horarios.',
  msg: (nom, emp, lista, nota) => `Hola, soy ${nom} de ${emp}. Armé mi selección para una web de salud y bienestar y me interesan estos módulos:\n\n` + lista.map(n => '• ' + n).join('\n') + (nota ? `\n\n${nota}` : '') + '\n\n¿Me armás una maqueta?'
  };

  /* nivel: 1 básico, 2 intermedio, 3 avanzado */
  const GRUPOS = [
    ['Presentación', [
      ['Perfil profesional', 'Foto, formación, enfoque y matrícula para que te conozcan antes de la primera consulta.', 1],
      ['Servicios y áreas de trabajo', 'Qué tratás, cómo trabajás y para quién, explicado con claridad.', 1],
      ['Cómo es la primera consulta', 'Qué esperar, cuánto dura y qué llevar, para que lleguen con menos dudas.', 1],
      ['Equipo de profesionales', 'Una ficha por profesional, cada uno con su propio pedido de turno.', 2]]],
    ['Turnos y consultas', [
      ['Agenda de turnos online', 'Elegir día y horario desde la web, con un servicio de agenda externo.', 2, 'agenda'],
      ['Consulta online por videollamada', 'La modalidad online explicada, con el enlace a la sala el día del turno.', 1],
      ['Formulario previo a la consulta', 'Motivo de consulta y datos básicos: llega por WhatsApp y no se guarda nada en la web.', 2],
      ['Pago o seña online con Mercado Pago', 'Reservar el turno pagando una seña con un botón de pago.', 3]]],
    ['Herramientas para orientar', [
      ['Cuestionario de orientación', 'Unas preguntas simples para sugerir por dónde empezar. No reemplaza una consulta.', 2, 'cuest'],
      ['Obras sociales y prepagas', 'Un buscador para saber si trabajás con la suya.', 1, 'os'],
      ['Planes y packs de sesiones', 'Sesiones sueltas, packs y seguimientos, con los valores a la vista.', 2],
      ['Comparador de modalidades', 'Presencial, online, individual o grupal, lado a lado.', 1]]],
    ['Contenido', [
      ['Artículos y blog', 'Notas para responder dudas frecuentes y mostrar tu enfoque.', 2],
      ['Recursos descargables', 'Guías, ejercicios o checklists en PDF para quienes te siguen.', 1],
      ['Talleres y grupos', 'Próximas fechas, cupos y cómo anotarse.', 2],
      ['Videos y audios', 'Presentaciones, meditaciones o ejercicios incorporados desde YouTube o Vimeo.', 2]]],
    ['Confianza', [
      ['Matrícula, formación y certificaciones', 'Lo que respalda tu trabajo, visible y claro.', 1],
      ['Testimonios que cuidan la privacidad', 'Opiniones reales, con el permiso de cada persona.', 1],
      ['Preguntas frecuentes', 'Responde las dudas antes de que lleguen por mensaje.', 1],
      ['Confidencialidad y aviso de privacidad', 'Cómo se cuidan los datos y la información de cada consulta.', 1]]],
    ['Base técnica', [
      ['Mapa y fotos del consultorio', 'Cómo llegar, accesos, estacionamiento y fotos del lugar.', 1],
      ['Varios idiomas', 'Español, inglés y portugués, con SEO para cada uno.', 2],
      ['SEO local', 'Para aparecer cuando buscan tu especialidad en tu zona.', 1],
      ['Estadísticas de consultas', 'Saber qué servicios miran más y de dónde llegan las personas.', 1]]]
  ];
  const NIVELES = ['', 'Básico', 'Intermedio', 'Avanzado'];

  /* ---------- Mini demos (valores de ejemplo, no reales) ---------- */
  const opts = (a, f) => a.map((x, i) => `<option value="${i}">${f(x)}</option>`).join('');
  const DIAS = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i + 1);
    return d.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
  });
  const HORAS = ['09:00', '10:30', '15:00', '17:30'];
  const MODOS = ['Presencial', 'Online (videollamada)'];
  const Q1 = ['Quiero hablar de lo que me pasa', 'Quiero mejorar mi alimentación', 'Tengo una molestia física', 'Quiero cuidar mi piel o mi imagen'];
  const R1 = ['una consulta de psicología o terapia', 'una consulta de nutrición', 'una consulta de kinesiología o con un médico', 'una consulta de estética o dermatología'];
  const Q2 = ['Presencial', 'Online', 'Me da igual'];
  const LISTA = ['APROSS', 'OSDE', 'Swiss Medical', 'Galeno', 'Medifé', 'Sancor Salud', 'PAMI'];

  const DEMOS = {
    agenda: ['Elegí tu turno', () => `
      <label>Día<select id="a">${opts(DIAS, d => d)}</select></label>
      <label>Horario<select id="b">${opts(HORAS, h => h)}</select></label>
      <label>Modalidad<select id="c">${opts(MODOS, m => m)}</select></label>
      <p class="res" id="res"></p>`, () => {
      $('#res').innerHTML = `<b>${DIAS[$('#a').value]}</b> · ${HORAS[$('#b').value]} h<br>${MODOS[$('#c').value]}<br><small>La persona recibe la confirmación por WhatsApp.</small>`;
    }],
    cuest: ['Cuestionario de orientación', () => `
      <label>Qué te trae por acá<select id="a">${opts(Q1, q => q)}</select></label>
      <label>Cómo preferís la consulta<select id="b">${opts(Q2, q => q)}</select></label>
      <p class="res" id="res"></p>`, () => {
      $('#res').innerHTML = `Podrías empezar por <b>${R1[$('#a').value]}</b><br>Modalidad: ${Q2[$('#b').value]}<br><small>Es una orientación, no un diagnóstico.</small>`;
    }],
    os: ['Obras sociales y prepagas', () => `
      <label>Buscá tu obra social o prepaga<input id="a" type="search" placeholder="Escribí el nombre…" autocomplete="off"></label>
      <div class="res" id="res"></div>`, () => {
      const q = ($('#a').value || '').trim().toLowerCase();
      const r = LISTA.filter(n => n.toLowerCase().includes(q));
      $('#res').innerHTML = r.length ? '<ul>' + r.map(n => `<li>${n}</li>`).join('') + '</ul>' : '<small>Sin resultados. Consultanos igual.</small>';
    }]
  };

  return { RUBRO, UI, GRUPOS, NIVELES, DEMOS };
})();
