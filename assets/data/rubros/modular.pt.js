/* ==========================================================================
   CB STUDIO — datos de la propuesta «construcción modular» (pt)
   Para un rubro nuevo: copiar este archivo, cambiar los textos y los módulos
   (GRUPOS) y las mini demos (DEMOS), y enlazarlo en la página del rubro.
   Nivel de cada módulo: 1 básico · 2 intermedio · 3 avanzado.
   ========================================================================== */
window.CB_RUBRO = (() => {
  const $ = (s) => document.querySelector(s);

  const RUBRO = 'construção modular';
  const UI = {
    none: 'Você ainda não escolheu nada',
    areas: (a, n) => `${a} de ${n} áreas com a luz acesa`,
    count: n => n + (n === 1 ? ' módulo' : ' módulos'),
    min: 'Marque pelo menos um módulo para poder enviar.',
    try: 'Testar demo',
    note: 'É uma amostra com valores de exemplo. No seu site usaríamos seus modelos e preços.',
    msg: (nom, emp, lista, nota) => `Olá, sou ${nom} da ${emp}. Montei a minha seleção para um site de construção modular e tenho interesse nestes módulos:\n\n` + lista.map(n => '• ' + n).join('\n') + (nota ? `\n\n${nota}` : '') + '\n\nPodem montar uma maquete para nós?'
  };
  /* nivel: 1 básico, 2 intermedio, 3 avanzado */
  const GRUPOS = [
    ['Catálogo', [
      ['Páginas de modelos', 'Uma página por modelo com medidas, ambientes, fotos e plantas.', 1],
      ['Configurador de projeto', 'O cliente escolhe modelo, acabamentos e extras e vê o resultado.', 2, 'cfg'],
      ['Comparador de modelos', 'Até três modelos lado a lado.', 1, 'cmp']]],
    ['Ferramentas para decidir', [
      ['Orçamento com PDF', 'O orçamento se monta sozinho e pode ser baixado ou enviado por WhatsApp.', 3, 'cfg'],
      ['Sinal online', 'Reservar um modelo pagando o sinal pelo site.', 3],
      ['Simulador de financiamento', 'Entrada, parcelas e prazos à vista.', 2, 'fin'],
      ['Calculadora de rentabilidade', 'Para hospedagens turísticas: investimento e anos de retorno.', 2, 'ren']]],
    ['Obra', [
      ['Processo passo a passo', 'Da ideia à entrega, explicado com desenhos.', 1],
      ['Acompanhamento da obra', 'Linha do tempo com fotos de cada etapa da fabricação.', 3]]],
    ['Alcance', [
      ['Mapa de obras entregues', 'Projetos filtráveis por tipo e estado.', 2],
      ['Área para empresas', 'Acampamentos, escritórios e empreendimentos, com pedido por volume.', 1],
      ['Instagram integrado', 'Suas últimas obras do Instagram exibidas no site.', 1],
      ['Formulário que qualifica o cliente', 'Terreno, orçamento e prazo: os contatos chegam prontos para orçar.', 2],
      ['Guia do terreno e normas', 'O que preparar, o que licenciar e um checklist para baixar.', 1]]],
    ['Confiança', [
      ['Garantias e certificações', 'O que respalda a fabricação, de forma clara.', 1],
      ['Depoimentos e vídeo da fábrica', 'Clientes reais e o processo à vista.', 1],
      ['Perguntas frequentes', 'Responde as dúvidas antes que cheguem por mensagem.', 1]]],
    ['Base técnica', [
      ['Vários idiomas', 'Espanhol, inglês e português, com SEO para cada um.', 2],
      ['SEO local', 'Para aparecer quando buscam construção modular na sua região.', 1],
      ['Estatísticas de contatos', 'Saber quais modelos mais são vistos e de onde vêm os clientes.', 1]]]
  ];
  const NIVELES = ['', 'Básico', 'Intermediário', 'Avançado'];

  /* ---------- Mini demos (valores de ejemplo, no reales) ---------- */
  const usd = n => 'USD ' + Math.round(n).toLocaleString('pt-BR');
  const MODELOS = [['Modelo pequeno', 18, 'Studio', 1], ['Modelo médio', 36, '1 quarto', 1], ['Modelo grande', 60, '2 quartos', 1]];
  const LINEAS = [['Padrão', 1000], ['Premium', 1200], ['Deluxe', 1400]];
  const EXTRAS = [['Pérgola', 1800], ['Deck', 2400], ['Fechamentos de segurança', 1200]];
  const rng = (id, t, min, max, step, v) => `<label>${t}: <b id="${id}-o"></b><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${v}"></label>`;
  const opts = (a, f) => a.map((x, i) => `<option value="${i}">${f(x)}</option>`).join('');

  const DEMOS = {
    cfg: ['Configure seu módulo', () => `
      <label>Modelo<select id="a">${opts(MODELOS, m => m[0] + ' · ' + m[1] + ' m²')}</select></label>
      <label>Acabamento<select id="b">${opts(LINEAS, l => l[0])}</select></label>
      <fieldset><legend>Extras</legend>${EXTRAS.map((e, i) => `<label class="ck"><input type="checkbox" class="ex" value="${i}"> ${e[0]}</label>`).join('')}</fieldset>
      <p class="res" id="res"></p>`, () => {
      const m = MODELOS[$('#a').value], l = LINEAS[$('#b').value];
      const ex = [...document.querySelectorAll('.ex:checked')].reduce((s, c) => s + EXTRAS[c.value][1], 0);
      $('#res').innerHTML = `<b>${usd(m[1] * l[1] + ex)}</b> estimado<br><small>${m[1]} m² · ${m[2]} · produção em 60 a 90 dias</small>`;
    }],
    cmp: ['Comparador de modelos', () => `
      <div class="duo"><select id="a">${opts(MODELOS, m => m[0])}</select><select id="b">${opts(MODELOS, m => m[0]).replace('value="1"','value="1" selected')}</select></div>
      <table id="res"></table>`, () => {
      const A = MODELOS[$('#a').value], B = MODELOS[$('#b').value];
      const row = (t, f) => `<tr><th>${t}</th><td>${f(A)}</td><td>${f(B)}</td></tr>`;
      $('#res').innerHTML = row('Área', m => m[1] + ' m²') + row('Ambientes', m => m[2]) + row('A partir de', m => usd(m[1] * 1000));
    }, 1],
    fin: ['Simulador de financiamento', () => `
      ${rng('p', 'Valor do projeto', 10000, 150000, 1000, 50000)}${rng('q', 'Entrada', 20, 80, 5, 40)}${rng('n', 'Parcelas', 6, 48, 6, 24)}
      <p class="res" id="res"></p>`, () => {
      const P = +$('#p').value, q = +$('#q').value, n = +$('#n').value, s = P * (1 - q / 100), i = 0.015;
      $('#p-o').textContent = usd(P); $('#q-o').textContent = q + '%'; $('#n-o').textContent = n;
      $('#res').innerHTML = `Entrada <b>${usd(P * q / 100)}</b><br>Parcela mensal <b>${usd(s * i / (1 - Math.pow(1 + i, -n)))}</b><br><small>Juros de exemplo: 1,5% ao mês</small>`;
    }],
    ren: ['Calculadora de rentabilidad', () => `
      ${rng('p', 'Investimento', 15000, 120000, 1000, 40000)}${rng('q', 'Preço por noite', 40, 300, 10, 120)}${rng('n', 'Ocupación', 20, 90, 5, 55)}
      <p class="res" id="res"></p>`, () => {
      const P = +$('#p').value, q = +$('#q').value, n = +$('#n').value, r = q * 365 * n / 100 * 0.7;
      $('#p-o').textContent = usd(P); $('#q-o').textContent = usd(q); $('#n-o').textContent = n + '%';
      $('#res').innerHTML = `Receita líquida anual <b>${usd(r)}</b><br>Retorno em <b>${(P / r).toFixed(1)} años</b><br><small>Desconta 30% de despesas. Valores de exemplo.</small>`;
    }]
  };

  return { RUBRO, UI, GRUPOS, NIVELES, DEMOS };
})();
