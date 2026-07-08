import { useState } from 'react';
import Dropzone from './shared/Dropzone';

// Usa a mesma biblioteca "pdf-lib" da ferramenta de juntar PDF: ela sabe
// criar um PDF do zero e colar imagens dentro dele, uma por página.
// Tudo roda no navegador do usuário.

interface ImageItem {
  file: File;
  id: string;
}

export default function ImageToPdf() {
  const [items, setItems] = useState<ImageItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function addFiles(fileList: FileList | File[]) {
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

  async function convert() {
    if (items.length === 0) return;
    setIsProcessing(true);
    setError(null);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const pdfDoc = await PDFDocument.create();

      for (const item of items) {
        const bytes = await item.file.arrayBuffer();
        const isPng = item.file.type === 'image/png';
        const image = isPng ? await pdfDoc.embedPng(bytes) : await pdfDoc.embedJpg(bytes);
        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setResultUrl(URL.createObjectURL(blob));
    } catch (err) {
      setError('Não foi possível converter essas imagens. Use apenas arquivos JPG ou PNG.');
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div
      className="rounded-xl border p-5 sm:p-6"
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
    >
      <Dropzone accept="image/png, image/jpeg" multiple onFiles={addFiles} hint="Solte quantas imagens quiser, uma por página" />

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
          onClick={convert}
          disabled={items.length === 0 || isProcessing}
          className="rounded-lg px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
          style={{ background: 'var(--color-accent)' }}
        >
          {isProcessing ? 'Convertendo...' : `Converter ${items.length || ''} imagem(ns) para PDF`}
        </button>
      </div>

      {error && (
        <p className="mt-3 text-sm" style={{ color: '#e05252' }}>
          {error}
        </p>
      )}

      {resultUrl && (
        <a
          href={resultUrl}
          download="imagens-convertidas.pdf"
          className="mt-4 inline-block rounded-lg px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
          style={{ background: 'var(--color-accent)' }}
        >
          Baixar PDF
        </a>
      )}
    </div>
  );
}
