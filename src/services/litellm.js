/* =========================================================
   LiteLLM Fleet Gateway Client
   Sovereign AI fleet — adraca-azure-01
   Endpoint: http://100.125.158.117:4000
========================================================= */

const GATEWAY = "http://100.125.158.117:4000";
const API_KEY = "sk-2c063145e57b0987b1c20d58cc978d62afc73f1cd40a8649d2d12da24aa45918";
const DEFAULT_MODEL = "qwen3-max";

/* Single-shot completion */
export async function complete({ model = DEFAULT_MODEL, messages, temperature = 0.7, max_tokens = 512 }) {
  const res = await fetch(`${GATEWAY}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({ model, messages, temperature, max_tokens }),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => res.statusText);
    throw new Error(`LiteLLM ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

/* Streaming completion — calls onChunk(text) as tokens arrive, returns full text */
export async function stream({ model = DEFAULT_MODEL, messages, temperature = 0.7, max_tokens = 512, onChunk }) {
  const res = await fetch(`${GATEWAY}/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({ model, messages, temperature, max_tokens, stream: true }),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => res.statusText);
    throw new Error(`LiteLLM ${res.status}: ${err}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let full = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split("\n").filter(l => l.startsWith("data: "));

    for (const line of lines) {
      const raw = line.slice(6).trim();
      if (raw === "[DONE]") return full;
      try {
        const parsed = JSON.parse(raw);
        const delta = parsed.choices?.[0]?.delta?.content ?? "";
        if (delta) {
          full += delta;
          onChunk?.(delta, full);
        }
      } catch { /* skip malformed */ }
    }
  }

  return full;
}
