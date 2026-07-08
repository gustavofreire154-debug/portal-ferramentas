import { useMemo, useState } from 'react';

export default function MarketingRoiCalculator() {
  const [investment, setInvestment] = useState('1000');
  const [revenue, setRevenue] = useState('2500');

  const result = useMemo(() => {
    const inv = parseFloat(investment.replace(',', '.'));
    const rev = parseFloat(revenue.replace(',', '.'));
    if (!Number.isFinite(inv) || inv <= 0 || !Number.isFinite(rev)) return null;

    const profit = rev - inv;
    const roi = (profit / inv) * 100;
    return { profit, roi };
  }, [investment, revenue]);

  return (
    <div
      className="rounded-xl border p-5 sm:p-6"
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
    >
      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex flex-col gap-1.5">
          <span style={{ color: 'var(--color-text-muted)' }}>Valor investido (R$)</span>
          <input
            type="text"
            inputMode="decimal"
            value={investment}
            onChange={(e) => setInvestment(e.target.value)}
            className="w-40 rounded-lg border px-3 py-2 outline-none focus:border-[var(--color-accent)]"
            style={{ borderColor: 'var(--color-border)' }}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span style={{ color: 'var(--color-text-muted)' }}>Receita gerada (R$)</span>
          <input
            type="text"
            inputMode="decimal"
            value={revenue}
            onChange={(e) => setRevenue(e.target.value)}
            className="w-40 rounded-lg border px-3 py-2 outline-none focus:border-[var(--color-accent)]"
            style={{ borderColor: 'var(--color-border)' }}
          />
        </label>
      </div>

      {result && (
        <div className="mt-6 rounded-lg p-4" style={{ background: 'var(--color-accent-soft)' }}>
          <p
            className="font-display text-2xl font-semibold"
            style={{ color: result.roi >= 0 ? 'var(--color-accent)' : '#e05252' }}
          >
            {result.roi.toFixed(1)}% de ROI
          </p>
          <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Lucro líquido:{' '}
            {result.profit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>
        </div>
      )}
    </div>
  );
}
