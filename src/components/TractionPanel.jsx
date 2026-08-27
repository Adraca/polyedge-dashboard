import { useEffect, useState } from "react";
import { getLastResolvedSignals } from "../engine/Crypto15mSignalEngine";
import SignalProofCard from "./SignalProofCard";

function StatCard({ label, value, color, sub }) {
  return (
    <div style={{
      background: "#0f172a",
      border: "1px solid #1e293b",
      borderRadius: 10,
      padding: "14px 18px",
    }}>
      <div style={{ fontSize: 11, color: "#475569", marginBottom: 6, fontWeight: 500, letterSpacing: "0.02em" }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: color || "#f8fafc", letterSpacing: "-0.03em", lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: "#334155", marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

export default function TractionPanel({ variant = "default" }) {
  const [signals, setSignals] = useState([]);

  useEffect(() => {
    const load = () => setSignals(getLastResolvedSignals(6));
    load();
    const id = setInterval(load, 2000);
    return () => clearInterval(id);
  }, []);

  const wins = signals.filter(s => s.result === "WIN").length;
  const losses = signals.length - wins;
  const winRate = signals.length > 0 ? Math.round((wins / signals.length) * 100) : null;
  const totalPnL = signals.reduce((a, s) => a + (s.pnl || 0), 0);
  const avgPnL = signals.length > 0 ? (totalPnL / signals.length) : null;

  if (variant === "compact") {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12 }}>
        <StatCard label="Resolved" value={signals.length} />
        <StatCard label="Wins" value={wins} color="#10b981" />
        <StatCard label="Losses" value={losses} color={losses > 0 ? "#f43f5e" : "#475569"} />
        <StatCard
          label="Win Rate"
          value={winRate !== null ? `${winRate}%` : "—"}
          color={winRate === null ? "#475569" : winRate >= 70 ? "#10b981" : winRate >= 55 ? "#f59e0b" : "#f43f5e"}
          sub={signals.length > 0 ? `${signals.length} signals` : null}
        />
        <StatCard
          label="Avg PnL"
          value={avgPnL !== null ? `${avgPnL >= 0 ? "+" : ""}${(avgPnL * 100).toFixed(2)}%` : "—"}
          color={avgPnL === null ? "#475569" : avgPnL >= 0 ? "#10b981" : "#f43f5e"}
        />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12 }}>
        <StatCard label="Resolved" value={signals.length} />
        <StatCard label="Wins" value={wins} color="#10b981" />
        <StatCard label="Losses" value={losses} color={losses > 0 ? "#f43f5e" : "#475569"} />
        <StatCard label="Win Rate" value={winRate !== null ? `${winRate}%` : "—"} color={winRate >= 70 ? "#10b981" : "#f59e0b"} />
        <StatCard label="Avg PnL" value={avgPnL !== null ? `${avgPnL >= 0 ? "+" : ""}${(avgPnL * 100).toFixed(2)}%` : "—"} color={avgPnL >= 0 ? "#10b981" : "#f43f5e"} />
      </div>
      {signals.length > 0 && (
        <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 10, padding: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0", marginBottom: 12 }}>Recent Outcomes</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 10 }}>
            {signals.map(s => <SignalProofCard key={s.id} signal={s} />)}
          </div>
        </div>
      )}
    </div>
  );
}
