/*
  quiz.js: Quiz de revisão do Lab I (quiz.html?b=1 para o 1º bimestre, ?b=2 para o 2º).
  versão 2 · 2026-10-15 (login da faculdade e registro do resultado para a professora, conta.js)
  Como no PyQuiz: o aluno entra com o e-mail da faculdade e digita o nome para liberar, responde com explicação a cada pergunta
  e, no fim, vê o resultado com nome e data (pode imprimir ou tirar print). As perguntas saem
  dos conceitos das aulas. O melhor resultado fica no navegador (localStorage "lab1-quiz-b1"/"-b2").
*/
(function () {
  var BANCO = {
    1: {
      titulo: "Quiz do 1º bimestre",
      sub: "Aulas 1 a 8: perfil profissional, relações humanas e liderança.",
      perguntas: [
        { p: "Qual é a diferença entre invenção e inovação?", c: "Inovação é a ideia posta em uso, gerando valor para as pessoas.",
          e: ["Inovação é sempre um aplicativo ou um aparelho novo.", "Invenção é a ideia em uso; inovação é só a ideia.", "Não há diferença: são sinônimos."],
          x: "Invenção é só a ideia; inovação é a ideia que chega às pessoas e gera valor. Ela pode ser tecnológica, social ou pessoal (aula 1)." },
        { p: "Aprender a editar vídeos assistindo a tutoriais e ajudando um amigo é aprendizagem:", c: "Informal",
          e: ["Formal", "Não formal", "Que não conta para o currículo"],
          x: "Informal é o que você aprende fazendo, vendo vídeo ou ajudando alguém. Tudo isso conta e pode virar argumento numa entrevista (aula 2)." },
        { p: "Qual destas é uma evidência de experiência?", c: "O link de um repositório no GitHub com o projeto.",
          e: ["Dizer na entrevista que você sabe programar.", "Uma lista dos seus interesses.", "O seu objetivo de carreira."],
          x: "Evidência é a prova: certificado, link, foto, declaração ou repositório. Experiência sem evidência vira só conversa (aula 3)." },
        { p: "Revisar o código antes de entregar, mesmo sem ninguém pedir, é um exemplo de:", c: "Atitude",
          e: ["Conhecimento", "Habilidade", "Talento"],
          x: "No CHA, conhecimento é saber, habilidade é saber fazer e atitude é querer fazer. Revisar sem ninguém pedir é atitude (aula 4)." },
        { p: "Qual destas é uma soft skill?", c: "Lidar com pressão.",
          e: ["Configurar uma rede.", "Programar em Python.", "Criar um banco de dados."],
          x: "Soft skills são comportamentais: comunicar, ouvir, lidar com pressão. As outras opções são hard skills, técnicas e fáceis de medir (aula 4)." },
        { p: "Uma vaga lista requisitos obrigatórios e desejáveis. Você tem a maior parte do obrigatório. O que fazer?", c: "Candidatar-se.",
          e: ["Esperar ter todos os requisitos.", "Desistir: a vaga não é para você.", "Mentir no currículo sobre o que falta."],
          x: "Ninguém tem tudo o que a vaga pede. Se você tem a maior parte do obrigatório, candidate-se (aula 5)." },
        { p: "Dizer o que pensa com clareza e respeito é o estilo de comunicação:", c: "Assertivo",
          e: ["Passivo", "Agressivo", "Neutro"],
          x: "Passivo não diz o que pensa; agressivo diz sem respeitar o outro; assertivo diz com clareza e respeito. Assertividade se treina (aula 6)." },
        { p: "Qual é a ordem da fórmula para ser assertivo?", c: "Fato, impacto e pedido.",
          e: ["Pedido, fato e impacto.", "Crítica, fato e pedido.", "Impacto, culpa e solução."],
          x: "1) O fato, sem julgamento; 2) o impacto; 3) o pedido (aula 6)." },
        { p: "Qual tipo de conflito quase sempre atrapalha o trabalho?", c: "De relacionamento.",
          e: ["De tarefa.", "De processo.", "Todos os conflitos melhoram o trabalho."],
          x: "Conflitos de tarefa e de processo podem melhorar o trabalho; o de relacionamento, entre as pessoas, quase sempre atrapalha (aula 7)." },
        { p: "Na tríade do tempo, as tarefas desnecessárias que tomam o seu tempo são as:", c: "Circunstanciais",
          e: ["Importantes", "Urgentes", "Estratégicas"],
          x: "Christian Barbosa divide as tarefas em importantes, urgentes e circunstanciais. Quem cuida do importante evita o incêndio (aula 8)." }
      ]
    },
    2: {
      titulo: "Quiz do 2º bimestre",
      sub: "Aulas 10 a 16: carreira, currículo e responsabilidade social. Bom para estudar para a recuperação.",
      perguntas: [
        { p: "Na carreira em Y, o que acontece depois da base técnica?", c: "O caminho se divide entre gestão e especialização técnica, com reconhecimento equivalente.",
          e: ["Todo mundo precisa virar gestor para crescer.", "A pessoa sai da TI.", "Só quem tem certificação continua na carreira."],
          x: "Na carreira em Y, um braço vai para a gestão e o outro para a especialização técnica. Ninguém precisa virar chefe para crescer (aula 10)." },
        { p: "Quem sabe um pouco de muita coisa e conecta as partes é o profissional:", c: "Generalista",
          e: ["Especialista", "Gestor", "Estagiário"],
          x: "O especialista vai fundo num assunto; o generalista conecta as partes; o gestor cuida de pessoas, prazos e orçamento (aula 10)." },
        { p: "Ao comparar uma proposta CLT com uma PJ, o que a aula recomenda?", c: "Comparar o valor do ano inteiro, não só o do mês.",
          e: ["Escolher sempre o maior salário mensal.", "Escolher sempre a CLT.", "Comparar só os benefícios."],
          x: "Na CLT há férias, 13º e FGTS; na PJ você paga impostos e não tem esses benefícios. Por isso, compare o ano inteiro (aula 11)." },
        { p: "Propor a automação de uma tarefa na empresa onde você trabalha é um exemplo de:", c: "Intraempreendedorismo",
          e: ["Trabalho freelancer", "Startup", "Acomodação"],
          x: "Intraempreender é empreender dentro da empresa: propor melhorias, automatizar, liderar um projeto novo (aula 11)." },
        { p: "Qual destas é uma meta SMART?", c: "Terminar o curso de Python de 40h até 30 de novembro.",
          e: ["Aprender programação.", "Estudar mais este ano.", "Ser um profissional de sucesso."],
          x: "Meta SMART é específica, mensurável, atingível, relevante e com tempo definido (aula 12)." },
        { p: "Segundo Charles Duhigg, um hábito tem três partes:", c: "Deixa, rotina e recompensa.",
          e: ["Meta, prazo e prêmio.", "Vontade, esforço e sorte.", "Planejamento, execução e controle."],
          x: "Para estudar todo dia: uma deixa fixa, uma rotina curta e uma recompensa. Plano de carreira sem hábito fica no papel (aula 12)." },
        { p: "Quantas páginas a aula recomenda para um currículo em TI?", c: "Uma, no máximo duas.",
          e: ["Quantas forem necessárias.", "No mínimo três.", "Meia página."],
          x: "Uma página, no máximo duas, com nome, contato, LinkedIn e GitHub no topo (aula 13)." },
        { p: "Quais são as três partes do pitch pessoal?", c: "Quem sou, o que sei e já fiz, e o que busco.",
          e: ["Nome, idade e endereço.", "Formação, salário e horário.", "Defeitos, qualidades e sonhos."],
          x: "Quem sou (uma frase), o que sei e já fiz (com um exemplo) e o que busco. Ensaiado, sem decorar palavra por palavra (aula 13)." },
        { p: "O 5W2H ajuda a planejar respondendo a quantas perguntas?", c: "Sete",
          e: ["Cinco", "Dois", "Doze"],
          x: "O quê, por quê, onde, quando, quem, como e quanto custa: cinco perguntas que começam com W em inglês e duas com H (aula 15)." },
        { p: "Como medir o impacto da ação social?", c: "Comparando as respostas do público antes e depois da ação.",
          e: ["Contando quantas fotos foram tiradas.", "Perguntando só ao final se gostaram.", "Pelo número de slides da apresentação."],
          x: "Impacto é o que mudou para o público. Pergunte antes e depois: a diferença entre as respostas é o seu resultado (aula 15)." }
      ]
    }
  };

  var raiz = document.getElementById("quiz");
  if (!raiz) return;
  var b = new URLSearchParams(location.search).get("b") === "2" ? 2 : 1;
  var Q = BANCO[b];
  var CHAVE = "lab1-quiz-b" + b;
  document.getElementById("quiz-titulo").textContent = Q.titulo;
  document.getElementById("quiz-sub").textContent = Q.sub;
  document.title = Q.titulo + " · Laboratório de Inovação I · Stela";
  var outro = document.getElementById("quiz-outro");
  if (outro) {
    outro.href = "quiz.html?b=" + (b === 1 ? 2 : 1);
    outro.textContent = b === 1 ? "Ir para o quiz do 2º bimestre" : "Ir para o quiz do 1º bimestre";
  }

  var estado;

  function el(tag, cls, txt) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt !== undefined) e.textContent = txt;
    return e;
  }

  function embaralhar(v) {
    var a = v.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function melhor() {
    try { return JSON.parse(localStorage.getItem(CHAVE)); } catch (erro) { return null; }
  }

  function pergunta() {
    var q = estado.ordem[estado.i];
    raiz.innerHTML = "";
    var prog = el("div", "quiz-progresso");
    prog.setAttribute("role", "progressbar");
    prog.setAttribute("aria-label", "Progresso do quiz");
    prog.setAttribute("aria-valuemin", "0");
    prog.setAttribute("aria-valuemax", String(estado.ordem.length));
    prog.setAttribute("aria-valuenow", String(estado.i));
    var s = el("span");
    s.style.setProperty("--p", (estado.i / estado.ordem.length * 100) + "%");
    prog.appendChild(s);
    raiz.appendChild(prog);

    var card = el("div", "cartao rodada");
    card.appendChild(el("span", "contador", "Pergunta " + (estado.i + 1) + " de " + estado.ordem.length + " · " + estado.acertos + " acerto(s)"));
    var h = el("h2", "", q.p);
    h.tabIndex = -1;
    card.appendChild(h);
    var ul = el("ul", "opcoes");
    embaralhar([q.c].concat(q.e)).forEach(function (op) {
      var li = el("li");
      var bt = el("button", "", op);
      bt.type = "button";
      bt.addEventListener("click", function () { responder(op, q, ul, card); });
      li.appendChild(bt);
      ul.appendChild(li);
    });
    card.appendChild(ul);
    raiz.appendChild(card);
    h.focus();
  }

  function responder(op, q, ul, card) {
    var certo = op === q.c;
    if (certo) estado.acertos++;
    estado.respostas.push({ p: q.p, certo: certo, c: q.c });
    ul.querySelectorAll("button").forEach(function (bt) {
      bt.disabled = true;
      if (bt.textContent === q.c) bt.classList.add("certa");
      else if (bt.textContent === op) bt.classList.add("errada");
    });
    var c = el("div", "consequencia");
    c.setAttribute("role", "status");
    c.appendChild(el("p", "", certo ? "Acertou!" : "Não foi dessa vez. A resposta certa: " + q.c));
    c.appendChild(el("p", "", q.x));
    card.appendChild(c);
    var prox = el("button", "botao", estado.i + 1 < estado.ordem.length ? "Próxima pergunta" : "Ver o resultado");
    prox.type = "button";
    prox.addEventListener("click", function () {
      estado.i++;
      if (estado.i < estado.ordem.length) pergunta(); else fim();
    });
    var bts = el("div", "botoes");
    bts.appendChild(prox);
    card.appendChild(bts);
    prox.focus();
  }

  function fim() {
    var total = estado.ordem.length;
    var antes = melhor();
    if (!antes || estado.acertos > antes.acertos) {
      try {
        localStorage.setItem(CHAVE, JSON.stringify({ nome: estado.nome, acertos: estado.acertos, total: total, quando: new Date().toISOString() }));
      } catch (erro) {}
    }
    raiz.innerHTML = "";
    var cert = el("div", "certificado");
    cert.appendChild(el("span", "olho", Q.titulo + " · Laboratório de Inovação I"));
    var h = el("h2", "", estado.nome);
    h.tabIndex = -1;
    cert.appendChild(h);
    cert.appendChild(el("p", "nota", estado.acertos + " de " + total));
    var msg = estado.acertos === total ? "Gabaritou! Os conceitos estão firmes."
      : estado.acertos >= 7 ? "Muito bem! Revise as perguntas que errou e está pronto."
      : "Bom começo. Releia as aulas das perguntas que errou e tente de novo.";
    cert.appendChild(el("p", "", msg));
    cert.appendChild(el("p", "contador", new Date().toLocaleString("pt-BR")));
    var aviso = el("p", "ativ-aviso");
    aviso.setAttribute("role", "status");
    aviso.hidden = true;
    cert.appendChild(aviso);
    raiz.appendChild(cert);
    registrar(aviso);

    var rev = el("div", "cartao");
    rev.appendChild(el("h3", "", "Revisão"));
    var ol = el("ol", "revisao");
    estado.respostas.forEach(function (r) {
      var li = el("li", "", (r.certo ? "✓ " : "✗ ") + r.p);
      if (!r.certo) li.appendChild(el("span", "", "Certa: " + r.c));
      ol.appendChild(li);
    });
    rev.appendChild(ol);
    var bts = el("div", "botoes");
    var de = el("button", "botao", "Fazer de novo");
    de.type = "button";
    de.addEventListener("click", function () { iniciar(estado.nome); });
    var imp = el("button", "botao contorno", "Imprimir ou salvar em PDF");
    imp.type = "button";
    imp.addEventListener("click", function () { window.print(); });
    bts.appendChild(de);
    bts.appendChild(imp);
    rev.appendChild(bts);
    raiz.appendChild(rev);
    h.focus();
  }

  // ---------- registro para a professora (assets/js/conta.js) ----------
  // Com o login da faculdade, o resultado vai para o Placa-Mãe; o código de verificação aparece no resultado.
  function registrar(aviso) {
    if (!window.CONTA) return;
    aviso.hidden = false;
    aviso.textContent = "Soldando os componentes... registrando o resultado para a professora.";
    CONTA.registrarTentativa({
      atividade: "quiz-revisao-b" + b,
      titulo: Q.titulo + " · Laboratório de Inovação I",
      acertos: estado.acertos,
      total: estado.ordem.length,
      duracao_seg: (Date.now() - estado.inicio) / 1000,
      detalhes: { nome_digitado: estado.nome }
    }).then(function (registro) {
      aviso.textContent = "";
      if (registro) {
        aviso.appendChild(document.createTextNode("Compilou de primeira! Resultado registrado para a professora. Código de verificação: "));
        aviso.appendChild(el("strong", "", registro.codigo));
        aviso.appendChild(document.createTextNode(". Salve o resultado e envie no Moodle."));
      } else {
        aviso.appendChild(document.createTextNode("Resultado não registrado. Para valer como atividade, entre com o e-mail da faculdade. "));
        var de = el("button", "botao contorno", "Registrar agora");
        de.type = "button";
        de.addEventListener("click", function () { registrar(aviso); });
        aviso.appendChild(de);
      }
    });
  }

  function iniciar(nome) {
    estado = { nome: nome, i: 0, acertos: 0, respostas: [], ordem: embaralhar(Q.perguntas), inicio: Date.now() };
    pergunta();
  }

  var form = document.getElementById("form-nome");
  var erro = document.getElementById("erro-nome");
  var m = melhor();
  if (m) {
    form.elements.nome.value = m.nome || "";
    document.getElementById("melhor").textContent = "Seu melhor resultado neste navegador: " + m.acertos + " de " + m.total + ".";
  }
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var nome = form.elements.nome.value.trim().replace(/\s+/g, " ");
    if (nome.split(" ").length < 2) {
      erro.textContent = "Digite seu nome completo (nome e sobrenome) para liberar o quiz.";
      form.elements.nome.setAttribute("aria-invalid", "true");
      form.elements.nome.focus();
      return;
    }
    erro.textContent = "";
    form.elements.nome.removeAttribute("aria-invalid");
    document.getElementById("abertura-quiz").hidden = true;
    // nome com a primeira letra maiúscula (conta.js); sem ele, fica como foi digitado
    iniciar(window.CONTA ? CONTA.formatarNome(nome) : nome);
  });

  // com o login, o nome da conta já entra no formulário
  if (window.CONTA) {
    CONTA.aoMudar(function () {
      if (CONTA.daFaculdade() && !form.elements.nome.value.trim()) form.elements.nome.value = CONTA.nome();
    });
  }
})();
