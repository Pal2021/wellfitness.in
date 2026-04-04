import { useState } from 'react';
import { colors, typography } from '../theme';

export default function SetRow({ setNumber, previousWeight, previousReps, targetWeight, targetReps,
  isDone, isPR, onComplete }) {

  const [weight, setWeight] = useState(targetWeight || '');
  const [reps, setReps] = useState(targetReps || '');
  const [done, setDone] = useState(isDone || false);

  const cellBase = {
    borderRadius: 9, padding: '8px 6px', textAlign: 'center',
    fontFamily: typography.FONT_MONO, fontSize: 14, fontWeight: 800,
    border: `0.5px solid ${colors.BORDER_DEFAULT}`, width: '100%',
    outline: 'none',
  };

  const handleComplete = () => {
    if (!weight || !reps) return;
    setDone(true);
    onComplete?.(Number(weight), Number(reps));
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 14px', marginBottom: 5 }}>
      {/* Set number */}
      <div style={{ width: 28, fontSize: 10, fontWeight: 800, color: colors.TEXT_TERTIARY, fontFamily: typography.FONT_MONO }}>
        S{setNumber}
      </div>

      {/* Last time — shows what user did last session */}
      <div style={{
        ...cellBase, flex: 1, cursor: 'default',
        background: done ? colors.GREEN_DIM : colors.BG_TERTIARY,
        color: done ? colors.GREEN : colors.TEXT_SECONDARY,
        border: done ? `0.5px solid #34D39922` : cellBase.border,
        fontSize: 11, position: 'relative',
      }}>
        {previousWeight ? (
          <div>
            <div style={{ fontWeight: 800, fontSize: 13 }}>{previousWeight}<span style={{ fontSize: 10, opacity: 0.7 }}>kg</span></div>
            <div style={{ fontSize: 9, opacity: 0.6, marginTop: 1 }}>×{previousReps} reps</div>
          </div>
        ) : (
          <div style={{ fontSize: 10, color: colors.TEXT_TERTIARY }}>1st time</div>
        )}
      </div>

      {/* Weight input */}
      <input
        type="number"
        value={weight}
        onChange={e => setWeight(e.target.value)}
        placeholder="kg"
        disabled={done}
        style={{
          ...cellBase, flex: 1,
          background: done ? colors.GREEN_DIM : (targetWeight ? colors.AMBER_DIM : colors.BG_TERTIARY),
          color: done ? colors.GREEN : (targetWeight ? colors.AMBER : colors.TEXT_PRIMARY),
          border: done ? `0.5px solid #34D39922` : (targetWeight ? `1px dashed #F5A62355` : cellBase.border),
          opacity: done ? 0.7 : 1,
        }}
      />

      {/* Reps input */}
      <input
        type="number"
        value={reps}
        onChange={e => setReps(e.target.value)}
        placeholder="reps"
        disabled={done}
        style={{
          ...cellBase, flex: 1,
          background: done ? colors.GREEN_DIM : (targetReps ? colors.AMBER_DIM : colors.BG_TERTIARY),
          color: done ? colors.GREEN : (targetReps ? colors.AMBER : colors.TEXT_PRIMARY),
          border: done ? `0.5px solid #34D39922` : (targetReps ? `1px dashed #F5A62355` : cellBase.border),
          opacity: done ? 0.7 : 1,
        }}
      />

      {/* Complete button */}
      <div onClick={handleComplete} style={{
        width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: done ? 'default' : 'pointer', fontSize: 14, transition: 'all 0.2s',
        background: done ? colors.GREEN_DIM : colors.BG_TERTIARY,
        border: `0.5px solid ${done ? '#34D39933' : colors.BORDER_DEFAULT}`,
        color: done ? colors.GREEN : colors.TEXT_TERTIARY,
        animation: done ? 'scaleIn 0.3s ease' : 'none',
      }}>
        {done ? '✓' : '○'}
      </div>
    </div>
  );
}
