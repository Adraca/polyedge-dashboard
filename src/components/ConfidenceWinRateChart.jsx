import { useEffect, useState } from "react";
import { getLastResolvedSignals } from "../engine/Crypto15mSignalEngine";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from "recharts";
import { BarChart2 } from "lucide-react";

const BUCKETS = [
  { min: 60, max: 65 },
  { min: 65, max: 70 },
  { min: 70, max: 75 },
  { min: 75, max: 80 },
  { min: 80, max: 85 },
];

function getBarColor(winRate) {
  if (winRate === null || winRate === undefined) return "rgba(255,255,255,0.1)";
  if (winRate >= 70) return "#34d399";
  if (winRate >= 60) return "#f59e0b";
  return "#f43f5e";
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const wr = payload[0].value;
  const color = wr >= 70 ? "#34d399" : wr >= 60 ? "#f59e0b" : "#f43f5e";
  return (
    <div
      style={{
        background: "#161B22",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 12,
        padding: "8px 12px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        fontSize: 13,
      }}
    >
      <div style={{ color: "rgba(226,232,240,.5)", fontSize: 11, marginBottom: 3 }}>{label}</div>
      <div style={{ color, fontWeight: 700 }}>
        {wr !== null && wr !== undefined ? `${wr}% win rate` : "No data"}
      </div>
    </div>
  );
}

export default function ConfidenceWinRateChart() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const compute = () => {
      const resolved = getLastResolvedSignals(200);
      setStats(
        BUCKETS.map(b => {
          const sigs = resolved.filter(s => {
            const pct = Math.round(s.confidence * 100);
            return pct >= b.min && pct < b.max;
          });
          const wins = sigs.filter(s => s.result === "WIN").length;
          return {
            label: `${b.min}–${b.max}%`,
            count: sigs.length,
            winRate: sigs.length > 0 ? Math.round((wins / sigs.length) * 100) : null,
          };
        })
      );
    };
    compute();
    const id = setInterval(compute, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="glass-card p-5"
      style={{ border: "1px solid rgba(59,130,246,0.15)" }}
    >
      <div className="flex items-center gap-2 mb-5">
        <BarChart2 size={15} style={{ color: "#60a5fa" }} />
        <div>
          <h3 className="text-sm font-semibold" style={{ color: "#e2e8f0" }}>
            Confidence vs Win Rate
          </h3>
          <p className="text-[11px] mt-0.5" style={{ color: "rgba(226,232,240,.35)" }}>
            Signal accuracy by confidence bucket
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={stats} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barCategoryGap="32%">
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: "rgba(226,232,240,.4)" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "rgba(226,232,240,.3)" }}
            domain={[0, 100]}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
          <Bar dataKey="winRate" radius={[6, 6, 0, 0]}>
            {stats.map((entry, i) => (
              <Cell key={i} fill={getBarColor(entry.winRate)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div
        className="flex items-center gap-4 mt-3"
        style={{ fontSize: 10, color: "rgba(226,232,240,.3)" }}
      >
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-sm inline-block" style={{ background: "#34d399" }} />
          ≥ 70%
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-sm inline-block" style={{ background: "#f59e0b" }} />
          60–70%
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-sm inline-block" style={{ background: "#f43f5e" }} />
          &lt; 60%
        </span>
      </div>
    </div>
  );
}
