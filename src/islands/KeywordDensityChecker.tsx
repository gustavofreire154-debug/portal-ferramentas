import { useMemo, useState } from 'react';
import { PT_BR_STOPWORDS, tokenize } from '../lib/ptBrStopwords';

interface WordCount {
  word: string;
  count: number;
  density: number;
}

export default function KeywordDensityChecker() {
  const [text, setText] = useState('');

  const results = useMemo<WordCount[]>(() => {
    const words = tokenize(text).filter((w) => !PT_BR_STOPWORDS.has(w));
    if (words.length === 0) return [];

    const counts = new Map<string, number>();
    for (const word of words) {
      counts.set(word, (counts.get(word) ?? 0) + 1);
    }

    return [...counts.entries()]
      .map(([word, count]) => ({ word, count, density: (count / words.length) * 100 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);
  }, [text]);

  const totalWords = tokenize(text).length;

  return (
    <div
      className="rounded-xl border p-5 sm:p-6"
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
    >
      <label className="flex flex-col gap-1.5 text-sm">
        <span style={{ color: 'var(--color-text-muted)' }}>Cole seu texto</span>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          placeholder="Cole aqui o texto do seu artigo ou página..."
          className="w-full resize-y rounded-lg border p-3 text-sm outline-none focus:border-[var(--color-accent)]"
          style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)' }}
        />
      </label>

      <p className="mt-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>
        {totalWords} palavras no total (stopwords já filtradas do ranking abaixo)
      </p>

      {results.length > 0 && (
        <div className="mt-4 rounded-lg p-4" style={{ background: 'var(--color-accent-soft)' }}>
          <div className="space-y-2">
            {results.map((item) => (
              <div key={item.word} className="flex items-center justify-between gap-3 text-sm">
                <span className="font-mono">{item.word}</span>
                <span className="flex items-center gap-2 shrink-0">
                  <span style={{ color: 'var(--color-text-muted)' }}>{item.count}x</span>
                  <span className="font-mono text-xs" style={{ color: 'var(--color-accent)' }}>
                    {item.density.toFixed(1)}%
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
