/* =========================================================
   AISignalPanel
   Slide-in panel showing live-streamed AI analysis for a signal.
   Powered by qwen3-max via sovereign fleet LiteLLM gateway.
========================================================= */

import { useEffect, useRef } from "react";
import { X, Zap, Brain, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Minus, Loader } from "lucide-react";
import { useAISignalExplanation } from "../../hooks/useAISignalExplanation";

const ASSET_COLORS = {
  BTC: "#f59e0b", ETH: "#3b82f6", SOL: "#06b6d4", XRP: "#10b981",
};

function SentimentBadge({ sentiment }) {
  const map = {
    bullish: { color: "#10b981", bg: "rgba(16,185,129,0.15)", border: "rgba(16,185,129,0.3)", icon: TrendingUp, label: "Bullish" },
    bearish: { color: "#f43f5e", bg: "rgba(244,63,94,0.15)", border: "rgba(244,63,94,0.3)", icon: TrendingDown, label: "Bearish" },
    neutral: { color: "#94a3b8", bg: "rgba(148,163,184,0.12)", border: "rgba(148,163,184,0.25)", icon: Minus, label: "Neutral" },
  };
  const s = map[sentiment] || map.neutral;
  const Icon = s.icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
    >
      <Icon size={11} />
      {s.label}
    </span>
  );
}

function ConvictionDots({ conviction }) {
  const levels = { high: 3, medium: 2, low: 1 };
  const n = levels[conviction] ?? 1;
  const color = n === 3 ? "#10b981" : n === 2 ? "#f59e0b" : "#f43f5e";
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3].map(i => (
        <span
          key={i}
          className="w-2 h-2 rounded-full"
          style={{ background: i <= n ? color : "rgba(255,255,255,0.12)" }}
        />
      ))}
      <span className="ml-1 text-[11px] font-semibold capitalize" style={{ color }}>
        {conviction} conviction
      </span>
    </div>
  );
}

/* Streaming text cursor effect */
function StreamingText({ text }) {
  return (
    <span>
      {text}
      <span
        className="inline-block w-0.5 h-3.5 ml-0.5 rounded-sm align-middle"
        style={{ background: "#3b82f6", animation: "blink 0.9s step-end infinite" }}
      />
      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </span>
  );
}

export default function AISignalPanel({ signal, onClose }) {
  const { loading, streaming, result, error, explain } = useAISignalExplanation();
  const color = ASSET_COLORS[signal?.symbol] || "#3b82f6";
  const conf = Math.round((signal?.confidence || 0) * 100);
  const panelRef = useRef(null);

  useEffect(() => {
    if (signal) explain(signal);
  }, [signal?.id]);

  /* Close on Escape */
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!signal) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50"
        style={{ background: "rgba(4,6,15,0.7)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)" }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="fixed right-0 top-0 h-full z-50 flex flex-col"
        style={{
          width: "min(440px, 95vw)",
          background: "rgba(9,11,26,0.98)",
          backdropFilter: "blur(32px)",
          WebkitBackdropFilter: "blur(32px)",
          borderLeft: "1px solid rgba(255,255,255,0.09)",
          boxShadow: "-20px 0 60px rgba(0,0,0,0.6)",
          animation: "slideIn 0.28s cubic-bezier(0.22,1,0.36,1) forwards",
        }}
      >
        <style>{`@keyframes slideIn { from { transform: translateX(100%); opacity:0; } to { transform: translateX(0); opacity:1; } }`}</style>

        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5 flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${color}33, rgba(59,130,246,0.2))` }}
            >
              <Brain size={17} style={{ color }} />
            </div>
            <div>
              <div className="text-sm font-bold" style={{ color: "#e2e8f0" }}>AI Signal Analysis</div>
              <div className="text-[11px]" style={{ color: "rgba(226,232,240,.4)" }}>
                {signal.symbol} · 15m · {conf}% confidence · qwen3-max
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
            style={{ color: "rgba(226,232,240,.4)" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = "#e2e8f0"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(226,232,240,.4)"; }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Signal snapshot */}
        <div
          className="mx-6 mt-5 rounded-xl p-4 flex-shrink-0"
          style={{ background: `${color}0d`, border: `1px solid ${color}25` }}
        >
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { label: "Confidence", value: `${conf}%`, color },
              { label: "Market Prob", value: signal.marketProbability ? `${Math.round(signal.marketProbability * 100)}%` : "—", color: "#94a3b8" },
              { label: "Edge", value: signal.edge ? `+${(signal.edge * 100).toFixed(1)}%` : "—", color: "#10b981" },
            ].map(({ label, value, color: c }) => (
              <div key={label}>
                <div className="text-[10px] mb-1" style={{ color: "rgba(226,232,240,.4)" }}>{label}</div>
                <div className="text-base font-bold" style={{ color: c }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-auto px-6 pb-6 pt-5 space-y-5">

          {/* Loading */}
          {loading && !streaming && (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)" }}
              >
                <Loader size={20} style={{ color: "#60a5fa", animation: "spin 1s linear infinite" }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
              <div className="text-sm" style={{ color: "rgba(226,232,240,.45)" }}>
                Querying qwen3-max…
              </div>
            </div>
          )}

          {/* Streaming — show raw text while JSON builds */}
          {loading && streaming && (
            <div
              className="rounded-xl p-4"
              style={{ background: "rgba(59,130,246,0.07)", border: "1px solid rgba(59,130,246,0.18)" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Zap size={13} style={{ color: "#60a5fa" }} />
                <span className="text-xs font-semibold" style={{ color: "#60a5fa" }}>Streaming from fleet…</span>
              </div>
              <p className="text-sm leading-relaxed font-mono" style={{ color: "rgba(226,232,240,.7)" }}>
                <StreamingText text={streaming} />
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div
              className="rounded-xl p-4 flex items-start gap-3"
              style={{ background: "rgba(244,63,94,0.08)", border: "1px solid rgba(244,63,94,0.25)" }}
            >
              <AlertTriangle size={16} style={{ color: "#f43f5e", flexShrink: 0, marginTop: 2 }} />
              <div>
                <div className="text-sm font-semibold" style={{ color: "#f43f5e" }}>Fleet error</div>
                <div className="text-xs mt-1" style={{ color: "rgba(226,232,240,.5)" }}>{error}</div>
              </div>
            </div>
          )}

          {/* Result */}
          {result && !loading && (
            <>
              {/* Badges row */}
              <div className="flex items-center gap-2 flex-wrap">
                <SentimentBadge sentiment={result.sentiment} />
                <ConvictionDots conviction={result.conviction} />
              </div>

              {/* Thesis */}
              <div
                className="rounded-xl p-4"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Brain size={13} style={{ color: "#60a5fa" }} />
                  <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "rgba(226,232,240,.4)" }}>
                    Thesis
                  </span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "#e2e8f0" }}>
                  {result.thesis}
                </p>
              </div>

              {/* Key factors */}
              {result.bullets?.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-widest mb-3" style={{ color: "rgba(226,232,240,.35)" }}>
                    Key Factors
                  </div>
                  <div className="space-y-2">
                    {result.bullets.map((b, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 rounded-lg px-3 py-2.5"
                        style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.12)" }}
                      >
                        <CheckCircle size={13} style={{ color: "#10b981", flexShrink: 0, marginTop: 2 }} />
                        <span className="text-sm" style={{ color: "rgba(226,232,240,.8)" }}>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Risk */}
              {result.risk && (
                <div
                  className="rounded-xl p-4 flex items-start gap-3"
                  style={{ background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.2)" }}
                >
                  <AlertTriangle size={14} style={{ color: "#f59e0b", flexShrink: 0, marginTop: 1 }} />
                  <div>
                    <div className="text-[11px] font-semibold mb-1" style={{ color: "#f59e0b" }}>Key Risk</div>
                    <p className="text-sm" style={{ color: "rgba(226,232,240,.7)" }}>{result.risk}</p>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div
                className="flex items-center gap-2 text-[10px] pt-2"
                style={{ color: "rgba(226,232,240,.25)", borderTop: "1px solid rgba(255,255,255,0.05)" }}
              >
                <Zap size={10} />
                Generated by qwen3-max via Sovereign Fleet · Adraca Azure-01 · Analytics only
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
