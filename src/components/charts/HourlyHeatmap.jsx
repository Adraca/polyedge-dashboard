import { useEffect, useState } from "react";
import { getLastResolvedSignals } from "../../engine/Crypto15mSignalEngine";

function HourCell({ hour, winRate, count }) {
  const intensity = winRate === null ? 0 : (winRate - 50) / 50;
  const bg = winRate === null
    ? "#161B22"
    : winRate >= 70
      ? `rgba(16,185,129,${0.15 + intensity * 0.5})`
      : winRate >= 50
        ? `rgba(245,158,11,${0.1 + (winRate-50)/20 * 0.3})`
        : `rgba(244,63,94,${0.1 + (50-winRate)/50 * 0.4})`;
  const border = winRate === null
    ? "#1e293b"
    : winRate >= 70 ? "rgba(16,185,129,0.35)" : winRate >= 50 ? "rgba(245,158,11,0.25)" : "rgba(244,63,94,0.3)";
  const textColor = winRate === null ? "#334155"
    : winRate >= 70 ? "#34d399" : winRate >= 50 ? "#f59e0b" : "#f87171";

  return (
    <div
      title={`${hour}:00 UTC — ${winRate !== null ? winRate + "% win rate, " + count + " trades" : "no data"}`}
      style={{
        flex:1, minWidth:0, textAlign:"center",
        padding:"8px 2px", borderRadius:6,
        background: bg, border:`1px solid ${border}`,
        cursor:"default", transition:"opacity 0.15s",
      }}
      onMouseEnter={e => e.currentTarget.style.opacity="0.8"}
      onMouseLeave={e => e.currentTarget.style.opacity="1"}
    >
      <div style={{ fontSize:9, color:"#475569", lineHeight:1 }}>{String(hour).padStart(2,"0")}</div>
      <div style={{ fontSize:11, fontWeight:700, color:textColor, marginTop:3, lineHeight:1 }}>
        {winRate !== null ? `${winRate}%` : "·"}
      </div>
      {count > 0 && <div style={{ fontSize:8, color:"#334155", marginTop:2 }}>{count}t</div>}
    </div>
  );
}

export default function HourlyHeatmap() {
  const [hours, setHours] = useState(Array.from({length:24},(_,i) => ({ hour:i, winRate:null, count:0 })));

  useEffect(() => {
    const compute = () => {
      const signals = getLastResolvedSignals(500);
      const map = Array.from({length:24}, () => ({ wins:0, total:0 }));
      signals.forEach(s => {
        const h = new Date(s.resolveAt).getUTCHours();
        map[h].total++;
        if (s.result === "WIN") map[h].wins++;
      });
      setHours(map.map((d,h) => ({
        hour:h,
        winRate: d.total > 0 ? Math.round(d.wins/d.total*100) : null,
        count: d.total,
      })));
    };
    compute();
    const id = setInterval(compute, 10000);
    return () => clearInterval(id);
  }, []);

  const best = hours.filter(h => h.count >= 3).sort((a,b) => (b.winRate||0)-(a.winRate||0))[0];

  return (
    <div style={{ background:"#0f172a", border:"1px solid rgba(14,165,233,0.18)", borderRadius:12, padding:"20px 20px 16px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
        <div>
          <div style={{ fontSize:13, fontWeight:600, color:"#e2e8f0" }}>Hourly Win Rate</div>
          <div style={{ fontSize:11, color:"#475569", marginTop:2 }}>UTC hours · best times to trade</div>
        </div>
        {best && (
          <div style={{ fontSize:11, color:"#94a3b8" }}>
            Peak <span style={{ color:"#34d399", fontWeight:700 }}>{String(best.hour).padStart(2,"0")}:00</span>
            {" "}at <span style={{ color:"#34d399", fontWeight:700 }}>{best.winRate}%</span>
          </div>
        )}
      </div>
      <div style={{ display:"flex", gap:3, flexWrap:"nowrap", overflowX:"auto" }}>
        {hours.map(h => <HourCell key={h.hour} {...h} />)}
      </div>
      <div style={{ display:"flex", gap:12, marginTop:10, fontSize:10, color:"#475569" }}>
        <span style={{ display:"flex", alignItems:"center", gap:4 }}>
          <span style={{ width:8, height:8, borderRadius:2, background:"rgba(16,185,129,0.5)", display:"inline-block" }}/>
          ≥ 70%
        </span>
        <span style={{ display:"flex", alignItems:"center", gap:4 }}>
          <span style={{ width:8, height:8, borderRadius:2, background:"rgba(245,158,11,0.4)", display:"inline-block" }}/>
          50–70%
        </span>
        <span style={{ display:"flex", alignItems:"center", gap:4 }}>
          <span style={{ width:8, height:8, borderRadius:2, background:"rgba(244,63,94,0.3)", display:"inline-block" }}/>
          {"< 50%"}
        </span>
      </div>
    </div>
  );
}
