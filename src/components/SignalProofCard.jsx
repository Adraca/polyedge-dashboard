import { CheckCircle, XCircle, Clock } from "lucide-react";

export default function SignalProofCard({ signal }) {
  if (!signal) return null;

  const isWin = signal.result === "WIN" || signal.outcome === "RESOLVED_UP";
  const pnl = typeof signal.pnl === "number" ? signal.pnl : 0;
  const conf = Math.round((signal.confidence || 0) * 100);

  const assetColors = {
    BTC: "#f59e0b", ETH: "#3b82f6", SOL: "#06b6d4", XRP: "#10b981",
  };
  const color = assetColors[signal.symbol] || "#3b82f6";

  return (
    <div
      className="rounded-xl p-4 space-y-3"
      style={{
        background: isWin ? "rgba(16,185,129,0.06)" : "rgba(244,63,94,0.06)",
        border: `1px solid ${isWin ? "rgba(16,185,129,0.18)" : "rgba(244,63,94,0.18)"}`,
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold"
            style={{ background: `${color}22`, color }}
          >
            {(signal.symbol || "?")[0]}
          </div>
          <span className="text-sm font-semibold" style={{ color: "#e2e8f0" }}>
            {signal.symbol} · 15m · {signal.direction || signal.bias}
          </span>
        </div>

        {isWin
          ? <CheckCircle size={16} style={{ color: "#10b981" }} />
          : <XCircle size={16} style={{ color: "#f43f5e" }} />
        }
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px]" style={{ color: "rgba(226,232,240,.4)" }}>Confidence</div>
          <div className="text-sm font-bold" style={{ color }}>{conf}%</div>
        </div>
        <div>
          <div className="text-[10px]" style={{ color: "rgba(226,232,240,.4)" }}>PnL</div>
          <div
            className="text-sm font-bold"
            style={{ color: pnl >= 0 ? "#10b981" : "#f43f5e" }}
          >
            {pnl >= 0 ? "+" : ""}{(pnl * 100).toFixed(2)}%
          </div>
        </div>
        {signal.resolveAt && (
          <div className="flex items-center gap-1 text-[10px]" style={{ color: "rgba(226,232,240,.35)" }}>
            <Clock size={10} />
            {new Date(signal.resolveAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
        )}
      </div>
    </div>
  );
}
