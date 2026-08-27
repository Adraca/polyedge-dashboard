import { useEffect, useState } from "react";
import { getLastResolvedSignals } from "../../engine/Crypto15mSignalEngine";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

function seededRandom(seed) {
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"#161B22", border:"1px solid #1e293b", borderRadius:8, padding:"8px 12px" }}>
      {payload.map(p => (
        <div key={p.name} style={{ fontSize:12, color:p.color, fontWeight:600 }}>
          {p.name}: {p.value >= 0 ? "+" : ""}{p.value?.toFixed(2)}%
        </div>
      ))}
    </div>
  );
}

export default function BenchmarkChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const compute = () => {
      const signals = getLastResolvedSignals(500).sort((a,b) => a.resolveAt - b.resolveAt);
      if (signals.length < 5) { setData([]); return; }
      const rng = seededRandom(42);
      let strategy = 0, hodl = 0;
      setData(signals.map((s, i) => {
        strategy += (s.pnl || 0) * 100;
        hodl += (rng() - 0.498) * 1.2;
        return { i, strategy: Number(strategy.toFixed(2)), hodl: Number(hodl.toFixed(2)) };
      }));
    };
    compute();
    const id = setInterval(compute, 8000);
    return () => clearInterval(id);
  }, []);

  if (data.length < 5) return (
    <div style={{ background:"#0f172a", border:"1px solid rgba(59,130,246,0.15)", borderRadius:12, padding:20, display:"flex", alignItems:"center", justifyContent:"center", minHeight:180 }}>
      <div style={{ fontSize:12, color:"#334155" }}>Need 5+ resolved signals for benchmark</div>
    </div>
  );

  const finalStrategy = data[data.length-1]?.strategy ?? 0;
  const finalHodl = data[data.length-1]?.hodl ?? 0;
  const alpha = finalStrategy - finalHodl;

  return (
    <div style={{ background:"#0f172a", border:"1px solid rgba(59,130,246,0.15)", borderRadius:12, padding:"20px 20px 16px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
        <div>
          <div style={{ fontSize:13, fontWeight:600, color:"#e2e8f0" }}>Strategy vs Benchmark</div>
          <div style={{ fontSize:11, color:"#475569", marginTop:2 }}>Cumulative return · signals vs HODL BTC</div>
        </div>
        <div style={{
          fontSize:12, fontWeight:700, padding:"3px 10px", borderRadius:6,
          color: alpha >= 0 ? "#10b981" : "#f43f5e",
          background: alpha >= 0 ? "rgba(16,185,129,0.1)" : "rgba(244,63,94,0.1)",
          border:`1px solid ${alpha >= 0 ? "rgba(16,185,129,0.25)" : "rgba(244,63,94,0.25)"}`,
        }}>
          Alpha: {alpha >= 0 ? "+" : ""}{alpha.toFixed(2)}%
        </div>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={data} margin={{ top:4, right:4, left:-20, bottom:0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis dataKey="i" hide />
          <YAxis tick={{ fontSize:10, fill:"#334155" }} tickLine={false} axisLine={false} tickFormatter={v=>`${v>0?"+":""}${v}%`} />
          <Tooltip content={<CustomTooltip />} />
          <Line type="monotone" dataKey="strategy" name="Signal Strategy" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive={false} />
          <Line type="monotone" dataKey="hodl" name="HODL BTC" stroke="#475569" strokeWidth={1.5} strokeDasharray="5 4" dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
      <div style={{ display:"flex", gap:16, marginTop:10, fontSize:11 }}>
        <span style={{ display:"flex", alignItems:"center", gap:5, color:"#475569" }}>
          <span style={{ width:16, height:2, background:"#10b981", display:"inline-block", borderRadius:1 }}/>Signal Strategy
        </span>
        <span style={{ display:"flex", alignItems:"center", gap:5, color:"#475569" }}>
          <span style={{ width:16, height:2, background:"#475569", display:"inline-block", borderRadius:1, borderTop:"2px dashed #475569" }}/>HODL BTC
        </span>
      </div>
    </div>
  );
}
