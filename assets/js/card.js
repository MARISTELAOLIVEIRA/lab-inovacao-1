/*
  card.js: Card do Profissional (Lab I, aulas 4, 5 e 13).
  versão 2 · 2026-10-15 (login da faculdade; ao baixar, o card é registrado para a professora, conta.js)
  O aluno entra com o e-mail da faculdade, preenche o formulário, vê o card ao vivo e baixa a imagem em PNG (1080 x 1350, bom para o
  portfólio no Loop e para o LinkedIn). Os dados ficam só no navegador dele (localStorage "lab1-card").
*/
(function () {
  var CHAVE = "lab1-card";
  var CURSOS = {
    ADS: "Análise e Desenvolvimento de Sistemas",
    GTI: "Gestão da Tecnologia da Informação",
    SI: "Segurança da Informação",
    IA: "Inteligência Artificial e Machine Learning"
  };
  var PERFIS = {
    ADS: ["Desenvolvimento front-end", "Desenvolvimento back-end", "Desenvolvimento mobile", "Análise de sistemas", "Testes (QA)", "DevOps"],
    GTI: ["Suporte e service desk", "Análise de processos", "Projetos de TI", "Governança de TI", "Gestão de equipes de TI"],
    SI: ["Analista de SOC", "Segurança de redes", "Resposta a incidentes", "Pentest", "Privacidade e LGPD"],
    IA: ["Análise de dados", "Ciência de dados", "Engenharia de machine learning", "IA generativa"]
  };

  var form = document.getElementById("form-card");
  if (!form) return;
  var previa = document.getElementById("card-prof");
  var status = document.getElementById("status-card");
  var lista = document.getElementById("perfis-sugeridos");

  function campos() {
    var d = {};
    Array.prototype.forEach.call(form.elements, function (el) {
      if (el.name) d[el.name] = el.value;
    });
    return d;
  }

  function ler() {
    try {
      return JSON.parse(localStorage.getItem(CHAVE)) || {};
    } catch (erro) {
      return {};
    }
  }

  function gravar(d) {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(d));
    } catch (erro) {
      // aba anônima: funciona, só não fica salvo
    }
  }

  function texto(el, valor, reserva) {
    el.textContent = valor && valor.trim() ? valor.trim() : reserva;
  }

  function sugerirPerfis(curso) {
    lista.innerHTML = "";
    (PERFIS[curso] || []).forEach(function (p) {
      var op = document.createElement("option");
      op.value = p;
      lista.appendChild(op);
    });
  }

  function desenhar() {
    var d = campos();
    var q = function (s) { return previa.querySelector(s); };
    texto(q(".sigla"), d.curso, "ADS");
    texto(q(".nome"), d.nome, "Seu nome");
    texto(q(".perfil"), d.perfil, "O perfil que você busca");
    texto(q(".lema"), d.lema ? "“" + d.lema.trim() + "”" : "", "“Sua frase, em poucas palavras.”");
    var attrs = q(".atributos");
    attrs.innerHTML = "";
    [1, 2, 3].forEach(function (i) {
      var linha = document.createElement("div");
      linha.className = "atributo";
      var nome = document.createElement("span");
      nome.textContent = (d["hard" + i] || "").trim() || "Hard skill " + i;
      var nivel = document.createElement("span");
      nivel.className = "nivel";
      var n = parseInt(d["nivel" + i] || "1", 10);
      for (var k = 1; k <= 5; k++) {
        var b = document.createElement("i");
        if (k <= n) b.className = "on";
        nivel.appendChild(b);
      }
      linha.appendChild(nome);
      linha.appendChild(nivel);
      attrs.appendChild(linha);
    });
    var chips = q(".chips");
    chips.innerHTML = "";
    [1, 2, 3].forEach(function (i) {
      var s = document.createElement("span");
      s.textContent = (d["soft" + i] || "").trim() || "Soft skill " + i;
      chips.appendChild(s);
    });
    texto(q(".talento"), d.talento, "O que você faz bem sem esforço");
    texto(q(".evolucao"), d.evolucao, "Uma competência a desenvolver");
    texto(q(".curso-nome"), CURSOS[d.curso] || CURSOS.ADS, "");
    form.querySelectorAll("output[data-de]").forEach(function (o) {
      var r = form.elements[o.getAttribute("data-de")];
      o.textContent = r.value + " de 5";
    });
    gravar(d);
  }

  // ---------- PNG: desenha o mesmo card num canvas ----------
  function quebrar(ctx, txt, larg) {
    var palavras = txt.split(/\s+/), linhas = [], atual = "";
    palavras.forEach(function (p) {
      var teste = atual ? atual + " " + p : p;
      if (ctx.measureText(teste).width > larg && atual) {
        linhas.push(atual);
        atual = p;
      } else {
        atual = teste;
      }
    });
    if (atual) linhas.push(atual);
    return linhas;
  }

  function retArred(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function gerarPNG() {
    var d = campos();
    var W = 1080, H = 1350, M = 80;
    var c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    var ctx = c.getContext("2d");
    var NEON = "#a3e635", VIOLETA = "#a78bfa", OURO = "#ecc874", TEXTO = "#f2efe6", TEXTO2 = "#c9c3b2";
    var TIT = '"Mona Sans", system-ui, sans-serif', TXT = '"Atkinson Hyperlegible Next", system-ui, sans-serif',
        MONO = '"Atkinson Hyperlegible Mono", ui-monospace, monospace';

    ctx.fillStyle = "#0b100e";
    ctx.fillRect(0, 0, W, H);
    var g1 = ctx.createRadialGradient(W, 0, 0, W, 0, 760);
    g1.addColorStop(0, "rgba(167,139,250,.38)");
    g1.addColorStop(1, "rgba(167,139,250,0)");
    ctx.fillStyle = g1;
    ctx.fillRect(0, 0, W, H);
    var g2 = ctx.createRadialGradient(0, H, 0, 0, H, 700);
    g2.addColorStop(0, "rgba(163,230,53,.26)");
    g2.addColorStop(1, "rgba(163,230,53,0)");
    ctx.fillStyle = g2;
    ctx.fillRect(0, 0, W, H);
    ctx.lineWidth = 8;
    ctx.strokeStyle = NEON;
    retArred(ctx, 24, 24, W - 48, H - 48, 48);
    ctx.stroke();

    var y = M + 40;
    // sigla
    ctx.font = "800 40px " + TIT;
    var sigla = d.curso || "ADS";
    var sw = ctx.measureText(sigla).width + 44;
    ctx.fillStyle = NEON;
    retArred(ctx, M, y - 44, sw, 64, 16);
    ctx.fill();
    ctx.fillStyle = "#0b100e";
    ctx.fillText(sigla, M + 22, y);
    ctx.font = "26px " + MONO;
    ctx.fillStyle = TEXTO2;
    ctx.textAlign = "right";
    ctx.fillText("Laboratório de Inovação I", W - M, y - 8);
    ctx.textAlign = "left";

    y += 130;
    ctx.font = "800 84px " + TIT;
    ctx.fillStyle = TEXTO;
    quebrar(ctx, (d.nome || "Seu nome").trim(), W - 2 * M).slice(0, 2).forEach(function (l) {
      ctx.fillText(l, M, y);
      y += 88;
    });
    ctx.font = "34px " + MONO;
    ctx.fillStyle = NEON;
    ctx.fillText((d.perfil || "O perfil que você busca").trim().slice(0, 48), M, y);
    y += 60;
    if (d.lema && d.lema.trim()) {
      ctx.font = "italic 32px " + TXT;
      ctx.fillStyle = "#d8d2c2";
      quebrar(ctx, "“" + d.lema.trim() + "”", W - 2 * M).slice(0, 2).forEach(function (l) {
        ctx.fillText(l, M, y);
        y += 42;
      });
    }

    y += 40;
    function tituloBloco(t) {
      ctx.font = "26px " + MONO;
      ctx.fillStyle = OURO;
      ctx.fillText(t.toUpperCase(), M, y);
      y += 52;
    }
    tituloBloco("Hard skills");
    [1, 2, 3].forEach(function (i) {
      ctx.font = "34px " + TXT;
      ctx.fillStyle = TEXTO;
      var nome = (d["hard" + i] || "Hard skill " + i).trim();
      while (ctx.measureText(nome).width > 560 && nome.length > 3) nome = nome.slice(0, -2);
      ctx.fillText(nome, M, y);
      var n = parseInt(d["nivel" + i] || "1", 10);
      for (var k = 0; k < 5; k++) {
        ctx.fillStyle = k < n ? NEON : "rgba(242,239,230,.15)";
        retArred(ctx, W - M - 5 * 62 + k * 62, y - 26, 52, 24, 6);
        ctx.fill();
      }
      y += 62;
    });

    y += 20;
    tituloBloco("Soft skills");
    ctx.font = "30px " + TXT;
    var x = M;
    [1, 2, 3].forEach(function (i) {
      var t = (d["soft" + i] || "Soft skill " + i).trim().slice(0, 28);
      var w = ctx.measureText(t).width + 40;
      if (x + w > W - M) { x = M; y += 62; }
      ctx.strokeStyle = "rgba(167,139,250,.75)";
      ctx.lineWidth = 3;
      retArred(ctx, x, y - 36, w, 50, 25);
      ctx.stroke();
      ctx.fillStyle = "#ddd3ff";
      ctx.fillText(t, x + 20, y);
      x += w + 16;
    });
    y += 84;

    tituloBloco("Talento");
    ctx.font = "32px " + TXT;
    ctx.fillStyle = TEXTO;
    quebrar(ctx, (d.talento || "—").trim(), W - 2 * M).slice(0, 2).forEach(function (l) {
      ctx.fillText(l, M, y);
      y += 42;
    });
    y += 24;
    tituloBloco("Em evolução");
    ctx.font = "32px " + TXT;
    ctx.fillStyle = TEXTO;
    quebrar(ctx, (d.evolucao || "—").trim(), W - 2 * M).slice(0, 2).forEach(function (l) {
      ctx.fillText(l, M, y);
      y += 42;
    });

    ctx.font = "26px " + TXT;
    ctx.fillStyle = TEXTO2;
    ctx.fillText(CURSOS[d.curso] || CURSOS.ADS, M, H - M);
    ctx.textAlign = "right";
    ctx.fillText("Fac Senac DF", W - M, H - M);
    ctx.textAlign = "left";
    return c;
  }

  function baixar() {
    var pronto = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    pronto.then(function () {
      var c = gerarPNG();
      var a = document.createElement("a");
      var nome = (campos().nome || "meu").trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-");
      a.download = "card-profissional-" + (nome || "meu") + ".png";
      a.href = c.toDataURL("image/png");
      document.body.appendChild(a);
      a.click();
      a.remove();
      status.textContent = "Imagem baixada. Cole no seu portfólio no Loop.";
      registrar();
    });
  }

  // ---------- registro para a professora (assets/js/conta.js) ----------
  // O card vale como entregue (1 de 1); o código de verificação aparece embaixo do botão.
  function registrar() {
    if (!window.CONTA) return;
    var d = campos();
    CONTA.registrarTentativa({
      atividade: "card-profissional",
      titulo: "Card do Profissional · Laboratório de Inovação I",
      acertos: 1,
      total: 1,
      detalhes: { nome_digitado: (d.nome || "").trim(), curso: d.curso, perfil: (d.perfil || "").trim() }
    }).then(function (registro) {
      status.textContent = registro
        ? "Imagem baixada e card registrado para a professora. Código de verificação: " + registro.codigo + ". Cole no seu portfólio no Loop."
        : "Imagem baixada, mas o card não foi registrado: entre com o e-mail da faculdade e baixe de novo.";
    });
  }

  // ---------- início ----------
  var salvo = ler();
  Object.keys(salvo).forEach(function (k) {
    if (form.elements[k]) form.elements[k].value = salvo[k];
  });
  sugerirPerfis(form.elements.curso.value);
  desenhar();

  form.addEventListener("input", function (e) {
    if (e.target.name === "curso") sugerirPerfis(e.target.value);
    status.textContent = "";
    desenhar();
  });
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    baixar();
  });
  document.getElementById("limpar-card").addEventListener("click", function () {
    form.reset();
    try { localStorage.removeItem(CHAVE); } catch (erro) {}
    sugerirPerfis(form.elements.curso.value);
    desenhar();
    status.textContent = "Card apagado deste navegador.";
  });
})();
