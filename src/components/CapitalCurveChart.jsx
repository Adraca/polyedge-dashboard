import { getCapitalCurve } from "../engine/capitalCurve";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { TrendingUp } from "lucide-react";

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const val = payload[0].value;
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
      <div style={{ color: "#34d399", fontWeight: 700 }}>
        ${typeof val === "number" ? val.toFixed(2) : val}
      </div>
    </div>
  );
}

export default function CapitalCurveChart() {
  const curve = getCapitalCurve();

  if (!curve.length) {
    return (
      <div
        className="glass-card p-6 flex items-center justify-center"
        style={{ minHeight: 200 }}
      >
        <div className="text-center">
          <TrendingUp size={28} className="mx-auto mb-2" style={{ color: "rgba(226,232,240,0.2)" }} />
          <div className="text-sm" style={{ color: "rgba(226,232,240,.35)" }}>
            No resolved trades yet
          </div>
          <div className="text-xs mt-1" style={{ color: "rgba(226,232,240,.2)" }}>
            Curve appears once signals resolve
          </div>
        </div>
      </div>
    );
  }

  const data = curve.map(p => ({
    t: p.t,
    label: new Date(p.t).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
    capital: typeof p.capital === "number" ? Number(p.capital.toFixed(2)) : p.capital,
  }));

  return (
    <div
      className="glass-card p-5"
      style={{ border: "1px solid rgba(52,211,153,0.15)" }}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold" style={{ color: "#e2e8f0" }}>
            Capital Curve
          </h3>
          <p className="text-[11px] mt-0.5" style={{ color: "rgba(226,232,240,.35)" }}>
            Simulated equity growth
          </p>
        </div>
        <div
          className="px-3 py-1.5 rounded-lg text-xs font-semibold"
          style={{
            background: "rgba(52,211,153,0.12)",
            color: "#34d399",
            border: "1px solid rgba(52,211,153,0.2)",
          }}
        >
          {data.length} trades
        </div>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="capitalGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#34d399" stopOpacity={0.28} />
              <stop offset="95%" stopColor="#34d399" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="label" tick={{ fontSize: 9, fill: "rgba(226,232,240,.3)" }} tickLine={false} axisLine={false} interval={Math.max(1, Math.floor(data.length / 5))} />
          <YAxis
            tick={{ fontSize: 10, fill: "rgba(226,232,240,.3)" }}
            tickLine={false}
            axisLine={false}
            domain={[dataMin => Math.floor(dataMin * 0.97), dataMax => Math.ceil(dataMax * 1.02)]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="capital"
            stroke="#34d399"
            strokeWidth={2}
            fill="url(#capitalGradient)"
            dot={false}
            activeDot={{ r: 4, fill: "#34d399", stroke: "rgba(52,211,153,0.5)", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
