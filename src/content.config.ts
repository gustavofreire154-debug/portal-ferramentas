// Este arquivo define o "molde" (schema) de cada tipo de conteúdo do site.
// Toda ferramenta e todo artigo do blog PRECISA seguir esse molde.
// Se faltar um campo obrigatório, o Astro avisa o erro na hora do build —
// isso evita que uma ferramenta "quebrada" vá parar no ar sem SEO, por exemplo.

import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Schema de uma FERRAMENTA (ex: calculadora de porcentagem, compressor de PDF...)
const tools = defineCollection({
  // "loader" diz ao Astro ONDE encontrar os arquivos dessa coleção.
  // A partir do Astro 5+, isso substitui o antigo "type: 'content'".
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/tools' }),
  schema: z.object({
    name: z.string(),               // Nome exibido: "Calculadora de Porcentagem"
    description: z.string(),        // Frase curta usada em cards e meta description
    category: z.string(),           // Slug da categoria: "calculadoras"
    image: z.string().optional(),   // Caminho da imagem de capa
    featured: z.boolean().default(false), // Aparece em "Ferramentas em destaque"?
    isNew: z.boolean().default(false),    // Aparece em "Ferramentas novas"?
    popular: z.boolean().default(false),  // Aparece em "Mais usadas"?
    icon: z.string().default('🛠️'),      // Emoji/ícone simples exibido no card
    seo: z.object({
      title: z.string(),            // Título de SEO (pode ser diferente do "name")
      description: z.string(),      // Meta description otimizada
    }),
    faq: z
      .array(
        z.object({
          question: z.string(),
          answer: z.string(),
        })
      )
      .default([]),
    relatedArticle: z.string().optional(), // slug de um artigo do blog relacionado
  }),
});

// Schema de um ARTIGO do blog
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    updatedDate: z.date().optional(),
    relatedTool: z.string().optional(), // slug de uma ferramenta relacionada
    // "draft"     -> existe no repositório, mas NUNCA gera página pública.
    // "published" -> só muda para isso depois que você revisar e aprovar.
    // Este é o "portão" do fluxo de aprovação: nada vai ao ar sem essa
    // troca manual e consciente.
    status: z.enum(['draft', 'published']).default('draft'),
    generatedByAI: z.boolean().default(false), // marca artigos que vieram de um rascunho gerado por IA
    seo: z.object({
      title: z.string(),
      description: z.string(),
    }),
  }),
});

export const collections = { tools, blog };
