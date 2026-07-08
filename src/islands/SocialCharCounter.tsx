import { useState } from 'react';

const PLATFORMS = [
  { name: 'X (Twitter)', limit: 280 },
  { name: 'Instagram (legenda)', limit: 2200 },
  { name: 'LinkedIn', limit: 3000 },
  { name: 'Facebook', limit: 63206 },
  { name: 'TikTok', limit: 2200 },
];

export default function SocialCharCounter() {
  const [text, setText] = useState('');
  const length = text.length;

  return (
    <div
      className="rounded-xl border p-5 sm:p-6"
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
    >
      <label className="flex flex-col gap-1.5 text-sm">
        <span style={{ color: 'var(--color-text-muted)' }}>Seu texto</span>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          className="w-full resize-y rounded-lg border p-3 text-sm outline-none focus:border-[var(--color-accent)]"
          style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)' }}
        />
      </label>

      <div className="mt-4 space-y-3">
        {PLATFORMS.map((platform) => {
          const pct = Math.min(100, (length / platform.limit) * 100);
          const over = length > platform.limit;
          return (
            <div key={platform.name}>
              <div className="flex items-center justify-between text-sm">
                <span>{platform.name}</span>
                <span
                  className="font-mono text-xs"
                  style={{ color: over ? '#e05252' : 'var(--color-text-muted)' }}
                >
                  {length.toLocaleString('pt-BR')}/{platform.limit.toLocaleString('pt-BR')}
                </span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full" style={{ background: 'var(--color-accent-soft)' }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${pct}%`,
                    background: over ? '#e05252' : 'var(--gradient-brand)',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
