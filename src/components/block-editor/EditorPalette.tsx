import Icon from "@/components/ui/icon";
import { BlockType, BLOCK_DEFS, PALETTE_ORDER } from "./types";

interface EditorPaletteProps {
  selectedId: string | null;
  selectedText: string | undefined;
  onDragStart: (type: BlockType) => void;
  onDragEnd: () => void;
  onDelete: () => void;
  onClear: () => void;
}

export function EditorPalette({
  selectedId,
  selectedText,
  onDragStart,
  onDragEnd,
  onDelete,
  onClear,
}: EditorPaletteProps) {
  return (
    <div style={{
      width: 200,
      minWidth: 200,
      background: "#0D0D15",
      borderRight: "1px solid #ffffff15",
      display: "flex",
      flexDirection: "column",
      padding: "16px 12px",
      gap: 8,
      overflowY: "auto",
    }}>
      <div style={{ color: "#ffffff60", fontSize: 11, fontWeight: 700, letterSpacing: 2, marginBottom: 8 }}>
        БЛОКИ
      </div>

      {PALETTE_ORDER.map((type) => {
        const def = BLOCK_DEFS[type];
        return (
          <div
            key={type}
            draggable
            onDragStart={() => onDragStart(type)}
            onDragEnd={onDragEnd}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              borderRadius: 12,
              border: `1.5px solid ${def.color}50`,
              background: def.bg,
              cursor: "grab",
              transition: "all 0.15s",
              userSelect: "none",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = def.color;
              (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 12px ${def.color}40`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = def.color + "50";
              (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
            }}
          >
            <Icon name={def.icon as Parameters<typeof Icon>[0]["name"]} size={16} style={{ color: def.color, flexShrink: 0 }} />
            <span style={{ color: def.color, fontSize: 13, fontWeight: 600 }}>{def.label}</span>
          </div>
        );
      })}

      <div style={{ marginTop: 16, borderTop: "1px solid #ffffff10", paddingTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ color: "#ffffff40", fontSize: 11, fontWeight: 700, letterSpacing: 2, marginBottom: 4 }}>
          ПРАВКА
        </div>
        <button
          onClick={onDelete}
          disabled={!selectedId}
          style={{
            padding: "9px 12px",
            borderRadius: 10,
            border: "1.5px solid #FF5C8A40",
            background: selectedId ? "#FF5C8A20" : "#ffffff08",
            color: selectedId ? "#FF5C8A" : "#ffffff30",
            fontSize: 13,
            fontWeight: 600,
            cursor: selectedId ? "pointer" : "not-allowed",
            display: "flex", alignItems: "center", gap: 8,
            transition: "all 0.15s",
          }}
        >
          <Icon name="Trash2" size={14} />
          Удалить блок
        </button>
        <button
          onClick={onClear}
          style={{
            padding: "9px 12px",
            borderRadius: 10,
            border: "1.5px solid #ffffff20",
            background: "#ffffff08",
            color: "#ffffff50",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            display: "flex", alignItems: "center", gap: 8,
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#ffffff50"; }}
        >
          <Icon name="RotateCcw" size={14} />
          Очистить всё
        </button>
      </div>

      {/* Подсказка */}
      <div style={{
        marginTop: "auto",
        padding: "12px",
        borderRadius: 12,
        background: "#7C4DFF15",
        border: "1px solid #7C4DFF30",
        fontSize: 11,
        color: "#ffffff50",
        lineHeight: 1.5,
      }}>
        Перетащи блок на холст. Двойной клик — редактировать текст.
      </div>

      {selectedId && selectedText && (
        <div style={{
          padding: "8px 12px",
          borderRadius: 10,
          background: "#7C4DFF20",
          border: "1px solid #7C4DFF50",
          fontSize: 12,
          color: "#B39DFF",
        }}>
          выбран: {selectedText}
        </div>
      )}
    </div>
  );
}
