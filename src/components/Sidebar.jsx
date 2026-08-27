import { NavLink } from "react-router-dom";
import { LayoutDashboard, TrendingUp, BookOpen, Briefcase, Settings, Zap } from "lucide-react";
import LastWinningBet from "./cards/LastWinningBet";
import SidebarMarketCards from "./SidebarMarketCards";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/market", label: "Markets", icon: TrendingUp },
  { to: "/orderbook", label: "Orderbook", icon: BookOpen },
  { to: "/portfolio", label: "Portfolio", icon: Briefcase },
  { to: "/settings", label: "Settings", icon: Settings },
];

const CATEGORIES = [
  { label: "Top Markets", count: 10, dot: "#f59e0b" },
  { label: "High Probability", count: 8, dot: "#10b981" },
  { label: "Trending", count: 10, dot: "#06b6d4" },
  { label: "Crypto", count: 10, dot: "#3b82f6" },
  { label: "Politics", count: 6, dot: "#94a3b8" },
  { label: "Sports", count: 15, dot: "#94a3b8" },
];

export default function Sidebar() {
  const collapsed = false;
  return (
    <aside
      className="relative flex flex-col flex-shrink-0"
      style={{
        width: 220,
        minHeight: "100vh",
        background: "#0D1117",
        borderRight: "1px solid #1e293b",
        overflowX: "hidden",
        overflowY: "auto",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 overflow-hidden flex-shrink-0">
        <div
          className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #3b82f6, #06b6d4)", boxShadow: "0 0 14px rgba(59,130,246,0.4)" }}
        >
          <Zap size={14} style={{ color: "#fff" }} />
        </div>
        {!collapsed && (
          <div className="min-w-0 overflow-hidden">
            <div className="text-sm font-bold text-white tracking-tight whitespace-nowrap">
              Poly<span style={{ color: "#60a5fa" }}>Edge</span>
            </div>
            <div className="text-[10px] whitespace-nowrap" style={{ color: "rgba(255,255,255,0.28)" }}>
              Premium Analytics
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-shrink-0 px-2 space-y-0.5 pt-1">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            title={collapsed ? label : undefined}
            style={{ whiteSpace: "nowrap", overflow: "hidden" }}
          >
            <Icon size={17} className="flex-shrink-0" />
            {!collapsed && <span className="truncate">{label}</span>}
          </NavLink>
        ))}

        {!collapsed && (
          <>
            <div className="pt-5 pb-2 px-2">
              <span
                className="text-[10px] font-semibold uppercase tracking-widest"
                style={{ color: "rgba(226,232,240,0.22)" }}
              >
                Categories
              </span>
            </div>
            {CATEGORIES.map(c => (
              <div key={c.label} className="nav-item" style={{ cursor: "pointer" }}>
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: c.dot }}
                />
                <span className="flex-1 truncate text-[13px]">{c.label}</span>
                <span className="text-[11px]" style={{ color: "rgba(226,232,240,0.22)" }}>{c.count}</span>
              </div>
            ))}
          </>
        )}
      </nav>

      {/* Last Winning Bet + Market Cards (only when expanded) */}
      {!collapsed && (
        <div className="flex-1 pb-4">
          <div className="mt-4 mb-2">
            <LastWinningBet />
          </div>
          <SidebarMarketCards />
        </div>
      )}


      {/* Bottom live indicator */}
      <div
        className="px-4 py-4 flex-shrink-0"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        {!collapsed ? (
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full animate-pulse flex-shrink-0"
              style={{ background: "#10b981" }}
            />
            <span className="text-xs truncate" style={{ color: "rgba(226,232,240,0.32)" }}>
              Engine running
            </span>
          </div>
        ) : (
          <span
            className="w-2 h-2 rounded-full animate-pulse block mx-auto"
            style={{ background: "#10b981" }}
          />
        )}
      </div>
    </aside>
  );
}
