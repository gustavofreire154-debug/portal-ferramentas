// Lista central de categorias. Ficar em um único arquivo (em vez de
// espalhado pelo código) significa que, pra adicionar uma categoria nova,
// você só mexe AQUI — a home, o menu e as páginas de categoria se atualizam
// sozinhos.
export interface Category {
  slug: string;
  name: string;
  icon: string;
  description: string;
}

export const categories: Category[] = [
  { slug: 'pdf', name: 'PDF', icon: '📄', description: 'Juntar, dividir, comprimir e converter' },
  { slug: 'imagem', name: 'Imagem', icon: '🖼️', description: 'Redimensionar, comprimir, converter' },
  { slug: 'texto', name: 'Texto', icon: '✏️', description: 'Contar, formatar, comparar' },
  { slug: 'calculadoras', name: 'Calculadoras', icon: '🧮', description: 'Porcentagem, IMC, juros e mais' },
  { slug: 'conversores', name: 'Conversores', icon: '🔁', description: 'Moedas, unidades, arquivos' },
  { slug: 'programacao', name: 'Programação', icon: '💻', description: 'JSON, regex, formatadores' },
  { slug: 'seo', name: 'SEO', icon: '📈', description: 'Meta tags, palavras-chave, análise' },
  { slug: 'marketing', name: 'Marketing', icon: '📣', description: 'UTM, copy, planejamento' },
  { slug: 'ia', name: 'Inteligência Artificial', icon: '✨', description: 'Prompts, resumos, geração de texto' },
  { slug: 'redes-sociais', name: 'Redes Sociais', icon: '📱', description: 'Formatos, legendas, hashtags' },
  { slug: 'financas', name: 'Finanças', icon: '💰', description: 'Empréstimos, investimentos, orçamento' },
  { slug: 'educacao', name: 'Educação', icon: '🎓', description: 'Estudo, notas, calendários' },
  { slug: 'utilidades', name: 'Utilidades', icon: '🧰', description: 'Do dia a dia, sem categoria fixa' },
];
