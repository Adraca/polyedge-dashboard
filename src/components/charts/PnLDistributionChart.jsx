import { useEffect, useState } from "react";
import { getLastResolvedSignals } from "../../engine/Crypto15mSignalEngine";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from "recharts";

const BUCKETS = [
  { min: -Infinity, max: -0.02, label: "< -2%",     positive: false },
  { min: -0.02,     max: -0.01, label: "-2 to -1%", positive: false },
  { min: -0.01,     max: 0,     label: "-1 to 0%",  positive: false },
  { min: 0,         max: 0.01,  label: "0 to 1%",   positive: true  },
  { min: 0.01,      max: 0.02,  label: "1 to 2%",   positive: true  },
  { min: 0.02,      max: Infinity, label: "> 2%",   positive: true  },
];

export default function PnLDistributionChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const compute = () => {
      const signals = getLastResolvedSignals(500);
      setData(BUCKETS.map(b => ({
        label: b.label,
        count: signals.filter(s => (s.pnl ?? 0) >= b.min && (s.pnl ?? 0) < b.max).length,
        positive: b.positive,
      })));
    };
    compute();
    const id = setInterval(compute, 5000);
    return () => clearInterval(id);
  }, []);

  const total = data.reduce((a,d) => a + d.count, 0);

  return (
    <div style={{ background:"#0f172a", border:"1px solid rgba(245,158,11,0.15)", borderRadius:12, padding:"20px 20px 16px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
        <div>
          <div style={{ fontSize:13, fontWeight:600, color:"#e2e8f0" }}>PnL Distribution</div>
          <div style={{ fontSize:11, color:"#475569", marginTop:2 }}>Trade outcome spread · {total} trades</div>
        </div>
        <div style={{ display:"flex", gap:12, fontSize:10, color:"#475569" }}>
          <span style={{ display:"flex", alignItems:"center", gap:4 }}><span style={{ width:8, height:8, borderRadius:2, background:"#10b981", display:"inline-block" }}/>Profit</span>
          <span style={{ display:"flex", alignItems:"center", gap:4 }}><span style={{ width:8, height:8, borderRadius:2, background:"#f43f5e", display:"inline-block" }}/>Loss</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} margin={{ top:4, right:4, left:-20, bottom:0 }} barCategoryGap="20%">
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize:9, fill:"#334155" }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize:10, fill:"#334155" }} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              return (
                <div style={{ background:"#161B22", border:"1px solid #1e293b", borderRadius:8, padding:"8px 12px" }}>
                  <div style={{ fontSize:11, color:"#475569", marginBottom:3 }}>{label}</div>
                  <div style={{ fontSize:13, fontWeight:700, color:"#e2e8f0" }}>{payload[0].value} trades</div>
                  {total > 0 && <div style={{ fontSize:11, color:"#475569" }}>{Math.round(payload[0].value/total*100)}% of total</div>}
                </div>
              );
            }}
            cursor={{ fill:"rgba(255,255,255,0.02)" }}
          />
          <Bar dataKey="count" radius={[4,4,0,0]}>
            {data.map((d,i) => <Cell key={i} fill={d.positive ? "#10b981" : "#f43f5e"} fillOpacity={d.positive ? 0.8 : 0.7} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
