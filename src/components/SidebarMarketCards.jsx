const markets = [
  { title: "Fed Decision", date: "Jan 29", yesProb: 72, status: "Ongoing" },
  { title: "Trump VP Pick", date: "Feb 3", yesProb: 58, status: "Upcoming" },
  { title: "ETH ETF Approval", date: "Mar 15", yesProb: 81, status: "Upcoming" },
  { title: "CPI Inflation Report", date: "Apr 10", yesProb: 45, status: "Upcoming" },
  { title: "FOMC Minutes", date: "Apr 25", yesProb: 63, status: "Upcoming" },
];

function MarketTicket({ m }) {
  const noProb = 100 - m.yesProb;
  return (
    <div
      className="relative mx-2 rounded-xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(11,14,20,0.98) 100%)",
        border: "1px solid rgba(59,130,246,0.2)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(59,130,246,0.08)",
      }}
    >
      {/* Ticket punch holes */}
      <div
        className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full"
        style={{ background: "#0B0E14" }}
      />
      <div
        className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full"
        style={{ background: "#0B0E14" }}
      />

      {/* Top accent line */}
      <div
        className="h-0.5 w-full"
        style={{ background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.5), transparent)" }}
      />

      <div className="px-3 py-2.5">
        <div className="flex items-start justify-between mb-1.5">
          <div>
            <div className="text-[10px] font-medium" style={{ color: "rgba(226,232,240,0.38)" }}>
              {m.date}
            </div>
            <div className="text-xs font-semibold leading-snug mt-0.5" style={{ color: "#e2e8f0" }}>
              {m.title}
            </div>
          </div>
          <span
            className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md flex-shrink-0 ml-2 mt-0.5"
            style={{
              background: m.status === "Ongoing" ? "rgba(16,185,129,0.15)" : "rgba(59,130,246,0.12)",
              color: m.status === "Ongoing" ? "#34d399" : "#60a5fa",
              border: `1px solid ${m.status === "Ongoing" ? "rgba(16,185,129,0.25)" : "rgba(59,130,246,0.2)"}`,
            }}
          >
            {m.status}
          </span>
        </div>

        {/* Probability bar */}
        <div className="mb-2">
          <div className="flex justify-between text-[9px] mb-1" style={{ color: "rgba(226,232,240,0.35)" }}>
            <span>YES {m.yesProb}%</span>
            <span>NO {noProb}%</span>
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${m.yesProb}%`,
                background: "linear-gradient(90deg, #3b82f6, #06b6d4)",
              }}
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-1.5">
          <button
            className="flex-1 py-1 rounded-lg text-[10px] font-semibold transition-all"
            style={{
              background: "rgba(59,130,246,0.15)",
              color: "#60a5fa",
              border: "1px solid rgba(59,130,246,0.25)",
            }}
          >
            YES
          </button>
          <button
            className="flex-1 py-1 rounded-lg text-[10px] font-semibold transition-all"
            style={{
              background: "rgba(244,63,94,0.1)",
              color: "#f87171",
              border: "1px solid rgba(244,63,94,0.2)",
            }}
          >
            NO
          </button>
        </div>
      </div>

      {/* Bottom accent line */}
      <div
        className="h-0.5 w-full"
        style={{ background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.3), transparent)" }}
      />
    </div>
  );
}

export default function SidebarMarketCards() {
  return (
    <div className="space-y-2.5">
      <div className="px-4 pt-4 pb-1">
        <span
          className="text-[10px] font-semibold uppercase tracking-widest"
          style={{ color: "rgba(226,232,240,0.22)" }}
        >
          Markets
        </span>
      </div>
      {markets.map(m => (
        <MarketTicket key={m.title} m={m} />
      ))}
    </div>
  );
}
