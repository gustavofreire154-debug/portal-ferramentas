import { useMemo, useState } from 'react';

// Valores de referência (USD por 1 milhão de tokens), sujeitos a alteração
// pelos provedores a qualquer momento — usar apenas para comparação relativa.
const MODELS = [
  { name: 'Modelo econômico', inputPer1M: 0.15, outputPer1M: 0.6 },
  { name: 'Modelo intermediário', inputPer1M: 3, outputPer1M: 15 },
  { name: 'Modelo avançado', inputPer1M: 15, outputPer1M: 75 },
];

export default function AiCostComparator() {
  const [requests, setRequests] = useState('1000');
  const [inputTokens, setInputTokens] = useState('500');
  const [outputTokens, setOutputTokens] = useState('300');

  const results = useMemo(() => {
    const reqs = parseFloat(requests.replace(',', '.')) || 0;
    const inTok = parseFloat(inputTokens.replace(',', '.')) || 0;
    const outTok = parseFloat(outputTokens.replace(',', '.')) || 0;

    return MODELS.map((model) => {
      const cost =
        (reqs * inTok * model.inputPer1M) / 1_000_000 + (reqs * outTok * model.outputPer1M) / 1_000_000;
      return { ...model, cost };
    });
  }, [requests, inputTokens, outputTokens]);

  const maxCost = Math.max(...results.map((r) => r.cost), 0.01);

  return (
    <div
      className="rounded-xl border p-5 sm:p-6"
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
    >
      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex flex-col gap-1.5">
          <span style={{ color: 'var(--color-text-muted)' }}>Requisições/mês</span>
          <input
            type="text"
            inputMode="decimal"
            value={requests}
            onChange={(e) => setRequests(e.target.value)}
            className="w-32 rounded-lg border px-3 py-2 outline-none focus:border-[var(--color-accent)]"
            style={{ borderColor: 'var(--color-border)' }}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span style={{ color: 'var(--color-text-muted)' }}>Tokens de entrada (média)</span>
          <input
            type="text"
            inputMode="decimal"
            value={inputTokens}
            onChange={(e) => setInputTokens(e.target.value)}
            className="w-32 rounded-lg border px-3 py-2 outline-none focus:border-[var(--color-accent)]"
            style={{ borderColor: 'var(--color-border)' }}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span style={{ color: 'var(--color-text-muted)' }}>Tokens de saída (média)</span>
          <input
            type="text"
            inputMode="decimal"
            value={outputTokens}
            onChange={(e) => setOutputTokens(e.target.value)}
            className="w-32 rounded-lg border px-3 py-2 outline-none focus:border-[var(--color-accent)]"
            style={{ borderColor: 'var(--color-border)' }}
          />
        </label>
      </div>

      <div className="mt-6 space-y-3">
        {results.map((model) => (
          <div key={model.name}>
            <div className="flex items-center justify-between text-sm">
              <span>{model.name}</span>
              <span className="font-display font-semibold" style={{ color: 'var(--color-accent)' }}>
                US$ {model.cost.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}/mês
              </span>
            </div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full" style={{ background: 'var(--color-accent-soft)' }}>
              <div
                className="h-full rounded-full"
                style={{ width: `${(model.cost / maxCost) * 100}%`, background: 'var(--gradient-brand)' }}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs" style={{ color: 'var(--color-text-muted)' }}>
        Valores de referência em dólar, sujeitos a alteração pelos provedores de IA. Use apenas para comparação relativa entre modelos.
      </p>
    </div>
  );
}
