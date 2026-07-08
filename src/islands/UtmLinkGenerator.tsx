import { useMemo, useState } from 'react';

export default function UtmLinkGenerator() {
  const [url, setUrl] = useState('https://seusite.com.br');
  const [source, setSource] = useState('instagram');
  const [medium, setMedium] = useState('social');
  const [campaign, setCampaign] = useState('lancamento');
  const [term, setTerm] = useState('');
  const [content, setContent] = useState('');
  const [copied, setCopied] = useState(false);

  const finalUrl = useMemo(() => {
    if (!url.trim()) return '';
    try {
      const parsed = new URL(url.trim());
      const params = new URLSearchParams(parsed.search);
      if (source.trim()) params.set('utm_source', source.trim());
      if (medium.trim()) params.set('utm_medium', medium.trim());
      if (campaign.trim()) params.set('utm_campaign', campaign.trim());
      if (term.trim()) params.set('utm_term', term.trim());
      if (content.trim()) params.set('utm_content', content.trim());
      parsed.search = params.toString();
      return parsed.toString();
    } catch {
      return '';
    }
  }, [url, source, medium, campaign, term, content]);

  async function copyUrl() {
    await navigator.clipboard.writeText(finalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const fields: [string, string, (v: string) => void, string][] = [
    ['URL do site', url, setUrl, 'https://seusite.com.br/pagina'],
    ['utm_source (origem)', source, setSource, 'instagram, newsletter, google'],
    ['utm_medium (meio)', medium, setMedium, 'social, email, cpc'],
    ['utm_campaign (campanha)', campaign, setCampaign, 'lancamento-produto'],
    ['utm_term (opcional)', term, setTerm, 'palavra-chave do anúncio'],
    ['utm_content (opcional)', content, setContent, 'botao-topo, botao-rodape'],
  ];

  return (
    <div
      className="rounded-xl border p-5 sm:p-6"
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map(([label, value, setter, placeholder]) => (
          <label key={label} className="flex flex-col gap-1.5 text-sm">
            <span style={{ color: 'var(--color-text-muted)' }}>{label}</span>
            <input
              type="text"
              value={value}
              placeholder={placeholder}
              onChange={(e) => setter(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 outline-none focus:border-[var(--color-accent)]"
              style={{ borderColor: 'var(--color-border)' }}
            />
          </label>
        ))}
      </div>

      <div className="mt-6 rounded-lg p-4" style={{ background: 'var(--color-accent-soft)' }}>
        <p className="mb-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
          Link com UTM
        </p>
        <p className="break-all font-mono text-sm">{finalUrl || 'Preencha a URL do site'}</p>
      </div>

      {finalUrl && (
        <button
          onClick={copyUrl}
          className="mt-4 rounded-lg px-4 py-2 text-sm font-medium transition"
          style={{ background: 'var(--color-accent-soft)', color: 'var(--color-text-muted)' }}
        >
          {copied ? 'Copiado!' : 'Copiar link'}
        </button>
      )}
    </div>
  );
}
