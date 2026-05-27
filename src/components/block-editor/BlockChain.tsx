import { useState } from "react";
import { BlockInstance, BLOCK_DEFS } from "./types";
import { BlockShape, Connector } from "./BlockShape";

// ───── Зона для дропа ─────
export function DropZone({
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

// ───── Рекурсивный рендер цепочки ─────
export function BlockChain({
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
