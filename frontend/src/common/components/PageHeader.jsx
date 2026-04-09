import { colors } from "../../theme";

export default function PageHeader({ title, subtitle, rightElement }) {
  return (
    <div
      style={{
        background: colors.BG_PRIMARY,
        position: "sticky",
        top: 0,
        zIndex: 50,
        padding: "14px 16px 10px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: colors.TEXT_PRIMARY,
              letterSpacing: -0.5,
              margin: 0,
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <div
              style={{
                fontSize: 12,
                color: colors.TEXT_TERTIARY,
                marginTop: 2,
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
        {rightElement && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
}
