import { Zap } from "lucide-react";
import { useBreakingNews } from "../hooks/useQueries";

export function BreakingTicker() {
  const { data: news } = useBreakingNews();

  if (!news || news.length === 0) return null;

  const items = [...news, ...news]; // duplicate for seamless loop

  return (
    <div
      className="bg-primary text-primary-foreground flex items-center overflow-hidden h-9"
      data-ocid="breaking.ticker"
    >
      <div className="breaking-label flex items-center gap-1 shrink-0 z-10 h-full">
        <Zap className="w-3 h-3" />
        <span>BREAKING</span>
      </div>
      <div className="flex-1 overflow-hidden relative">
        <div className="ticker-animate flex gap-12">
          {items.map((item, idx) => (
            <span key={`${item.id}-${idx}`} className="text-sm font-semibold">
              ● {item.title}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
