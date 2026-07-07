import { useMemo, useState } from 'react';

function classifyBmi(bmi: number) {
  if (!Number.isFinite(bmi) || bmi <= 0) return null;
  if (bmi < 18.5) return { label: 'Abaixo do peso', color: '#e98a2e' };
  if (bmi < 25) return { label: 'Peso normal', color: 'var(--color-accent)' };
  if (bmi < 30) return { label: 'Sobrepeso', color: '#e98a2e' };
  return { label: 'Obesidade', color: '#e05252' };
}

export default function BmiCalculator() {
  const [weight, setWeight] = useState('70');
  const [height, setHeight] = useState('170');

  const bmi = useMemo(() => {
    const weightNum = parseFloat(weight.replace(',', '.'));
    const heightM = parseFloat(height.replace(',', '.')) / 100;
    return weightNum / (heightM * heightM);
  }, [weight, height]);

  const classification = classifyBmi(bmi);

  return (
    <div
      className="rounded-xl border p-5 sm:p-6"
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
    >
      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex flex-col gap-1.5">
          <span style={{ color: 'var(--color-text-muted)' }}>Peso (kg)</span>
          <input
            type="text"
            inputMode="decimal"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-28 rounded-lg border px-3 py-2 outline-none focus:border-[var(--color-accent)]"
            style={{ borderColor: 'var(--color-border)' }}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span style={{ color: 'var(--color-text-muted)' }}>Altura (cm)</span>
          <input
            type="text"
            inputMode="decimal"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="w-28 rounded-lg border px-3 py-2 outline-none focus:border-[var(--color-accent)]"
            style={{ borderColor: 'var(--color-border)' }}
          />
        </label>
      </div>

      {classification && (
        <div className="mt-6 rounded-lg p-4" style={{ background: 'var(--color-accent-soft)' }}>
          <p className="font-display text-2xl font-semibold" style={{ color: classification.color }}>
            {bmi.toFixed(1)}
          </p>
          <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            {classification.label}
          </p>
        </div>
      )}

      <p className="mt-4 text-xs" style={{ color: 'var(--color-text-muted)' }}>
        O IMC é uma referência geral e não substitui avaliação médica individual.
      </p>
    </div>
  );
}
