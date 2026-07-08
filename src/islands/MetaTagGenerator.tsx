import { useState } from 'react';

function counterColor(length: number, min: number, max: number) {
  if (length === 0) return 'var(--color-text-muted)';
  if (length < min || length > max) return '#e98a2e';
  return 'var(--color-accent)';
}

export default function MetaTagGenerator() {
  const [title, setTitle] = useState('Portal de Ferramentas Online Grátis');
  const [description, setDescription] = useState(
    'Dezenas de ferramentas online gratuitas: calculadoras, conversores, PDF, imagem e mais. Sem cadastro.'
  );
  const [url, setUrl] = useState('https://seusite.com.br');
  const [copied, setCopied] = useState(false);

  const html = `<title>${title}</title>\n<meta name="description" content="${description}" />`;

  async function copyHtml() {
    await navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div
      className="rounded-xl border p-5 sm:p-6"
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
    >
      <div className="grid gap-4">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="flex items-center justify-between">
            <span style={{ color: 'var(--color-text-muted)' }}>Title</span>
            <span className="font-mono text-xs" style={{ color: counterColor(title.length, 50, 60) }}>
              {title.length}/60
            </span>
          </span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 outline-none focus:border-[var(--color-accent)]"
            style={{ borderColor: 'var(--color-border)' }}
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="flex items-center justify-between">
            <span style={{ color: 'var(--color-text-muted)' }}>Meta description</span>
            <span className="font-mono text-xs" style={{ color: counterColor(description.length, 120, 155) }}>
              {description.length}/155
            </span>
          </span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full resize-y rounded-lg border px-3 py-2 outline-none focus:border-[var(--color-accent)]"
            style={{ borderColor: 'var(--color-border)' }}
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span style={{ color: 'var(--color-text-muted)' }}>URL (só para o preview)</span>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 outline-none focus:border-[var(--color-accent)]"
            style={{ borderColor: 'var(--color-border)' }}
          />
        </label>
      </div>

      <div className="mt-6">
        <p className="mb-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>
          Preview no Google
        </p>
        <div className="rounded-lg p-4" style={{ background: 'var(--color-accent-soft)' }}>
          <p className="truncate text-sm" style={{ color: 'var(--color-text-muted)' }}>
            {url}
          </p>
          <p className="mt-1 truncate text-lg" style={{ color: '#1a0dab' }}>
            {title || 'Seu title aparece aqui'}
          </p>
          <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            {description || 'Sua meta description aparece aqui.'}
          </p>
        </div>
      </div>

      <button
        onClick={copyHtml}
        className="mt-4 rounded-lg px-4 py-2 text-sm font-medium transition"
        style={{ background: 'var(--color-accent-soft)', color: 'var(--color-text-muted)' }}
      >
        {copied ? 'Copiado!' : 'Copiar HTML'}
      </button>
    </div>
  );
}
