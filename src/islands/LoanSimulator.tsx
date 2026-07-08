import { useMemo, useState } from 'react';

interface Installment {
  n: number;
  payment: number;
}

export default function LoanSimulator() {
  const [amount, setAmount] = useState('30000');
  const [rate, setRate] = useState('1.5');
  const [installments, setInstallments] = useState('24');
  const [system, setSystem] = useState<'price' | 'sac'>('price');

  const result = useMemo(() => {
    const principal = parseFloat(amount.replace(',', '.')) || 0;
    const monthlyRate = (parseFloat(rate.replace(',', '.')) || 0) / 100;
    const n = parseInt(installments, 10) || 0;
    if (principal <= 0 || n <= 0) return null;

    const schedule: Installment[] = [];

    if (system === 'price') {
      const payment =
        monthlyRate === 0
          ? principal / n
          : (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -n));
      for (let i = 1; i <= n; i++) {
        schedule.push({ n: i, payment });
      }
    } else {
      const amortization = principal / n;
      let balance = principal;
      for (let i = 1; i <= n; i++) {
        const interest = balance * monthlyRate;
        schedule.push({ n: i, payment: amortization + interest });
        balance -= amortization;
      }
    }

    const total = schedule.reduce((sum, item) => sum + item.payment, 0);
    return {
      schedule,
      first: schedule[0].payment,
      last: schedule[schedule.length - 1].payment,
      total,
      totalInterest: total - principal,
    };
  }, [amount, rate, installments, system]);

  const currency = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div
      className="rounded-xl border p-5 sm:p-6"
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
    >
      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex flex-col gap-1.5">
          <span style={{ color: 'var(--color-text-muted)' }}>Valor financiado (R$)</span>
          <input
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-36 rounded-lg border px-3 py-2 outline-none focus:border-[var(--color-accent)]"
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
            className="w-28 rounded-lg border px-3 py-2 outline-none focus:border-[var(--color-accent)]"
            style={{ borderColor: 'var(--color-border)' }}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span style={{ color: 'var(--color-text-muted)' }}>Parcelas</span>
          <input
            type="text"
            inputMode="numeric"
            value={installments}
            onChange={(e) => setInstallments(e.target.value)}
            className="w-24 rounded-lg border px-3 py-2 outline-none focus:border-[var(--color-accent)]"
            style={{ borderColor: 'var(--color-border)' }}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span style={{ color: 'var(--color-text-muted)' }}>Sistema</span>
          <select
            value={system}
            onChange={(e) => setSystem(e.target.value as 'price' | 'sac')}
            className="rounded-lg border px-3 py-2 outline-none focus:border-[var(--color-accent)]"
            style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
          >
            <option value="price">Price (parcelas fixas)</option>
            <option value="sac">SAC (parcelas decrescentes)</option>
          </select>
        </label>
      </div>

      {result && (
        <>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg p-4" style={{ background: 'var(--color-accent-soft)' }}>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>1ª parcela</p>
              <p className="font-display mt-1 text-lg font-semibold">{currency(result.first)}</p>
            </div>
            <div className="rounded-lg p-4" style={{ background: 'var(--color-accent-soft)' }}>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Última parcela</p>
              <p className="font-display mt-1 text-lg font-semibold">{currency(result.last)}</p>
            </div>
            <div className="rounded-lg p-4" style={{ background: 'var(--color-accent-soft)' }}>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Total de juros</p>
              <p className="font-display mt-1 text-lg font-semibold" style={{ color: 'var(--color-accent)' }}>
                {currency(result.totalInterest)}
              </p>
            </div>
          </div>

          <p className="mt-3 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Total pago ao final: <strong>{currency(result.total)}</strong>
          </p>

          <details className="mt-4">
            <summary className="cursor-pointer text-sm" style={{ color: 'var(--color-accent)' }}>
              Ver tabela completa de parcelas
            </summary>
            <div className="mt-3 max-h-64 overflow-y-auto rounded-lg border" style={{ borderColor: 'var(--color-border)' }}>
              <table className="w-full text-left text-sm">
                <thead>
                  <tr style={{ background: 'var(--color-accent-soft)' }}>
                    <th className="px-3 py-2">Parcela</th>
                    <th className="px-3 py-2">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {result.schedule.map((item) => (
                    <tr key={item.n} className="border-t" style={{ borderColor: 'var(--color-border)' }}>
                      <td className="px-3 py-1.5">{item.n}</td>
                      <td className="px-3 py-1.5">{currency(item.payment)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </>
      )}
    </div>
  );
}
