# Portal de Ferramentas — Projeto Base (Fase 2)

Este é o esqueleto inicial do projeto, gerado com Astro + Tailwind + React + MDX.

## Rodando localmente

1. Instale o [Node.js](https://nodejs.org) (versão 18 ou superior).
2. Dentro desta pasta, rode:
   ```
   npm install
   npm run dev
   ```
3. Abra http://localhost:4321 no navegador.

## Estrutura

- `src/content.config.ts` — define os campos obrigatórios de cada ferramenta/artigo.
- `src/content/tools/` — um arquivo `.mdx` por ferramenta.
- `src/content/blog/` — um arquivo `.mdx` por artigo.
- `src/pages/ferramentas/[slug].astro` — gera automaticamente a página de cada ferramenta.
- `src/layouts/` — moldes reutilizáveis de página.
- `src/components/` — peças de interface sem JavaScript (header, footer).
- `src/islands/` — (vazio por enquanto) vai receber as ferramentas interativas na Fase 4.
