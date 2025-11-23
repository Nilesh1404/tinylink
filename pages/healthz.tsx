import { useEffect, useState } from "react";

export default function HealthPage() {
  const [time, setTime] = useState("");
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    setTime(new Date().toLocaleString());

    const interval = setInterval(() => {
      setUptime((u) => u + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] p-8 flex items-center justify-center">
      <div className="backdrop-blur-2xl bg-white/20 border border-white/30 rounded-3xl shadow-2xl p-10 w-full max-w-lg text-center">
        <h1 className="text-4xl font-extrabold text-white drop-shadow mb-2">
          System Health
        </h1>
        <p className="text-white/70 mb-8 text-sm tracking-wide">
          TinyLink Service Status
        </p>

        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-6 h-6 bg-green-400 rounded-full animate-ping absolute opacity-75"></div>
            <div className="w-6 h-6 bg-green-500 rounded-full relative shadow-lg"></div>
          </div>
        </div>

        <div className="space-y-4 text-white/90 text-left">
          <div className="flex items-center justify-between border-b border-white/20 pb-3">
            <span className="text-white/70">Status</span>
            <span className="font-semibold text-green-300">Operational</span>
          </div>

          <div className="flex items-center justify-between border-b border-white/20 pb-3">
            <span className="text-white/70">Version</span>
            <span className="font-semibold text-white">1.0</span>
          </div>

          <div className="flex items-center justify-between border-b border-white/20 pb-3">
            <span className="text-white/70">Server Time</span>
            <span className="font-medium">{time}</span>
          </div>

          <div className="flex items-center justify-between border-b border-white/20 pb-3">
            <span className="text-white/70">Uptime</span>
            <span className="font-medium">{uptime}s</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-white/70">API Status</span>
            <span className="font-semibold text-blue-300">Healthy</span>
          </div>
        </div>

        <p className="text-white/40 text-xs mt-10">
          © {new Date().getFullYear()} TinyLink — All systems operational
        </p>
      </div>
    </div>
  );
}
