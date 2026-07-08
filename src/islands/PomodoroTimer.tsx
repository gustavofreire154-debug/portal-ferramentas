import { useEffect, useRef, useState } from 'react';

export default function PomodoroTimer() {
  const [focusMinutes, setFocusMinutes] = useState('25');
  const [breakMinutes, setBreakMinutes] = useState('5');
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [cycles, setCycles] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev > 1) return prev - 1;

        // Ciclo acabou: troca de modo e reinicia a contagem no novo modo.
        const nextMode = mode === 'focus' ? 'break' : 'focus';
        setMode(nextMode);
        if (mode === 'focus') setCycles((c) => c + 1);
        const nextMinutes = nextMode === 'focus' ? focusMinutes : breakMinutes;
        return (parseInt(nextMinutes, 10) || 1) * 60;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, mode, focusMinutes, breakMinutes]);

  function start() {
    setRunning(true);
  }

  function pause() {
    setRunning(false);
  }

  function reset() {
    setRunning(false);
    setMode('focus');
    setCycles(0);
    setSecondsLeft((parseInt(focusMinutes, 10) || 25) * 60);
  }

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');

  return (
    <div
      className="rounded-xl border p-5 sm:p-6"
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
    >
      <div className="flex flex-wrap gap-4 text-sm">
        <label className="flex flex-col gap-1.5">
          <span style={{ color: 'var(--color-text-muted)' }}>Foco (min)</span>
          <input
            type="text"
            inputMode="numeric"
            disabled={running}
            value={focusMinutes}
            onChange={(e) => {
              setFocusMinutes(e.target.value);
              if (mode === 'focus') setSecondsLeft((parseInt(e.target.value, 10) || 1) * 60);
            }}
            className="w-20 rounded-lg border px-3 py-2 outline-none focus:border-[var(--color-accent)] disabled:opacity-50"
            style={{ borderColor: 'var(--color-border)' }}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span style={{ color: 'var(--color-text-muted)' }}>Pausa (min)</span>
          <input
            type="text"
            inputMode="numeric"
            disabled={running}
            value={breakMinutes}
            onChange={(e) => setBreakMinutes(e.target.value)}
            className="w-20 rounded-lg border px-3 py-2 outline-none focus:border-[var(--color-accent)] disabled:opacity-50"
            style={{ borderColor: 'var(--color-border)' }}
          />
        </label>
      </div>

      <div className="mt-6 rounded-lg p-6 text-center" style={{ background: 'var(--color-accent-soft)' }}>
        <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--color-text-muted)' }}>
          {mode === 'focus' ? 'Foco' : 'Pausa'}
        </p>
        <p className="font-display mt-1 text-5xl font-bold" style={{ color: 'var(--color-accent)' }}>
          {mm}:{ss}
        </p>
        <p className="mt-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
          Ciclos completos: {cycles}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        {!running ? (
          <button
            onClick={start}
            className="rounded-lg px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
            style={{ background: 'var(--color-accent)' }}
          >
            Iniciar
          </button>
        ) : (
          <button
            onClick={pause}
            className="rounded-lg px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
            style={{ background: 'var(--color-accent)' }}
          >
            Pausar
          </button>
        )}
        <button
          onClick={reset}
          className="rounded-lg px-4 py-2 text-sm font-medium transition"
          style={{ background: 'var(--color-accent-soft)', color: 'var(--color-text-muted)' }}
        >
          Reiniciar
        </button>
      </div>
    </div>
  );
}
