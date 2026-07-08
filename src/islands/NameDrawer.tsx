import { useState } from 'react';

export default function NameDrawer() {
  const [namesText, setNamesText] = useState('');
  const [winner, setWinner] = useState<string | null>(null);
  const [drawing, setDrawing] = useState(false);

  const names = namesText
    .split('\n')
    .map((n) => n.trim())
    .filter(Boolean);

  function draw() {
    if (names.length === 0) return;
    setDrawing(true);
    setWinner(null);

    // Pequena animação: troca o nome exibido algumas vezes antes de parar
    // no resultado final, pra dar sensação de "sorteio" acontecendo.
    let ticks = 0;
    const maxTicks = 12;
    const interval = setInterval(() => {
      const random = names[Math.floor(Math.random() * names.length)];
      setWinner(random);
      ticks++;
      if (ticks >= maxTicks) {
        clearInterval(interval);
        setDrawing(false);
      }
    }, 80);
  }

  function removeWinner() {
    if (!winner) return;
    setNamesText(names.filter((n) => n !== winner).join('\n'));
    setWinner(null);
  }

  return (
    <div
      className="rounded-xl border p-5 sm:p-6"
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
    >
      <label className="flex flex-col gap-1.5 text-sm">
        <span style={{ color: 'var(--color-text-muted)' }}>Um nome por linha</span>
        <textarea
          value={namesText}
          onChange={(e) => setNamesText(e.target.value)}
          rows={6}
          placeholder={'Ana\nBruno\nCarla'}
          className="w-full resize-y rounded-lg border p-3 text-sm outline-none focus:border-[var(--color-accent)]"
          style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)' }}
        />
      </label>

      <p className="mt-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>
        {names.length} nome{names.length === 1 ? '' : 's'} na lista
      </p>

      <button
        onClick={draw}
        disabled={names.length === 0 || drawing}
        className="mt-4 rounded-lg px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
        style={{ background: 'var(--color-accent)' }}
      >
        Sortear
      </button>

      {winner && (
        <div className="mt-6 rounded-lg p-6 text-center" style={{ background: 'var(--color-accent-soft)' }}>
          <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--color-text-muted)' }}>
            {drawing ? 'Sorteando...' : 'Resultado'}
          </p>
          <p className="font-display mt-1 text-3xl font-bold" style={{ color: 'var(--color-accent)' }}>
            {winner}
          </p>
          {!drawing && (
            <button
              onClick={removeWinner}
              className="mt-3 rounded-lg px-3 py-1.5 text-xs font-medium transition"
              style={{ background: 'var(--color-surface)' }}
            >
              Remover da lista e sortear de novo
            </button>
          )}
        </div>
      )}
    </div>
  );
}
