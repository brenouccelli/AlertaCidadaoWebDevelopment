# Alerta Cidadão – Monitoramento e Prevenção de Enchentes

Projeto acadêmico FIAP · GS CitizenTech 2026 · Web Development (Front-end Dinâmico).
Tecnologias: HTML5, CSS3 e JavaScript puro. Sem frameworks nem bibliotecas.

> **Protótipo.** Os níveis do rio são simulados. Não há sensores, banco de dados ou APIs conectados, e os formulários não enviam dados a nenhum servidor.

## Como abrir
Abra a pasta no Visual Studio Code e abra `index.html` no navegador (ou use a extensão Live Server).

## Estrutura
```
Alerta-Cidadao/
  index.html
  css/style.css
  js/script.js
  assets/images/  (logo-icone.svg, favicon.svg, slide-1.svg, slide-2.svg, slide-3.svg)
  equipe.txt
  AI.md
  README.md
```

## Requisitos da etapa
| Requisito | Onde está |
|---|---|
| Slideshow com 3 imagens, voltar/avançar, pontos, pausa e troca automática | Hero (topo da página) · `iniciarSlideshow()` |
| Formulários com validação em JS e bloqueio de envio com campo vazio | Seção Contato (abas "Receber alertas" e "Relatar ocorrência") · `validarCadastro()`, `validarRelato()` |
| Manipulação do DOM (seleção, conteúdo, classes e estilos) | Painel do nível do rio, hero, orientações, histórico, abas, FAQ · `iniciarPainel()` |
| Responsividade | media queries em `css/style.css` (tablet ≤ 960 px, celular ≤ 760 px) |

---

## https://brenouccelli.github.io/AlertaCidadaoWebDevelopment/
