import { useState } from "react";
import { Bell, Zap, Eye, Moon, Shield, RefreshCw, Trash2, Info } from "lucide-react";

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="relative w-10 h-5 rounded-full transition-all flex-shrink-0"
      style={{ background: checked ? "rgba(59,130,246,0.8)" : "rgba(255,255,255,0.12)" }}
    >
      <span
        className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
        style={{ left: checked ? "calc(100% - 18px)" : 2, boxShadow: "0 1px 4px rgba(0,0,0,0.4)" }}
      />
    </button>
  );
}

function SettingRow({ icon: Icon, label, desc, checked, onChange, color = "#3b82f6" }) {
  return (
    <div
      className="flex items-center justify-between px-5 py-4"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
          <Icon size={15} style={{ color }} />
        </div>
        <div>
          <div className="text-sm font-semibold" style={{ color: "#e2e8f0" }}>{label}</div>
          {desc && <div className="text-[11px] mt-0.5" style={{ color: "rgba(226,232,240,.4)" }}>{desc}</div>}
        </div>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

export default function Settings() {
  const [settings, setSettings] = useState({
    notifications: true,
    sound: false,
    animations: true,
    darkMode: true,
    autoSeed: true,
    liveData: true,
    drawdownGuard: true,
    confidenceFilter: true,
  });

  const set = (key) => (val) => setSettings(prev => ({ ...prev, [key]: val }));

  const handleClearData = () => {
    if (confirm("Clear all resolved signal history from localStorage?")) {
      localStorage.removeItem("pm_resolved_signals_v1");
      alert("Signal history cleared. Refresh to reseed.");
    }
  };

  return (
    <div className="px-6 py-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold" style={{ color: "#e2e8f0" }}>Settings</h1>
        <p className="text-xs mt-0.5" style={{ color: "rgba(226,232,240,.35)" }}>Dashboard preferences and engine configuration</p>
      </div>

      {/* Notifications */}
      <div className="glass-card overflow-hidden">
        <div className="px-5 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(226,232,240,.3)" }}>Alerts & UX</span>
        </div>
        <SettingRow icon={Bell} label="Signal Notifications" desc="Browser push alerts for new high-confidence signals" checked={settings.notifications} onChange={set("notifications")} color="#3b82f6" />
        <SettingRow icon={Zap} label="Sound Alerts" desc="Audio cue on urgent signal (resolve &lt;5 min)" checked={settings.sound} onChange={set("sound")} color="#f59e0b" />
        <SettingRow icon={Eye} label="Animations" desc="Framer Motion entrance animations and pulse effects" checked={settings.animations} onChange={set("animations")} color="#06b6d4" />
        <SettingRow icon={Moon} label="Dark Mode" desc="Premium dark theme (always on in this build)" checked={settings.darkMode} onChange={set("darkMode")} color="#94a3b8" />
      </div>

      {/* Engine */}
      <div className="glass-card overflow-hidden">
        <div className="px-5 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(226,232,240,.3)" }}>Engine</span>
        </div>
        <SettingRow icon={RefreshCw} label="Live Data Feed" desc="Binance WebSocket real-time price feed" checked={settings.liveData} onChange={set("liveData")} color="#10b981" />
        <SettingRow icon={Shield} label="Drawdown Guard" desc="Block signals when daily loss exceeds 5%" checked={settings.drawdownGuard} onChange={set("drawdownGuard")} color="#f43f5e" />
        <SettingRow icon={Zap} label="Auto-Seed History" desc="Seed synthetic signal history on first load" checked={settings.autoSeed} onChange={set("autoSeed")} color="#3b82f6" />
      </div>

      {/* Data management */}
      <div className="glass-card overflow-hidden">
        <div className="px-5 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(226,232,240,.3)" }}>Data</span>
        </div>
        <div className="px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(244,63,94,0.15)" }}>
              <Trash2 size={15} style={{ color: "#f43f5e" }} />
            </div>
            <div>
              <div className="text-sm font-semibold" style={{ color: "#e2e8f0" }}>Clear Signal History</div>
              <div className="text-[11px] mt-0.5" style={{ color: "rgba(226,232,240,.4)" }}>Remove all resolved signals from localStorage</div>
            </div>
          </div>
          <button
            onClick={handleClearData}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold"
            style={{ background: "rgba(244,63,94,0.15)", color: "#f43f5e", border: "1px solid rgba(244,63,94,0.3)" }}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Version info */}
      <div
        className="flex items-start gap-3 p-4 rounded-xl text-xs"
        style={{ background: "rgba(59,130,246,0.07)", border: "1px solid rgba(59,130,246,0.18)" }}
      >
        <Info size={14} style={{ color: "#60a5fa", flexShrink: 0, marginTop: 1 }} />
        <div style={{ color: "rgba(226,232,240,.55)" }}>
          <span style={{ color: "#60a5fa", fontWeight: 600 }}>PolyEdge Premium</span> · Analytics only · No execution ·
          Real-time prices via Binance WebSocket · Signals are model-derived for research purposes.
        </div>
      </div>
    </div>
  );
}
