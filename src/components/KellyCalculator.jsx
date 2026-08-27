import { useEffect, useState } from "react";
import { getLastResolvedSignals } from "../engine/Crypto15mSignalEngine";

export default function KellyCalculator() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const compute = () => {
      const signals = getLastResolvedSignals(100);
      if (signals.length < 10) { setStats(null); return; }
      const wins = signals.filter(s => s.result === "WIN");
      const losses = signals.filter(s => s.result === "LOSS");
      const winRate = wins.length / signals.length;
      const avgWin = wins.length > 0 ? wins.reduce((a,s) => a + Math.abs(s.pnl||0), 0) / wins.length : 0;
      const avgLoss = losses.length > 0 ? losses.reduce((a,s) => a + Math.abs(s.pnl||0), 0) / losses.length : 0.01;
      const ratio = avgLoss > 0 ? avgWin / avgLoss : 1;
      const kelly = winRate - (1 - winRate) / ratio;
      setStats({ winRate, avgWin, avgLoss, ratio, kelly, halfKelly: kelly / 2, n: signals.length });
    };
    compute();
    const id = setInterval(compute, 8000);
    return () => clearInterval(id);
  }, []);

  const fraction = stats ? Math.max(0, Math.min(stats.halfKelly, 0.25)) : 0;
  const pct = (fraction * 100).toFixed(1);
  const kellySafe = stats ? Math.max(0, stats.kelly * 100).toFixed(1) : "0";

  return (
    <div style={{ background:"#0f172a", border:"1px solid rgba(6,182,212,0.2)", borderRadius:12, padding:"20px 20px 16px" }}>
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:13, fontWeight:600, color:"#e2e8f0" }}>Kelly Position Sizer</div>
        <div style={{ fontSize:11, color:"#475569", marginTop:2 }}>Optimal bet fraction · based on {stats?.n || "—"} trades</div>
      </div>

      {!stats ? (
        <div style={{ color:"#334155", fontSize:12, padding:"20px 0" }}>Need 10+ resolved signals</div>
      ) : (
        <>
          <div style={{ display:"flex", alignItems:"center", gap:20, marginBottom:20 }}>
            <div style={{
              width:80, height:80, borderRadius:"50%", flexShrink:0,
              border:"3px solid #06b6d4",
              boxShadow:"0 0 20px rgba(6,182,212,0.2)",
              display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
            }}>
              <div style={{ fontSize:22, fontWeight:800, color:"#06b6d4", lineHeight:1 }}>{pct}%</div>
              <div style={{ fontSize:9, color:"#475569", marginTop:2 }}>of bankroll</div>
            </div>
            <div>
              <div style={{ fontSize:12, color:"#94a3b8", marginBottom:6 }}>Half-Kelly (recommended)</div>
              <div style={{ fontSize:11, color:"#475569", lineHeight:1.9 }}>
                Full Kelly: <span style={{ color:"#e2e8f0", fontWeight:600 }}>{kellySafe}%</span><br/>
                Win rate: <span style={{ color:"#10b981", fontWeight:600 }}>{(stats.winRate*100).toFixed(1)}%</span><br/>
                Win/Loss ratio: <span style={{ color:"#e2e8f0", fontWeight:600 }}>{stats.ratio.toFixed(2)}×</span>
              </div>
            </div>
          </div>

          <div>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4, fontSize:10, color:"#334155" }}>
              <span>Conservative (0%)</span><span>Max (25%)</span>
            </div>
            <div style={{ height:4, background:"#1e293b", borderRadius:2, position:"relative" }}>
              <div style={{
                position:"absolute", left:0, top:0, height:"100%",
                width:`${Math.min(fraction/0.25*100, 100)}%`,
                background:"linear-gradient(90deg,#10b981,#06b6d4)",
                borderRadius:2, transition:"width 0.6s ease",
              }}/>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
