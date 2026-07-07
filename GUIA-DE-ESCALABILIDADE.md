# Guia de Escalabilidade — Como Crescer o Portal Sozinho

Este documento é o seu "manual de operação" do dia a dia. Sempre que
quiser adicionar uma ferramenta, artigo ou categoria nova, o processo
está aqui.

---

## 1. Adicionar uma ferramenta SEM calculadora interativa (só conteúdo)

Esse é o caso mais simples e mais comum — ferramentas como "Juntar PDF"
começaram assim, como conteúdo, antes de ganhar a parte interativa.

1. Vá em `src/content/tools/`.
2. Copie um arquivo `.mdx` existente (ex: `calculadora-de-imc.mdx`) e
   renomeie para o slug da ferramenta nova (ex: `gerador-de-senha.mdx`).
3. Edite o cabeçalho (front-matter) com os dados da ferramenta nova:
   ```yaml
   ---
   name: "Gerador de Senha"
   description: "Crie senhas fortes e aleatórias em segundos."
   category: "utilidades"   # precisa ser um slug que já existe em src/config/categories.ts
   icon: "🔐"
   featured: false
   isNew: true
   popular: false
   seo:
     title: "Gerador de Senha Online Grátis"
     description: "Gere senhas fortes e seguras gratuitamente."
   faq:
     - question: "As senhas são salvas em algum lugar?"
       answer: "Não, tudo acontece no seu navegador."
   ---
   ```
4. Escreva o conteúdo explicativo abaixo do cabeçalho (o texto que aparece
   na página, acima do FAQ).
5. Rode `npm run dev` e confira em `http://localhost:4321/ferramentas/gerador-de-senha`.
6. `git add . && git commit -m "Adiciona ferramenta: gerador de senha" && git push`.

A ferramenta já aparece automaticamente na home (se `featured`/`popular`/
`isNew` estiverem marcados), na página de categoria, na busca do Hero e
no sitemap. Você não precisa editar mais nada.

---

## 2. Adicionar uma ferramenta COM calculadora interativa

Esse é o caso que exige um pouco de código (React). Este é o momento
certo para **me chamar numa conversa** e pedir algo como:
> "Cria a ilha interativa para o Gerador de Senha, com opções de
> tamanho, incluir números e símbolos."

Mas se quiser fazer sozinho, o padrão é sempre este:

1. Crie o arquivo de conteúdo (passo 1 acima).
2. Crie um componente novo em `src/islands/NomeDaFerramenta.tsx`, seguindo
   o padrão dos que já existem (`useState` para os campos, cálculo em
   tempo real).
3. Abra `src/pages/ferramentas/[slug].astro` e:
   - Importe o componente no topo.
   - Adicione o slug na lista `KNOWN_TOOLS`.
   - Adicione a linha:
     ```jsx
     {tool.id === 'gerador-de-senha' && <GeradorDeSenha client:load />}
     ```
4. Teste com `npm run dev`, depois `npm run build` pra garantir que não
   quebrou nada.

---

## 3. Adicionar um artigo no blog

Siga o fluxo já documentado em `CONTEUDO-IA.md`:
1. Peça pra mim gerar o rascunho (ou escreva você mesmo) em
   `src/content/blog/nome-do-artigo.mdx`, com `status: "draft"`.
2. Leia, edite o que quiser.
3. Troque para `status: "published"`.
4. `git add . && git commit -m "Publica artigo: nome do artigo" && git push`.

---

## 4. Adicionar uma categoria nova

1. Abra `src/config/categories.ts`.
2. Adicione uma linha nova no array, seguindo o padrão:
   ```ts
   { slug: 'jogos', name: 'Jogos', icon: '🎮', description: 'Passatempos e diversão' },
   ```
3. Pronto — a página `/categorias/jogos` é gerada automaticamente, e ela
   já aparece na listagem de `/categorias` e no rodapé.

---

## 5. Checklist antes de qualquer publicação

- [ ] `npm run build` rodou sem erro?
- [ ] O título de SEO (`seo.title`) tem entre 50-60 caracteres?
- [ ] A descrição de SEO (`seo.description`) tem entre 120-155 caracteres?
- [ ] Testou a ferramenta/artigo em `npm run dev` antes de publicar?
- [ ] Se for ferramenta nova: ela está na categoria certa?

---

## 6. Quando me chamar numa conversa

Me procure quando precisar de:
- Uma calculadora/ferramenta interativa nova (código React).
- Ajustes de design ou nova seção na home.
- Dúvidas técnicas de deploy, Git ou configuração.
- Revisão de um rascunho de artigo antes de publicar.

Para tarefas puramente de conteúdo (adicionar ferramenta simples, editar
texto, trocar ícone), você já tem tudo que precisa neste guia.

---

## 7. Uma sugestão para o dia a dia

Para esse tipo de trabalho repetitivo — criar vários arquivos, testar,
commitar — vale a pena considerar o **Claude Code**, uma ferramenta da
Anthropic feita pra esse tipo de tarefa direto no seu computador (sem
precisar copiar/colar arquivos entre o chat e o VS Code toda vez).
