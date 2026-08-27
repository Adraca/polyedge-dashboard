import { useState, useEffect } from "react";
import { deriveHeatmapSignal } from "../../utils/deriveHeatmapSignal";
import { Layers } from "lucide-react";

const TIMEFRAMES = ["5m", "15m", "1h"];
const PRICE_LEVELS = [68200, 67900, 67600, 67300, 67000];

function generateHeatmap() {
  return PRICE_LEVELS.map(basePrice =>
    Array.from({ length: 12 }).map((_, col) => {
      const intensity = Math.pow(Math.random(), 0.7); // skew toward higher
      const side = Math.random() > 0.52 ? "YES" : "NO";
      const liquidity = (Math.random() * 3.2 + 0.15).toFixed(2);
      return {
        price: (basePrice + (Math.random() - 0.5) * 80).toFixed(0),
        side,
        liquidity: `$${liquidity}M`,
        strength: intensity > 0.72 ? "Strong" : intensity > 0.42 ? "Medium" : "Thin",
        intensity,
        whale: intensity > 0.88,
      };
    })
  );
}

function cellColor(intensity, side) {
  const base = side === "YES"
    ? `rgba(16,185,129,${0.15 + intensity * 0.7})`
    : `rgba(244,63,94,${0.15 + intensity * 0.7})`;
  return base;
}

export default function LiquidityHeatmap({ onSignal }) {
  const [timeframe, setTimeframe] = useState("15m");
  const [data, setData] = useState(generateHeatmap());
  const [hover, setHover] = useState(null);

  useEffect(() => {
    const id = setInterval(() => setData(generateHeatmap()), 4000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (onSignal) onSignal(deriveHeatmapSignal(data));
  }, [data, onSignal]);

  return (
    <div
      className="glass-card p-5"
      style={{ border: "1px solid rgba(6,182,212,0.15)", position: "relative" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Layers size={15} style={{ color: "#06b6d4" }} />
          <div>
            <h3 className="text-sm font-semibold" style={{ color: "#e2e8f0" }}>Liquidity Heatmap</h3>
            <p className="text-[11px]" style={{ color: "rgba(226,232,240,.35)" }}>Order book depth simulation</p>
          </div>
        </div>

        {/* Timeframe tabs */}
        <div className="flex gap-1">
          {TIMEFRAMES.map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: timeframe === tf ? "rgba(6,182,212,0.18)" : "rgba(255,255,255,0.04)",
                color: timeframe === tf ? "#22d3ee" : "rgba(226,232,240,.4)",
                border: `1px solid ${timeframe === tf ? "rgba(6,182,212,0.35)" : "rgba(255,255,255,0.07)"}`,
              }}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 mb-3 text-[10px]" style={{ color: "rgba(226,232,240,.35)" }}>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm" style={{ background: "rgba(16,185,129,0.7)" }} />
          YES side
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm" style={{ background: "rgba(244,63,94,0.7)" }} />
          NO side
        </span>
        <span className="flex items-center gap-1.5 ml-auto">
          <span
            className="w-2.5 h-2.5 rounded-sm"
            style={{ background: "rgba(6,182,212,0.5)", boxShadow: "0 0 6px rgba(6,182,212,0.8)" }}
          />
          Whale block
        </span>
      </div>

      {/* Grid */}
      <div className="space-y-1.5">
        {data.map((row, r) => (
          <div key={r} className="flex items-center gap-1.5">
            <span className="text-[9px] w-12 text-right flex-shrink-0" style={{ color: "rgba(226,232,240,.3)" }}>
              ${PRICE_LEVELS[r]?.toLocaleString()}
            </span>
            <div className="flex gap-1 flex-1">
              {row.map((cell, c) => (
                <div
                  key={c}
                  onMouseEnter={() => setHover({ ...cell, row: r, col: c })}
                  onMouseLeave={() => setHover(null)}
                  className="flex-1 h-5 rounded-md cursor-pointer transition-transform hover:scale-y-110"
                  style={{
                    background: cellColor(cell.intensity, cell.side),
                    boxShadow: cell.whale
                      ? `0 0 8px rgba(6,182,212,0.7)`
                      : "none",
                    border: cell.whale ? "1px solid rgba(6,182,212,0.5)" : "none",
                    transform: cell.whale ? "scaleY(1.15)" : undefined,
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Tooltip */}
      {hover && (
        <div
          className="absolute top-4 right-4 z-20 rounded-xl p-3 text-xs space-y-1.5"
          style={{
            background: "rgba(11,14,31,0.97)",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
            minWidth: 140,
          }}
        >
          <div className="font-semibold text-white">@${hover.price}</div>
          <div style={{ color: hover.side === "YES" ? "#10b981" : "#f43f5e" }}>
            {hover.side} · {hover.strength}
          </div>
          <div style={{ color: "rgba(226,232,240,.5)" }}>{hover.liquidity}</div>
          {hover.whale && <div className="badge badge-cyan">Whale block</div>}
        </div>
      )}
    </div>
  );
}
