/*
  simulador.js: Simulador Crise na Equipe (Lab I, aula 7). Caso fictício, criado para a aula.
  versão 1 · 2026-10-14
  Cinco decisões; cada escolha mexe em três indicadores (equipe, entrega e reputação, de 0 a 100)
  e corresponde a um dos cinco jeitos de lidar com conflito da aula 7.
  O último resultado fica no navegador (localStorage "lab1-simulador").
*/
(function () {
  var CHAVE = "lab1-simulador";
  var NOMES = { equipe: "Confiança da equipe", entrega: "Entrega do projeto", reputacao: "Sua reputação" };
  var RODADAS = [
    {
      titulo: "Segunda-feira: a tela de login",
      situacao: "Na reunião, o Diego quer refazer a tela de login do zero. A Bia acha que não dá tempo: a entrega para a clínica é na sexta.",
      tipo: "Conflito de tarefa",
      opcoes: [
        { txt: "Fico quieto: eles que se resolvam.", estilo: "Evitar", ef: { equipe: -5, entrega: -10, reputacao: -5 },
          cons: "A discussão se arrasta por dois dias e ninguém decide. O prazo ficou ainda mais apertado." },
        { txt: "Proponho testar a tela atual com dois usuários hoje e decidir com base no resultado.", estilo: "Colaborar", ef: { equipe: 10, entrega: 5, reputacao: 10 },
          cons: "O teste mostra dois problemas pequenos. A equipe ajusta a tela em uma tarde, e ninguém sai perdendo." },
        { txt: "Defendo o Diego com tudo: a tela está feia e pronto.", estilo: "Competir", ef: { equipe: -10, entrega: -5, reputacao: 0 },
          cons: "A Bia se sente atropelada e para de dar opinião. A tela fica mais bonita, mas atrasa o resto." }
      ]
    },
    {
      titulo: "Terça-feira: o quadro de tarefas",
      situacao: "Ninguém atualiza o quadro de tarefas no Planner, e duas pessoas programaram a mesma função.",
      tipo: "Conflito de processo",
      opcoes: [
        { txt: "Atualizo eu mesmo o quadro todo dia, sem falar nada.", estilo: "Acomodar", ef: { equipe: 0, entrega: 5, reputacao: -5 },
          cons: "O quadro fica em dia, mas você vira o secretário da equipe e atrasa a sua parte." },
        { txt: "Proponho dez minutos de conversa todo dia para atualizar o quadro juntos.", estilo: "Colaborar", ef: { equipe: 10, entrega: 10, reputacao: 5 },
          cons: "Na quarta, o retrabalho acabou. Todo mundo sabe o que o outro está fazendo." },
        { txt: "Mando no grupo: “Quem não atualiza o quadro está atrapalhando todo mundo!”", estilo: "Competir", ef: { equipe: -10, entrega: 5, reputacao: -10 },
          cons: "O quadro é atualizado, mas o clima pesa. A mensagem em tom de bronca fica no grupo." }
      ]
    },
    {
      titulo: "Quarta-feira: os dados da clínica",
      situacao: "Para testar mais rápido, a Bia sugere usar a planilha real de pacientes da clínica, com nomes e telefones.",
      tipo: "Ética na TI",
      opcoes: [
        { txt: "Topo: é só para teste, ninguém vai ver.", estilo: "Acomodar", ef: { equipe: 5, entrega: 5, reputacao: -20 },
          cons: "Usar dados pessoais reais num teste, sem autorização, é arriscado e pode ir contra a LGPD. Se vazar, o problema é de todos, e a clínica perde a confiança na equipe." },
        { txt: "Sugiro criar dados fictícios em quinze minutos, numa planilha ou com o Copilot.", estilo: "Colaborar", ef: { equipe: 5, entrega: 0, reputacao: 15 },
          cons: "Os testes andam do mesmo jeito, e os dados dos pacientes ficam protegidos. Ética é fazer o certo mesmo quando ninguém está olhando." },
        { txt: "Não falo nada agora, mas conto para a professora depois.", estilo: "Evitar", ef: { equipe: -5, entrega: 0, reputacao: -5 },
          cons: "O risco continua até alguém perceber, e a equipe sente que você não confiou nela para resolver." }
      ]
    },
    {
      titulo: "Quinta-feira: a reunião com o cliente",
      situacao: "Na frente do cliente, o Diego faz um comentário irônico sobre o seu código.",
      tipo: "Conflito de relacionamento",
      opcoes: [
        { txt: "Respondo na hora, no mesmo tom.", estilo: "Competir", ef: { equipe: -15, entrega: -5, reputacao: -10 },
          cons: "O cliente presencia a discussão e sai da reunião preocupado com a equipe." },
        { txt: "Depois da reunião, falo com ele em particular: o fato, o impacto e o pedido.", estilo: "Colaborar", ef: { equipe: 10, entrega: 0, reputacao: 10 },
          cons: "O Diego pede desculpas e combina que críticas ao código serão feitas na revisão, entre vocês." },
        { txt: "Finjo que não ouvi e sigo em frente.", estilo: "Evitar", ef: { equipe: -5, entrega: 0, reputacao: -5 },
          cons: "A reunião segue, mas a mágoa fica, e o comentário pode se repetir." }
      ]
    },
    {
      titulo: "Sexta-feira: o prazo",
      situacao: "Faltam poucas horas. Uma das funcionalidades pedidas não vai ficar pronta com qualidade.",
      tipo: "Negociação",
      opcoes: [
        { txt: "Viramos a noite e entregamos tudo, mesmo sem testar.", estilo: "Competir", ef: { equipe: -10, entrega: -5, reputacao: -5 },
          cons: "Tudo é entregue, mas com erros. Na segunda, o cliente liga reclamando, e a equipe está exausta." },
        { txt: "Proponho ao cliente entregar agora o essencial, testado, e a funcionalidade extra na semana que vem.", estilo: "Ceder em parte", ef: { equipe: 5, entrega: 10, reputacao: 10 },
          cons: "O cliente aceita: prefere o essencial funcionando. Cada lado abriu mão de algo, e todos ganharam." },
        { txt: "Aceito tudo o que o cliente pedir e faço sozinho o que faltar.", estilo: "Acomodar", ef: { equipe: 0, entrega: 0, reputacao: -5 },
          cons: "Você entrega, mas sozinho e no limite. A equipe nem soube do problema." }
      ]
    }
  ];

  var raiz = document.getElementById("simulador");
  if (!raiz) return;
  var estado;

  function el(tag, cls, txt) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt !== undefined) e.textContent = txt;
    return e;
  }

  function limitar(v) {
    return Math.max(0, Math.min(100, v));
  }

  function painel() {
    var p = el("div", "painel-ind");
    p.setAttribute("aria-label", "Indicadores");
    Object.keys(NOMES).forEach(function (k) {
      var v = estado.ind[k];
      var c = el("div", "indicador" + (v < 35 ? " baixo" : ""));
      var r = el("div", "rotulo-ind");
      r.appendChild(el("span", "", NOMES[k]));
      r.appendChild(el("strong", "", String(v)));
      var t = el("div", "trilho");
      t.setAttribute("role", "progressbar");
      t.setAttribute("aria-label", NOMES[k]);
      t.setAttribute("aria-valuemin", "0");
      t.setAttribute("aria-valuemax", "100");
      t.setAttribute("aria-valuenow", String(v));
      var s = el("span");
      s.style.setProperty("--v", v + "%");
      t.appendChild(s);
      c.appendChild(r);
      c.appendChild(t);
      p.appendChild(c);
    });
    return p;
  }

  function efeitos(ef) {
    var d = el("p", "efeitos");
    Object.keys(NOMES).forEach(function (k, i) {
      if (i) d.appendChild(document.createTextNode(" · "));
      var v = ef[k];
      var s = el("span", v > 0 ? "mais" : v < 0 ? "menos" : "", NOMES[k] + " " + (v > 0 ? "+" : "") + v);
      d.appendChild(s);
    });
    return d;
  }

  function rodada() {
    var r = RODADAS[estado.i];
    raiz.innerHTML = "";
    raiz.appendChild(painel());
    var card = el("div", "cartao rodada");
    card.appendChild(el("span", "contador", "Decisão " + (estado.i + 1) + " de " + RODADAS.length + " · " + r.tipo));
    var h = el("h2", "", r.titulo);
    h.tabIndex = -1;
    card.appendChild(h);
    card.appendChild(el("p", "situacao", r.situacao));
    card.appendChild(el("p", "", "O que você faz?"));
    var ul = el("ul", "opcoes");
    r.opcoes.forEach(function (o, j) {
      var li = el("li");
      var b = el("button", "", o.txt);
      b.type = "button";
      b.addEventListener("click", function () { escolher(j, ul, card); });
      li.appendChild(b);
      ul.appendChild(li);
    });
    card.appendChild(ul);
    raiz.appendChild(card);
    h.focus();
  }

  function escolher(j, ul, card) {
    var r = RODADAS[estado.i];
    var o = r.opcoes[j];
    ul.querySelectorAll("button").forEach(function (b, k) {
      b.disabled = true;
      if (k === j) b.classList.add("escolhida");
    });
    Object.keys(o.ef).forEach(function (k) { estado.ind[k] = limitar(estado.ind[k] + o.ef[k]); });
    estado.escolhas.push({ rodada: r.titulo, estilo: o.estilo });
    var c = el("div", "consequencia");
    c.setAttribute("role", "status");
    c.appendChild(el("p", "", o.cons));
    c.appendChild(efeitos(o.ef));
    c.appendChild(el("p", "contador", "Jeito de lidar: " + o.estilo));
    card.appendChild(c);
    var prox = el("button", "botao", estado.i + 1 < RODADAS.length ? "Próxima decisão" : "Ver o resultado");
    prox.type = "button";
    prox.addEventListener("click", function () {
      estado.i++;
      if (estado.i < RODADAS.length) rodada(); else fim();
    });
    var bt = el("div", "botoes");
    bt.appendChild(prox);
    card.appendChild(bt);
    var painelAntigo = raiz.querySelector(".painel-ind");
    raiz.replaceChild(painel(), painelAntigo);
    prox.focus();
  }

  function fim() {
    var cont = {};
    estado.escolhas.forEach(function (e) { cont[e.estilo] = (cont[e.estilo] || 0) + 1; });
    var mais = Object.keys(cont).sort(function (a, b) { return cont[b] - cont[a]; })[0];
    var total = estado.ind.equipe + estado.ind.entrega + estado.ind.reputacao;
    var msg = total >= 210 ? "Equipe unida, entrega em dia e você com a reputação em alta. É assim que um conflito melhora o trabalho."
      : total >= 150 ? "O projeto saiu, mas com arranhões. Veja em quais decisões os indicadores caíram e o que daria para fazer diferente."
      : "A semana foi dura. Conflito mal resolvido custa caro: releia as consequências e jogue de novo testando outros caminhos.";
    try {
      localStorage.setItem(CHAVE, JSON.stringify({ ind: estado.ind, escolhas: estado.escolhas, quando: new Date().toISOString() }));
    } catch (erro) {}

    raiz.innerHTML = "";
    raiz.appendChild(painel());
    var card = el("div", "cartao resultado-final");
    card.appendChild(el("span", "olho", "resultado"));
    var h = el("h2", "", "Fim da semana");
    h.tabIndex = -1;
    card.appendChild(h);
    card.appendChild(el("p", "", msg));
    card.appendChild(el("p", "", "O jeito de lidar que você mais usou: " + mais + " (" + cont[mais] + " de " + RODADAS.length + ")."));
    var ol = el("ol", "revisao");
    estado.escolhas.forEach(function (e) {
      var li = el("li", "", e.rodada);
      li.appendChild(el("span", "", e.estilo));
      ol.appendChild(li);
    });
    card.appendChild(ol);
    card.appendChild(el("h3", "", "Para a sua análise da simulação"));
    var perg = el("ol");
    ["Em qual decisão você mudaria a sua escolha? Por quê?",
     "Qual tipo de conflito foi mais difícil para você: de tarefa, de processo ou de relacionamento?",
     "Que situação parecida você já viveu num trabalho, num grupo da escola ou em casa?"].forEach(function (t) {
      perg.appendChild(el("li", "", t));
    });
    card.appendChild(perg);
    var bt = el("div", "botoes");
    var de = el("button", "botao", "Jogar de novo");
    de.type = "button";
    de.addEventListener("click", iniciar);
    bt.appendChild(de);
    card.appendChild(bt);
    raiz.appendChild(card);
    h.focus();
  }

  function iniciar() {
    estado = { i: 0, ind: { equipe: 50, entrega: 50, reputacao: 50 }, escolhas: [] };
    rodada();
  }

  document.getElementById("comecar-sim").addEventListener("click", function () {
    document.getElementById("abertura-sim").hidden = true;
    iniciar();
  });
})();
