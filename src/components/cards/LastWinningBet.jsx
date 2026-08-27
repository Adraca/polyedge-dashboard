import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";

export default function LastWinningBet() {
  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("lastWinningClaimed") === "true") setClaimed(true);
  }, []);

  const handleClaim = () => {
    setClaimed(true);
    localStorage.setItem("lastWinningClaimed", "true");
  };

  const resetDemo = () => {
    localStorage.removeItem("lastWinningClaimed");
    setClaimed(false);
  };

  return (
    <div
      className="relative mx-2 mt-1 rounded-xl overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(59,130,246,0.18) 0%, rgba(6,182,212,0.12) 100%)",
        border: "1px solid rgba(59,130,246,0.3)",
        boxShadow: "0 0 24px rgba(59,130,246,0.1), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      {/* Ticket punch holes */}
      <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full" style={{ background: "#0B0E14" }} />
      <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full" style={{ background: "#0B0E14" }} />

      {/* Top stripe */}
      <div className="h-0.5 w-full" style={{ background: "linear-gradient(90deg, transparent, #3b82f6, #06b6d4, transparent)" }} />

      <div className="px-3 pt-3 pb-3">
        <div
          className="text-[9px] font-semibold uppercase tracking-widest mb-1"
          style={{ color: "rgba(96,165,250,0.7)" }}
        >
          Last Winning Bet
        </div>

        <div className="text-xs font-bold" style={{ color: "#e2e8f0" }}>
          FOMC Result — Rate Hold
        </div>
        <div className="text-[10px] mt-0.5 mb-2.5" style={{ color: "rgba(226,232,240,0.45)" }}>
          YES · Stake $2,500
        </div>

        <div
          className="text-xl font-black mb-3"
          style={{
            background: "linear-gradient(90deg, #3b82f6, #06b6d4)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          +10,000 USDC
        </div>

        {!claimed ? (
          <button
            onClick={handleClaim}
            className="w-full rounded-lg py-1.5 text-xs font-semibold transition-all"
            style={{
              background: "rgba(59,130,246,0.2)",
              color: "#60a5fa",
              border: "1px solid rgba(59,130,246,0.35)",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(59,130,246,0.35)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(59,130,246,0.2)"; }}
          >
            Claim Winnings
          </button>
        ) : (
          <>
            <div
              className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold mb-1.5"
              style={{ background: "rgba(16,185,129,0.12)", color: "#34d399", border: "1px solid rgba(16,185,129,0.2)" }}
            >
              <CheckCircle size={11} />
              Claimed
            </div>
            <button
              onClick={resetDemo}
              className="w-full text-[10px] text-center transition-colors"
              style={{ color: "rgba(226,232,240,0.2)" }}
              onMouseEnter={e => { e.currentTarget.style.color = "rgba(226,232,240,0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "rgba(226,232,240,0.2)"; }}
            >
              Reset demo
            </button>
          </>
        )}
      </div>

      <div className="h-0.5 w-full" style={{ background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.3), transparent)" }} />
    </div>
  );
}
