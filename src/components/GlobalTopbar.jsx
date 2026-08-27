import { useEffect, useState } from "react";
import { getLivePrice } from "../engine/priceFeed";
import { Bell, Search } from "lucide-react";

function useLivePrice(sym) {
  const [price, setPrice] = useState(null);
  const [change, setChange] = useState(null);
  useEffect(() => {
    let prev = null;
    const tick = async () => {
      const p = await getLivePrice(sym);
      if (p) {
        if (prev !== null) setChange(p > prev ? 1 : p < prev ? -1 : 0);
        prev = p;
        setPrice(p);
      }
    };
    tick();
    const id = setInterval(tick, 3000);
    return () => clearInterval(id);
  }, [sym]);
  return { price, change };
}

function LivePricePill({ sym, decimals = 2 }) {
  const { price, change } = useLivePrice(sym);
  const color = change === 1 ? "#10b981" : change === -1 ? "#f43f5e" : "#94a3b8";
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: "rgba(255,255,255,0.04)" }}>
      <span className="text-xs font-semibold" style={{ color: "rgba(226,232,240,0.45)" }}>{sym}</span>
      <span className="font-mono text-sm font-semibold transition-colors duration-500" style={{ color }}>
        {price
          ? `$${price.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`
          : "—"}
      </span>
    </div>
  );
}

function LiveClock() {
  const [t, setT] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="font-mono text-xs" style={{ color: "rgba(226,232,240,0.35)" }}>
      {t.toLocaleTimeString("en-US", { hour12: false })} UTC
    </span>
  );
}

export default function GlobalTopbar() {
  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between px-6 py-3"
      style={{
        background: "#0D1117",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        minHeight: 56,
      }}
    >
      {/* Left: search */}
      <div className="flex items-center gap-3">
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", cursor: "text" }}
        >
          <Search size={13} style={{ color: "rgba(226,232,240,0.35)" }} />
          <span className="text-xs" style={{ color: "rgba(226,232,240,0.28)" }}>Search markets…</span>
          <kbd className="ml-2 text-[10px]" style={{ color: "rgba(226,232,240,0.18)" }}>⌘K</kbd>
        </div>
      </div>

      {/* Center: live prices */}
      <div className="hidden md:flex items-center gap-2">
        <LivePricePill sym="BTC" decimals={0} />
        <LivePricePill sym="ETH" decimals={2} />
        <LivePricePill sym="SOL" decimals={2} />
        <LivePricePill sym="XRP" decimals={4} />
      </div>

      {/* Right: status + clock + bell */}
      <div className="flex items-center gap-4">
        <LiveClock />
        <div className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: "#10b981", boxShadow: "0 0 6px rgba(16,185,129,0.7)" }}
          />
          <span className="text-xs hidden sm:block" style={{ color: "rgba(226,232,240,0.4)" }}>Live</span>
        </div>
        <button
          className="p-2 rounded-lg transition-colors"
          style={{ color: "rgba(226,232,240,0.45)" }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          title="Notifications"
        >
          <Bell size={15} />
        </button>
      </div>
    </header>
  );
}
