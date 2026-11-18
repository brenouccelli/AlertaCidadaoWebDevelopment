/* Alerta Cidadão – JavaScript puro (sem frameworks ou bibliotecas)
   Módulos: topo/menu, painel (DOM), slideshow, FAQ, abas e formulários com validação.
   Todos os níveis são SIMULADOS: não há sensor, API ou banco de dados. */
"use strict";

/* ---------- Dados demonstrativos (em centímetros) ---------- */
var NIVEL_MAX = 300;
var LIMITE_ATENCAO = 150;
var LIMITE_CRITICO = 220;

var ESTADOS = {
  normal: {
    nome: "Normal",
    mensagem: "Nível dentro do esperado. Nenhuma ação é necessária agora.",
    cor: "#2e8b57",
    orientacoes: [
      "Mantenha bueiros e calhas limpos.",
      "Combine com a família qual é o ponto de encontro em caso de alagamento.",
      "Acompanhe a previsão do tempo."
    ]
  },
  atencao: {
    nome: "Atenção",
    mensagem: "O nível está subindo. Fique atento às próximas leituras.",
    cor: "#e0a100",
    orientacoes: [
      "Evite estacionar em ruas próximas ao rio.",
      "Separe documentos e medicamentos em um saco plástico.",
      "Avise vizinhos idosos ou com dificuldade de locomoção."
    ]
  },
  critico: {
    nome: "Risco crítico",
    mensagem: "Risco de enchente. Siga as orientações da Defesa Civil.",
    cor: "#c62f2f",
    orientacoes: [
      "Saia de áreas alagáveis e vá para um local alto e seguro.",
      "Desligue a energia elétrica se a água entrar em casa.",
      "Não atravesse ruas alagadas a pé ou de carro.",
      "Em emergência, ligue 199 (Defesa Civil) ou 193 (Bombeiros)."
    ]
  }
};

function estadoPorNivel(cm) {
  if (cm >= LIMITE_CRITICO) return "critico";
  if (cm >= LIMITE_ATENCAO) return "atencao";
  return "normal";
}

function formatarMetros(cm) {
  return (cm / 100).toFixed(2).replace(".", ",") + " m";
}

document.addEventListener("DOMContentLoaded", function () {
  iniciarTopo();
  iniciarPainel();
  iniciarSlideshow();
  iniciarFaq();
  iniciarAbas();
  iniciarFormularios();
  document.getElementById("ano").textContent = "© " + new Date().getFullYear();
});

/* ---------- Topo: menu, sombra ao rolar e link ativo ---------- */
function iniciarTopo() {
  var topo = document.getElementById("topo");
  var botao = document.getElementById("menuBotao");
  var menu = document.getElementById("menu");

  botao.addEventListener("click", function () {
    var aberto = menu.classList.toggle("aberto");
    botao.setAttribute("aria-expanded", String(aberto));
  });
  menu.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      menu.classList.remove("aberto");
      botao.setAttribute("aria-expanded", "false");
    }
  });

  function aoRolar() { topo.classList.toggle("rolou", window.scrollY > 10); }
  window.addEventListener("scroll", aoRolar, { passive: true });
  aoRolar();

  // Destaca no menu a seção que está na tela
  var links = menu.querySelectorAll("a[data-secao]");
  if ("IntersectionObserver" in window) {
    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          links.forEach(function (a) {
            a.classList.toggle("ativo", a.getAttribute("data-secao") === entrada.target.id);
          });
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    links.forEach(function (a) {
      var secao = document.getElementById(a.getAttribute("data-secao"));
      if (secao) observador.observe(secao);
    });
  }
}

/* ---------- Painel de nível do rio (simulado) ---------- */
function iniciarPainel() {
  var slider = document.getElementById("nivel");
  var painel = document.getElementById("painelBox");
  var valor = document.getElementById("painelValor");
  var selo = document.getElementById("selo");
  var mensagem = document.getElementById("mensagemEstado");
  var agua = document.getElementById("medidorAgua");
  var blocoOrient = document.getElementById("orientacaoEstado");
  var nomeOrient = document.getElementById("orientacaoNome");
  var listaOrient = document.getElementById("orientacaoLista");
  var lista = document.getElementById("listaHistorico");
  var heroNivel = document.getElementById("heroNivel");
  var heroEstado = document.getElementById("heroEstado");
  var heroPonto = document.getElementById("heroPonto");
  var timerChuva = null;
  var estadoAnterior = null;

  construirEscala();

  function atualizar() {
    var nivel = Number(slider.value);
    var chave = estadoPorNivel(nivel);
    var estado = ESTADOS[chave];

    valor.textContent = formatarMetros(nivel);
    painel.setAttribute("data-estado", chave);
    blocoOrient.setAttribute("data-estado", chave);
    heroPonto.setAttribute("data-estado", chave);
    selo.textContent = estado.nome;
    mensagem.textContent = estado.mensagem;
    agua.style.height = (nivel / NIVEL_MAX) * 100 + "%";
    heroNivel.textContent = formatarMetros(nivel);
    heroEstado.textContent = estado.nome;

    // As orientações são reconstruídas quando o estado muda
    if (chave !== estadoAnterior) {
      nomeOrient.textContent = estado.nome;
      listaOrient.innerHTML = "";
      estado.orientacoes.forEach(function (texto) {
        var li = document.createElement("li");
        li.textContent = texto;
        listaOrient.appendChild(li);
      });
      estadoAnterior = chave;
    }
  }

  function registrar() {
    var nivel = Number(slider.value);
    var chave = estadoPorNivel(nivel);
    var vazio = lista.querySelector(".vazio");
    if (vazio) vazio.remove();

    var li = document.createElement("li");
    li.setAttribute("data-estado", chave);
    li.textContent = new Date().toLocaleTimeString("pt-BR") + " · " + formatarMetros(nivel) + " · " + ESTADOS[chave].nome + " (simulado)";
    lista.insertBefore(li, lista.firstChild);
    while (lista.children.length > 8) lista.removeChild(lista.lastChild);
  }

  function limparHistorico() {
    lista.innerHTML = "";
    var li = document.createElement("li");
    li.className = "vazio";
    li.textContent = "Nenhuma leitura ainda. Use “Registrar leitura”.";
    lista.appendChild(li);
  }

  function pararChuva() {
    if (timerChuva) {
      clearInterval(timerChuva);
      timerChuva = null;
      document.getElementById("btnChuva").textContent = "Simular chuva forte";
    }
  }

  function simularChuva() {
    if (timerChuva) { pararChuva(); return; }
    document.getElementById("btnChuva").textContent = "Parar simulação";
    timerChuva = setInterval(function () {
      var proximo = Math.min(NIVEL_MAX, Number(slider.value) + 10);
      slider.value = proximo;
      atualizar();
      if (proximo >= NIVEL_MAX) pararChuva();
    }, 400);
  }

  slider.addEventListener("input", function () { pararChuva(); atualizar(); });
  document.getElementById("btnRegistrar").addEventListener("click", registrar);
  document.getElementById("btnChuva").addEventListener("click", simularChuva);
  document.getElementById("btnLimparHistorico").addEventListener("click", limparHistorico);
  document.getElementById("btnZerar").addEventListener("click", function () {
    pararChuva();
    slider.value = 0;
    atualizar();
  });

  atualizar();
}

// Monta a escala lateral do medidor (marcas, faixas de cor e linhas de limite) a partir das constantes
function construirEscala() {
  var escala = document.getElementById("escala");
  escala.innerHTML = "";

  function pos(cm) { return (cm / NIVEL_MAX) * 100; }
  function faixa(de, ate, cor) {
    var f = document.createElement("div");
    f.className = "faixa";
    f.style.bottom = pos(de) + "%";
    f.style.height = (pos(ate) - pos(de)) + "%";
    f.style.backgroundColor = cor;
    escala.appendChild(f);
  }
  faixa(0, LIMITE_ATENCAO, ESTADOS.normal.cor);
  faixa(LIMITE_ATENCAO, LIMITE_CRITICO, ESTADOS.atencao.cor);
  faixa(LIMITE_CRITICO, NIVEL_MAX, ESTADOS.critico.cor);

  for (var cm = 0; cm <= NIVEL_MAX; cm += 50) {
    var t = document.createElement("span");
    t.className = "tique";
    t.style.bottom = pos(cm) + "%";
    t.textContent = formatarMetros(cm);
    escala.appendChild(t);
  }
}

/* ---------- Slideshow ---------- */
function iniciarSlideshow() {
  var raiz = document.getElementById("slideshow");
  var slides = raiz.querySelectorAll(".slide");
  var pontosBox = document.getElementById("slidePontos");
  var btnPausa = document.getElementById("slidePausa");
  var legenda = document.getElementById("slideLegenda");
  var hero = document.getElementById("inicio");
  var nomes = ["Estação de monitoramento", "Rua com água subindo", "Alerta no celular"];
  var atual = 0;
  var timer = null;
  var pausadoPeloUsuario = false;
  var INTERVALO = 5500;
  var pontos = [];

  slides.forEach(function (_, i) {
    var p = document.createElement("button");
    p.type = "button";
    p.setAttribute("aria-label", "Ir para a imagem " + (i + 1) + ": " + nomes[i]);
    p.addEventListener("click", function () { mostrar(i); reiniciar(); });
    pontosBox.appendChild(p);
    pontos.push(p);
  });

  function mostrar(indice) {
    atual = (indice + slides.length) % slides.length;
    slides.forEach(function (s, i) {
      s.classList.toggle("ativo", i === atual);
      s.setAttribute("aria-hidden", String(i !== atual));
    });
    pontos.forEach(function (p, i) { p.classList.toggle("ativo", i === atual); });
    legenda.textContent = (atual + 1) + " de " + slides.length + " · " + nomes[atual] + " (ilustração)";
  }

  function iniciar() {
    if (!timer && !pausadoPeloUsuario) {
      timer = setInterval(function () { mostrar(atual + 1); }, INTERVALO);
    }
  }
  function parar() { clearInterval(timer); timer = null; }
  function reiniciar() { parar(); iniciar(); }

  document.getElementById("slideProximo").addEventListener("click", function () { mostrar(atual + 1); reiniciar(); });
  document.getElementById("slideAnterior").addEventListener("click", function () { mostrar(atual - 1); reiniciar(); });

  btnPausa.addEventListener("click", function () {
    pausadoPeloUsuario = !pausadoPeloUsuario;
    btnPausa.setAttribute("aria-pressed", String(pausadoPeloUsuario));
    btnPausa.textContent = pausadoPeloUsuario ? "Retomar" : "Pausar";
    if (pausadoPeloUsuario) parar(); else iniciar();
  });

  // Pausa temporária ao passar o mouse ou ao focar nos controles
  hero.addEventListener("mouseenter", parar);
  hero.addEventListener("mouseleave", iniciar);
  hero.addEventListener("focusin", parar);
  hero.addEventListener("focusout", iniciar);

  hero.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") { mostrar(atual + 1); reiniciar(); }
    if (e.key === "ArrowLeft") { mostrar(atual - 1); reiniciar(); }
  });

  // Gesto de deslizar no celular
  var inicioX = null;
  hero.addEventListener("touchstart", function (e) { inicioX = e.touches[0].clientX; }, { passive: true });
  hero.addEventListener("touchend", function (e) {
    if (inicioX === null) return;
    var dx = e.changedTouches[0].clientX - inicioX;
    if (Math.abs(dx) > 50) { mostrar(atual + (dx < 0 ? 1 : -1)); reiniciar(); }
    inicioX = null;
  });

  mostrar(0);
  iniciar();
}

/* ---------- FAQ (acordeão) ---------- */
function iniciarFaq() {
  document.querySelectorAll(".faq__pergunta").forEach(function (botao) {
    botao.addEventListener("click", function () {
      var abrir = botao.getAttribute("aria-expanded") !== "true";
      botao.setAttribute("aria-expanded", String(abrir));
      botao.nextElementSibling.hidden = !abrir;
    });
  });
}

/* ---------- Abas dos formulários ---------- */
function abrirAba(nome) {
  document.querySelectorAll(".aba").forEach(function (aba) {
    var ativa = aba.getAttribute("data-aba") === nome;
    aba.classList.toggle("ativa", ativa);
    aba.setAttribute("aria-selected", String(ativa));
    aba.tabIndex = ativa ? 0 : -1;
    document.getElementById(aba.getAttribute("aria-controls")).hidden = !ativa;
  });
}

function iniciarAbas() {
  var abas = document.querySelectorAll(".aba");
  abas.forEach(function (aba, i) {
    aba.addEventListener("click", function () { abrirAba(aba.getAttribute("data-aba")); });
    aba.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        var prox = abas[(i + (e.key === "ArrowRight" ? 1 : abas.length - 1)) % abas.length];
        abrirAba(prox.getAttribute("data-aba"));
        prox.focus();
      }
    });
  });
  // Botões "Receber alertas" do topo e do hero abrem a aba correspondente
  document.querySelectorAll("[data-abrir-aba]").forEach(function (link) {
    link.addEventListener("click", function () { abrirAba(link.getAttribute("data-abrir-aba")); });
  });
}

/* ---------- Formulários com validação ---------- */
var REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
var REGEX_CELULAR = /^\(\d{2}\) \d{4,5}-\d{4}$/;

function mostrarErro(form, nomeCampo, texto) {
  var alvo = form.querySelector('[data-erro-para="' + nomeCampo + '"]');
  if (alvo) alvo.textContent = texto;
  form.querySelectorAll('[name="' + nomeCampo + '"]').forEach(function (campo) {
    if (texto) campo.setAttribute("aria-invalid", "true");
    else campo.removeAttribute("aria-invalid");
  });
}

// Cada validador devolve um objeto { campo: "mensagem" } só com os campos inválidos
function validarCadastro(form) {
  var erros = {};
  var nome = form.nome.value.trim();
  var email = form.email.value.trim();
  var tel = form.telefone.value.trim();
  var canal = form.querySelector('input[name="canal"]:checked');

  if (!nome) erros.nome = "Informe seu nome completo.";
  else if (nome.length < 3 || nome.indexOf(" ") === -1) erros.nome = "Digite nome e sobrenome.";

  if (!email) erros.email = "Informe seu e-mail.";
  else if (!REGEX_EMAIL.test(email)) erros.email = "Digite um e-mail válido, como nome@exemplo.com.";

  if (!form.bairro.value) erros.bairro = "Escolha o seu bairro.";
  if (!canal) erros.canal = "Escolha como prefere ser avisado.";

  if (canal && canal.value === "SMS" && !tel) erros.telefone = "Informe o celular para receber SMS.";
  else if (tel && !REGEX_CELULAR.test(tel)) erros.telefone = "Use o formato (11) 91234-5678.";

  if (!form.aceite.checked) erros.aceite = "Marque a caixa para continuar.";
  return erros;
}

function validarRelato(form) {
  var erros = {};
  var desc = form.relDescricao.value.trim();

  if (!form.relBairro.value) erros.relBairro = "Escolha o bairro da ocorrência.";
  if (!form.relTipo.value) erros.relTipo = "Escolha o tipo de ocorrência.";
  if (!desc) erros.relDescricao = "Descreva o que está acontecendo.";
  else if (desc.length < 20) erros.relDescricao = "Escreva pelo menos 20 caracteres (faltam " + (20 - desc.length) + ").";
  return erros;
}

function configurarFormulario(form, validar, aoSucesso) {
  var campos = Array.prototype.map.call(form.elements, function (el) { return el.name; })
    .filter(function (n, i, arr) { return n && arr.indexOf(n) === i; });

  function aplicar(erros) {
    campos.forEach(function (nome) { mostrarErro(form, nome, erros[nome] || ""); });
  }

  var tentou = false; // só revalida em tempo real depois da primeira tentativa de envio
  form.addEventListener("input", function () { if (tentou) aplicar(validar(form)); });
  form.addEventListener("change", function () { if (tentou) aplicar(validar(form)); });

  form.addEventListener("submit", function (e) {
    e.preventDefault(); // nada é enviado a servidor
    tentou = true;
    var erros = validar(form);
    aplicar(erros);

    var nomes = Object.keys(erros);
    if (nomes.length > 0) {
      var primeiro = form.querySelector('[name="' + nomes[0] + '"]');
      if (primeiro) primeiro.focus();
      return;
    }
    aoSucesso(form);
    form.reset();
    tentou = false;
    aplicar({});
  });
}

function iniciarFormularios() {
  var formCadastro = document.getElementById("formCadastro");
  var formRelato = document.getElementById("formRelato");
  var retornoCadastro = document.getElementById("retornoCadastro");
  var retornoRelato = document.getElementById("retornoRelato");
  var listaRelatos = document.getElementById("listaRelatos");
  var contador = document.getElementById("contador");

  configurarFormulario(formCadastro, validarCadastro, function (form) {
    var primeiroNome = form.nome.value.trim().split(" ")[0];
    var canal = form.querySelector('input[name="canal"]:checked').value;
    retornoCadastro.textContent = "Cadastro validado, " + primeiroNome + ". Canal escolhido: " + canal +
      ". Nesta versão nada foi enviado nem salvo: é só uma demonstração.";
    retornoCadastro.hidden = false;
  });

  configurarFormulario(formRelato, validarRelato, function (form) {
    var vazio = listaRelatos.querySelector(".vazio");
    if (vazio) vazio.remove();

    var li = document.createElement("li");
    var titulo = document.createElement("strong");
    titulo.textContent = form.relTipo.value + " · " + form.relBairro.value;
    var texto = document.createElement("span");
    texto.textContent = form.relDescricao.value.trim(); // textContent evita injeção de HTML
    li.appendChild(titulo);
    li.appendChild(document.createElement("br"));
    li.appendChild(texto);
    listaRelatos.insertBefore(li, listaRelatos.firstChild);

    retornoRelato.textContent = "Relato registrado apenas nesta página. Ele some ao recarregar.";
    retornoRelato.hidden = false;
    contador.textContent = "0";
  });

  document.getElementById("relDescricao").addEventListener("input", function (e) {
    contador.textContent = e.target.value.length;
  });

  // Máscara do celular: (11) 91234-5678
  document.getElementById("telefone").addEventListener("input", function (e) {
    var d = e.target.value.replace(/\D/g, "").slice(0, 11);
    var t = d;
    if (d.length > 10) t = "(" + d.slice(0, 2) + ") " + d.slice(2, 7) + "-" + d.slice(7);
    else if (d.length > 6) t = "(" + d.slice(0, 2) + ") " + d.slice(2, 6) + "-" + d.slice(6);
    else if (d.length > 2) t = "(" + d.slice(0, 2) + ") " + d.slice(2);
    else if (d.length > 0) t = "(" + d;
    e.target.value = t;
  });

  // Dica do celular muda conforme o canal escolhido
  var dica = document.getElementById("telefoneDica");
  formCadastro.addEventListener("change", function (e) {
    if (e.target.name === "canal") {
      dica.textContent = e.target.value === "SMS" ? "(obrigatório para SMS)" : "(opcional)";
    }
  });
  formCadastro.addEventListener("reset", function () { dica.textContent = "(obrigatório se escolher SMS)"; });

  formCadastro.addEventListener("input", function () { retornoCadastro.hidden = true; });
  formRelato.addEventListener("input", function () { retornoRelato.hidden = true; });
}
