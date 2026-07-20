import { useRef, useState } from 'react';

// Esta ferramenta NÃO usa nenhuma biblioteca externa — o próprio navegador
// já sabe recomprimir imagens através da Canvas API (desenhamos a imagem
// num "quadro" invisível e pedimos pra ele exportar de novo com menos
// qualidade). Isso mantém o site leve e o processamento 100% local:
// a imagem do usuário nunca sai do computador dele.

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function ImageCompressor() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState<number | null>(null);
  const [quality, setQuality] = useState(0.7);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  function handleFile(file: File) {
    setOriginalFile(file);
    setResultUrl(null);
    setResultSize(null);
    const url = URL.createObjectURL(file);
    setOriginalUrl(url);
  }

  function compress(targetQuality: number) {
    if (!originalUrl || !canvasRef.current) return;
    setIsProcessing(true);

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          setResultUrl(URL.createObjectURL(blob));
          setResultSize(blob.size);
          setIsProcessing(false);
        },
        'image/jpeg',
        targetQuality
      );
    };
    img.src = originalUrl;
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
          <div className="mt-5 flex items-center gap-4">
            <label className="flex-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Qualidade: {Math.round(quality * 100)}%
              <input
                type="range"
                min={0.1}
                max={1}
                step={0.05}
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="mt-2 w-full accent-[var(--color-accent)]"
              />
            </label>
            <button
              onClick={() => compress(quality)}
              disabled={isProcessing}
              className="shrink-0 rounded-lg px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
              style={{ background: 'var(--color-accent)' }}
            >
              {isProcessing ? 'Comprimindo...' : 'Comprimir'}
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
                  Comprimida — {formatBytes(resultSize!)}
                  {resultSize && originalFile && (
                    <> ({Math.round(100 - (resultSize / originalFile.size) * 100)}% menor)</>
                  )}
                </p>
                <img src={resultUrl} alt="Comprimida" className="mt-2 max-h-48 rounded-lg object-contain" />
                <a
                  href={resultUrl}
                  download="imagem-comprimida.jpg"
                  className="mt-3 inline-block rounded-lg px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                  style={{ background: 'var(--color-accent)' }}
                >
                  Baixar
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
