import { useEffect, useState } from "react";
import { getEntryTimingPnLStats } from "../engine/entryTimingPnLAnalytics";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid, ReferenceLine } from "recharts";
import { Clock } from "lucide-react";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const val = payload[0].value;
  const color = val >= 0 ? "#22d3ee" : "#f43f5e";
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
        {val !== null && val !== undefined
          ? val >= 0 ? `+${val}` : `${val}`
          : "—"}
      </div>
    </div>
  );
}

export default function EntryTimingPnLChart() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    setRows(getEntryTimingPnLStats());
  }, []);

  return (
    <div
      className="glass-card p-5"
      style={{ border: "1px solid rgba(34,211,238,0.15)" }}
    >
      <div className="flex items-center gap-2 mb-5">
        <Clock size={15} style={{ color: "#22d3ee" }} />
        <div>
          <h3 className="text-sm font-semibold" style={{ color: "#e2e8f0" }}>
            Entry Timing vs PnL
          </h3>
          <p className="text-[11px] mt-0.5" style={{ color: "rgba(226,232,240,.35)" }}>
            Edge decay over observation window
          </p>
        </div>
      </div>

      {rows.length === 0 ? (
        <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 6 }}>
          <Clock size={24} style={{ color: "rgba(34,211,238,0.2)" }} />
          <div style={{ fontSize: 12, color: "rgba(226,232,240,.3)" }}>Accumulating entry timing data…</div>
        </div>
      ) : (
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={rows} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barCategoryGap="32%">
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: "rgba(226,232,240,.4)" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "rgba(226,232,240,.3)" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
          <ReferenceLine y={0} stroke="rgba(255,255,255,0.1)" strokeDasharray="4 4" />
          <Bar dataKey="avgPnL" radius={[6, 6, 0, 0]}>
            {rows.map((r, i) => (
              <Cell
                key={i}
                fill={(r.avgPnL ?? 0) >= 0 ? "#22d3ee" : "#f43f5e"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      )}
    </div>
  );
}
