import { Fragment, type ReactNode } from "react";

/** 全站三個關鍵句：出現時一律用同一種螢光標記 */
export const keyLines = ["大腦是可塑的", "一起放電的神經元會彼此連結", "重複＋注意力＋刻意＝持久的改變"];

const pattern = new RegExp(`(${keyLines.join("|").replace(/[+＋]/g, m => `\\${m}`)})`);

export function markKeys(text: string): ReactNode {
  const parts = text.split(pattern);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    keyLines.includes(part) ? (
      <mark key={i} className="key-mark">
        {part}
      </mark>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    )
  );
}
