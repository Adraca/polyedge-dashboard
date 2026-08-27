import { useEffect, useState } from "react";
import { getLastResolvedSignals } from "../../engine/Crypto15mSignalEngine";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid, LabelList } from "recharts";

const ASSET_COLORS = { BTC: "#f59e0b", ETH: "#60a5fa", SOL: "#22d3ee", XRP: "#34d399" };

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{ background:"#161B22", border:"1px solid #1e293b", borderRadius:8, padding:"8px 12px" }}>
      <div style={{ fontWeight:700, color: ASSET_COLORS[d.asset] || "#e2e8f0", fontSize:13 }}>{d.asset}</div>
      <div style={{ fontSize:11, color:"#94a3b8", marginTop:3 }}>{d.wins}W / {d.losses}L · {d.total} trades</div>
      <div style={{ fontSize:13, fontWeight:700, color: d.winRate >= 70 ? "#10b981" : d.winRate >= 55 ? "#f59e0b" : "#f43f5e", marginTop:2 }}>{d.winRate}% win rate</div>
    </div>
  );
}

export default function AssetPerformanceChart() {
  const [data, setData] = useState([]);
  useEffect(() => {
    const compute = () => {
      const signals = getLastResolvedSignals(500);
      const map = {};
      signals.forEach(s => {
        if (!map[s.symbol]) map[s.symbol] = { wins:0, losses:0 };
        if (s.result === "WIN") map[s.symbol].wins++;
        else map[s.symbol].losses++;
      });
      setData(["BTC","ETH","SOL","XRP"].map(sym => {
        const d = map[sym] || { wins:0, losses:0 };
        const total = d.wins + d.losses;
        return { asset: sym, winRate: total > 0 ? Math.round(d.wins/total*100) : 0, wins: d.wins, losses: d.losses, total };
      }));
    };
    compute();
    const id = setInterval(compute, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ background:"#0f172a", border:"1px solid rgba(59,130,246,0.15)", borderRadius:12, padding:"20px 20px 16px" }}>
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:13, fontWeight:600, color:"#e2e8f0" }}>Asset Win Rate</div>
        <div style={{ fontSize:11, color:"#475569", marginTop:2 }}>Performance by crypto pair</div>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} layout="vertical" margin={{ top:0, right:44, left:10, bottom:0 }} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
          <XAxis type="number" domain={[0,100]} tick={{ fontSize:10, fill:"#334155" }} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} />
          <YAxis type="category" dataKey="asset" tick={{ fontSize:12, fill:"#94a3b8", fontWeight:600 }} tickLine={false} axisLine={false} width={36} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill:"rgba(255,255,255,0.02)" }} />
          <Bar dataKey="winRate" radius={[0,4,4,0]}>
            {data.map((d,i) => <Cell key={i} fill={ASSET_COLORS[d.asset] || "#3b82f6"} fillOpacity={0.85} />)}
            <LabelList dataKey="winRate" position="right" formatter={v => `${v}%`} style={{ fill:"#475569", fontSize:11 }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
