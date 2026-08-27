import { useEffect, useState } from "react";
import { getLastResolvedSignals } from "../../engine/Crypto15mSignalEngine";
import { ComposedChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from "recharts";

const BUCKETS = [
  {min:0.60,max:0.65,mid:62.5}, {min:0.65,max:0.70,mid:67.5},
  {min:0.70,max:0.75,mid:72.5}, {min:0.75,max:0.80,mid:77.5},
  {min:0.80,max:0.85,mid:82.5}, {min:0.85,max:0.90,mid:87.5},
];

function DotShape(props) {
  const { cx, cy, payload } = props;
  if (!payload || payload.count < 3) return null;
  const r = Math.max(5, Math.min(14, payload.count / 4));
  const color = payload.actualWinRate >= payload.predicted - 5 ? "#10b981" : "#f43f5e";
  return <circle cx={cx} cy={cy} r={r} fill={color} fillOpacity={0.7} stroke={color} strokeWidth={1} />;
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  return (
    <div style={{ background:"#161B22", border:"1px solid #1e293b", borderRadius:8, padding:"8px 12px" }}>
      <div style={{ fontSize:11, color:"#475569" }}>Predicted: {d.predicted}%</div>
      <div style={{ fontSize:13, fontWeight:700, color: d.actualWinRate >= d.predicted - 5 ? "#10b981" : "#f43f5e" }}>
        Actual: {d.actualWinRate}%
      </div>
      <div style={{ fontSize:11, color:"#334155", marginTop:2 }}>{d.count} trades in bucket</div>
    </div>
  );
}

export default function CalibrationChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const compute = () => {
      const signals = getLastResolvedSignals(500);
      setData(BUCKETS.map(b => {
        const sigs = signals.filter(s => s.confidence >= b.min && s.confidence < b.max);
        const wins = sigs.filter(s => s.result === "WIN").length;
        return {
          predicted: b.mid,
          actualWinRate: sigs.length > 0 ? Math.round(wins / sigs.length * 100) : null,
          count: sigs.length,
        };
      }).filter(d => d.actualWinRate !== null));
    };
    compute();
    const id = setInterval(compute, 8000);
    return () => clearInterval(id);
  }, []);

  const hasData = data.length >= 2;

  return (
    <div style={{ background:"#0f172a", border:"1px solid rgba(16,185,129,0.18)", borderRadius:12, padding:"20px 20px 16px" }}>
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:13, fontWeight:600, color:"#e2e8f0" }}>Calibration Curve</div>
        <div style={{ fontSize:11, color:"#475569", marginTop:2 }}>Predicted confidence vs actual win rate · perfect = diagonal</div>
      </div>
      {!hasData ? (
        <div style={{ height:160, display:"flex", alignItems:"center", justifyContent:"center", color:"#334155", fontSize:12 }}>
          Need more resolved signals across confidence buckets
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={160}>
          <ComposedChart data={data} margin={{ top:4, right:4, left:-20, bottom:0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="predicted" type="number" domain={[60,90]} tick={{ fontSize:10, fill:"#334155" }} tickLine={false} axisLine={false} tickFormatter={v=>`${v}%`} />
            <YAxis domain={[0,100]} tick={{ fontSize:10, fill:"#334155" }} tickLine={false} axisLine={false} tickFormatter={v=>`${v}%`} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine segment={[{x:60,y:60},{x:90,y:90}]} stroke="rgba(255,255,255,0.12)" strokeDasharray="6 4" />
            <Line type="monotone" dataKey="actualWinRate" stroke="#10b981" strokeWidth={2} dot={<DotShape />} isAnimationActive={false} activeDot={{ r:5, fill:"#10b981" }} />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
