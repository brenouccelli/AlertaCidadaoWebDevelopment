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

## Guia de GitHub (para a equipe fazer)

Faça os commits com o que cada integrante realmente fizer. Não crie commits artificiais. A divisão abaixo é só um modelo.

### 1. Criar a GitHub Organization e o repositório
1. No GitHub: foto do perfil > *Your organizations* > *New organization* (plano gratuito). Dê um nome ao grupo.
2. Convide os integrantes em *People > Invite member*.
3. Dentro da Organization, crie o repositório `alerta-cidadao`.
4. No terminal, dentro da pasta do projeto:
```bash
git init
git branch -M main
git add .
git commit -m "chore: estrutura inicial do projeto"
git remote add origin https://github.com/NOME-DA-ORGANIZATION/alerta-cidadao.git
git push -u origin main
```

### 2. Trabalhar em branches
Cada integrante cria uma branch para a sua parte, faz commits pequenos e abre um Pull Request para a `main`:
```bash
git checkout -b feature/slideshow
# edite os arquivos
git add .
git commit -m "feat: ajusta legenda do slideshow"
git push -u origin feature/slideshow
```
No GitHub, abra o *Pull Request*, peça revisão de alguém do grupo e faça o *merge*. Depois:
```bash
git checkout main
git pull
```

### 3. Sugestão de divisão (ajuste ao seu grupo)
- `feature/hero-slideshow`: textos e imagens do hero e do slideshow.
- `feature/painel-dom`: painel, histórico e orientações.
- `feature/formularios`: validações e mensagens de erro.
- `style/responsivo`: ajustes de CSS e media queries.
- `docs/equipe-ai`: preencher `equipe.txt`, `AI.md` e este README.

Para chegar a **15 commits ou mais** de forma honesta, faça commits pequenos a cada ajuste real (uma correção, uma mensagem de erro revisada, uma imagem trocada). Cada integrante deve commitar com o próprio usuário do GitHub.

### 4. Mensagens de commit
Prefixos: `feat:` (nova função), `fix:` (correção), `style:` (CSS), `docs:` (documentação), `refactor:`, `chore:`.

### 5. Gerar o ZIP da entrega
Depois do merge de tudo na `main`:
- pelo GitHub: *Code > Download ZIP*; ou
- pelo terminal: `git archive --format=zip --output=Alerta-Cidadao.zip main`

Antes de enviar, confira se `equipe.txt` tem todos os nomes, RMs e o link do repositório.

### 6. (Opcional) GitHub Pages
*Settings > Pages > Branch: main / (root)*.
