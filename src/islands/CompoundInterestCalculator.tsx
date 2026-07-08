import { useMemo, useState } from 'react';

export default function CompoundInterestCalculator() {
  const [initial, setInitial] = useState('1000');
  const [monthly, setMonthly] = useState('200');
  const [rate, setRate] = useState('1');
  const [months, setMonths] = useState('24');

  const result = useMemo(() => {
    const p0 = parseFloat(initial.replace(',', '.')) || 0;
    const contribution = parseFloat(monthly.replace(',', '.')) || 0;
    const monthlyRate = (parseFloat(rate.replace(',', '.')) || 0) / 100;
    const n = parseInt(months, 10) || 0;

    let balance = p0;
    for (let i = 0; i < n; i++) {
      balance = balance * (1 + monthlyRate) + contribution;
    }

    const invested = p0 + contribution * n;
    const interest = balance - invested;
    return { balance, invested, interest };
  }, [initial, monthly, rate, months]);

  const currency = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div
      className="rounded-xl border p-5 sm:p-6"
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
    >
      <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
        <label className="flex flex-col gap-1.5">
          <span style={{ color: 'var(--color-text-muted)' }}>Valor inicial (R$)</span>
          <input
            type="text"
            inputMode="decimal"
            value={initial}
            onChange={(e) => setInitial(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 outline-none focus:border-[var(--color-accent)]"
            style={{ borderColor: 'var(--color-border)' }}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span style={{ color: 'var(--color-text-muted)' }}>Aporte mensal (R$)</span>
          <input
            type="text"
            inputMode="decimal"
            value={monthly}
            onChange={(e) => setMonthly(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 outline-none focus:border-[var(--color-accent)]"
            style={{ borderColor: 'var(--color-border)' }}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span style={{ color: 'var(--color-text-muted)' }}>Taxa mensal (%)</span>
          <input
            type="text"
            inputMode="decimal"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 outline-none focus:border-[var(--color-accent)]"
            style={{ borderColor: 'var(--color-border)' }}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span style={{ color: 'var(--color-text-muted)' }}>Período (meses)</span>
          <input
            type="text"
            inputMode="numeric"
            value={months}
            onChange={(e) => setMonths(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 outline-none focus:border-[var(--color-accent)]"
            style={{ borderColor: 'var(--color-border)' }}
          />
        </label>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg p-4" style={{ background: 'var(--color-accent-soft)' }}>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Total acumulado</p>
          <p className="font-display mt-1 text-xl font-semibold" style={{ color: 'var(--color-accent)' }}>
            {currency(result.balance)}
          </p>
        </div>
        <div className="rounded-lg p-4" style={{ background: 'var(--color-accent-soft)' }}>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Total investido</p>
          <p className="font-display mt-1 text-xl font-semibold">{currency(result.invested)}</p>
        </div>
        <div className="rounded-lg p-4" style={{ background: 'var(--color-accent-soft)' }}>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Total em juros</p>
          <p className="font-display mt-1 text-xl font-semibold">{currency(result.interest)}</p>
        </div>
      </div>
    </div>
  );
}
