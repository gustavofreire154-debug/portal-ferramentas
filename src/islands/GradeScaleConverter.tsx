import { useState } from 'react';

function letterFromScore100(score: number) {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

const LETTER_TO_SCORE100: Record<string, number> = { A: 95, B: 85, C: 75, D: 65, F: 40 };

export default function GradeScaleConverter() {
  const [score10, setScore10] = useState('7');

  const num10 = parseFloat(score10.replace(',', '.'));
  const valid = Number.isFinite(num10) && num10 >= 0 && num10 <= 10;
  const score100 = valid ? num10 * 10 : null;
  const letter = score100 !== null ? letterFromScore100(score100) : null;

  function setFromScore100(value: string) {
    const v = parseFloat(value.replace(',', '.'));
    if (Number.isFinite(v)) setScore10((v / 10).toString());
  }

  function setFromLetter(value: string) {
    const s100 = LETTER_TO_SCORE100[value];
    if (s100 !== undefined) setScore10((s100 / 10).toString());
  }

  return (
    <div
      className="rounded-xl border p-5 sm:p-6"
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="flex flex-col gap-1.5 text-sm">
          <span style={{ color: 'var(--color-text-muted)' }}>Escala 0 a 10</span>
          <input
            type="text"
            inputMode="decimal"
            value={score10}
            onChange={(e) => setScore10(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 outline-none focus:border-[var(--color-accent)]"
            style={{ borderColor: 'var(--color-border)' }}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span style={{ color: 'var(--color-text-muted)' }}>Escala 0 a 100</span>
          <input
            type="text"
            inputMode="decimal"
            value={score100 !== null ? score100.toFixed(0) : ''}
            onChange={(e) => setFromScore100(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 outline-none focus:border-[var(--color-accent)]"
            style={{ borderColor: 'var(--color-border)' }}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span style={{ color: 'var(--color-text-muted)' }}>Conceito (A-F)</span>
          <select
            value={letter ?? ''}
            onChange={(e) => setFromLetter(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 outline-none focus:border-[var(--color-accent)]"
            style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
          >
            <option value="" disabled>
              —
            </option>
            {Object.keys(LETTER_TO_SCORE100).map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </label>
      </div>

      {!valid && (
        <p className="mt-4 text-xs" style={{ color: '#e05252' }}>
          Digite um valor entre 0 e 10 na escala principal.
        </p>
      )}

      <p className="mt-4 text-xs" style={{ color: 'var(--color-text-muted)' }}>
        Conversão de referência geral — instituições podem usar faixas diferentes para os conceitos.
      </p>
    </div>
  );
}
