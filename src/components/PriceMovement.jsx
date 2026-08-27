import LinePriceChart from "./charts/LinePriceChart";
import { Activity } from "lucide-react";

export default function PriceMovement() {
  return (
    <div
      className="glass-card p-5"
      style={{ border: "1px solid rgba(59,130,246,0.15)" }}
    >
      <div className="flex items-center gap-2 mb-1">
        <Activity size={15} style={{ color: "#3b82f6" }} />
        <h3 className="text-sm font-semibold" style={{ color: "#e2e8f0" }}>
          Live Price Feed
        </h3>
        <span className="ml-auto flex items-center gap-1.5 text-[10px]" style={{ color: "rgba(226,232,240,.35)" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Binance WebSocket
        </span>
      </div>
      <LinePriceChart />
    </div>
  );
}
