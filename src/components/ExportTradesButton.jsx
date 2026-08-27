import { getLastResolvedSignals } from "../engine/Crypto15mSignalEngine";
import { Download } from "lucide-react";

export default function ExportTradesButton() {
  function exportCSV() {
    const rows = getLastResolvedSignals(500);
    const csv = [
      ["Time", "Symbol", "Direction", "Confidence%", "EntryDelay_min", "Result", "PnL"],
      ...rows.map(s => [
        new Date(s.resolveAt).toISOString(),
        s.symbol,
        s.direction || s.bias,
        (s.confidence * 100).toFixed(1),
        s.entryDelayMs ? (s.entryDelayMs / 60000).toFixed(2) : "",
        s.result,
        s.pnl ?? 0,
      ]),
    ]
      .map(r => r.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `polyedge_signals_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  }

  return (
    <button
      onClick={exportCSV}
      className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
      style={{
        background: "rgba(59,130,246,0.15)",
        color: "#60a5fa",
        border: "1px solid rgba(59,130,246,0.3)",
      }}
      onMouseEnter={e => { e.currentTarget.style.background = "rgba(59,130,246,0.25)"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "rgba(59,130,246,0.15)"; }}
    >
      <Download size={13} />
      Export Journal
    </button>
  );
}
