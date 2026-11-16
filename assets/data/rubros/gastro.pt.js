/* ==========================================================================
   CB STUDIO — datos de la propuesta «gastronomía» (pt)
   Nivel de cada módulo: 1 básico · 2 intermedio · 3 avanzado.
   Todo es estático: sin base de datos ni panel. Lo que usa un servicio externo
   (planilla de Google, pagos) lo dice en la descripción del módulo.
   ========================================================================== */
window.CB_RUBRO = (() => {
  const $ = (s) => document.querySelector(s);

  const RUBRO = 'gastronomia';
  const UI = {
  none: 'Você ainda não escolheu nada',
  areas: (a, n) => `${a} de ${n} áreas com a luz acesa`,
  count: n => n + (n === 1 ? ' módulo' : ' módulos'),
  min: 'Marque pelo menos um módulo para poder enviar.',
  try: 'Testar demo',
  note: 'É uma amostra com valores de exemplo. No seu site usaríamos seu cardápio e preços.',
  msg: (nom, emp, lista, nota) => `Olá, sou ${nom} de ${emp}. Montei a minha seleção para um site de gastronomia e tenho interesse nestes módulos:\n\n` + lista.map(n => '• ' + n).join('\n') + (nota ? `\n\n${nota}` : '') + '\n\nPodem montar uma maquete para nós?'
  };

  /* nivel: 1 básico, 2 intermedio, 3 avanzado */
  const GRUPOS = [
    ['Apresentação e cardápio', [
      ['Nossa história e proposta', 'A sua história e o que faz você diferente, para que escolham você antes de chegar.', 1],
      ['Cardápio digital com fotos', 'Pratos, bebidas e preços por categoria, claros e com fotos que dão fome.', 1],
      ['Selos vegano, sem glúten e picante', 'Marcas visíveis em cada prato. A informação é carregada pelo local.', 2],
      ['Cardápio a partir de uma planilha do Google', 'Você muda preços e pratos na sua planilha e o site se atualiza sozinho. Usa um serviço externo (Google Sheets).', 3]]],
    ['Pedidos e reservas', [
      ['Pedido por WhatsApp com carrinho', 'Escolher pratos e quantidades e enviar o pedido pronto pelo WhatsApp.', 2, 'pedido'],
      ['Reserva de mesa', 'Data, horário e número de pessoas, enviados pelo WhatsApp.', 2, 'reserva'],
      ['Entregas com zonas e taxas', 'Por zona, com taxa de entrega e pedido mínimo à vista.', 2],
      ['Pagamento ou sinal com Mercado Pago', 'Cobrar o pedido ou um sinal com um botão de pagamento.', 3]]],
    ['Local e localização', [
      ['Horários e «aberto agora»', 'Os horários do local e um aviso que mostra se está aberto neste momento.', 1, 'abierto'],
      ['Mapa, como chegar e fotos do local', 'Endereço, mapa, estacionamento e fotos do lugar.', 1],
      ['Onde estamos hoje', 'Agenda semanal de localizações para barracas e food trucks.', 2],
      ['Salões e ambientes', 'Capacidade, fotos de cada ambiente e pedidos de reserva.', 2]]],
    ['Promoções e comunidade', [
      ['Promoções e combos da semana', 'Ofertas em destaque com validade, sempre à vista.', 2],
      ['Avaliações em destaque', 'Opiniões reais de clientes, escolhidas por você.', 1],
      ['Instagram integrado', 'Suas últimas publicações exibidas no site.', 1],
      ['Catering e eventos privados', 'Cardápios, quantidades e pedido de orçamento.', 2]]],
    ['Confiança e contato', [
      ['Perguntas frequentes', 'Responde dúvidas sobre horários, pagamentos, entregas e reservas.', 1],
      ['Galeria de fotos e vídeos', 'Pratos, local e equipe em uma galeria leve.', 1],
      ['Trabalhe conosco', 'Formulário para receber candidaturas por WhatsApp ou e-mail.', 1],
      ['Equipe e cozinha', 'Quem cozinha e atende, com a sua história.', 2]]],
    ['Base técnica', [
      ['QR para as mesas', 'Um código QR que leva ao seu cardápio, pronto para imprimir.', 1],
      ['Vários idiomas', 'Espanhol, inglês e português, com SEO para cada um.', 2],
      ['SEO local', 'Para aparecer quando procuram onde comer na sua região.', 1],
      ['Estatísticas de consultas', 'Saber quais pratos são mais vistos e de onde as pessoas chegam.', 1]]]
  ];
  const NIVELES = ['', 'Básico', 'Intermediário', 'Avançado'];

  /* ---------- Mini demos (valores de ejemplo, no reales) ---------- */
  const opts = (a, f) => a.map((x, i) => `<option value="${i}">${f(x)}</option>`).join('');
  const FMT = (n) => 'R$ ' + n.toLocaleString('pt-BR');
  const MENU = [['Cachorro-quente clássico', 18], ['Cachorro-quente com cheddar', 22], ['Batata frita', 15], ['Refrigerante', 8]];
  const DIAS = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i + 1);
    return d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  });
  const SEM = Array.from({ length: 7 }, (_, i) => {
    const s = new Date(2024, 0, 1 + i).toLocaleDateString('pt-BR', { weekday: 'long' });
    return s.charAt(0).toUpperCase() + s.slice(1);
  });
  const HORAS = ['20:00', '20:30', '21:00', '21:30', '22:00'];
  const HF = (h) => h + ':00';
  const HORAS24 = Array.from({ length: 24 }, (_, h) => h);
  const PERSONAS = [1, 2, 3, 4, 5, 6, 7, 8];
  const CANT = [0, 1, 2, 3, 4, 5];

  const DEMOS = {
    pedido: ['Monte o seu pedido', () =>
      MENU.map((m, i) => `<label>${m[0]} · ${FMT(m[1])}<select id="q${i}">${opts(CANT, n => n)}</select></label>`).join('') + '<p class="res" id="res"></p>', () => {
      let total = 0; const lineas = [];
      MENU.forEach((m, i) => { const q = Number($('#q' + i).value) || 0; if (q) { total += q * m[1]; lineas.push(`${q} × ${m[0]}`); } });
      $('#res').innerHTML = lineas.length ? `${lineas.join('<br>')}<br><b>${FMT(total)}</b><br><small>Vai pronto para o WhatsApp.</small>` : '<small>Escolha as quantidades para ver o pedido.</small>';
    }],
    reserva: ['Reserve a sua mesa', () => `
      <label>Dia<select id="a">${opts(DIAS, d => d)}</select></label>
      <label>Horário<select id="b">${opts(HORAS, h => h)}</select></label>
      <label>Pessoas<select id="c">${opts(PERSONAS, p => p)}</select></label>
      <p class="res" id="res"></p>`, () => {
      $('#res').innerHTML = `Mesa para <b>${PERSONAS[$('#c').value]}</b> · ${DIAS[$('#a').value]} · ${HORAS[$('#b').value]}<br><small>O local recebe pelo WhatsApp.</small>`;
    }],
    abierto: ['Aberto agora', () => `
      <label>Dia<select id="a">${opts(SEM, d => d)}</select></label>
      <label>Horário<select id="b">${opts(HORAS24, h => HF(h))}</select></label>
      <p class="res" id="res"></p>`, () => {
      const dia = Number($('#a').value) || 0, h = Number($('#b').value) || 0;
      const abierto = dia !== 0 && ((h >= 12 && h < 15) || (h >= 20 && h < 24));
      $('#res').innerHTML = `<b>${abierto ? 'Aberto' : 'Fechado'}</b><br><small>Terça a domingo · 12 às 15 h e 20 às 24 h</small>`;
    }]
  };

  return { RUBRO, UI, GRUPOS, NIVELES, DEMOS };
})();
