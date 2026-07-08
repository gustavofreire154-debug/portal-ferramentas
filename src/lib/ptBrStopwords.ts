// Lista de palavras muito comuns do português (artigos, preposições,
// conjunções, pronomes) que não carregam significado por si só — usada
// para filtrar ruído em análises de frequência de palavras (densidade
// de palavras-chave, geração de hashtags).
export const PT_BR_STOPWORDS: Set<string> = new Set([
  'a', 'ao', 'aos', 'aquela', 'aquelas', 'aquele', 'aqueles', 'aquilo', 'as', 'até',
  'com', 'como', 'da', 'das', 'de', 'dela', 'delas', 'dele', 'deles', 'depois',
  'do', 'dos', 'e', 'ela', 'elas', 'ele', 'eles', 'em', 'entre', 'era', 'essa',
  'essas', 'esse', 'esses', 'esta', 'estas', 'este', 'estes', 'eu', 'foi', 'for',
  'há', 'isso', 'isto', 'já', 'lhe', 'lhes', 'mais', 'mas', 'me', 'mesmo', 'meu',
  'meus', 'minha', 'minhas', 'muito', 'na', 'nas', 'nem', 'no', 'nos', 'nós',
  'nossa', 'nossas', 'nosso', 'nossos', 'num', 'numa', 'o', 'os', 'ou', 'para',
  'pela', 'pelas', 'pelo', 'pelos', 'perante', 'pois', 'por', 'porque', 'qual',
  'quando', 'que', 'quem', 'se', 'sem', 'ser', 'seu', 'seus', 'só', 'sua', 'suas',
  'também', 'te', 'tu', 'tua', 'tuas', 'um', 'uma', 'umas', 'uns', 'você', 'vocês',
]);

// Quebra um texto em palavras "limpas" (minúsculas, sem pontuação), pronto
// para contagem de frequência.
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize('NFC')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 1);
}
