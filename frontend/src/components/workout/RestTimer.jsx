import { useState, useEffect } from "react";
import { colors, typography } from "../../theme";

export default function RestTimer({
  seconds = 90,
  onComplete,
  onSkip,
  onAddTime,
}) {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete?.();
      return;
    }
    const t = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, onComplete]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <div
      style={{
        background: colors.AMBER_DIM,
        border: `0.5px solid ${colors.AMBER_GLOW}`,
        borderRadius: 16,
        padding: "14px 16px",
        margin: "0 14px 10px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 800,
            color: colors.AMBER,
            letterSpacing: 0.5,
          }}
        >
          REST TIMER
        </div>
        <div
          style={{
            fontSize: 30,
            fontWeight: 800,
            color: colors.AMBER,
            fontFamily: typography.FONT_MONO,
          }}
        >
          {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
        </div>
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        <button
          onClick={() => {
            onAddTime?.();
            setTimeLeft((t) => t + 30);
          }}
          style={{
            background: "#F5A62322",
            border: `0.5px solid ${colors.AMBER_GLOW}`,
            borderRadius: 8,
            padding: "6px 11px",
            fontSize: 11,
            fontWeight: 800,
            color: colors.AMBER,
            cursor: "pointer",
          }}
        >
          +30s
        </button>
        <button
          onClick={onSkip}
          style={{
            background: "#F5A62322",
            border: `0.5px solid ${colors.AMBER_GLOW}`,
            borderRadius: 8,
            padding: "6px 11px",
            fontSize: 11,
            fontWeight: 800,
            color: colors.AMBER,
            cursor: "pointer",
          }}
        >
          Skip
        </button>
      </div>
    </div>
  );
}
