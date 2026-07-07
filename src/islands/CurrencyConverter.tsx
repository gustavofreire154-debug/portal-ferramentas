import { useEffect, useState } from 'react';

// Esta ferramenta busca cotações reais na API pública e gratuita
// Frankfurter (dados oficiais do Banco Central Europeu, atualizados
// uma vez por dia útil). Não precisa de chave de API nem de cadastro.

const CURRENCIES = [
  { code: 'BRL', label: 'Real (BRL)' },
  { code: 'USD', label: 'Dólar americano (USD)' },
  { code: 'EUR', label: 'Euro (EUR)' },
  { code: 'GBP', label: 'Libra esterlina (GBP)' },
  { code: 'JPY', label: 'Iene (JPY)' },
  { code: 'CAD', label: 'Dólar canadense (CAD)' },
];

export default function CurrencyConverter() {
  const [amount, setAmount] = useState('100');
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('BRL');
  const [rate, setRate] = useState<number | null>(null);
  const [rateDate, setRateDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (from === to) {
      setRate(1);
      setRateDate(null);
      return;
    }
    setLoading(true);
    setError(null);

    fetch(`https://api.frankfurter.dev/v1/latest?base=${from}&symbols=${to}`)
      .then((res) => {
        if (!res.ok) throw new Error('Falha na resposta da API');
        return res.json();
      })
      .then((data) => {
        setRate(data.rates[to]);
        setRateDate(data.date);
      })
      .catch(() => {
        setError('Não foi possível buscar a cotação agora. Tente novamente em instantes.');
      })
      .finally(() => setLoading(false));
  }, [from, to]);

  const amountNum = parseFloat(amount.replace(',', '.'));
  const result = rate !== null && Number.isFinite(amountNum) ? amountNum * rate : null;

  return (
    <div
      className="rounded-xl border p-5 sm:p-6"
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
    >
      <div className="flex flex-wrap items-end gap-3 text-sm">
        <label className="flex flex-col gap-1.5">
          <span style={{ color: 'var(--color-text-muted)' }}>Valor</span>
          <input
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-28 rounded-lg border px-3 py-2 outline-none focus:border-[var(--color-accent)]"
            style={{ borderColor: 'var(--color-border)' }}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span style={{ color: 'var(--color-text-muted)' }}>De</span>
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="rounded-lg border px-3 py-2 outline-none focus:border-[var(--color-accent)]"
            style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
        </label>

        <button
          onClick={() => {
            setFrom(to);
            setTo(from);
          }}
          className="rounded-lg border px-3 py-2"
          style={{ borderColor: 'var(--color-border)' }}
          aria-label="Inverter moedas"
        >
          ⇄
        </button>

        <label className="flex flex-col gap-1.5">
          <span style={{ color: 'var(--color-text-muted)' }}>Para</span>
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="rounded-lg border px-3 py-2 outline-none focus:border-[var(--color-accent)]"
            style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-6 rounded-lg p-4" style={{ background: 'var(--color-accent-soft)' }}>
        {loading && (
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Buscando cotação...
          </p>
        )}
        {error && (
          <p className="text-sm" style={{ color: '#e05252' }}>
            {error}
          </p>
        )}
        {!loading && !error && result !== null && (
          <>
            <p className="font-display text-2xl font-semibold" style={{ color: 'var(--color-accent)' }}>
              {result.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} {to}
            </p>
            <p className="mt-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
              1 {from} = {rate?.toLocaleString('pt-BR', { maximumFractionDigits: 4 })} {to}
              {rateDate && ` · cotação de ${rateDate}`}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
