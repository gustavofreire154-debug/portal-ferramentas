import { useMemo, useState } from 'react';

const CONTEXT_LIMITS = [
  { label: 'Contexto de 8K tokens', value: 8_000 },
  { label: 'Contexto de 32K tokens', value: 32_000 },
  { label: 'Contexto de 128K tokens', value: 128_000 },
];

export default function AiTokenCalculator() {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const chars = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    // Duas heurísticas comuns: ~4 caracteres por token, ou ~0.75 palavras por token.
    // A média das duas dá uma estimativa mais equilibrada para textos em português.
    const estimateByChars = chars / 4;
    const estimateByWords = words / 0.75;
    const tokens = Math.round((estimateByChars + estimateByWords) / 2);
    return { chars, words, tokens };
  }, [text]);

  return (
    <div
      className="rounded-xl border p-5 sm:p-6"
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
    >
      <label className="flex flex-col gap-1.5 text-sm">
        <span style={{ color: 'var(--color-text-muted)' }}>Cole seu texto ou prompt</span>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          className="w-full resize-y rounded-lg border p-3 text-sm outline-none focus:border-[var(--color-accent)]"
          style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)' }}
        />
      </label>

      <div className="mt-6 rounded-lg p-4" style={{ background: 'var(--color-accent-soft)' }}>
        <p className="font-display text-2xl font-semibold" style={{ color: 'var(--color-accent)' }}>
          ~{stats.tokens.toLocaleString('pt-BR')} tokens
        </p>
        <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
          {stats.chars.toLocaleString('pt-BR')} caracteres · {stats.words.toLocaleString('pt-BR')} palavras
        </p>
      </div>

      <div className="mt-4 space-y-2 text-sm">
        {CONTEXT_LIMITS.map((limit) => {
          const pct = Math.min(100, (stats.tokens / limit.value) * 100);
          return (
            <div key={limit.label}>
              <div className="flex justify-between text-xs" style={{ color: 'var(--color-text-muted)' }}>
                <span>{limit.label}</span>
                <span>{pct.toFixed(2)}%</span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full" style={{ background: 'var(--color-accent-soft)' }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: `${pct}%`, background: 'var(--gradient-brand)' }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-xs" style={{ color: 'var(--color-text-muted)' }}>
        Estimativa aproximada por heurística de caracteres/palavras — a contagem exata varia conforme o tokenizador de cada modelo.
      </p>
    </div>
  );
}
