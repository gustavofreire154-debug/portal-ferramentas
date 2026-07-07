import { useMemo, useState } from 'react';

function countStats(text: string) {
  const trimmed = text.trim();
  const words = trimmed.length === 0 ? 0 : trimmed.split(/\s+/).length;
  const charactersWithSpaces = text.length;
  const charactersWithoutSpaces = text.replace(/\s/g, '').length;
  const sentences = trimmed.length === 0 ? 0 : (trimmed.match(/[.!?]+/g) || []).length || (trimmed ? 1 : 0);
  // Estimativa comum: ~200 palavras por minuto de leitura.
  const readingMinutes = Math.max(1, Math.ceil(words / 200));

  return { words, charactersWithSpaces, charactersWithoutSpaces, sentences, readingMinutes };
}

export default function WordCounter() {
  const [text, setText] = useState('');
  const stats = useMemo(() => countStats(text), [text]);

  const cards = [
    { label: 'Palavras', value: stats.words },
    { label: 'Caracteres (com espaços)', value: stats.charactersWithSpaces },
    { label: 'Caracteres (sem espaços)', value: stats.charactersWithoutSpaces },
    { label: 'Frases (aprox.)', value: stats.sentences },
    { label: 'Tempo de leitura', value: `${stats.readingMinutes} min` },
  ];

  return (
    <div
      className="rounded-xl border p-5 sm:p-6"
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Cole ou digite seu texto aqui..."
        rows={8}
        className="w-full resize-y rounded-lg border p-4 text-sm outline-none focus:border-[var(--color-accent)]"
        style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)' }}
      />

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-lg border p-3 text-center"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <p className="font-display text-lg font-semibold" style={{ color: 'var(--color-accent)' }}>
              {card.value}
            </p>
            <p className="mt-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
              {card.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
