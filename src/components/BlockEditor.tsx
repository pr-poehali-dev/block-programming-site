import { useState, useCallback } from "react";
import { BlockInstance, BlockType, DEFAULT_CHAIN, newId } from "./block-editor/types";
import { BlockChain } from "./block-editor/BlockChain";
import { EditorPalette } from "./block-editor/EditorPalette";

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
    if (blocks.length === 1) return;

    setBlocks((prev) => {
      const next = prev.filter((b) => b.id !== selectedId);
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

    const newBlock: BlockInstance = {
      id: newId(),
      type: draggingType,
      text: draggingType === "start" ? "Начало"
          : draggingType === "end" ? "Конец"
          : draggingType === "action" ? "Действие"
          : draggingType === "condition" ? "Условие"
          : draggingType === "loop" ? "Цикл"
          : draggingType === "input" ? "Ввод"
          : "Вывод",
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
        }
        if (position === "before") {
          if (b.nextId === targetId)      return { ...b, nextId: newBlock.id };
          if (b.branchYesId === targetId) return { ...b, branchYesId: newBlock.id };
          if (b.branchNoId === targetId)  return { ...b, branchNoId: newBlock.id };
        }
        return b;
      }).map((b) => {
        if (b.id === newBlock.id && position === "before") {
          return { ...b, nextId: targetId };
        }
        return b;
      });
    });

    setDraggingType(null);
  }, [draggingType]);

  const blockCount = blocks.length;
  const selectedBlock = blocks.find((b) => b.id === selectedId);

  return (
    <div style={{ display: "flex", height: "100%", minHeight: 0, fontFamily: "'Golos Text', sans-serif" }}>

      {/* ── Панель палитры ── */}
      <EditorPalette
        selectedId={selectedId}
        selectedText={selectedBlock?.text}
        onDragStart={setDraggingType}
        onDragEnd={() => setDraggingType(null)}
        onDelete={deleteSelected}
        onClear={clearAll}
      />

      {/* ── Холст ── */}
      <div
        style={{
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
        <div style={{ position: "absolute", top: 16, right: 16, display: "flex", gap: 12, alignItems: "center" }}>
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
