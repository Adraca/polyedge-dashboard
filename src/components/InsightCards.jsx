import { useEffect, useState } from "react";
import { getLastResolvedSignals } from "../engine/Crypto15mSignalEngine";

function InsightCard({ label, value, sub, color, border }) {
  return (
    <div style={{
      background:"#0f172a", borderRadius:10, padding:"14px 16px",
      border: border || "1px solid #1e293b",
      flex: 1, minWidth: 140,
    }}>
      <div style={{ fontSize:10, color:"#475569", fontWeight:500, textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:6 }}>{label}</div>
      <div style={{ fontSize:20, fontWeight:800, color: color || "#f8fafc", letterSpacing:"-0.02em", lineHeight:1 }}>{value}</div>
      {sub && <div style={{ fontSize:11, color:"#334155", marginTop:5 }}>{sub}</div>}
    </div>
  );
}

export default function InsightCards() {
  const [stats, setStats] = useState({ best:null, worst:null, streak:0, streakType:"", maxDD:0 });

  useEffect(() => {
    const compute = () => {
      const signals = getLastResolvedSignals(500).sort((a,b) => a.resolveAt - b.resolveAt);
      if (!signals.length) return;

      const byPnl = [...signals].sort((a,b) => (b.pnl||0) - (a.pnl||0));
      const best = byPnl[0];
      const worst = byPnl[byPnl.length - 1];

      let streak = 0, streakType = "";
      for (let i = signals.length - 1; i >= 0; i--) {
        if (i === signals.length - 1) { streakType = signals[i].result; streak = 1; }
        else if (signals[i].result === streakType) streak++;
        else break;
      }

      let capital = 100, peak = 100, maxDD = 0;
      signals.forEach(s => {
        capital += (s.pnl || 0);
        if (capital > peak) peak = capital;
        const dd = (peak - capital) / peak;
        if (dd > maxDD) maxDD = dd;
      });

      setStats({ best, worst, streak, streakType, maxDD });
    };
    compute();
    const id = setInterval(compute, 5000);
    return () => clearInterval(id);
  }, []);

  const { best, worst, streak, streakType, maxDD } = stats;

  return (
    <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
      <InsightCard
        label="Best Trade"
        value={best ? `+${((best.pnl||0)*100).toFixed(2)}%` : "—"}
        sub={best ? `${best.symbol} · ${best.result}` : null}
        color="#10b981"
        border="1px solid rgba(16,185,129,0.2)"
      />
      <InsightCard
        label="Worst Trade"
        value={worst ? `${((worst.pnl||0)*100).toFixed(2)}%` : "—"}
        sub={worst ? `${worst.symbol} · ${worst.result}` : null}
        color={worst && (worst.pnl||0) < 0 ? "#f43f5e" : "#94a3b8"}
        border="1px solid rgba(244,63,94,0.18)"
      />
      <InsightCard
        label="Current Streak"
        value={streak > 0 ? `${streak}×` : "—"}
        sub={streakType === "WIN" ? "consecutive wins" : streakType === "LOSS" ? "consecutive losses" : null}
        color={streakType === "WIN" ? "#10b981" : streakType === "LOSS" ? "#f43f5e" : "#94a3b8"}
        border={streakType === "WIN" ? "1px solid rgba(16,185,129,0.2)" : "1px solid rgba(244,63,94,0.18)"}
      />
      <InsightCard
        label="Max Drawdown"
        value={maxDD > 0 ? `-${(maxDD*100).toFixed(2)}%` : "0%"}
        sub="peak-to-trough"
        color={maxDD > 0.05 ? "#f43f5e" : maxDD > 0.02 ? "#f59e0b" : "#10b981"}
        border="1px solid rgba(245,158,11,0.18)"
      />
    </div>
  );
}
