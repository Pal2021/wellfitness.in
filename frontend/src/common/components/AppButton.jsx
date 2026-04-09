import { colors, typography } from "../../theme";

const variants = {
  primary: { bg: colors.AMBER, color: "#000", border: "none" },
  outline: {
    bg: "transparent",
    color: colors.AMBER,
    border: `1px solid ${colors.AMBER}`,
  },
  ghost: {
    bg: colors.BG_TERTIARY,
    color: colors.TEXT_SECONDARY,
    border: `0.5px solid ${colors.BORDER_DEFAULT}`,
  },
  danger: {
    bg: colors.RED_DIM,
    color: colors.RED,
    border: `0.5px solid ${colors.RED}`,
  },
};

export default function AppButton({
  label,
  onClick,
  variant = "primary",
  loading,
  disabled,
  style,
}) {
  const v = variants[variant] || variants.primary;
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        background: v.bg,
        color: v.color,
        border: v.border,
        borderRadius: 16,
        padding: "15px 24px",
        width: "100%",
        fontSize: 15,
        fontWeight: 800,
        fontFamily: typography.FONT_FAMILY,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "all 0.15s ease",
        letterSpacing: 0.2,
        ...style,
      }}
    >
      {loading ? "..." : label}
    </button>
  );
}
