import { getDrawdownState } from "../engine/drawdownGuard";
import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";

export default function DrawdownBanner() {
  const [state, setState] = useState({ blocked: false, dayPnL: 0, weekPnL: 0 });

  useEffect(() => {
    const tick = () => setState(getDrawdownState());
    tick();
    const id = setInterval(tick, 2000);
    return () => clearInterval(id);
  }, []);

  if (!state.blocked) return null;

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium animate-in"
      style={{
        background: "rgba(244,63,94,0.08)",
        border: "1px solid rgba(244,63,94,0.3)",
        color: "#f43f5e",
        boxShadow: "0 0 24px rgba(244,63,94,0.08)",
      }}
    >
      <AlertTriangle size={16} className="flex-shrink-0" />
      <div>
        <span>Drawdown limit reached — new signals are blocked until recovery</span>
        {(state.dayPnL !== undefined || state.weekPnL !== undefined) && (
          <span className="ml-3 text-xs opacity-70">
            Day: {(state.dayPnL * 100).toFixed(2)}% · Week: {(state.weekPnL * 100).toFixed(2)}%
          </span>
        )}
      </div>
    </div>
  );
}
