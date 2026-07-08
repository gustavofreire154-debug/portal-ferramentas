import { useMemo, useState } from 'react';
import { PT_BR_STOPWORDS, tokenize } from '../lib/ptBrStopwords';

export default function HashtagGenerator() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const hashtags = useMemo(() => {
    const words = tokenize(text).filter((w) => !PT_BR_STOPWORDS.has(w) && w.length > 2);
    const counts = new Map<string, number>();
    for (const word of words) {
      counts.set(word, (counts.get(word) ?? 0) + 1);
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([word]) => `#${word}`);
  }, [text]);

  async function copyAll() {
    await navigator.clipboard.writeText(hashtags.join(' '));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div
      className="rounded-xl border p-5 sm:p-6"
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
    >
      <label className="flex flex-col gap-1.5 text-sm">
        <span style={{ color: 'var(--color-text-muted)' }}>Cole o texto da sua legenda ou descreva o tema</span>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          className="w-full resize-y rounded-lg border p-3 text-sm outline-none focus:border-[var(--color-accent)]"
          style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)' }}
        />
      </label>

      {hashtags.length > 0 && (
        <>
          <div className="mt-4 flex flex-wrap gap-2 rounded-lg p-4" style={{ background: 'var(--color-accent-soft)' }}>
            {hashtags.map((tag) => (
              <span key={tag} className="rounded-full px-3 py-1 text-sm" style={{ background: 'var(--color-surface)' }}>
                {tag}
              </span>
            ))}
          </div>
          <button
            onClick={copyAll}
            className="mt-4 rounded-lg px-4 py-2 text-sm font-medium transition"
            style={{ background: 'var(--color-accent-soft)', color: 'var(--color-text-muted)' }}
          >
            {copied ? 'Copiado!' : 'Copiar todas'}
          </button>
        </>
      )}
    </div>
  );
}
