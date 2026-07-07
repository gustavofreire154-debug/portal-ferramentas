import { useRef, useState } from 'react';

// Assim como o compressor de imagem, este conversor usa só a Canvas API
// nativa do navegador — sem biblioteca externa. Desenhamos a imagem original
// num canvas invisível e pedimos pra ele exportar num formato diferente
// (PNG, JPG ou WEBP). Tudo acontece no computador do usuário.

const FORMATS = [
  { value: 'image/png', label: 'PNG', ext: 'png' },
  { value: 'image/jpeg', label: 'JPG', ext: 'jpg' },
  { value: 'image/webp', label: 'WEBP', ext: 'webp' },
] as const;

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function ImageConverter() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState<(typeof FORMATS)[number]['value']>('image/webp');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  function handleFile(file: File) {
    setOriginalFile(file);
    setOriginalUrl(URL.createObjectURL(file));
    setResultUrl(null);
    setResultSize(null);
  }

  function convert() {
    if (!originalUrl || !canvasRef.current) return;
    setIsProcessing(true);

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      // Fundo branco: importante ao converter PNG com transparência para JPG,
      // que não suporta canal alfa (ficaria preto sem isso).
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      }

      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          setResultUrl(URL.createObjectURL(blob));
          setResultSize(blob.size);
          setIsProcessing(false);
        },
        targetFormat,
        0.92
      );
    };
    img.src = originalUrl;
  }

  const targetInfo = FORMATS.find((f) => f.value === targetFormat)!;

  return (
    <div
      className="rounded-xl border p-5 sm:p-6"
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
    >
      <input
        type="file"
        accept="image/png, image/jpeg, image/webp, image/gif, image/bmp"
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
            <label className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Converter para:
            </label>
            <select
              value={targetFormat}
              onChange={(e) => setTargetFormat(e.target.value as typeof targetFormat)}
              className="rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg)' }}
            >
              {FORMATS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
            <button
              onClick={convert}
              disabled={isProcessing}
              className="rounded-lg px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
              style={{ background: 'var(--color-accent)' }}
            >
              {isProcessing ? 'Convertendo...' : 'Converter'}
            </button>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                Original — {formatBytes(originalFile.size)}
              </p>
              <img src={originalUrl!} alt="Original" className="mt-2 max-h-48 rounded-lg object-contain" />
            </div>
            {resultUrl && (
              <div>
                <p className="text-xs" style={{ color: 'var(--color-accent)' }}>
                  {targetInfo.label} — {formatBytes(resultSize!)}
                </p>
                <img src={resultUrl} alt="Convertida" className="mt-2 max-h-48 rounded-lg object-contain" />
                <a
                  href={resultUrl}
                  download={`imagem-convertida.${targetInfo.ext}`}
                  className="mt-3 inline-block rounded-lg px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                  style={{ background: 'var(--color-accent)' }}
                >
                  Baixar {targetInfo.label}
                </a>
              </div>
            )}
          </div>
        </>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
