# Fluxo de Conteúdo com IA — Como Funciona

Este documento descreve o processo que o portal usa para gerar artigos do
blog com ajuda de IA, **sem nunca publicar nada automaticamente**.

## O fluxo (em 4 passos)

```
1. VOCÊ APROVA A PAUTA   →   2. A IA GERA O RASCUNHO
   (o tema do artigo)          (arquivo .mdx com status: "draft")

4. VOCÊ PUBLICA          ←   3. O SISTEMA REVISA
   (troca pra "published"      (o build falha se faltar campo
    e faz push)                 obrigatório de SEO/estrutura)
```

### 1) Você aprova a pauta
Você decide (ou pede pra mim sugerir) sobre qual ferramenta ou tema vale a
pena escrever. Ex: "escreve um artigo sobre como funciona o compressor de
imagem".

### 2) A IA gera o rascunho
Eu crio um arquivo novo em `src/content/blog/nome-do-artigo.mdx`, sempre
com `status: "draft"` no topo. Enquanto estiver assim, o artigo:
- **não aparece** na home, no `/blog`, nem em nenhum lugar do site;
- **não gera nenhuma página pública** — acessar a URL dá 404 de propósito.

Ou seja: nada vai ao ar sozinho, mesmo que o arquivo já esteja no
repositório e publicado no GitHub.

### 3) O sistema revisa (validação técnica)
Isso já está embutido no projeto: se o rascunho estiver faltando um campo
obrigatório (título de SEO, descrição, data), o `npm run build` **falha**
com erro claro. Isso é uma primeira camada de revisão automática, antes
mesmo de você ler o texto.

### 4) Você publica
Depois de ler, editar o que quiser, e achar que está bom:
1. Abra o arquivo `.mdx` do artigo.
2. Troque `status: "draft"` para `status: "published"`.
3. Faça o commit e push de sempre:
   ```
   git add .
   git commit -m "Publica artigo: nome do artigo"
   git push
   ```
4. No próximo deploy da Vercel, a página passa a existir de verdade —
   e só a partir daí ela entra no sitemap e fica visível para o Google.

## Campo `generatedByAI`

Todo artigo tem um campo `generatedByAI: true/false` no cabeçalho. Isso é
só para **seu controle interno** (saber quais artigos vieram de rascunho
de IA vs. escritos por você do zero) — não aparece em nenhum lugar do
site público.

## Resumindo

- **Nenhum conteúdo de IA aparece no site sem você trocar manualmente
  `draft` → `published` e fazer o push.**
- Isso vale para sempre, mesmo que eu gere 50 rascunhos de uma vez.
- Se um dia quiser automatizar a geração de vários rascunhos junto (ex:
  "gera um rascunho pra cada ferramenta que ainda não tem artigo"), é só
  pedir — o portão de aprovação continua sendo o mesmo.
