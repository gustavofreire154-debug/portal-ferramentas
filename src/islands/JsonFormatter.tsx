import { useState } from 'react';

// Formatar/validar JSON não precisa de nenhuma biblioteca: o próprio
// JavaScript já sabe fazer isso com JSON.parse (lê e valida) e
// JSON.stringify com um terceiro argumento (a indentação).

export default function JsonFormatter() {
  const [input, setInput] = useState('{"nome":"Portal de Ferramentas","gratuito":true,"categorias":["pdf","imagem"]}');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function format() {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (err) {
      setError((err as Error).message);
      setOutput('');
    }
  }

  function minify() {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError(null);
    } catch (err) {
      setError((err as Error).message);
      setOutput('');
    }
  }

  async function copyOutput() {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div
      className="rounded-xl border p-5 sm:p-6"
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-1.5 text-xs" style={{ color: 'var(--color-text-muted)' }}>
            JSON de entrada
          </p>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={10}
            className="w-full resize-y rounded-lg border p-3 font-mono text-xs outline-none focus:border-[var(--color-accent)]"
            style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)' }}
          />
        </div>
        <div>
          <p className="mb-1.5 text-xs" style={{ color: 'var(--color-text-muted)' }}>
            Resultado
          </p>
          <textarea
            value={output}
            readOnly
            rows={10}
            placeholder="Clique em Formatar para ver o resultado aqui"
            className="w-full resize-y rounded-lg border p-3 font-mono text-xs outline-none"
            style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)' }}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          onClick={format}
          className="rounded-lg px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
          style={{ background: 'var(--color-accent)' }}
        >
          Formatar
        </button>
        <button
          onClick={minify}
          className="rounded-lg px-4 py-2 text-sm font-medium transition"
          style={{ background: 'var(--color-accent-soft)', color: 'var(--color-text-muted)' }}
        >
          Minificar
        </button>
        {output && (
          <button
            onClick={copyOutput}
            className="rounded-lg px-4 py-2 text-sm font-medium transition"
            style={{ background: 'var(--color-accent-soft)', color: 'var(--color-text-muted)' }}
          >
            {copied ? 'Copiado!' : 'Copiar resultado'}
          </button>
        )}
      </div>

      {error && (
        <p className="mt-3 font-mono text-xs" style={{ color: '#e05252' }}>
          Erro: {error}
        </p>
      )}
    </div>
  );
}
