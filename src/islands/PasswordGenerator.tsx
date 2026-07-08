import { useMemo, useState } from 'react';

const CHARSETS = {
  lower: 'abcdefghijklmnopqrstuvwxyz',
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}',
};

function strengthOf(length: number, poolSize: number) {
  const bitsOfEntropy = length * Math.log2(poolSize || 1);
  if (bitsOfEntropy < 40) return { label: 'Fraca', color: '#e05252' };
  if (bitsOfEntropy < 70) return { label: 'Média', color: '#e98a2e' };
  return { label: 'Forte', color: 'var(--color-accent)' };
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [useLower, setUseLower] = useState(true);
  const [useUpper, setUseUpper] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(false);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const pool = useMemo(() => {
    let p = '';
    if (useLower) p += CHARSETS.lower;
    if (useUpper) p += CHARSETS.upper;
    if (useNumbers) p += CHARSETS.numbers;
    if (useSymbols) p += CHARSETS.symbols;
    return p;
  }, [useLower, useUpper, useNumbers, useSymbols]);

  function generate() {
    if (!pool) return;
    const bytes = new Uint32Array(length);
    crypto.getRandomValues(bytes);
    const result = Array.from(bytes, (byte) => pool[byte % pool.length]).join('');
    setPassword(result);
  }

  async function copyPassword() {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const strength = strengthOf(length, pool.length);

  const options: [string, boolean, (v: boolean) => void][] = [
    ['Letras minúsculas', useLower, setUseLower],
    ['Letras maiúsculas', useUpper, setUseUpper],
    ['Números', useNumbers, setUseNumbers],
    ['Símbolos', useSymbols, setUseSymbols],
  ];

  return (
    <div
      className="rounded-xl border p-5 sm:p-6"
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
    >
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="flex items-center justify-between">
          <span style={{ color: 'var(--color-text-muted)' }}>Tamanho</span>
          <span className="font-mono text-xs" style={{ color: 'var(--color-accent)' }}>{length}</span>
        </span>
        <input
          type="range"
          min={6}
          max={32}
          value={length}
          onChange={(e) => setLength(parseInt(e.target.value, 10))}
        />
      </label>

      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        {options.map(([label, checked, setter]) => (
          <label key={label} className="flex items-center gap-2">
            <input type="checkbox" checked={checked} onChange={(e) => setter(e.target.checked)} />
            <span>{label}</span>
          </label>
        ))}
      </div>

      <button
        onClick={generate}
        disabled={!pool}
        className="mt-4 rounded-lg px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
        style={{ background: 'var(--color-accent)' }}
      >
        Gerar senha
      </button>

      {password && (
        <div className="mt-4 rounded-lg p-4" style={{ background: 'var(--color-accent-soft)' }}>
          <p className="break-all font-mono text-lg">{password}</p>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm font-medium" style={{ color: strength.color }}>
              Força: {strength.label}
            </span>
            <button
              onClick={copyPassword}
              className="rounded-lg px-3 py-1.5 text-xs font-medium transition"
              style={{ background: 'var(--color-surface)' }}
            >
              {copied ? 'Copiado!' : 'Copiar'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
