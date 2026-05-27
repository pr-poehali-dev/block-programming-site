import { useState, useRef, useCallback } from "react";
import Icon from "@/components/ui/icon";

// ───── Типы ─────
type BlockType =
  | "start"
  | "end"
  | "action"
  | "condition"
  | "loop"
  | "input"
  | "output";

interface BlockDef {
  type: BlockType;
  label: string;
  color: string;
  bg: string;
  icon: string;
  hasInput: boolean;   // принимает ли блок «вход» сверху
  hasOutput: boolean;  // имеет ли «выход» снизу
  hasBranch: boolean;  // имеет ли ветку Да/Нет (условие)
  shape: "rect" | "diamond" | "oval" | "parallelogram";
}

const BLOCK_DEFS: Record<BlockType, BlockDef> = {
  start:     { type: "start",     label: "Начало",      color: "#00FF94", bg: "#00FF9420", icon: "Play",         hasInput: false, hasOutput: true,  hasBranch: false, shape: "oval" },
  end:       { type: "end",       label: "Конец",       color: "#FF5C8A", bg: "#FF5C8A20", icon: "Square",       hasInput: true,  hasOutput: false, hasBranch: false, shape: "oval" },
  action:    { type: "action",    label: "Действие",    color: "#7C4DFF", bg: "#7C4DFF20", icon: "Zap",          hasInput: true,  hasOutput: true,  hasBranch: false, shape: "rect" },
  condition: { type: "condition", label: "Условие",     color: "#FFD600", bg: "#FFD60020", icon: "GitBranch",    hasInput: true,  hasOutput: false, hasBranch: true,  shape: "diamond" },
  loop:      { type: "loop",      label: "Цикл",        color: "#FF9800", bg: "#FF980020", icon: "RefreshCw",    hasInput: true,  hasOutput: true,  hasBranch: false, shape: "rect" },
  input:     { type: "input",     label: "Ввод",        color: "#00BCD4", bg: "#00BCD420", icon: "ArrowDown",    hasInput: true,  hasOutput: true,  hasBranch: false, shape: "parallelogram" },
  output:    { type: "output",    label: "Вывод",       color: "#4CAF50", bg: "#4CAF5020", icon: "ArrowUp",      hasInput: true,  hasOutput: true,  hasBranch: false, shape: "parallelogram" },
};

const PALETTE_ORDER: BlockType[] = ["start", "action", "condition", "loop", "input", "output", "end"];

// ───── Экземпляр блока на холсте ─────
interface BlockInstance {
  id: string;
  type: BlockType;
  text: string;       // редактируемый текст
  nextId: string | null;       // основной выход (вниз)
  branchYesId: string | null;  // ветка «Да»
  branchNoId: string | null;   // ветка «Нет»
}

let idCounter = 1;
const newId = () => `b${idCounter++}`;

const DEFAULT_CHAIN: BlockInstance[] = [
  { id: "b0", type: "start", text: "Начало", nextId: null, branchYesId: null, branchNoId: null },
];
idCounter = 1;

// ───── SVG-форма блока ─────
function BlockShape({ def, text, selected, onEdit }: {
  def: BlockDef;
  text: string;
  selected: boolean;
  onEdit: () => void;
}) {
  const W = 200;
  const H = def.shape === "diamond" ? 70 : 52;

  const glow = selected ? `0 0 0 2px ${def.color}, 0 0 20px ${def.color}60` : `0 0 12px ${def.color}30`;

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
function Connector({ color = "#ffffff30", label }: { color?: string; label?: string }) {
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

// ───── Рекурсивный рендер цепочки ─────
function BlockChain({
  id,
  blocks,
  selectedId,
  onSelect,
  onDrop,
  onEdit,
  depth = 0,
}: {
  id: string | null;
  blocks: BlockInstance[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDrop: (targetId: string, position: "before" | "after" | "yes" | "no") => void;
  onEdit: (id: string) => void;
  depth?: number;
}) {
  if (!id) return null;
  const block = blocks.find((b) => b.id === id);
  if (!block) return null;
  const def = BLOCK_DEFS[block.type];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Зона для дропа «перед» блоком */}
      <DropZone targetId={id} position="before" onDrop={onDrop} />

      {/* Сам блок */}
      <div
        onClick={() => onSelect(id)}
        style={{ position: "relative" }}
      >
        <BlockShape
          def={def}
          text={block.text}
          selected={selectedId === id}
          onEdit={() => onEdit(id)}
        />
      </div>

      {/* Ветки для условия */}
      {def.hasBranch ? (
        <div style={{ display: "flex", gap: 40, marginTop: 0, alignItems: "flex-start" }}>
          {/* Ветка ДА */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Connector color="#00FF9480" label="Да" />
            <BlockChain id={block.branchYesId} blocks={blocks} selectedId={selectedId} onSelect={onSelect} onDrop={onDrop} onEdit={onEdit} depth={depth + 1} />
            {!block.branchYesId && <DropZone targetId={id} position="yes" onDrop={onDrop} empty />}
          </div>
          {/* Ветка НЕТ */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Connector color="#FF5C8A80" label="Нет" />
            <BlockChain id={block.branchNoId} blocks={blocks} selectedId={selectedId} onSelect={onSelect} onDrop={onDrop} onEdit={onEdit} depth={depth + 1} />
            {!block.branchNoId && <DropZone targetId={id} position="no" onDrop={onDrop} empty />}
          </div>
        </div>
      ) : (
        <>
          {def.hasOutput && <Connector />}
          {def.hasOutput && (
            <BlockChain id={block.nextId} blocks={blocks} selectedId={selectedId} onSelect={onSelect} onDrop={onDrop} onEdit={onEdit} depth={depth} />
          )}
          {def.hasOutput && !block.nextId && <DropZone targetId={id} position="after" onDrop={onDrop} empty />}
        </>
      )}
    </div>
  );
}

// ───── Зона для дропа ─────
function DropZone({
  targetId,
  position,
  onDrop,
  empty,
}: {
  targetId: string;
  position: "before" | "after" | "yes" | "no";
  onDrop: (targetId: string, position: "before" | "after" | "yes" | "no") => void;
  empty?: boolean;
}) {
  const [over, setOver] = useState(false);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); onDrop(targetId, position); }}
      style={{
        width: empty ? 160 : 200,
        height: empty ? 48 : 10,
        borderRadius: 12,
        border: over ? "2px dashed #7C4DFF" : empty ? "2px dashed #ffffff20" : "none",
        background: over ? "#7C4DFF20" : empty ? "#ffffff08" : "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: empty ? "4px 0" : 0,
        transition: "all 0.15s",
        cursor: "copy",
      }}
    >
      {empty && (
        <span style={{ color: over ? "#7C4DFF" : "#ffffff30", fontSize: 12, fontFamily: "monospace" }}>
          {position === "yes" ? "+ Да" : position === "no" ? "+ Нет" : "+ блок"}
        </span>
      )}
    </div>
  );
}

// ───── Главный редактор ─────
export default function BlockEditor() {
  const [blocks, setBlocks] = useState<BlockInstance[]>(DEFAULT_CHAIN);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [draggingType, setDraggingType] = useState<BlockType | null>(null);

  // ── Выбор ──
  const handleSelect = useCallback((id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  }, []);

  // ── Редактирование текста ──
  const handleEdit = useCallback((id: string) => {
    const b = blocks.find((x) => x.id === id);
    if (!b) return;
    setEditingId(id);
    setEditText(b.text);
  }, [blocks]);

  const commitEdit = () => {
    if (!editingId) return;
    setBlocks((prev) => prev.map((b) => b.id === editingId ? { ...b, text: editText } : b));
    setEditingId(null);
  };

  // ── Удаление выбранного блока ──
  const deleteSelected = () => {
    if (!selectedId) return;
    const target = blocks.find((b) => b.id === selectedId);
    if (!target) return;
    // нельзя удалить первый блок-начало если он один
    if (blocks.length === 1) return;

    setBlocks((prev) => {
      const next = prev.filter((b) => b.id !== selectedId);
      // убираем ссылки на удалённый блок
      return next.map((b) => ({
        ...b,
        nextId: b.nextId === selectedId ? (target.nextId) : b.nextId,
        branchYesId: b.branchYesId === selectedId ? null : b.branchYesId,
        branchNoId: b.branchNoId === selectedId ? null : b.branchNoId,
      }));
    });
    setSelectedId(null);
  };

  // ── Очистить всё ──
  const clearAll = () => {
    setBlocks([{ id: "b_start_new", type: "start", text: "Начало", nextId: null, branchYesId: null, branchNoId: null }]);
    setSelectedId(null);
  };

  // ── Дроп с палитры ──
  const handleDrop = useCallback((targetId: string, position: "before" | "after" | "yes" | "no") => {
    if (!draggingType) return;

    const def = BLOCK_DEFS[draggingType];
    const newBlock: BlockInstance = {
      id: newId(),
      type: draggingType,
      text: def.label,
      nextId: null,
      branchYesId: null,
      branchNoId: null,
    };

    setBlocks((prev) => {
      const updated = [...prev, newBlock];

      return updated.map((b) => {
        if (b.id === targetId) {
          if (position === "yes") return { ...b, branchYesId: newBlock.id };
          if (position === "no")  return { ...b, branchNoId: newBlock.id };
          if (position === "after") return { ...b, nextId: newBlock.id };
          // before — ставим новый блок перед target, перенаправляем из parent
        }
        // для "before": ищем parent, указывающий на target, и переключаем на newBlock
        if (position === "before") {
          if (b.nextId === targetId)      return { ...b, nextId: newBlock.id };
          if (b.branchYesId === targetId) return { ...b, branchYesId: newBlock.id };
          if (b.branchNoId === targetId)  return { ...b, branchNoId: newBlock.id };
        }
        return b;
      }).map((b) => {
        // для before — связываем новый блок с target
        if (b.id === newBlock.id && position === "before") {
          return { ...b, nextId: targetId };
        }
        return b;
      });
    });

    setDraggingType(null);
  }, [draggingType]);

  // ── Счётчик блоков ──
  const blockCount = blocks.length;

  return (
    <div style={{ display: "flex", height: "100%", minHeight: 0, fontFamily: "'Golos Text', sans-serif" }}>

      {/* ── Панель палитры ── */}
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
              onDragStart={() => setDraggingType(type)}
              onDragEnd={() => setDraggingType(null)}
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
            onClick={deleteSelected}
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
            onClick={clearAll}
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
      </div>

      {/* ── Холст ── */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        overflowX: "auto",
        background: "radial-gradient(circle at 50% 0%, #1a0a3320 0%, transparent 60%), #0A0A0F",
        backgroundImage: `
          radial-gradient(circle at 50% 0%, #1a0a3320 0%, transparent 60%),
          linear-gradient(#ffffff05 1px, transparent 1px),
          linear-gradient(90deg, #ffffff05 1px, transparent 1px)
        `,
        backgroundSize: "100% 100%, 32px 32px, 32px 32px",
        padding: "48px 24px",
        position: "relative",
      }}
        onClick={() => setSelectedId(null)}
      >
        {/* Статус-бар */}
        <div style={{
          position: "absolute",
          top: 16,
          right: 16,
          display: "flex",
          gap: 12,
          alignItems: "center",
        }}>
          <span style={{
            background: "#ffffff08",
            border: "1px solid #ffffff15",
            borderRadius: 8,
            padding: "5px 12px",
            fontSize: 12,
            color: "#ffffff50",
          }}>
            {blockCount} блоков
          </span>
          {selectedId && (
            <span style={{
              background: "#7C4DFF20",
              border: "1px solid #7C4DFF50",
              borderRadius: 8,
              padding: "5px 12px",
              fontSize: 12,
              color: "#B39DFF",
            }}>
              выбран: {blocks.find((b) => b.id === selectedId)?.text}
            </span>
          )}
        </div>

        {/* Схема */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{ display: "inline-block", minWidth: 240 }}
        >
          <BlockChain
            id={blocks[0]?.id ?? null}
            blocks={blocks}
            selectedId={selectedId}
            onSelect={handleSelect}
            onDrop={handleDrop}
            onEdit={handleEdit}
          />
        </div>
      </div>

      {/* ── Модалка редактирования текста ── */}
      {editingId && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 100,
            background: "#00000080",
            backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
          onClick={commitEdit}
        >
          <div
            style={{
              background: "#12121A",
              border: "1px solid #ffffff20",
              borderRadius: 20,
              padding: 28,
              minWidth: 320,
              boxShadow: "0 24px 80px #00000080",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 16, marginBottom: 16 }}>
              Текст блока
            </div>
            <input
              autoFocus
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") commitEdit(); if (e.key === "Escape") setEditingId(null); }}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 12,
                border: "1.5px solid #7C4DFF80",
                background: "#7C4DFF15",
                color: "#fff",
                fontSize: 14,
                fontFamily: "monospace",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            <div style={{ display: "flex", gap: 10, marginTop: 16, justifyContent: "flex-end" }}>
              <button
                onClick={() => setEditingId(null)}
                style={{ padding: "8px 18px", borderRadius: 10, border: "1px solid #ffffff20", background: "transparent", color: "#ffffff60", cursor: "pointer", fontSize: 13 }}
              >
                Отмена
              </button>
              <button
                onClick={commitEdit}
                style={{ padding: "8px 18px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#7C4DFF,#5B34D4)", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 700 }}
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
