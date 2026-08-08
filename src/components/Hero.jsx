import React from 'react';
import { ArrowRight, ShieldCheck, Cpu, Cloud, Code, Terminal, CheckCircle2, ChevronRight, Play } from 'lucide-react';

export default function Hero({ onOpenCalculator }) {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-grid-pattern">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="absolute top-1/3 left-10 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Tagline Pill */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-mono text-cyan-400 shadow-xl shadow-cyan-950/20 backdrop-blur-md">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
            </span>
            <span className="font-semibold tracking-wider uppercase">INNOVATE • INTEGRATE • ELEVATE</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300">Smart Solutions. Stronger Tomorrow.</span>
          </div>
        </div>

        {/* Hero Main Heading */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white font-['Outfit'] leading-[1.1]">
            Next-Generation <br className="hidden sm:inline" />
            <span className="text-gradient-cyan">Enterprise IT Services</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            Engineering resilient custom software, high-concurrency cloud architectures, and zero-trust cybersecurity for modern forward-thinking businesses.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a
              href="#contact"
              className="glow-btn w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 text-slate-950 font-bold text-base shadow-lg shadow-cyan-500/25 transition-all"
            >
              <span>Schedule Architecture Audit</span>
              <ArrowRight className="w-5 h-5" />
            </a>

            <button
              onClick={onOpenCalculator}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl glass-panel text-slate-200 hover:text-white font-semibold text-base border border-slate-700/80 hover:border-cyan-500/50 transition-all group"
            >
              <Terminal className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300" />
              <span>Launch Cost Calculator</span>
            </button>
          </div>

          {/* Quick Value Badges */}
          <div className="pt-4 flex flex-wrap justify-center items-center gap-6 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ISO 27001 Compliant
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              99.99% Uptime Guarantee
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              24/7 Managed SOC Support
            </span>
          </div>
        </div>

        {/* Hero Visual Card Showcase */}
        <div className="mt-14 relative max-w-5xl mx-auto">
          {/* Card Border glow wrapper */}
          <div className="relative rounded-2xl p-1 bg-gradient-to-b from-cyan-500/40 via-indigo-500/20 to-slate-900/90 shadow-2xl shadow-cyan-950/50">
            <div className="relative rounded-xl overflow-hidden bg-slate-950/90 backdrop-blur-xl border border-slate-800">
              
              {/* Fake Terminal / Window Header */}
              <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-mono text-slate-400 hidden sm:inline">lyntrix-infrastructure-console.cloud</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>STATUS: ACTIVE_SOC_ONLINE</span>
                </div>
              </div>

              {/* Banner Showcase */}
              <div className="relative aspect-[21/9] w-full overflow-hidden bg-slate-950">
                <img 
                  src="/banner.jpg" 
                  alt="Lyntrix IT Services Infrastructure Banner"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700 opacity-90"
                />
                
                {/* Dark gradient overlay for contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent pointer-events-none" />

                {/* Floating Tech Badges over image */}
                <div className="absolute bottom-6 left-6 right-6 hidden md:flex items-center justify-between">
                  <div className="glass-panel px-4 py-2 rounded-xl flex items-center gap-3 border border-slate-700/60">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 font-mono">Microservices</div>
                      <div className="text-sm font-bold text-white">Kubernetes & AWS Native</div>
                    </div>
                  </div>

                  <div className="glass-panel px-4 py-2 rounded-xl flex items-center gap-3 border border-slate-700/60">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 font-mono">Cybersecurity</div>
                      <div className="text-sm font-bold text-white">Zero-Trust Shielding</div>
                    </div>
                  </div>

                  <div className="glass-panel px-4 py-2 rounded-xl flex items-center gap-3 border border-slate-700/60">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
                      <Cloud className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 font-mono">Cloud SLA</div>
                      <div className="text-sm font-bold text-white">99.99% Availability</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card p-5 rounded-xl border border-slate-800 text-center">
            <div className="text-3xl sm:text-4xl font-extrabold text-cyan-400 font-['Outfit']">250+</div>
            <div className="text-xs text-slate-400 mt-1 uppercase font-mono tracking-wider">Enterprise Projects</div>
          </div>
          <div className="glass-card p-5 rounded-xl border border-slate-800 text-center">
            <div className="text-3xl sm:text-4xl font-extrabold text-indigo-400 font-['Outfit']">99.99%</div>
            <div className="text-xs text-slate-400 mt-1 uppercase font-mono tracking-wider">Target Uptime SLA</div>
          </div>
          <div className="glass-card p-5 rounded-xl border border-slate-800 text-center">
            <div className="text-3xl sm:text-4xl font-extrabold text-purple-400 font-['Outfit']">&lt; 15 mins</div>
            <div className="text-xs text-slate-400 mt-1 uppercase font-mono tracking-wider">Critical Incident Response</div>
          </div>
          <div className="glass-card p-5 rounded-xl border border-slate-800 text-center">
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-['Outfit']">100%</div>
            <div className="text-xs text-slate-400 mt-1 uppercase font-mono tracking-wider">Compliance Guarantee</div>
          </div>
        </div>

      </div>
    </section>
  );
}
