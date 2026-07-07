import { useState } from 'react';

// Esta ferramenta usa a biblioteca "@imgly/background-removal" — ela roda
// um modelo de IA inteiro dentro do navegador (via WebAssembly), então a
// imagem do usuário nunca é enviada a um servidor. Na primeira vez que a
// ferramenta é usada, o navegador baixa o modelo (alguns MB) de um CDN
// público; depois disso ele fica em cache e as próximas remoções são rápidas.

export default function BackgroundRemover() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleFile(file: File) {
    setOriginalFile(file);
    setOriginalUrl(URL.createObjectURL(file));
    setResultUrl(null);
    setError(null);
  }

  async function removeBg() {
    if (!originalFile) return;
    setIsProcessing(true);
    setError(null);
    setProgress('Carregando modelo de IA...');
    try {
      const { removeBackground } = await import('@imgly/background-removal');
      const blob = await removeBackground(originalFile, {
        progress: (key, current, total) => {
          if (key.startsWith('fetch')) {
            setProgress(`Baixando modelo... ${Math.round((current / total) * 100)}%`);
          } else {
            setProgress('Removendo fundo...');
          }
        },
      });
      setResultUrl(URL.createObjectURL(blob));
    } catch (err) {
      setError('Não foi possível remover o fundo dessa imagem. Tente outro arquivo.');
    } finally {
      setIsProcessing(false);
      setProgress(null);
    }
  }

  return (
    <div
      className="rounded-xl border p-5 sm:p-6"
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
    >
      <input
        type="file"
        accept="image/png, image/jpeg, image/webp"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
        className="block w-full text-sm file:mr-4 file:rounded-lg file:border-0 file:px-4 file:py-2 file:text-sm file:font-medium"
        style={{ color: 'var(--color-text-muted)' }}
      />

      {originalFile && (
        <>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={removeBg}
              disabled={isProcessing}
              className="rounded-lg px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
              style={{ background: 'var(--color-accent)' }}
            >
              {isProcessing ? 'Processando...' : 'Remover fundo'}
            </button>
            {progress && (
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                {progress}
              </span>
            )}
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                Original
              </p>
              <img src={originalUrl!} alt="Original" className="mt-2 max-h-64 rounded-lg object-contain" />
            </div>
            {resultUrl && (
              <div
                className="rounded-lg p-2"
                style={{
                  backgroundImage:
                    'linear-gradient(45deg, #80808022 25%, transparent 25%), linear-gradient(-45deg, #80808022 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #80808022 75%), linear-gradient(-45deg, transparent 75%, #80808022 75%)',
                  backgroundSize: '16px 16px',
                  backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
                }}
              >
                <p className="text-xs" style={{ color: 'var(--color-accent)' }}>
                  Sem fundo
                </p>
                <img src={resultUrl} alt="Sem fundo" className="mt-2 max-h-64 rounded-lg object-contain" />
                <a
                  href={resultUrl}
                  download="imagem-sem-fundo.png"
                  className="mt-3 inline-block rounded-lg px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                  style={{ background: 'var(--color-accent)' }}
                >
                  Baixar PNG
                </a>
              </div>
            )}
          </div>
        </>
      )}

      {error && (
        <p className="mt-3 text-sm" style={{ color: '#e05252' }}>
          {error}
        </p>
      )}
    </div>
  );
}
