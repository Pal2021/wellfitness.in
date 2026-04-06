import { colors } from "../../theme";
export default function SectionLabel({ label }) {
  return (
    <div
      style={{
        fontSize: 10,
        fontWeight: 800,
        color: colors.TEXT_TERTIARY,
        letterSpacing: 1,
        textTransform: "uppercase",
        margin: "14px 16px 8px",
      }}
    >
      {label}
    </div>
  );
}
