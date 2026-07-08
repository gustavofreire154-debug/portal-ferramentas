import { useMemo, useState } from 'react';

interface Row {
  id: number;
  grade: string;
  weight: string;
}

let nextId = 3;

export default function GradeAverageCalculator() {
  const [rows, setRows] = useState<Row[]>([
    { id: 1, grade: '7', weight: '6' },
    { id: 2, grade: '8', weight: '4' },
  ]);
  const [passingGrade, setPassingGrade] = useState('6');

  const average = useMemo(() => {
    let weightedSum = 0;
    let weightTotal = 0;
    for (const row of rows) {
      const grade = parseFloat(row.grade.replace(',', '.'));
      const weight = parseFloat(row.weight.replace(',', '.'));
      if (Number.isFinite(grade) && Number.isFinite(weight)) {
        weightedSum += grade * weight;
        weightTotal += weight;
      }
    }
    return weightTotal > 0 ? weightedSum / weightTotal : null;
  }, [rows]);

  const passing = parseFloat(passingGrade.replace(',', '.'));

  function updateRow(id: number, field: 'grade' | 'weight', value: string) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  }

  function addRow() {
    setRows((prev) => [...prev, { id: nextId++, grade: '', weight: '1' }]);
  }

  function removeRow(id: number) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div
      className="rounded-xl border p-5 sm:p-6"
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
    >
      <div className="space-y-2">
        {rows.map((row) => (
          <div key={row.id} className="flex items-center gap-2 text-sm">
            <input
              type="text"
              inputMode="decimal"
              placeholder="Nota"
              value={row.grade}
              onChange={(e) => updateRow(row.id, 'grade', e.target.value)}
              className="w-24 rounded-lg border px-3 py-2 outline-none focus:border-[var(--color-accent)]"
              style={{ borderColor: 'var(--color-border)' }}
            />
            <input
              type="text"
              inputMode="decimal"
              placeholder="Peso"
              value={row.weight}
              onChange={(e) => updateRow(row.id, 'weight', e.target.value)}
              className="w-24 rounded-lg border px-3 py-2 outline-none focus:border-[var(--color-accent)]"
              style={{ borderColor: 'var(--color-border)' }}
            />
            <button
              onClick={() => removeRow(row.id)}
              className="rounded-lg px-3 py-2 text-xs"
              style={{ color: 'var(--color-text-muted)' }}
              aria-label="Remover avaliação"
            >
              Remover
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addRow}
        className="mt-3 rounded-lg px-4 py-2 text-sm font-medium transition"
        style={{ background: 'var(--color-accent-soft)', color: 'var(--color-text-muted)' }}
      >
        + Adicionar avaliação
      </button>

      <label className="mt-4 flex items-center gap-2 text-sm">
        <span style={{ color: 'var(--color-text-muted)' }}>Nota mínima para aprovação</span>
        <input
          type="text"
          inputMode="decimal"
          value={passingGrade}
          onChange={(e) => setPassingGrade(e.target.value)}
          className="w-20 rounded-lg border px-3 py-2 outline-none focus:border-[var(--color-accent)]"
          style={{ borderColor: 'var(--color-border)' }}
        />
      </label>

      {average !== null && (
        <div className="mt-6 rounded-lg p-4" style={{ background: 'var(--color-accent-soft)' }}>
          <p
            className="font-display text-2xl font-semibold"
            style={{ color: Number.isFinite(passing) && average >= passing ? 'var(--color-accent)' : '#e05252' }}
          >
            {average.toFixed(2)}
          </p>
          <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            {Number.isFinite(passing)
              ? average >= passing
                ? 'Aprovado com a média atual'
                : 'Abaixo da nota mínima'
              : 'Média ponderada'}
          </p>
        </div>
      )}
    </div>
  );
}
