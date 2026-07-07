import { useState } from 'react';

// Esta ferramenta usa a biblioteca "pdf-lib" — ela sabe ler e escrever
// arquivos PDF em JavaScript puro, então todo o trabalho de juntar os
// arquivos acontece no navegador do usuário. Nada é enviado a um servidor.

interface PdfItem {
  file: File;
  id: string;
}

export default function PdfMerger() {
  const [items, setItems] = useState<PdfItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function addFiles(fileList: FileList) {
    const newItems = Array.from(fileList).map((file) => ({
      file,
      id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2)}`,
    }));
    setItems((prev) => [...prev, ...newItems]);
    setResultUrl(null);
    setError(null);
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function moveItem(index: number, direction: -1 | 1) {
    setItems((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  async function mergePdfs() {
    if (items.length < 2) return;
    setIsProcessing(true);
    setError(null);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const mergedPdf = await PDFDocument.create();

      for (const item of items) {
        const bytes = await item.file.arrayBuffer();
        const donorPdf = await PDFDocument.load(bytes);
        const pages = await mergedPdf.copyPages(donorPdf, donorPdf.getPageIndices());
        pages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([mergedBytes], { type: 'application/pdf' });
      setResultUrl(URL.createObjectURL(blob));
    } catch (err) {
      setError('Não foi possível juntar esses arquivos. Confirme se todos são PDFs válidos.');
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div
      className="rounded-xl border p-5 sm:p-6"
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
    >
      <input
        type="file"
        accept="application/pdf"
        multiple
        onChange={(e) => e.target.files && addFiles(e.target.files)}
        className="block w-full text-sm file:mr-4 file:rounded-lg file:border-0 file:px-4 file:py-2 file:text-sm file:font-medium"
        style={{ color: 'var(--color-text-muted)' }}
      />

      {items.length > 0 && (
        <ul className="mt-5 space-y-2">
          {items.map((item, index) => (
            <li
              key={item.id}
              className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <span className="truncate">{item.file.name}</span>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  onClick={() => moveItem(index, -1)}
                  disabled={index === 0}
                  className="rounded px-2 py-1 text-xs disabled:opacity-30"
                  aria-label="Mover para cima"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveItem(index, 1)}
                  disabled={index === items.length - 1}
                  className="rounded px-2 py-1 text-xs disabled:opacity-30"
                  aria-label="Mover para baixo"
                >
                  ↓
                </button>
                <button
                  onClick={() => removeItem(item.id)}
                  className="rounded px-2 py-1 text-xs"
                  style={{ color: '#e05252' }}
                  aria-label="Remover"
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          onClick={mergePdfs}
          disabled={items.length < 2 || isProcessing}
          className="rounded-lg px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
          style={{ background: 'var(--color-accent)' }}
        >
          {isProcessing ? 'Juntando...' : `Juntar ${items.length || ''} PDFs`}
        </button>
        {items.length < 2 && (
          <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            Adicione pelo menos 2 arquivos.
          </span>
        )}
      </div>

      {error && (
        <p className="mt-3 text-sm" style={{ color: '#e05252' }}>
          {error}
        </p>
      )}

      {resultUrl && (
        <a
          href={resultUrl}
          download="documento-unido.pdf"
          className="mt-4 inline-block rounded-lg px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
          style={{ background: 'var(--color-accent)' }}
        >
          Baixar PDF unido
        </a>
      )}
    </div>
  );
}
