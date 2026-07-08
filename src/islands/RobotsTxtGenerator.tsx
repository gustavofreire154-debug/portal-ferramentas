import { useMemo, useState } from 'react';

export default function RobotsTxtGenerator() {
  const [allowAll, setAllowAll] = useState(true);
  const [disallowPaths, setDisallowPaths] = useState('/admin\n/carrinho');
  const [sitemapUrl, setSitemapUrl] = useState('https://seusite.com.br/sitemap.xml');
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => {
    const lines = ['User-agent: *'];

    if (allowAll) {
      lines.push('Allow: /');
    }

    const paths = disallowPaths
      .split('\n')
      .map((p) => p.trim())
      .filter(Boolean);

    for (const path of paths) {
      lines.push(`Disallow: ${path}`);
    }

    if (sitemapUrl.trim()) {
      lines.push('', `Sitemap: ${sitemapUrl.trim()}`);
    }

    return lines.join('\n');
  }, [allowAll, disallowPaths, sitemapUrl]);

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
        <div className="flex flex-col gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={allowAll} onChange={(e) => setAllowAll(e.target.checked)} />
            <span>Permitir rastreamento geral (Allow: /)</span>
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span style={{ color: 'var(--color-text-muted)' }}>Pastas bloqueadas (uma por linha)</span>
            <textarea
              value={disallowPaths}
              onChange={(e) => setDisallowPaths(e.target.value)}
              rows={4}
              className="w-full resize-y rounded-lg border p-3 font-mono text-xs outline-none focus:border-[var(--color-accent)]"
              style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)' }}
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span style={{ color: 'var(--color-text-muted)' }}>URL do sitemap</span>
            <input
              type="text"
              value={sitemapUrl}
              onChange={(e) => setSitemapUrl(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 outline-none focus:border-[var(--color-accent)]"
              style={{ borderColor: 'var(--color-border)' }}
            />
          </label>
        </div>

        <div>
          <p className="mb-1.5 text-xs" style={{ color: 'var(--color-text-muted)' }}>
            robots.txt gerado
          </p>
          <pre
            className="w-full whitespace-pre-wrap rounded-lg border p-3 font-mono text-xs"
            style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)' }}
          >
            {output}
          </pre>
          <button
            onClick={copyOutput}
            className="mt-3 rounded-lg px-4 py-2 text-sm font-medium transition"
            style={{ background: 'var(--color-accent-soft)', color: 'var(--color-text-muted)' }}
          >
            {copied ? 'Copiado!' : 'Copiar'}
          </button>
        </div>
      </div>
    </div>
  );
}
