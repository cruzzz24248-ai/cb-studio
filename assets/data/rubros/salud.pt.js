/* ==========================================================================
   CB STUDIO — datos de la propuesta «salud y bienestar» (pt)
   Nivel de cada módulo: 1 básico · 2 intermedio · 3 avanzado.
   Todo es estático: sin base de datos ni panel. Lo que usa un servicio externo
   (agenda, videollamada, pagos, analítica) lo dice en la descripción del módulo.
   ========================================================================== */
window.CB_RUBRO = (() => {
  const $ = (s) => document.querySelector(s);

  const RUBRO = 'saúde e bem-estar';
  const UI = {
  none: 'Você ainda não escolheu nada',
  areas: (a, n) => `${a} de ${n} áreas com a luz acesa`,
  count: n => n + (n === 1 ? ' módulo' : ' módulos'),
  min: 'Marque pelo menos um módulo para poder enviar.',
  try: 'Testar demo',
  note: 'É uma amostra com valores de exemplo. No seu site usaríamos seus serviços e horários.',
  msg: (nom, emp, lista, nota) => `Olá, sou ${nom} de ${emp}. Montei a minha seleção para um site de saúde e bem-estar e tenho interesse nestes módulos:\n\n` + lista.map(n => '• ' + n).join('\n') + (nota ? `\n\n${nota}` : '') + '\n\nPodem montar uma maquete para nós?'
  };

  /* nivel: 1 básico, 2 intermedio, 3 avanzado */
  const GRUPOS = [
    ['Apresentação', [
      ['Perfil profissional', 'Foto, formação, abordagem e registro profissional para que conheçam você antes da primeira consulta.', 1],
      ['Serviços e áreas de atuação', 'O que você trata, como trabalha e para quem, explicado com clareza.', 1],
      ['Como é a primeira consulta', 'O que esperar, quanto dura e o que levar, para chegarem com menos dúvidas.', 1],
      ['Equipe de profissionais', 'Uma ficha por profissional, cada um com o seu próprio pedido de agendamento.', 2]]],
    ['Agendamentos e consultas', [
      ['Agendamento online', 'Escolher dia e horário pelo site, com um serviço de agenda externo.', 2, 'agenda'],
      ['Consulta online por videochamada', 'A modalidade online explicada, com o link da sala no dia da consulta.', 1],
      ['Formulário prévio à consulta', 'Motivo da consulta e dados básicos: chega por WhatsApp e nada é guardado no site.', 2],
      ['Pagamento ou sinal online com Mercado Pago', 'Reservar a consulta pagando um sinal com um botão de pagamento.', 3]]],
    ['Ferramentas de orientação', [
      ['Questionário de orientação', 'Algumas perguntas simples para sugerir por onde começar. Não substitui uma consulta.', 2, 'cuest'],
      ['Convênios e planos de saúde', 'Um buscador para saber se você atende o plano da pessoa.', 1, 'os'],
      ['Planos e pacotes de sessões', 'Sessões avulsas, pacotes e acompanhamentos, com os valores à vista.', 2],
      ['Comparador de modalidades', 'Presencial, online, individual ou em grupo, lado a lado.', 1]]],
    ['Conteúdo', [
      ['Artigos e blog', 'Textos para responder dúvidas frequentes e mostrar a sua abordagem.', 2],
      ['Materiais para baixar', 'Guias, exercícios ou checklists em PDF para quem acompanha você.', 1],
      ['Workshops e grupos', 'Próximas datas, vagas e como se inscrever.', 2],
      ['Vídeos e áudios', 'Apresentações, meditações ou exercícios incorporados do YouTube ou Vimeo.', 2]]],
    ['Confiança', [
      ['Registro, formação e certificações', 'O que respalda o seu trabalho, visível e claro.', 1],
      ['Depoimentos que cuidam da privacidade', 'Opiniões reais, com a permissão de cada pessoa.', 1],
      ['Perguntas frequentes', 'Responde às dúvidas antes que cheguem por mensagem.', 1],
      ['Confidencialidade e aviso de privacidade', 'Como os dados e as informações de cada consulta são protegidos.', 1]]],
    ['Base técnica', [
      ['Mapa e fotos do consultório', 'Como chegar, acessos, estacionamento e fotos do espaço.', 1],
      ['Vários idiomas', 'Espanhol, inglês e português, com SEO para cada um.', 2],
      ['SEO local', 'Para aparecer quando procuram a sua especialidade na sua região.', 1],
      ['Estatísticas de consultas', 'Saber quais serviços são mais vistos e de onde as pessoas chegam.', 1]]]
  ];
  const NIVELES = ['', 'Básico', 'Intermediário', 'Avançado'];

  /* ---------- Mini demos (valores de ejemplo, no reales) ---------- */
  const opts = (a, f) => a.map((x, i) => `<option value="${i}">${f(x)}</option>`).join('');
  const DIAS = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i + 1);
    return d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  });
  const HORAS = ['09:00', '10:30', '15:00', '17:30'];
  const MODOS = ['Presencial', 'Online (videochamada)'];
  const Q1 = ['Quero conversar sobre o que estou sentindo', 'Quero melhorar a minha alimentação', 'Tenho um desconforto físico', 'Quero cuidar da minha pele ou da minha imagem'];
  const R1 = ['uma consulta de psicologia ou terapia', 'uma consulta de nutrição', 'uma consulta de fisioterapia ou com um médico', 'uma consulta de estética ou dermatologia'];
  const Q2 = ['Presencial', 'Online', 'Tanto faz'];
  const LISTA = ['Unimed', 'Bradesco Saúde', 'SulAmérica', 'Amil', 'Porto Saúde'];

  const DEMOS = {
    agenda: ['Escolha o seu horário', () => `
      <label>Dia<select id="a">${opts(DIAS, d => d)}</select></label>
      <label>Horário<select id="b">${opts(HORAS, h => h)}</select></label>
      <label>Modalidade<select id="c">${opts(MODOS, m => m)}</select></label>
      <p class="res" id="res"></p>`, () => {
      $('#res').innerHTML = `<b>${DIAS[$('#a').value]}</b> · ${HORAS[$('#b').value]} h<br>${MODOS[$('#c').value]}<br><small>A pessoa recebe a confirmação por WhatsApp.</small>`;
    }],
    cuest: ['Questionário de orientação', () => `
      <label>O que traz você aqui<select id="a">${opts(Q1, q => q)}</select></label>
      <label>Como você prefere a consulta<select id="b">${opts(Q2, q => q)}</select></label>
      <p class="res" id="res"></p>`, () => {
      $('#res').innerHTML = `Você poderia começar por <b>${R1[$('#a').value]}</b><br>Modalidade: ${Q2[$('#b').value]}<br><small>É uma orientação, não um diagnóstico.</small>`;
    }],
    os: ['Convênios e planos de saúde', () => `
      <label>Procure o seu convênio ou plano<input id="a" type="search" placeholder="Digite o nome…" autocomplete="off"></label>
      <div class="res" id="res"></div>`, () => {
      const q = ($('#a').value || '').trim().toLowerCase();
      const r = LISTA.filter(n => n.toLowerCase().includes(q));
      $('#res').innerHTML = r.length ? '<ul>' + r.map(n => `<li>${n}</li>`).join('') + '</ul>' : '<small>Sem resultados. Fale conosco mesmo assim.</small>';
    }]
  };

  return { RUBRO, UI, GRUPOS, NIVELES, DEMOS };
})();
