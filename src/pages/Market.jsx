import { useState, useEffect } from "react";
import { getLivePrice } from "../engine/priceFeed";
import { TrendingUp, TrendingDown, Search, RefreshCw, ExternalLink } from "lucide-react";

const MARKETS = [
  { id: 1, pair: "BTC/USDT", sym: "BTC", category: "Crypto", vol: "$67.4B", question: "Will BTC close above $70K today?" },
  { id: 2, pair: "ETH/USDT", sym: "ETH", category: "Crypto", vol: "$33.5B", question: "Will ETH exceed $3,500 by EOD?" },
  { id: 3, pair: "SOL/USDT", sym: "SOL", category: "Crypto", vol: "$6.4B", question: "SOL to hit $140 before month end?" },
  { id: 4, pair: "XRP/USDT", sym: "XRP", category: "Crypto", vol: "$4.1B", question: "XRP above $0.65 by Friday?" },
  { id: 5, pair: "BTC Fed Reserve", sym: "BTC", category: "Macro", vol: "$12.1B", question: "Fed to cut rates before BTC halving?" },
  { id: 6, pair: "ETH ETF Volume", sym: "ETH", category: "Macro", vol: "$8.9B", question: "ETH ETF daily volume >$500M this week?" },
  { id: 7, pair: "SOL Mainnet", sym: "SOL", category: "Tech", vol: "$2.3B", question: "SOL TPS to exceed 65K this month?" },
  { id: 8, pair: "BTC Dominance", sym: "BTC", category: "Market", vol: "$5.7B", question: "BTC market dominance >55% by Q2?" },
];

const ASSET_COLORS = {
  BTC: "#f59e0b", ETH: "#3b82f6", SOL: "#06b6d4", XRP: "#10b981",
};

function useLiveMarketData() {
  const [prices, setPrices] = useState({});
  const [changes, setChanges] = useState({});

  useEffect(() => {
    const prev = {};
    const tick = async () => {
      for (const sym of ["BTC", "ETH", "SOL", "XRP"]) {
        const p = await getLivePrice(sym);
        if (p) {
          if (prev[sym]) {
            setChanges(c => ({ ...c, [sym]: ((p - prev[sym]) / prev[sym]) * 100 }));
          }
          prev[sym] = p;
          setPrices(cur => ({ ...cur, [sym]: p }));
        }
      }
    };
    tick();
    const id = setInterval(tick, 3000);
    return () => clearInterval(id);
  }, []);

  return { prices, changes };
}

const DECIMALS = { BTC: 0, ETH: 2, SOL: 3, XRP: 4 };

export default function Market() {
  const { prices, changes } = useLiveMarketData();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = ["All", "Crypto", "Macro", "Tech", "Market"];

  const filtered = MARKETS.filter(m => {
    const matchCat = category === "All" || m.category === category;
    const matchSearch = m.pair.toLowerCase().includes(search.toLowerCase()) ||
      m.question.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="px-6 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "#e2e8f0" }}>Markets</h1>
          <p className="text-xs mt-0.5" style={{ color: "rgba(226,232,240,.35)" }}>
            {MARKETS.length} active prediction markets
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold"
          style={{ background: "rgba(59,130,246,0.15)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.3)" }}
        >
          <RefreshCw size={12} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl flex-1 max-w-xs"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <Search size={13} style={{ color: "rgba(226,232,240,.4)" }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search markets…"
            className="bg-transparent text-sm outline-none w-full"
            style={{ color: "#e2e8f0" }}
          />
        </div>
        <div className="flex gap-1.5">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: category === c ? "rgba(59,130,246,0.2)" : "rgba(255,255,255,0.04)",
                color: category === c ? "#60a5fa" : "rgba(226,232,240,.45)",
                border: `1px solid ${category === c ? "rgba(59,130,246,0.35)" : "rgba(255,255,255,0.07)"}`,
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Market table */}
      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {["Market", "Live Price", "24h Vol", "Probability", ""].map(h => (
                <th
                  key={h}
                  className="px-5 py-3 text-left text-xs font-semibold"
                  style={{ color: "rgba(226,232,240,.4)" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((m, i) => {
              const price = prices[m.sym];
              const change = changes[m.sym] || 0;
              const color = ASSET_COLORS[m.sym];
              const isUp = change >= 0;
              const prob = Math.round(50 + Math.random() * 30);

              return (
                <tr
                  key={m.id}
                  className="transition-colors"
                  style={{
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                    animationDelay: `${i * 40}ms`,
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.025)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: `${color}22`, color }}
                      >
                        {m.sym[0]}
                      </div>
                      <div>
                        <div className="font-semibold" style={{ color: "#e2e8f0" }}>{m.pair}</div>
                        <div className="text-[10px] mt-0.5 max-w-[200px] truncate" style={{ color: "rgba(226,232,240,.4)" }}>
                          {m.question}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="font-mono font-semibold" style={{ color }}>
                      {price
                        ? `$${price.toLocaleString("en-US", { minimumFractionDigits: DECIMALS[m.sym], maximumFractionDigits: DECIMALS[m.sym] })}`
                        : "—"
                      }
                    </div>
                    {price && (
                      <div className="flex items-center gap-0.5 text-[10px] mt-0.5" style={{ color: isUp ? "#10b981" : "#f43f5e" }}>
                        {isUp ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
                        {Math.abs(change).toFixed(3)}%
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-xs" style={{ color: "rgba(226,232,240,.55)" }}>
                    {m.vol}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)", maxWidth: 80 }}>
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${prob}%`, background: prob > 65 ? "#10b981" : prob > 45 ? "#f59e0b" : "#f43f5e" }}
                        />
                      </div>
                      <span className="text-xs font-semibold" style={{ color: prob > 65 ? "#10b981" : prob > 45 ? "#f59e0b" : "#f43f5e" }}>
                        {prob}%
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <a
                      href="https://polymarket.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs font-semibold transition-colors"
                      style={{ color: "rgba(167,139,250,.7)" }}
                    >
                      Trade <ExternalLink size={10} />
                    </a>
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
