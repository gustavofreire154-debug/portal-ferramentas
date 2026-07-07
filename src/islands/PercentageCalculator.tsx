import { useMemo, useState } from 'react';

// Esta é uma "ilha": um componente React que roda de verdade no navegador
// do usuário. Diferente dos componentes .astro (que só geram HTML fixo),
// este aqui tem estado (useState) e recalcula a cada tecla digitada.
//
// Ela só é carregada na página desta ferramenta específica — nenhuma
// outra página do site baixa este JavaScript.

type Mode = 'percent-of' | 'what-percent' | 'change';

const TABS: { id: Mode; label: string }[] = [
  { id: 'percent-of', label: 'Quanto é X% de Y' },
  { id: 'what-percent', label: 'X é que % de Y' },
  { id: 'change', label: 'Aumento / desconto' },
];

function formatNumber(value: number) {
  if (Number.isNaN(value) || !Number.isFinite(value)) return '—';
  return value.toLocaleString('pt-BR', { maximumFractionDigits: 4 });
}

export default function PercentageCalculator() {
  const [mode, setMode] = useState<Mode>('percent-of');

  const [x, setX] = useState('20');
  const [y, setY] = useState('150');

  const [partial, setPartial] = useState('30');
  const [total, setTotal] = useState('150');

  const [base, setBase] = useState('150');
  const [changePercent, setChangePercent] = useState('10');
  const [changeType, setChangeType] = useState<'increase' | 'decrease'>('increase');

  const percentOfResult = useMemo(() => {
    const xNum = parseFloat(x.replace(',', '.'));
    const yNum = parseFloat(y.replace(',', '.'));
    return (xNum / 100) * yNum;
  }, [x, y]);

  const whatPercentResult = useMemo(() => {
    const partialNum = parseFloat(partial.replace(',', '.'));
    const totalNum = parseFloat(total.replace(',', '.'));
    return (partialNum / totalNum) * 100;
  }, [partial, total]);

  const changeResult = useMemo(() => {
    const baseNum = parseFloat(base.replace(',', '.'));
    const percentNum = parseFloat(changePercent.replace(',', '.'));
    const factor = changeType === 'increase' ? 1 + percentNum / 100 : 1 - percentNum / 100;
    return baseNum * factor;
  }, [base, changePercent, changeType]);

  return (
    <div
      className="rounded-xl border p-5 sm:p-6"
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
    >
      {/* Abas de modo */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setMode(tab.id)}
            className="rounded-lg px-3 py-1.5 text-xs font-medium transition sm:text-sm"
            style={
              mode === tab.id
                ? { background: 'var(--color-accent)', color: 'white' }
                : { background: 'var(--color-accent-soft)', color: 'var(--color-text-muted)' }
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Modo 1: quanto é X% de Y */}
      {mode === 'percent-of' && (
        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
          <input
            type="text"
            inputMode="decimal"
            value={x}
            onChange={(e) => setX(e.target.value)}
            className="w-20 rounded-lg border px-3 py-2 text-center outline-none focus:border-[var(--color-accent)]"
            style={{ borderColor: 'var(--color-border)' }}
          />
          <span>% de</span>
          <input
            type="text"
            inputMode="decimal"
            value={y}
            onChange={(e) => setY(e.target.value)}
            className="w-24 rounded-lg border px-3 py-2 text-center outline-none focus:border-[var(--color-accent)]"
            style={{ borderColor: 'var(--color-border)' }}
          />
          <span>=</span>
          <span className="font-display text-xl font-semibold" style={{ color: 'var(--color-accent)' }}>
            {formatNumber(percentOfResult)}
          </span>
        </div>
      )}

      {/* Modo 2: X é que % de Y */}
      {mode === 'what-percent' && (
        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
          <input
            type="text"
            inputMode="decimal"
            value={partial}
            onChange={(e) => setPartial(e.target.value)}
            className="w-24 rounded-lg border px-3 py-2 text-center outline-none focus:border-[var(--color-accent)]"
            style={{ borderColor: 'var(--color-border)' }}
          />
          <span>é que % de</span>
          <input
            type="text"
            inputMode="decimal"
            value={total}
            onChange={(e) => setTotal(e.target.value)}
            className="w-24 rounded-lg border px-3 py-2 text-center outline-none focus:border-[var(--color-accent)]"
            style={{ borderColor: 'var(--color-border)' }}
          />
          <span>=</span>
          <span className="font-display text-xl font-semibold" style={{ color: 'var(--color-accent)' }}>
            {formatNumber(whatPercentResult)}%
          </span>
        </div>
      )}

      {/* Modo 3: aumento / desconto */}
      {mode === 'change' && (
        <div className="mt-6 space-y-4 text-sm">
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              inputMode="decimal"
              value={base}
              onChange={(e) => setBase(e.target.value)}
              className="w-24 rounded-lg border px-3 py-2 text-center outline-none focus:border-[var(--color-accent)]"
              style={{ borderColor: 'var(--color-border)' }}
            />
            <select
              value={changeType}
              onChange={(e) => setChangeType(e.target.value as 'increase' | 'decrease')}
              className="rounded-lg border px-3 py-2 outline-none focus:border-[var(--color-accent)]"
              style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
            >
              <option value="increase">com aumento de</option>
              <option value="decrease">com desconto de</option>
            </select>
            <input
              type="text"
              inputMode="decimal"
              value={changePercent}
              onChange={(e) => setChangePercent(e.target.value)}
              className="w-20 rounded-lg border px-3 py-2 text-center outline-none focus:border-[var(--color-accent)]"
              style={{ borderColor: 'var(--color-border)' }}
            />
            <span>%</span>
          </div>
          <p>
            Resultado:{' '}
            <span className="font-display text-xl font-semibold" style={{ color: 'var(--color-accent)' }}>
              {formatNumber(changeResult)}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
