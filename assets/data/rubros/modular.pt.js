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
    try: 'Testar demo',
    note: 'É uma amostra com valores de exemplo. No seu site usaríamos seus modelos e preços.',
    msg: (nom, emp, lista, nota) => `Olá, sou ${nom} da ${emp}. Montei a minha seleção para um site de construção modular e tenho interesse nestes módulos:\n\n` + lista.map(n => '• ' + n).join('\n') + (nota ? `\n\n${nota}` : '') + '\n\nPodem montar uma maquete para nós?',
    pop: "★ Mais pedido",
    presets: [["pop", "Mais pedidos"], ["1", "Só o essencial"], ["all", "Selecionar tudo"], ["0", "Limpar"]],
    send: "Enviar minha seleção por WhatsApp",
    send0: "Pedir recomendação por WhatsApp",
    min: "Não precisa escolher: pode enviar assim e recomendamos os módulos mais úteis para a sua empresa.",
    msg0: (nom, emp, nota) => `Olá, sou ${nom} da ${emp}. Vi a proposta de site para construção modular e ainda não escolhi módulos. Podem me recomendar quais fazem mais sentido para nós e montar uma maquete?` + (nota ? `\n\n${nota}` : ''),
    tiposT: "Um site que mostra cada uso",
    tiposP: "Casas, escritórios, hospedagens e lojas: cada um merece o seu próprio caminho no site.",
    tipos: [["Casa", "Pronta para morar"], ["Escritório", "Espaços de trabalho"], ["Hospedagem turística", "Chalés com deck e pérgola"], ["Loja", "Cafés, lojas e quiosques"], ["Dois níveis", "Projetos que crescem em altura"]],
    demosT: "Teste o que o seu cliente veria",
    demosP: "Três ferramentas que podem viver no seu site. Toque e brinque com os valores.",
    cards: [["cfg", "Configurador e orçamento", "Escolha modelo, acabamento e extras e veja o valor na hora."], ["fin", "Simulador de financiamento", "Mexa na entrada e nas parcelas e veja quanto paga por mês."], ["ren", "Calculadora de rentabilidade", "Para investidores: renda anual e anos de retorno."]]
  };
  /* nivel: 1 básico, 2 intermedio, 3 avanzado · 5.º valor = 1 si es de «lo más pedido» */
  const GRUPOS = [
    ["Ferramentas para decidir", [
      ["Configurador de projeto", "O cliente monta o seu modelo, escolhe acabamentos e extras e vê o resultado na hora.", 2, "cfg", 1],
      ["Orçamento com PDF", "O cliente monta o orçamento sozinho, a qualquer hora, e envia pronto por WhatsApp.", 3, "cfg", 1],
      ["Simulador de financiamento", "Entrada, parcelas e prazos à vista: a dúvida sobre o preço se resolve sozinha.", 2, "fin"],
      ["Calculadora de rentabilidade", "Para hospedagens turísticas: o investidor vê em quantos anos recupera o investimento.", 2, "ren"],
      ["Sinal online", "Reservam um modelo pagando o sinal pelo site, sem esperar por ninguém.", 3]]],
    ["Catálogo", [
      ["Páginas de modelos", "Uma página por modelo com medidas, ambientes, fotos e plantas.", 1, "", 1],
      ["Comparador de modelos", "Até três modelos lado a lado.", 1, "cmp"]]],
    ["Confiança", [
      ["Garantias e certificações", "O que respalda a fabricação, de forma clara.", 1],
      ["Depoimentos e vídeo da fábrica", "Clientes reais e o processo à vista: confiança antes da primeira mensagem.", 1, "", 1],
      ["Perguntas frequentes", "Responde as dúvidas antes que cheguem por mensagem.", 1]]],
    ["Obra", [
      ["Processo passo a passo", "Da ideia à entrega, explicado com desenhos.", 1],
      ["Acompanhamento da obra", "Linha do tempo com fotos de cada etapa: o cliente vê o módulo ganhando forma.", 3]]],
    ["Alcance", [
      ["Formulário que qualifica o cliente", "Terreno, orçamento e prazo: os contatos chegam prontos para orçar.", 2, "", 1],
      ["Mapa de obras entregues", "Sua trajetória à vista, filtrável por tipo e estado.", 2],
      ["Área para empresas", "Acampamentos, escritórios e empreendimentos, com pedido por volume.", 1],
      ["Instagram integrado", "Suas últimas obras do Instagram exibidas no site.", 1],
      ["Guia do terreno e normas", "O que preparar, o que licenciar e um checklist para baixar.", 1]]],
    ["Base técnica", [
      ["Vários idiomas", "Espanhol, inglês e português, com SEO para cada um.", 2],
      ["SEO local", "Para aparecer quando buscam construção modular na sua região.", 1],
      ["Estatísticas de contatos", "Saber quais modelos mais são vistos e de onde vêm os clientes.", 1]]]
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
