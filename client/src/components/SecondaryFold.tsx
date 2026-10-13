import { useEffect, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

/** 次要內容：預設收合，點開才顯示；wide 用於滿版的參考資料區塊 */
export default function SecondaryFold({
  label,
  hint = "點開看",
  wide = false,
  children,
}: {
  label: string;
  hint?: string;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <details className={`walk-secondary${wide ? " walk-secondary-wide" : ""}`}>
      <summary>
        <span className="walk-secondary-tag">次要</span>
        <strong>{label}</strong>
        <small>{hint}</small>
        <ChevronDown size={18} aria-hidden="true" />
      </summary>
      <div className="walk-secondary-body">{children}</div>
    </details>
  );
}

/** 連到收合區塊裡的錨點時，先展開外層的 details，再讓瀏覽器捲動過去 */
export function useOpenFoldsForHash() {
  useEffect(() => {
    const open = (hash: string) => {
      if (!hash || hash.length < 2) return;
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      let fold = target?.closest("details");
      while (fold) {
        fold.open = true;
        fold = fold.parentElement?.closest("details") ?? null;
      }
    };
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.('a[href^="#"]');
      if (link) open(link.getAttribute("href") ?? "");
    };
    const onHash = () => {
      open(location.hash);
      requestAnimationFrame(() =>
        document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView({ block: "start" })
      );
    };
    document.addEventListener("click", onClick, true);
    window.addEventListener("hashchange", onHash);
    if (location.hash) window.setTimeout(onHash, 400);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("hashchange", onHash);
    };
  }, []);
}
