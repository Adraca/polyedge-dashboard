/* =========================================================
   useAISignalExplanation
   Streams a live AI thesis for a signal from the fleet.
   Results are cached by signal.id so re-opens are instant.
========================================================= */

import { useState, useRef, useCallback } from "react";
import { stream } from "../services/litellm";

const cache = new Map(); // signal.id → parsed result

function buildPrompt(signal) {
  const conf = Math.round((signal.confidence || 0) * 100);
  const edge = signal.edge ? `${(signal.edge * 100).toFixed(1)}%` : "unknown";
  const mktProb = signal.marketProbability
    ? `${Math.round(signal.marketProbability * 100)}%`
    : "unknown";
  const delay = signal.entryDelayMs
    ? `${(signal.entryDelayMs / 60000).toFixed(1)}m after signal`
    : "immediate";
  const price = signal.priceAtStart ? `$${signal.priceAtStart.toLocaleString()}` : "unknown";

  return `You are a quantitative prediction market analyst. Analyze this 15-minute crypto signal concisely.

Signal data:
- Asset: ${signal.symbol} / USDT
- Direction: ${signal.direction || signal.bias}
- Model confidence: ${conf}%
- Market-implied probability: ${mktProb}
- Edge vs market: ${edge}
- Entry delay: ${delay}
- Price at signal: ${price}
- Regime OK: ${signal.regimeOK ? "Yes" : "No"}
- Mispriced: ${signal.mispriced ? "Yes (edge above threshold)" : "No"}

Respond in this exact JSON format (no markdown, no extra text):
{
  "thesis": "One sharp sentence explaining the core edge here.",
  "bullets": ["Key factor 1", "Key factor 2", "Key factor 3"],
  "risk": "The single biggest risk to this signal.",
  "sentiment": "bullish" | "bearish" | "neutral",
  "conviction": "high" | "medium" | "low"
}`;
}

function parseResult(text) {
  try {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start === -1 || end === -1) return null;
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
}

export function useAISignalExplanation() {
  const [state, setState] = useState({
    loading: false,
    streaming: "",
    result: null,
    error: null,
    signalId: null,
  });

  const abortRef = useRef(null);

  const explain = useCallback(async (signal) => {
    if (!signal?.id) return;

    // Serve from cache instantly
    if (cache.has(signal.id)) {
      setState({ loading: false, streaming: "", result: cache.get(signal.id), error: null, signalId: signal.id });
      return;
    }

    setState({ loading: true, streaming: "", result: null, error: null, signalId: signal.id });

    try {
      let fullText = "";

      await stream({
        model: "qwen3-max",
        messages: [{ role: "user", content: buildPrompt(signal) }],
        temperature: 0.5,
        max_tokens: 300,
        onChunk: (_, full) => {
          fullText = full;
          setState(prev => ({ ...prev, streaming: full }));
        },
      });

      const parsed = parseResult(fullText);

      if (parsed) {
        cache.set(signal.id, parsed);
        setState({ loading: false, streaming: "", result: parsed, error: null, signalId: signal.id });
      } else {
        // Fallback: treat the raw text as the thesis
        const fallback = {
          thesis: fullText.slice(0, 200) || "Analysis unavailable.",
          bullets: [],
          risk: "Unable to parse structured response.",
          sentiment: "neutral",
          conviction: "low",
        };
        setState({ loading: false, streaming: "", result: fallback, error: null, signalId: signal.id });
      }
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err.message?.includes("Failed to fetch")
          ? "Fleet gateway unreachable (check Tailscale)"
          : err.message,
      }));
    }
  }, []);

  const reset = useCallback(() => {
    setState({ loading: false, streaming: "", result: null, error: null, signalId: null });
  }, []);

  return { ...state, explain, reset };
}
