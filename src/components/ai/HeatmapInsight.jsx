export default function HeatmapInsight({ signal }) {
  if (!signal) return null;

  const { dominance, confidence, whales } = signal;

  return (
    <div className="rounded-xl p-4
      bg-gradient-to-br from-slate-900/70 to-blue-900/60
      border border-white/10 text-sm shadow-xl">

      <div className="flex justify-between mb-2">
        <h3 className="font-semibold flex gap-2">🧠 AI Market Insight</h3>
        <span className="text-xs bg-white/10 px-2 rounded">Live</span>
      </div>

      <ul className="space-y-1 text-xs opacity-90 mb-3">
        <li>• {dominance} liquidity dominates orderbook</li>
        <li>• Whale walls detected: <b>{whales}</b></li>
        <li>• Orderflow imbalance favors <b>{dominance}</b></li>
      </ul>

      <div>
        <div className="flex justify-between text-xs mb-1">
          <span>Confidence</span>
          <span>{confidence}%</span>
        </div>
        <div className="h-2 bg-black/30 rounded">
          <div
            className="h-2 rounded bg-emerald-400"
            style={{ width: `${confidence}%` }}
          />
        </div>
      </div>

      <p className="text-[10px] opacity-50 mt-2">
        Derived from live liquidity & whale detection
      </p>
    </div>
  );
}
