// ───── Типы ─────
export type BlockType =
  | "start"
  | "end"
  | "action"
  | "condition"
  | "loop"
  | "input"
  | "output";

export interface BlockDef {
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

export const BLOCK_DEFS: Record<BlockType, BlockDef> = {
  start:     { type: "start",     label: "Начало",   color: "#00FF94", bg: "#00FF9420", icon: "Play",      hasInput: false, hasOutput: true,  hasBranch: false, shape: "oval" },
  end:       { type: "end",       label: "Конец",    color: "#FF5C8A", bg: "#FF5C8A20", icon: "Square",    hasInput: true,  hasOutput: false, hasBranch: false, shape: "oval" },
  action:    { type: "action",    label: "Действие", color: "#7C4DFF", bg: "#7C4DFF20", icon: "Zap",       hasInput: true,  hasOutput: true,  hasBranch: false, shape: "rect" },
  condition: { type: "condition", label: "Условие",  color: "#FFD600", bg: "#FFD60020", icon: "GitBranch", hasInput: true,  hasOutput: false, hasBranch: true,  shape: "diamond" },
  loop:      { type: "loop",      label: "Цикл",     color: "#FF9800", bg: "#FF980020", icon: "RefreshCw", hasInput: true,  hasOutput: true,  hasBranch: false, shape: "rect" },
  input:     { type: "input",     label: "Ввод",     color: "#00BCD4", bg: "#00BCD420", icon: "ArrowDown", hasInput: true,  hasOutput: true,  hasBranch: false, shape: "parallelogram" },
  output:    { type: "output",    label: "Вывод",    color: "#4CAF50", bg: "#4CAF5020", icon: "ArrowUp",   hasInput: true,  hasOutput: true,  hasBranch: false, shape: "parallelogram" },
};

export const PALETTE_ORDER: BlockType[] = ["start", "action", "condition", "loop", "input", "output", "end"];

// ───── Экземпляр блока на холсте ─────
export interface BlockInstance {
  id: string;
  type: BlockType;
  text: string;       // редактируемый текст
  nextId: string | null;       // основной выход (вниз)
  branchYesId: string | null;  // ветка «Да»
  branchNoId: string | null;   // ветка «Нет»
}

let idCounter = 1;
export const newId = () => `b${idCounter++}`;

export const DEFAULT_CHAIN: BlockInstance[] = [
  { id: "b0", type: "start", text: "Начало", nextId: null, branchYesId: null, branchNoId: null },
];
idCounter = 1;
