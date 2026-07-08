import { useRef, useState } from 'react';

interface DropzoneProps {
  accept: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  hint?: string;
}

// Área de arrastar-e-soltar reaproveitada por toda ferramenta que recebe
// arquivo (PDF, imagem...). Continua aceitando clique pra abrir o seletor
// nativo — o arrastar é um atalho a mais, não uma troca.
function matchesAccept(file: File, accept: string): boolean {
  const patterns = accept.split(',').map((p) => p.trim()).filter(Boolean);
  if (patterns.length === 0) return true;
  return patterns.some((pattern) => {
    if (pattern.endsWith('/*')) return file.type.startsWith(pattern.slice(0, -1));
    if (pattern.startsWith('.')) return file.name.toLowerCase().endsWith(pattern.toLowerCase());
    return file.type === pattern;
  });
}

export default function Dropzone({ accept, multiple = false, onFiles, hint }: DropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  function acceptValid(files: FileList | File[]) {
    const list = Array.from(files).filter((file) => matchesAccept(file, accept));
    return multiple ? list : list.slice(0, 1);
  }

  function handleDrop(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setIsDragging(false);
    const valid = acceptValid(e.dataTransfer.files);
    if (valid.length > 0) onFiles(valid);
  }

  return (
    <label
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 text-center transition"
      style={{
        borderColor: isDragging ? 'var(--color-accent)' : 'var(--color-border)',
        background: isDragging ? 'var(--color-accent-soft)' : 'var(--color-bg)',
      }}
    >
      <span className="text-2xl">📂</span>
      <span className="text-sm font-medium">
        {isDragging ? 'Solte os arquivos aqui' : 'Arraste os arquivos aqui ou clique para selecionar'}
      </span>
      {hint && (
        <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
          {hint}
        </span>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => {
          if (e.target.files) {
            const valid = acceptValid(e.target.files);
            if (valid.length > 0) onFiles(valid);
          }
          e.target.value = '';
        }}
        className="hidden"
      />
    </label>
  );
}
