import { useState } from 'react';

// Extrai o texto do PDF com "pdfjs-dist" (o motor de PDF do Firefox) e monta
// um arquivo .docx com "docx". Importante: isso extrai só o TEXTO — layout
// complexo, imagens e tabelas do PDF original não são recriados no Word.
// Para PDFs simples (contratos, artigos, relatórios de texto) funciona bem.
// Tudo roda no navegador: o arquivo nunca é enviado a um servidor.

export default function PdfToWord() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setFileName(file.name);
    setResultUrl(null);
    setPageCount(null);
    setError(null);
    setIsProcessing(true);

    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.mjs',
        import.meta.url
      ).href;
      const { Document, Packer, Paragraph, TextRun, PageBreak } = await import('docx');

      const bytes = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;

      const paragraphs: InstanceType<typeof Paragraph>[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();

        let lastY: number | null = null;
        let currentLine = '';
        const lines: string[] = [];

        for (const item of textContent.items) {
          if (!('str' in item)) continue;
          const y = item.transform[5];
          if (lastY !== null && Math.abs(y - lastY) > 2) {
            lines.push(currentLine);
            currentLine = '';
          }
          currentLine += item.str;
          lastY = y;
        }
        if (currentLine) lines.push(currentLine);

        lines.forEach((line) => {
          paragraphs.push(new Paragraph({ children: [new TextRun(line)] }));
        });

        if (i < pdf.numPages) {
          paragraphs.push(new Paragraph({ children: [new PageBreak()] }));
        }
      }

      const doc = new Document({ sections: [{ children: paragraphs }] });
      const blob = await Packer.toBlob(doc);
      setResultUrl(URL.createObjectURL(blob));
      setPageCount(pdf.numPages);
    } catch (err) {
      setError('Não foi possível extrair o texto desse PDF. Confirme se é um arquivo válido e que não é apenas um scaneamento de imagem.');
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
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
        className="block w-full text-sm file:mr-4 file:rounded-lg file:border-0 file:px-4 file:py-2 file:text-sm file:font-medium"
        style={{ color: 'var(--color-text-muted)' }}
      />

      <p className="mt-3 text-xs" style={{ color: 'var(--color-text-muted)' }}>
        Extrai apenas o texto do PDF — layout, imagens e tabelas complexas não são recriados.
      </p>

      {isProcessing && (
        <p className="mt-4 text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Extraindo texto...
        </p>
      )}

      {error && (
        <p className="mt-3 text-sm" style={{ color: '#e05252' }}>
          {error}
        </p>
      )}

      {resultUrl && (
        <div className="mt-5">
          <p className="text-sm" style={{ color: 'var(--color-accent)' }}>
            {pageCount} página(s) convertida(s) com sucesso.
          </p>
          <a
            href={resultUrl}
            download={`${fileName?.replace(/\.pdf$/i, '') || 'documento'}.docx`}
            className="mt-3 inline-block rounded-lg px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
            style={{ background: 'var(--color-accent)' }}
          >
            Baixar .docx
          </a>
        </div>
      )}
    </div>
  );
}
