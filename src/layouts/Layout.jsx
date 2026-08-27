import Sidebar from "../components/Sidebar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex" style={{ background: "#0B0E14", color: "#e2e8f0", fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />
      <main className="flex-1 overflow-auto min-w-0">
        {children}
      </main>
    </div>
  );
}
