import { useState, useEffect } from "react";
import { getLivePrice } from "../engine/priceFeed";
import { loadResolvedSignals } from "../engine/signalPersistence";
import { AreaChart, Area, ResponsiveContainer, Tooltip, CartesianGrid, XAxis, YAxis } from "recharts";
import { TrendingUp, TrendingDown, Wallet, BarChart2, Award, Target } from "lucide-react";

const HOLDINGS = [
  { sym: "BTC", amount: 0.042, color: "#f59e0b" },
  { sym: "ETH", amount: 1.84, color: "#3b82f6" },
  { sym: "SOL", amount: 18.5, color: "#06b6d4" },
  { sym: "XRP", amount: 3200, color: "#10b981" },
  { sym: "USDT", amount: 1840, color: "#94a3b8" },
];
const DECIMALS = { BTC: 0, ETH: 2, SOL: 2, XRP: 4, USDT: 2 };

function usePrices() {
  const [prices, setPrices] = useState({ USDT: 1 });
  useEffect(() => {
    const tick = async () => {
      for (const sym of ["BTC", "ETH", "SOL", "XRP"]) {
        const p = await getLivePrice(sym);
        if (p) setPrices(prev => ({ ...prev, [sym]: p }));
      }
    };
    tick();
    const id = setInterval(tick, 5000);
    return () => clearInterval(id);
  }, []);
  return prices;
}

function buildEquityCurve() {
  const signals = loadResolvedSignals().slice(0, 150).reverse();
  let capital = 1000;
  return signals.map((s, i) => {
    capital += (s.pnl || 0) * 1000;
    return { i, equity: Number(capital.toFixed(2)) };
  });
}

export default function Portfolio() {
  const prices = usePrices();
  const [curve] = useState(buildEquityCurve);

  const holdings = HOLDINGS.map(h => ({
    ...h,
    price: prices[h.sym] || 0,
    value: (prices[h.sym] || 0) * h.amount,
  }));
  const totalValue = holdings.reduce((a, h) => a + h.value, 0);

  const signals = loadResolvedSignals().slice(0, 50);
  const wins = signals.filter(s => s.result === "WIN").length;
  const winRate = signals.length > 0 ? Math.round((wins / signals.length) * 100) : 0;
  const totalPnL = signals.reduce((a, s) => a + (s.pnl || 0), 0);

  const stats = [
    { label: "Portfolio Value", value: `$${totalValue.toFixed(2)}`, icon: Wallet, color: "#3b82f6", bg: "rgba(59,130,246,0.12)" },
    { label: "Total PnL", value: `${totalPnL >= 0 ? "+" : ""}${(totalPnL * 100).toFixed(2)}%`, icon: TrendingUp, color: totalPnL >= 0 ? "#10b981" : "#f43f5e", bg: totalPnL >= 0 ? "rgba(16,185,129,0.12)" : "rgba(244,63,94,0.12)" },
    { label: "Win Rate", value: `${winRate}%`, icon: Award, color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
    { label: "Signals Resolved", value: signals.length, icon: Target, color: "#06b6d4", bg: "rgba(6,182,212,0.12)" },
  ];

  return (
    <div className="px-6 py-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold" style={{ color: "#e2e8f0" }}>Portfolio</h1>
        <p className="text-xs mt-0.5" style={{ color: "rgba(226,232,240,.35)" }}>Simulated analytics portfolio</p>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="glass-card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
              <Icon size={18} style={{ color }} />
            </div>
            <div>
              <div className="text-[11px]" style={{ color: "rgba(226,232,240,.4)" }}>{label}</div>
              <div className="text-lg font-bold leading-tight" style={{ color }}>{value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Equity curve */}
      {curve.length > 2 && (
        <div className="glass-card p-5" style={{ border: "1px solid rgba(16,185,129,0.15)" }}>
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 size={15} style={{ color: "#10b981" }} />
            <h2 className="text-sm font-semibold" style={{ color: "#e2e8f0" }}>Equity Curve</h2>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={curve} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="eqGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="i" hide />
              <YAxis tick={{ fontSize: 10, fill: "rgba(226,232,240,.3)" }} />
              <Tooltip
                contentStyle={{ background: "#0f1223", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10 }}
                labelStyle={{ display: "none" }}
                formatter={v => [`$${v.toFixed(2)}`, "Equity"]}
              />
              <Area type="monotone" dataKey="equity" stroke="#10b981" strokeWidth={2} fill="url(#eqGrad)" dot={false} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Holdings */}
      <div className="glass-card overflow-hidden">
        <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <h2 className="text-sm font-semibold" style={{ color: "#e2e8f0" }}>Holdings</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {["Asset", "Amount", "Price", "Value", "Allocation"].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold" style={{ color: "rgba(226,232,240,.4)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {holdings.map(h => {
              const alloc = totalValue > 0 ? (h.value / totalValue) * 100 : 0;
              return (
                <tr key={h.sym} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold"
                        style={{ background: `${h.color}22`, color: h.color }}>
                        {h.sym[0]}
                      </div>
                      <span className="font-semibold" style={{ color: "#e2e8f0" }}>{h.sym}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs" style={{ color: "rgba(226,232,240,.6)" }}>
                    {h.amount.toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs" style={{ color: h.color }}>
                    {h.price ? `$${h.price.toLocaleString("en-US", { minimumFractionDigits: DECIMALS[h.sym], maximumFractionDigits: DECIMALS[h.sym] })}` : "—"}
                  </td>
                  <td className="px-5 py-3.5 font-semibold" style={{ color: "#e2e8f0" }}>
                    ${h.value.toFixed(2)}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                        <div className="h-full rounded-full" style={{ width: `${alloc}%`, background: h.color }} />
                      </div>
                      <span className="text-xs" style={{ color: "rgba(226,232,240,.5)" }}>{alloc.toFixed(1)}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
