import { useState } from "react";
import { getLastResolvedSignals } from "../engine/Crypto15mSignalEngine";

const GATEWAY = "http://100.125.158.117:4000";
const API_KEY = "sk-2c063145e57b0987b1c20d58cc978d62afc73f1cd40a8649d2d12da24aa45918";

export default function AISessionDigest() {
  const [digest, setDigest] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    const signals = getLastResolvedSignals(50);
    if (!signals.length) return;
    const wins = signals.filter(s => s.result === "WIN").length;
    const winRate = Math.round(wins / signals.length * 100);
    const totalPnL = signals.reduce((a,s) => a + (s.pnl||0), 0);
    const byAsset = ["BTC","ETH","SOL","XRP"].map(sym => {
      const ss = signals.filter(s => s.symbol === sym);
      const w = ss.filter(s => s.result === "WIN").length;
      return `${sym}: ${ss.length > 0 ? Math.round(w/ss.length*100) : 0}% (${ss.length} trades)`;
    }).join(", ");

    const prompt = `You are a professional quantitative trading analyst. Write a concise 3-sentence performance digest for this trading session. Be specific about numbers. Do not start with "I" or "This session".

Session stats: ${signals.length} resolved signals, ${winRate}% win rate, ${totalPnL >= 0 ? "+" : ""}${(totalPnL*100).toFixed(2)}% total PnL.
Per-asset win rates: ${byAsset}.

Write only the 3-sentence narrative, nothing else.`;

    setLoading(true);
    setDigest("");
    try {
      const res = await fetch(`${GATEWAY}/v1/chat/completions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${API_KEY}` },
        body: JSON.stringify({ model: "qwen3-max", max_tokens: 200, stream: true, messages: [{ role: "user", content: prompt }] }),
      });
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let text = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter(l => l.startsWith("data: ") && l !== "data: [DONE]");
        for (const line of lines) {
          try {
            const json = JSON.parse(line.slice(6));
            const delta = json.choices?.[0]?.delta?.content || "";
            text += delta;
            setDigest(text);
          } catch { /* skip malformed SSE line */ }
        }
      }
    } catch {
      setDigest("Could not reach AI gateway. Check fleet connectivity.");
    }
    setLoading(false);
  };

  return (
    <div style={{ background:"#0f172a", border:"1px solid rgba(59,130,246,0.2)", borderRadius:12, padding:"20px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom: digest || loading ? 14 : 0 }}>
        <div>
          <div style={{ fontSize:13, fontWeight:600, color:"#e2e8f0" }}>AI Session Digest</div>
          <div style={{ fontSize:11, color:"#475569", marginTop:2 }}>qwen3-max · narrative analysis</div>
        </div>
        <button
          onClick={generate}
          disabled={loading}
          style={{
            padding:"7px 14px", borderRadius:8, fontSize:12, fontWeight:600,
            background: loading ? "rgba(59,130,246,0.06)" : "linear-gradient(45deg,#3b82f6,#06b6d4)",
            color: loading ? "#475569" : "#fff", border:"none", cursor: loading ? "default" : "pointer",
            transition:"opacity 0.15s",
          }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity="0.85"; }}
          onMouseLeave={e => e.currentTarget.style.opacity="1"}
        >
          {loading ? "Generating…" : digest ? "Regenerate" : "Generate Digest"}
        </button>
      </div>
      {(digest || loading) && (
        <div style={{
          fontSize:13, lineHeight:1.8, color:"#94a3b8",
          borderTop:"1px solid #1e293b", paddingTop:14,
        }}>
          {loading && !digest
            ? <span style={{ color:"#334155" }}>Analyzing session performance…</span>
            : <span>{digest}{loading && <span style={{ color:"#3b82f6", marginLeft:2 }}>▌</span>}</span>
          }
        </div>
      )}
    </div>
  );
}
