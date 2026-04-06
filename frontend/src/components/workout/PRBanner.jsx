import { colors } from "../../theme";

export default function PRBanner({ exerciseName, weight, reps }) {
  return (
    <div
      style={{
        background: colors.GREEN_DIM,
        border: `0.5px solid #34D39933`,
        borderRadius: 16,
        padding: "12px 15px",
        margin: "0 14px 10px",
        display: "flex",
        gap: 10,
        alignItems: "center",
        animation: "slideDown 0.4s ease",
      }}
    >
      <span style={{ fontSize: 21 }}>🏆</span>
      <div>
        <div style={{ fontSize: 13, fontWeight: 800, color: colors.GREEN }}>
          New PR! 🏆
        </div>
        <div style={{ fontSize: 11, color: colors.GREEN, opacity: 0.7 }}>
          {exerciseName} · {weight}kg × {reps}
        </div>
      </div>
    </div>
  );
}
