import { useEffect, useState } from "react";
import { getActive15mSignals } from "../engine/Crypto15mSignalEngine";
import ConfidenceExplanation from "./ConfidenceExplanation";
import AISignalPanel from "./ai/AISignalPanel";
import { Clock, ArrowUpRight, Copy, TrendingUp, TrendingDown, Brain } from "lucide-react";

const ASSETS = ["BTC", "ETH", "SOL", "XRP"];

const ASSET_COLORS = {
  BTC: { primary: "#f59e0b", glow: "rgba(245,158,11,0.25)", bg: "rgba(245,158,11,0.08)" },
  ETH: { primary: "#60a5fa", glow: "rgba(56,189,248,0.25)", bg: "rgba(56,189,248,0.08)" },
  SOL: { primary: "#22d3ee", glow: "rgba(34,211,238,0.25)", bg: "rgba(34,211,238,0.08)" },
  XRP: { primary: "#34d399", glow: "rgba(52,211,153,0.25)", bg: "rgba(52,211,153,0.08)" },
};

function formatTime(ms) {
  if (ms <= 0) return "0:00";
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function ConfidenceRing({ pct, color }) {
  const r = 34;
  const circ = 2 * Math.PI * r;
  const dash = Math.max(0, Math.min(pct / 100, 1)) * circ;
  return (
    <svg width="84" height="84" viewBox="0 0 84 84" style={{ flexShrink: 0 }}>
      {/* Track */}
      <circle cx="42" cy="42" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
      {/* Progress */}
      <circle
        cx="42" cy="42" r={r}
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        strokeDashoffset={circ * 0.25}
        style={{
          filter: `drop-shadow(0 0 5px ${color})`,
          transition: "stroke-dasharray 0.8s cubic-bezier(0.4,0,0.2,1)",
        }}
      />
      {/* Label */}
      <text x="42" y="46" textAnchor="middle" fill="#e2e8f0" fontSize="15" fontWeight="800" fontFamily="Inter, sans-serif">
        {pct}%
      </text>
    </svg>
  );
}

export default function Crypto15mSignalGrid() {
  const [signals, setSignals] = useState({});
  const [aiSignal, setAiSignal] = useState(null);

  useEffect(() => {
    const tick = () => setSignals(getActive15mSignals());
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, []);

  return (
    <>
    <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {ASSETS.map((asset, idx) => {
        const s = signals[asset];
        const colors = ASSET_COLORS[asset];

        if (!s) {
          return (
            <div
              key={asset}
              className="glass-card shimmer"
              style={{ minHeight: 220 }}
            />
          );
        }

        const remaining = s.resolveAt ? s.resolveAt - Date.now() : (s.observeUntil ? s.observeUntil - Date.now() : 0);
        const confidencePct = Math.round(s.confidence * 100);
        const isUrgent = remaining > 0 && remaining < 5 * 60 * 1000;
        const isUp = s.direction === "UP" || s.bias === "LEANS_YES";

        return (
          <div
            key={s.id}
            className={`glass-card p-5 space-y-4 animate-in ${isUrgent ? "resolve-border" : ""}`}
            style={{
              animationDelay: `${idx * 70}ms`,
              borderColor: isUrgent ? "rgba(244,63,94,0.3)" : "rgba(255,255,255,0.07)",
              boxShadow: isUrgent
                ? "0 0 28px rgba(244,63,94,0.12)"
                : `0 4px 24px rgba(0,0,0,0.3)`,
            }}
          >
            {/* Header: asset info + ring */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5 pt-1">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: colors.bg, color: colors.primary, border: `1px solid ${colors.glow}` }}
                >
                  {asset[0]}
                </div>
                <div>
                  <div className="text-sm font-bold" style={{ color: "#e2e8f0" }}>{asset}</div>
                  <div className="text-[11px]" style={{ color: "rgba(226,232,240,.35)" }}>15m Signal</div>
                </div>
              </div>
              <ConfidenceRing pct={confidencePct} color={colors.primary} />
            </div>

            {/* Direction + timer badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`badge ${isUp ? "badge-green" : "badge-red"}`}>
                {isUp
                  ? <TrendingUp size={10} style={{ display: "inline", marginRight: 3 }} />
                  : <TrendingDown size={10} style={{ display: "inline", marginRight: 3 }} />}
                {(s.direction || s.bias || "").replace("LEANS_YES","YES").replace("LEANS_NO","NO")}
              </span>
              {remaining > 0 && (
                <span className={`badge ${isUrgent ? "badge-red fire" : "badge-violet"}`}>
                  <Clock size={9} style={{ display: "inline", marginRight: 3 }} />
                  {formatTime(remaining)}
                </span>
              )}
            </div>

            {/* Confidence explanation */}
            <div
              className="rounded-xl p-3 text-xs decay"
              style={{
                background: "rgba(255,255,255,0.028)",
                border: "1px solid rgba(255,255,255,0.05)",
                color: "rgba(226,232,240,0.55)",
                lineHeight: "1.6",
              }}
            >
              <ConfidenceExplanation signal={s} />
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-2">
              <a
                href="https://polymarket.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200"
                style={{
                  background: colors.bg,
                  color: colors.primary,
                  border: `1px solid ${colors.glow}`,
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                View <ArrowUpRight size={11} />
              </a>
              <button
                onClick={() =>
                  navigator.clipboard.writeText(
                    `${asset} ${s.direction || s.bias} · ${confidencePct}%\nResolve in ${formatTime(remaining)}`
                  )
                }
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  color: "rgba(226,232,240,0.6)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
              >
                Copy <Copy size={11} />
              </button>
              <button
                onClick={() => setAiSignal(s)}
                className="col-span-2 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200"
                style={{
                  background: "rgba(59,130,246,0.12)",
                  color: "#60a5fa",
                  border: "1px solid rgba(59,130,246,0.28)",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(59,130,246,0.22)"; e.currentTarget.style.boxShadow = "0 0 16px rgba(59,130,246,0.2)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(59,130,246,0.12)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <Brain size={12} />
                AI Analysis
              </button>
            </div>

            {/* Footer */}
            <div
              className="flex justify-between items-center text-[10px]"
              style={{ color: "rgba(226,232,240,.22)" }}
            >
              <span>Analytics only · No execution</span>
              <span>Model-derived</span>
            </div>
          </div>
        );
      })}
    </div>
    {aiSignal && (
      <AISignalPanel signal={aiSignal} onClose={() => setAiSignal(null)} />
    )}
    </>
  );
}

