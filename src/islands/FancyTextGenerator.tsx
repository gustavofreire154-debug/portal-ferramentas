import { useMemo, useState } from 'react';

// Estiliza texto trocando letras/números "normais" pelos equivalentes de
// blocos Unicode (matemático, monoespaçado, circulado) — que os apps de
// redes sociais exibem como se fosse uma fonte diferente. Caracteres sem
// equivalente (espaços, acentos, pontuação) passam direto, sem alteração.
function mapChars(
  text: string,
  opts: { upperBase?: number; lowerBase?: number; digitBase?: number; exceptions?: Record<string, string> }
) {
  return [...text]
    .map((char) => {
      if (opts.exceptions?.[char]) return opts.exceptions[char];
      const code = char.codePointAt(0)!;
      if (opts.upperBase && code >= 65 && code <= 90) {
        return String.fromCodePoint(opts.upperBase + (code - 65));
      }
      if (opts.lowerBase && code >= 97 && code <= 122) {
        return String.fromCodePoint(opts.lowerBase + (code - 97));
      }
      if (opts.digitBase !== undefined && code >= 48 && code <= 57) {
        if (opts.digitBase === 0x24ea && code === 48) return '⓪'; // circled zero é irregular
        return String.fromCodePoint(opts.digitBase + (code - 48));
      }
      return char;
    })
    .join('');
}

const STYLES = [
  {
    name: 'Negrito',
    transform: (t: string) => mapChars(t, { upperBase: 0x1d400, lowerBase: 0x1d41a, digitBase: 0x1d7ce }),
  },
  {
    name: 'Itálico',
    transform: (t: string) =>
      mapChars(t, { upperBase: 0x1d434, lowerBase: 0x1d44e, exceptions: { h: 'ℎ' } }),
  },
  {
    name: 'Negrito Itálico',
    transform: (t: string) => mapChars(t, { upperBase: 0x1d468, lowerBase: 0x1d482 }),
  },
  {
    name: 'Monoespaçado',
    transform: (t: string) => mapChars(t, { upperBase: 0x1d670, lowerBase: 0x1d68a, digitBase: 0x1d7f6 }),
  },
  {
    name: 'Círculo',
    transform: (t: string) => mapChars(t, { upperBase: 0x24b6, lowerBase: 0x24d0, digitBase: 0x24ea }),
  },
];

export default function FancyTextGenerator() {
  const [text, setText] = useState('Portal de Ferramentas');
  const [copiedStyle, setCopiedStyle] = useState<string | null>(null);

  const variants = useMemo(() => STYLES.map((s) => ({ name: s.name, result: s.transform(text) })), [text]);

  async function copyVariant(name: string, value: string) {
    await navigator.clipboard.writeText(value);
    setCopiedStyle(name);
    setTimeout(() => setCopiedStyle(null), 1500);
  }

  return (
    <div
      className="rounded-xl border p-5 sm:p-6"
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
    >
      <label className="flex flex-col gap-1.5 text-sm">
        <span style={{ color: 'var(--color-text-muted)' }}>Digite seu texto</span>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full rounded-lg border px-3 py-2 outline-none focus:border-[var(--color-accent)]"
          style={{ borderColor: 'var(--color-border)' }}
        />
      </label>

      <div className="mt-4 space-y-2">
        {variants.map((variant) => (
          <div
            key={variant.name}
            className="flex items-center justify-between gap-3 rounded-lg p-3"
            style={{ background: 'var(--color-accent-soft)' }}
          >
            <div>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                {variant.name}
              </p>
              <p className="break-all">{variant.result}</p>
            </div>
            <button
              onClick={() => copyVariant(variant.name, variant.result)}
              className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition"
              style={{ background: 'var(--color-surface)' }}
            >
              {copiedStyle === variant.name ? 'Copiado!' : 'Copiar'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
