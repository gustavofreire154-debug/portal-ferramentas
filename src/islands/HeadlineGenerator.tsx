import { useMemo, useState } from 'react';

export default function HeadlineGenerator() {
  const [product, setProduct] = useState('curso de marketing digital');
  const [audience, setAudience] = useState('pequenos empreendedores');
  const [benefit, setBenefit] = useState('vender mais todos os dias');
  const [pain, setPain] = useState('depender de sorte');

  const headlines = useMemo(() => {
    const p = product.trim() || 'seu produto';
    const a = audience.trim() || 'seu público';
    const b = benefit.trim() || 'alcançar o resultado que você quer';
    const d = pain.trim() || 'complicar o processo';

    return [
      `Como ${a} podem ${b} com ${p}`,
      `${p.charAt(0).toUpperCase() + p.slice(1)}: o jeito mais simples de ${b}`,
      `Descubra como ${b} sem ${d}`,
      `${a.charAt(0).toUpperCase() + a.slice(1)}, chega de ${d}: conheça ${p}`,
      `O guia definitivo para ${a} que querem ${b}`,
      `Por que ${a} estão trocando ${d} por ${p}`,
    ];
  }, [product, audience, benefit, pain]);

  return (
    <div
      className="rounded-xl border p-5 sm:p-6"
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm">
          <span style={{ color: 'var(--color-text-muted)' }}>Produto ou serviço</span>
          <input
            type="text"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 outline-none focus:border-[var(--color-accent)]"
            style={{ borderColor: 'var(--color-border)' }}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span style={{ color: 'var(--color-text-muted)' }}>Público-alvo</span>
          <input
            type="text"
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 outline-none focus:border-[var(--color-accent)]"
            style={{ borderColor: 'var(--color-border)' }}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span style={{ color: 'var(--color-text-muted)' }}>Benefício principal</span>
          <input
            type="text"
            value={benefit}
            onChange={(e) => setBenefit(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 outline-none focus:border-[var(--color-accent)]"
            style={{ borderColor: 'var(--color-border)' }}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span style={{ color: 'var(--color-text-muted)' }}>Dor a evitar</span>
          <input
            type="text"
            value={pain}
            onChange={(e) => setPain(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 outline-none focus:border-[var(--color-accent)]"
            style={{ borderColor: 'var(--color-border)' }}
          />
        </label>
      </div>

      <div className="mt-6 space-y-2">
        {headlines.map((headline) => (
          <div key={headline} className="rounded-lg p-3 text-sm" style={{ background: 'var(--color-accent-soft)' }}>
            {headline}
          </div>
        ))}
      </div>
    </div>
  );
}
