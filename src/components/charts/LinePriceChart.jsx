import { useEffect, useState, useRef } from "react";
import { getLivePrice } from "../../engine/priceFeed";
import {
  AreaChart, Area, LineChart, Line, ResponsiveContainer,
  XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine
} from "recharts";

const ASSETS = [
  { sym: "BTC", color: "#f59e0b", decimals: 0 },
  { sym: "ETH", color: "#3b82f6", decimals: 2 },
  { sym: "SOL", color: "#06b6d4", decimals: 3 },
  { sym: "XRP", color: "#10b981", decimals: 4 },
];

function CustomTooltip({ active, payload, label, color, decimals }) {
  if (!active || !payload?.length) return null;
  const val = payload[0]?.value;
  return (
    <div
      style={{
        background: "#0b0e1f",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 10,
        padding: "8px 12px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
      }}
    >
      <div style={{ color, fontWeight: 700, fontSize: 13 }}>
        ${val?.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      </div>
      <div style={{ color: "rgba(226,232,240,.4)", fontSize: 10, marginTop: 2 }}>
        tick #{label}
      </div>
    </div>
  );
}

export default function LinePriceChart() {
  const [selected, setSelected] = useState("BTC");
  const [data, setData] = useState([]);
  const [change, setChange] = useState(null);
  const bufferRef = useRef([]);
  const tickRef = useRef(0);

  const asset = ASSETS.find(a => a.sym === selected);

  useEffect(() => {
    bufferRef.current = [];
    tickRef.current = 0;
    setData([]);
    setChange(null);

    const tick = async () => {
      const price = await getLivePrice(selected);
      if (!price) return;

      const point = { t: tickRef.current++, price: Number(price.toFixed(asset.decimals)) };
      bufferRef.current = [...bufferRef.current.slice(-59), point];
      setData([...bufferRef.current]);

      if (bufferRef.current.length >= 2) {
        const first = bufferRef.current[0].price;
        const last = bufferRef.current[bufferRef.current.length - 1].price;
        setChange(((last - first) / first) * 100);
      }
    };

    tick();
    const id = setInterval(tick, 2000);
    return () => clearInterval(id);
  }, [selected]);

  const isUp = change === null ? true : change >= 0;
  const color = asset.color;
  const latest = data[data.length - 1]?.price;

  return (
    <div>
      {/* Asset selector */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-base font-bold" style={{ color: "#e2e8f0" }}>
            {selected}/USDT
            {latest && (
              <span className="ml-2 font-mono text-sm" style={{ color }}>
                ${latest.toLocaleString("en-US", { minimumFractionDigits: asset.decimals, maximumFractionDigits: asset.decimals })}
              </span>
            )}
          </div>
          {change !== null && (
            <div
              className="text-xs font-semibold mt-0.5"
              style={{ color: isUp ? "#10b981" : "#f43f5e" }}
            >
              {isUp ? "▲" : "▼"} {Math.abs(change).toFixed(3)}% this session
            </div>
          )}
        </div>

        <div className="flex gap-1.5">
          {ASSETS.map(a => (
            <button
              key={a.sym}
              onClick={() => setSelected(a.sym)}
              className="px-3 py-1 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: selected === a.sym ? `${a.color}22` : "rgba(255,255,255,0.04)",
                color: selected === a.sym ? a.color : "rgba(226,232,240,.45)",
                border: `1px solid ${selected === a.sym ? a.color + "44" : "rgba(255,255,255,0.07)"}`,
              }}
            >
              {a.sym}
            </button>
          ))}
        </div>
      </div>

      {data.length === 0 ? (
        <div
          className="rounded-xl shimmer"
          style={{ height: 160 }}
        />
      ) : (
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
            <defs>
              <linearGradient id={`priceGrad-${selected}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.25} />
                <stop offset="95%" stopColor={color} stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="t" hide />
            <YAxis
              domain={["auto", "auto"]}
              tick={{ fontSize: 9, fill: "rgba(226,232,240,.3)" }}
              tickFormatter={v => v.toLocaleString("en-US", { maximumFractionDigits: asset.decimals })}
            />
            <Tooltip content={<CustomTooltip color={color} decimals={asset.decimals} />} />
            <Area
              type="monotone"
              dataKey="price"
              stroke={color}
              strokeWidth={2}
              fill={`url(#priceGrad-${selected})`}
              dot={false}
              activeDot={{ r: 4, fill: color, strokeWidth: 0 }}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
