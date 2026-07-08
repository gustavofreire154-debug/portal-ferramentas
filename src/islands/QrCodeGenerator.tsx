import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';

export default function QrCodeGenerator() {
  const [text, setText] = useState('https://seusite.com.br');
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (!text.trim()) {
      setError(null);
      const ctx = canvasRef.current.getContext('2d');
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      return;
    }
    QRCode.toCanvas(canvasRef.current, text, { width: 240, margin: 1 }, (err) => {
      setError(err ? 'Não foi possível gerar o QR Code para este texto.' : null);
    });
  }, [text]);

  function download() {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  }

  return (
    <div
      className="rounded-xl border p-5 sm:p-6"
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
    >
      <label className="flex flex-col gap-1.5 text-sm">
        <span style={{ color: 'var(--color-text-muted)' }}>Link ou texto</span>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full rounded-lg border px-3 py-2 outline-none focus:border-[var(--color-accent)]"
          style={{ borderColor: 'var(--color-border)' }}
        />
      </label>

      {error && (
        <p className="mt-3 text-xs" style={{ color: '#e05252' }}>
          {error}
        </p>
      )}

      <div className="mt-6 flex flex-col items-center gap-4 rounded-lg p-6" style={{ background: 'var(--color-accent-soft)' }}>
        <canvas ref={canvasRef} className="rounded-lg" />
        <button
          onClick={download}
          disabled={!text.trim()}
          className="rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-50"
          style={{ background: 'var(--color-surface)' }}
        >
          Baixar PNG
        </button>
      </div>
    </div>
  );
}
