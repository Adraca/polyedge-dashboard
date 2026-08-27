export default function ConfidenceExplanation({ signal }) {
  if (!signal) return null;

  const pct = Math.round((signal.confidence ?? 0) * 100);
  const edge = signal.edge != null ? `${(signal.edge * 100).toFixed(1)}%` : null;
  const mp = signal.marketProbability != null ? `${Math.round(signal.marketProbability * 100)}%` : null;

  if (signal.confidenceBreakdown) {
    const { momentum, trend, volatility, liquidity, timePenalty } = signal.confidenceBreakdown;
    return (
      <div style={{ fontSize: 11, lineHeight: 1.7, color: "rgba(226,232,240,0.55)" }}>
        <div>Momentum +{momentum}% · Trend +{trend}%</div>
        <div>Vol fit +{volatility}% · Liquidity +{liquidity}%</div>
        {timePenalty > 0 && <div style={{ color: "#f59e0b" }}>Late entry −{timePenalty}%</div>}
      </div>
    );
  }

  const hasEdge = signal.edge != null && signal.edge > 0.001;
  return (
    <div style={{ fontSize: 11, lineHeight: 1.9, color: "rgba(226,232,240,0.55)" }}>
      {mp && <div>Market probability <span style={{ color: "#e2e8f0", fontWeight: 600 }}>{mp}</span></div>}
      {hasEdge && <div>Signal edge <span style={{ color: "#10b981", fontWeight: 600 }}>{edge}</span></div>}
      <div>Confidence <span style={{ color: "#e2e8f0", fontWeight: 600 }}>{pct}%</span> · 15m window</div>
    </div>
  );
}
