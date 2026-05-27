import { BlockDef } from "./types";

// ───── SVG-форма блока ─────
export function BlockShape({ def, text, selected, onEdit }: {
  def: BlockDef;
  text: string;
  selected: boolean;
  onEdit: () => void;
}) {
  const W = 200;
  const H = def.shape === "diamond" ? 70 : 52;

  const glow = selected
    ? `0 0 0 2px ${def.color}, 0 0 20px ${def.color}60`
    : `0 0 12px ${def.color}30`;

  const shapeStyle: React.CSSProperties = {
    position: "relative",
    width: W,
    minHeight: H,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    userSelect: "none",
    boxShadow: glow,
    transition: "box-shadow 0.15s",
  };

  const innerStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    border: `2px solid ${def.color}`,
    background: def.bg,
    borderRadius:
      def.shape === "oval" ? 999 :
      def.shape === "diamond" ? 0 :
      def.shape === "parallelogram" ? 8 : 10,
    transform: def.shape === "diamond" ? "rotate(45deg) scale(0.7)" : "none",
  };

  return (
    <div style={shapeStyle} onDoubleClick={onEdit}>
      <div style={innerStyle} />
      <span
        style={{
          position: "relative",
          zIndex: 1,
          color: def.color,
          fontWeight: 700,
          fontSize: 13,
          textAlign: "center",
          padding: "0 12px",
          fontFamily: "monospace",
          maxWidth: 180,
          wordBreak: "break-word",
        }}
      >
        {text}
      </span>
    </div>
  );
}

// ───── Коннектор (стрелка вниз) ─────
export function Connector({ color = "#ffffff30", label }: { color?: string; label?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
      {label && (
        <span style={{ fontSize: 11, color, fontFamily: "monospace", marginBottom: 2 }}>{label}</span>
      )}
      <div style={{ width: 2, height: 24, background: color }} />
      <div style={{
        width: 0, height: 0,
        borderLeft: "6px solid transparent",
        borderRight: "6px solid transparent",
        borderTop: `8px solid ${color}`,
        marginTop: -1,
      }} />
    </div>
  );
}
