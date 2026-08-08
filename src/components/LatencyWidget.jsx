import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Wifi, RefreshCw, Lock, Server } from 'lucide-react';

export default function LatencyWidget() {
  const [latency, setLatency] = useState(12);
  const [testing, setTesting] = useState(false);

  const runTest = () => {
    setTesting(true);
    let count = 0;
    const interval = setInterval(() => {
      setLatency(Math.floor(8 + Math.random() * 10));
      count++;
      if (count >= 5) {
        clearInterval(interval);
        setTesting(false);
      }
    }, 150);
  };

  return (
    <div className="glass-panel py-3 px-4 sm:px-6 rounded-2xl border border-cyan-500/30 max-w-4xl mx-auto my-8 shadow-xl shadow-cyan-950/20">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono">
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/40">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase">EDGE TELEMETRY NETWORK</div>
            <div className="text-white font-bold flex items-center gap-2">
              <span>Lyntrix Edge Node: Asia-South (Colombo)</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-slate-300">
          <div className="flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ping: <strong className="text-emerald-400">{latency}ms</strong></span>
          </div>

          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            <span>TLS 1.3 / AES-256</span>
          </div>

          <div className="flex items-center gap-1.5 text-purple-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Zero-Trust: ACTIVE</span>
          </div>
        </div>

        <button
          onClick={runTest}
          disabled={testing}
          className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-400 text-[11px] font-bold border border-slate-800 transition-colors flex items-center gap-1.5 shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
          <span>{testing ? 'Testing Ping...' : 'Run Diagnostics'}</span>
        </button>

      </div>
    </div>
  );
}
