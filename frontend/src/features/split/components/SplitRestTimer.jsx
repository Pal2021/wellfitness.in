import { useEffect, useState } from 'react';
import { Clock3, RotateCcw } from 'lucide-react';

const INITIAL_SECONDS = 90;

function formatTime(seconds) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

export default function SplitRestTimer() {
  const [duration, setDuration] = useState(INITIAL_SECONDS);
  const [remaining, setRemaining] = useState(INITIAL_SECONDS);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running || remaining === 0) return undefined;
    const timer = window.setInterval(() => setRemaining((seconds) => Math.max(0, seconds - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [running, remaining]);

  const toggle = () => {
    if (remaining === 0) setRemaining(duration);
    setRunning((value) => !value || remaining === 0);
  };

  const adjust = (seconds) => {
    const next = Math.max(0, remaining + seconds);
    setRemaining(next);
    if (next > duration) setDuration(next);
  };

  const reset = () => {
    setRunning(false);
    setRemaining(duration);
  };

  return (
    <details className="group rounded-2xl border p-4 sm:p-5" style={{ background: 'var(--color-bg-card)', borderColor: 'var(--color-border)' }}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-bold [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-2"><Clock3 size={18} className="text-amber-500" aria-hidden="true" /> Rest timer</span>
        <span className="text-sm tabular-nums text-amber-500">{formatTime(remaining)}</span>
      </summary>
      <div className="mt-5 border-t pt-5" style={{ borderColor: 'var(--color-border)' }}>
        <div role="timer" aria-label="Rest time remaining" className="mb-4 text-center text-4xl font-black tabular-nums">{formatTime(remaining)}</div>
        <div className="mb-5 h-2 overflow-hidden rounded-full bg-amber-500/10"><div className="h-full rounded-full bg-amber-500 transition-[width]" style={{ width: `${(remaining / duration) * 100}%` }} /></div>
        <div className="grid grid-cols-4 gap-2">
          <button type="button" onClick={() => adjust(-30)} className="min-h-11 rounded-xl border text-xs font-bold" style={{ borderColor: 'var(--color-border)' }}>−30s</button>
          <button type="button" onClick={toggle} className="min-h-11 rounded-xl bg-amber-500 text-xs font-extrabold text-black">{running && remaining > 0 ? 'Pause' : 'Start'}</button>
          <button type="button" onClick={reset} aria-label="Reset timer" className="flex min-h-11 items-center justify-center rounded-xl border" style={{ borderColor: 'var(--color-border)' }}><RotateCcw size={16} /></button>
          <button type="button" onClick={() => adjust(30)} className="min-h-11 rounded-xl border text-xs font-bold" style={{ borderColor: 'var(--color-border)' }}>+30s</button>
        </div>
      </div>
    </details>
  );
}
