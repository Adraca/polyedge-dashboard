import { useEffect, useState } from "react";
import { getLastResolvedSignals } from "../../engine/Crypto15mSignalEngine";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from "recharts";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const v = payload[0].value;
  return (
    <div style={{ background:"#161B22", border:"1px solid #1e293b", borderRadius:8, padding:"8px 12px" }}>
      <div style={{ fontSize:11, color:"#475569", marginBottom:3 }}>Trade #{label}</div>
      <div style={{ fontSize:13, fontWeight:700, color: v >= 70 ? "#10b981" : v >= 50 ? "#f59e0b" : "#f43f5e" }}>{v}% rolling win rate</div>
    </div>
  );
}

export default function RollingWinRateChart() {
  const [data, setData] = useState([]);
  const WINDOW = 10;

  useEffect(() => {
    const compute = () => {
      const signals = getLastResolvedSignals(200).sort((a,b) => a.resolveAt - b.resolveAt);
      if (signals.length < WINDOW) { setData([]); return; }
      const pts = [];
      for (let i = WINDOW - 1; i < signals.length; i++) {
        const slice = signals.slice(i - WINDOW + 1, i + 1);
        const wins = slice.filter(s => s.result === "WIN").length;
        pts.push({ trade: i + 1, winRate: Math.round(wins / WINDOW * 100) });
      }
      setData(pts);
    };
    compute();
    const id = setInterval(compute, 5000);
    return () => clearInterval(id);
  }, []);

  if (data.length < 2) return (
    <div style={{ background:"#0f172a", border:"1px solid rgba(6,182,212,0.15)", borderRadius:12, padding:"20px", display:"flex", alignItems:"center", justifyContent:"center", minHeight:200 }}>
      <div style={{ textAlign:"center", color:"#334155", fontSize:12 }}>Need {WINDOW}+ resolved signals for rolling chart</div>
    </div>
  );

  return (
    <div style={{ background:"#0f172a", border:"1px solid rgba(6,182,212,0.15)", borderRadius:12, padding:"20px 20px 16px" }}>
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:13, fontWeight:600, color:"#e2e8f0" }}>Rolling Win Rate</div>
        <div style={{ fontSize:11, color:"#475569", marginTop:2 }}>10-trade moving window · model momentum</div>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={data} margin={{ top:4, right:4, left:-20, bottom:0 }}>
          <defs>
            <linearGradient id="rollGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis dataKey="trade" tick={{ fontSize:9, fill:"#334155" }} tickLine={false} axisLine={false} interval={Math.max(1,Math.floor(data.length/5))} />
          <YAxis tick={{ fontSize:10, fill:"#334155" }} tickLine={false} axisLine={false} domain={[0,100]} tickFormatter={v=>`${v}%`} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={50} stroke="rgba(244,63,94,0.3)" strokeDasharray="4 4" />
          <ReferenceLine y={70} stroke="rgba(16,185,129,0.25)" strokeDasharray="4 4" />
          <Line type="monotone" dataKey="winRate" stroke="url(#rollGrad)" strokeWidth={2} dot={false} isAnimationActive={false} activeDot={{ r:4, fill:"#06b6d4", strokeWidth:0 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
