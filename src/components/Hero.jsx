import React from 'react';
import { ArrowRight, ShieldCheck, Cpu, Cloud, Code, Terminal, CheckCircle2, ChevronRight, Play } from 'lucide-react';

export default function Hero({ onOpenCalculator }) {
  return (
    <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 md:pt-40 md:pb-28 overflow-hidden bg-grid-pattern">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[600px] h-[200px] sm:h-[300px] bg-cyan-500/10 rounded-full blur-[90px] sm:blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="absolute top-1/3 left-4 w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] bg-indigo-500/10 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Tagline Pill */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-[11px] sm:text-xs font-mono text-cyan-400 shadow-xl shadow-cyan-950/20 backdrop-blur-md max-w-full overflow-hidden">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
            </span>
            <span className="font-semibold tracking-wider uppercase truncate">INNOVATE • INTEGRATE • ELEVATE</span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-slate-300 hidden sm:inline">Smart Solutions. Stronger Tomorrow.</span>
          </div>
        </div>

        {/* Hero Main Heading */}
        <div className="text-center max-w-4xl mx-auto space-y-4 sm:space-y-6">
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white font-['Outfit'] leading-[1.15]">
            Next-Generation <br className="hidden sm:inline" />
            <span className="text-gradient-cyan">Enterprise IT Services</span>
          </h1>

          <p className="text-sm sm:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed px-2">
            Engineering resilient custom software, high-concurrency cloud architectures, and zero-trust cybersecurity for modern forward-thinking businesses.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-4">
            <a
              href="#contact"
              className="glow-btn w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 text-slate-950 font-bold text-sm sm:text-base shadow-lg shadow-cyan-500/25 transition-all"
            >
              <span>Schedule Architecture Audit</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>

            <button
              onClick={onOpenCalculator}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl glass-panel text-slate-200 hover:text-white font-semibold text-sm sm:text-base border border-slate-700/80 hover:border-cyan-500/50 transition-all group"
            >
              <Terminal className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 group-hover:text-cyan-300" />
              <span>Launch Cost Calculator</span>
            </button>
          </div>

          {/* Quick Value Badges */}
          <div className="pt-2 sm:pt-4 flex flex-wrap justify-center items-center gap-3 sm:gap-6 text-[11px] sm:text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5 bg-slate-900/60 px-2.5 py-1 rounded-md border border-slate-800/80 sm:bg-transparent sm:p-0 sm:border-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              ISO 27001 Compliant
            </span>
            <span className="flex items-center gap-1.5 bg-slate-900/60 px-2.5 py-1 rounded-md border border-slate-800/80 sm:bg-transparent sm:p-0 sm:border-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              99.99% Uptime Guarantee
            </span>
            <span className="flex items-center gap-1.5 bg-slate-900/60 px-2.5 py-1 rounded-md border border-slate-800/80 sm:bg-transparent sm:p-0 sm:border-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              24/7 Managed SOC Support
            </span>
          </div>
        </div>

        {/* Hero Visual Card Showcase */}
        <div className="mt-10 sm:mt-14 relative max-w-5xl mx-auto">
          {/* Card Border glow wrapper */}
          <div className="relative rounded-2xl p-0.5 sm:p-1 bg-gradient-to-b from-cyan-500/40 via-indigo-500/20 to-slate-900/90 shadow-2xl shadow-cyan-950/50">
            <div className="relative rounded-xl overflow-hidden bg-slate-950/90 backdrop-blur-xl border border-slate-800">
              
              {/* Fake Terminal / Window Header */}
              <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-rose-500/80" />
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-[10px] sm:text-xs font-mono text-slate-400 truncate max-w-[150px] sm:max-w-none">lyntrix-infrastructure-console.cloud</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-mono text-cyan-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0"></span>
                  <span className="hidden sm:inline">STATUS: </span>
                  <span>ACTIVE_SOC</span>
                </div>
              </div>

              {/* Banner Showcase */}
              <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden bg-slate-950">
                <img 
                  src="/banner.jpg" 
                  alt="Lyntrix IT Services Infrastructure Banner"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700 opacity-90"
                />
                
                {/* Dark gradient overlay for contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />

                {/* Floating Tech Badges over image */}
                <div className="absolute bottom-4 left-4 right-4 hidden md:flex items-center justify-between gap-2">
                  <div className="glass-panel px-3.5 py-2 rounded-xl flex items-center gap-3 border border-slate-700/60">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-mono">Microservices</div>
                      <div className="text-xs sm:text-sm font-bold text-white">Kubernetes & AWS Native</div>
                    </div>
                  </div>

                  <div className="glass-panel px-3.5 py-2 rounded-xl flex items-center gap-3 border border-slate-700/60">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-mono">Cybersecurity</div>
                      <div className="text-xs sm:text-sm font-bold text-white">Zero-Trust Shielding</div>
                    </div>
                  </div>

                  <div className="glass-panel px-3.5 py-2 rounded-xl flex items-center gap-3 border border-slate-700/60">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                      <Cloud className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-mono">Cloud SLA</div>
                      <div className="text-xs sm:text-sm font-bold text-white">99.99% Availability</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="glass-card p-4 sm:p-5 rounded-xl border border-slate-800 text-center">
            <div className="text-2xl sm:text-4xl font-extrabold text-cyan-400 font-['Outfit']">250+</div>
            <div className="text-[10px] sm:text-xs text-slate-400 mt-1 uppercase font-mono tracking-wider">Enterprise Projects</div>
          </div>
          <div className="glass-card p-4 sm:p-5 rounded-xl border border-slate-800 text-center">
            <div className="text-2xl sm:text-4xl font-extrabold text-indigo-400 font-['Outfit']">99.99%</div>
            <div className="text-[10px] sm:text-xs text-slate-400 mt-1 uppercase font-mono tracking-wider">Target Uptime SLA</div>
          </div>
          <div className="glass-card p-4 sm:p-5 rounded-xl border border-slate-800 text-center">
            <div className="text-2xl sm:text-4xl font-extrabold text-purple-400 font-['Outfit']">&lt; 15 mins</div>
            <div className="text-[10px] sm:text-xs text-slate-400 mt-1 uppercase font-mono tracking-wider">Critical Incident SLA</div>
          </div>
          <div className="glass-card p-4 sm:p-5 rounded-xl border border-slate-800 text-center">
            <div className="text-2xl sm:text-4xl font-extrabold text-emerald-400 font-['Outfit']">100%</div>
            <div className="text-[10px] sm:text-xs text-slate-400 mt-1 uppercase font-mono tracking-wider">Compliance Guarantee</div>
          </div>
        </div>

      </div>
    </section>
  );
}
