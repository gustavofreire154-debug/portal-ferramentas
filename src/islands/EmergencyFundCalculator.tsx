import { useMemo, useState } from 'react';

export default function EmergencyFundCalculator() {
  const [expenses, setExpenses] = useState('3000');
  const [monthsGoal, setMonthsGoal] = useState('6');
  const [savingsDeadline, setSavingsDeadline] = useState('12');

  const result = useMemo(() => {
    const exp = parseFloat(expenses.replace(',', '.')) || 0;
    const goalMonths = parseFloat(monthsGoal.replace(',', '.')) || 0;
    const deadline = parseInt(savingsDeadline, 10) || 0;

    const target = exp * goalMonths;
    const monthlySaving = deadline > 0 ? target / deadline : 0;
    return { target, monthlySaving };
  }, [expenses, monthsGoal, savingsDeadline]);

  const currency = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div
      className="rounded-xl border p-5 sm:p-6"
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
    >
      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex flex-col gap-1.5">
          <span style={{ color: 'var(--color-text-muted)' }}>Gasto mensal (R$)</span>
          <input
            type="text"
            inputMode="decimal"
            value={expenses}
            onChange={(e) => setExpenses(e.target.value)}
            className="w-36 rounded-lg border px-3 py-2 outline-none focus:border-[var(--color-accent)]"
            style={{ borderColor: 'var(--color-border)' }}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span style={{ color: 'var(--color-text-muted)' }}>Meses de reserva desejados</span>
          <input
            type="text"
            inputMode="decimal"
            value={monthsGoal}
            onChange={(e) => setMonthsGoal(e.target.value)}
            className="w-36 rounded-lg border px-3 py-2 outline-none focus:border-[var(--color-accent)]"
            style={{ borderColor: 'var(--color-border)' }}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span style={{ color: 'var(--color-text-muted)' }}>Prazo para juntar (meses)</span>
          <input
            type="text"
            inputMode="numeric"
            value={savingsDeadline}
            onChange={(e) => setSavingsDeadline(e.target.value)}
            className="w-36 rounded-lg border px-3 py-2 outline-none focus:border-[var(--color-accent)]"
            style={{ borderColor: 'var(--color-border)' }}
          />
        </label>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg p-4" style={{ background: 'var(--color-accent-soft)' }}>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Valor-alvo da reserva</p>
          <p className="font-display mt-1 text-xl font-semibold" style={{ color: 'var(--color-accent)' }}>
            {currency(result.target)}
          </p>
        </div>
        <div className="rounded-lg p-4" style={{ background: 'var(--color-accent-soft)' }}>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Guardar por mês</p>
          <p className="font-display mt-1 text-xl font-semibold">{currency(result.monthlySaving)}</p>
        </div>
      </div>

      <p className="mt-4 text-xs" style={{ color: 'var(--color-text-muted)' }}>
        Referência comum: 3 a 6 meses de gastos para renda fixa (CLT), de 6 a 12 meses para autônomos ou renda variável.
      </p>
    </div>
  );
}
