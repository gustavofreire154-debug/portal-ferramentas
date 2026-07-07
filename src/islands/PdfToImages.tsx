import { useState } from 'react';

// Usa a biblioteca "pdfjs-dist" (o motor de PDF do próprio Firefox) para
// desenhar cada página do PDF num canvas invisível, que depois exportamos
// como imagem JPG. O "jszip" empacota tudo num único .zip para baixar de
// uma vez. Nada é enviado a um servidor — o PDF nunca sai do navegador.

interface PageImage {
  pageNumber: number;
  url: string;
  blob: Blob;
}

export default function PdfToImages() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [pages, setPages] = useState<PageImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setFileName(file.name);
    setPages([]);
    setError(null);
    setIsProcessing(true);

    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.mjs',
        import.meta.url
      ).href;

      const bytes = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;

      const results: PageImage[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d')!;
        await page.render({ canvasContext: ctx, viewport, canvas }).promise;

        const blob: Blob = await new Promise((resolve) =>
          canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.9)
        );
        results.push({ pageNumber: i, url: URL.createObjectURL(blob), blob });
      }
      setPages(results);
    } catch (err) {
      setError('Não foi possível ler esse arquivo. Confirme se é um PDF válido.');
    } finally {
      setIsProcessing(false);
    }
  }

  async function downloadZip() {
    if (pages.length === 0) return;
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    pages.forEach((page) => {
      zip.file(`pagina-${String(page.pageNumber).padStart(2, '0')}.jpg`, page.blob);
    });
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName?.replace(/\.pdf$/i, '') || 'paginas'}.zip`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div
      className="rounded-xl border p-5 sm:p-6"
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
    >
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
        className="block w-full text-sm file:mr-4 file:rounded-lg file:border-0 file:px-4 file:py-2 file:text-sm file:font-medium"
        style={{ color: 'var(--color-text-muted)' }}
      />

      {isProcessing && (
        <p className="mt-4 text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Convertendo páginas...
        </p>
      )}

      {error && (
        <p className="mt-3 text-sm" style={{ color: '#e05252' }}>
          {error}
        </p>
      )}

      {pages.length > 0 && (
        <>
          <div className="mt-5 flex items-center justify-between">
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              {pages.length} página(s) convertida(s)
            </p>
            <button
              onClick={downloadZip}
              className="rounded-lg px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
              style={{ background: 'var(--color-accent)' }}
            >
              Baixar tudo (.zip)
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {pages.map((page) => (
              <div
                key={page.pageNumber}
                className="rounded-lg border p-2 text-center"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <img src={page.url} alt={`Página ${page.pageNumber}`} className="mx-auto max-h-32 rounded object-contain" />
                <p className="mt-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  Página {page.pageNumber}
                </p>
                <a
                  href={page.url}
                  download={`pagina-${String(page.pageNumber).padStart(2, '0')}.jpg`}
                  className="mt-1 inline-block text-xs font-medium"
                  style={{ color: 'var(--color-accent)' }}
                >
                  Baixar
                </a>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
