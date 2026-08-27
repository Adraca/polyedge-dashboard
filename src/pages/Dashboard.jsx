import Crypto15mSignalGrid from "../components/Crypto15mSignalGrid";
import TractionPanel from "../components/TractionPanel";
import InsightCards from "../components/InsightCards";
import ConfidenceWinRateChart from "../components/ConfidenceWinRateChart";
import EntryTimingPnLChart from "../components/EntryTimingPnLChart";
import PriceMovement from "../components/PriceMovement";
import LiquidityHeatmap from "../components/charts/LiquidityHeatmap";
import DrawdownBanner from "../components/DrawdownBanner";
import CapitalCurveChart from "../components/CapitalCurveChart";
import ExportTradesButton from "../components/ExportTradesButton";
import AssetPerformanceChart from "../components/charts/AssetPerformanceChart";
import RollingWinRateChart from "../components/charts/RollingWinRateChart";
import PnLDistributionChart from "../components/charts/PnLDistributionChart";
import CalibrationChart from "../components/charts/CalibrationChart";
import HourlyHeatmap from "../components/charts/HourlyHeatmap";
import BenchmarkChart from "../components/charts/BenchmarkChart";
import KellyCalculator from "../components/KellyCalculator";
import AISessionDigest from "../components/AISessionDigest";

const S = { fontSize: 13, fontWeight: 600, color: "#94a3b8", marginBottom: 12, letterSpacing: "0.01em" };
const TWO = { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(420px,1fr))", gap: 16 };

export default function Dashboard() {
  return (
    <div style={{
      minHeight: "100vh", padding: "24px", paddingBottom: 64,
      display: "flex", flexDirection: "column", gap: 28,
      background: "linear-gradient(to right,#80808012 1px,transparent 1px),linear-gradient(to bottom,#80808012 1px,transparent 1px),#0B0E14",
      backgroundSize: "40px 40px,40px 40px,auto",
    }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#f8fafc", letterSpacing: "-0.02em", margin: 0 }}>
            Crypto 15m Signal Dashboard
          </h1>
          <p style={{ fontSize: 12, color: "#475569", marginTop: 4, margin: "4px 0 0" }}>
            Live signals · BTC · ETH · SOL · XRP
          </p>
        </div>
        <ExportTradesButton />
      </div>

      {/* Drawdown warning */}
      <DrawdownBanner />

      {/* Signal grid — sticky strip */}
      <section style={{
        position: "sticky", top: 0, zIndex: 30,
        margin: "0 -24px", padding: "16px 24px",
        background: "rgba(11,14,20,0.93)",
        backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid #1e293b",
      }}>
        <Crypto15mSignalGrid />
      </section>

      {/* Session stats */}
      <section>
        <div style={S}>Session Traction</div>
        <TractionPanel variant="compact" />
      </section>

      {/* Key insight callouts */}
      <section>
        <div style={S}>Key Metrics</div>
        <InsightCards />
      </section>

      {/* Equity curve */}
      <section>
        <div style={S}>Equity Curve</div>
        <CapitalCurveChart />
      </section>

      {/* Performance analytics */}
      <section>
        <div style={S}>Performance Analytics</div>
        <div style={TWO}>
          <ConfidenceWinRateChart />
          <EntryTimingPnLChart />
        </div>
      </section>

      {/* Signal intelligence */}
      <section>
        <div style={S}>Signal Intelligence</div>
        <div style={TWO}>
          <AssetPerformanceChart />
          <RollingWinRateChart />
        </div>
      </section>

      {/* Model validation */}
      <section>
        <div style={S}>Model Validation</div>
        <div style={TWO}>
          <CalibrationChart />
          <BenchmarkChart />
        </div>
      </section>

      {/* Return distribution */}
      <section>
        <div style={S}>Return Distribution</div>
        <PnLDistributionChart />
      </section>

      {/* Timing intelligence */}
      <section>
        <div style={S}>Timing Intelligence</div>
        <HourlyHeatmap />
      </section>

      {/* Risk & AI tools */}
      <section>
        <div style={S}>Risk & AI Tools</div>
        <div style={TWO}>
          <KellyCalculator />
          <AISessionDigest />
        </div>
      </section>

      {/* Live market data */}
      <section>
        <div style={S}>Live Market Data</div>
        <div style={{ ...TWO, paddingBottom: 16 }}>
          <PriceMovement />
          <LiquidityHeatmap />
        </div>
      </section>

    </div>
  );
}
