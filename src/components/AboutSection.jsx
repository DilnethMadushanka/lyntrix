import React from 'react';
import { ShieldCheck, Award, Target, Users, Zap, CheckCircle2 } from 'lucide-react';

export default function AboutSection() {
  return (
    <section id="about" className="py-24 relative bg-slate-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Brand Logo & Emblem Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden p-1 bg-gradient-to-tr from-cyan-500/40 via-indigo-500/20 to-slate-800 border border-slate-700/60 shadow-2xl shadow-cyan-950/40">
              <div className="relative rounded-xl overflow-hidden bg-slate-950 aspect-square flex items-center justify-center p-6">
                <img
                  src="/logo.jpg"
                  alt="Lyntrix Technologies Official Emblem"
                  className="w-full h-full object-contain transform hover:scale-105 transition-transform duration-500"
                />
                
                {/* Floating badge */}
                <div className="absolute bottom-4 left-4 right-4 glass-panel p-3 rounded-xl border border-slate-700/80 text-center">
                  <div className="text-xs font-mono text-cyan-400 font-bold tracking-widest uppercase">
                    LYNTRIX TECHNOLOGIES
                  </div>
                  <div className="text-[11px] text-slate-300">
                    Smart Solutions. Stronger Tomorrow.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: About Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400">
              <Target className="w-3.5 h-3.5" />
              <span>ABOUT LYNTRIX IT SERVICES</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-['Outfit'] leading-tight">
              Architecting Digital Resilience & <span className="text-gradient-cyan">Technological Growth</span>
            </h2>

            <p className="text-slate-300 text-base font-light leading-relaxed">
              At <strong className="text-white">Lyntrix IT Services</strong>, we engineer robust, secure, and future-proof software and infrastructure solutions for organizations navigating digital transformation. Built on our core philosophy of <strong className="text-cyan-400">Innovate • Integrate • Elevate</strong>, we bridge complex engineering with effortless user experiences.
            </p>

            {/* Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="glass-card p-4 rounded-xl border border-slate-800 space-y-1">
                <div className="text-cyan-400 font-bold text-sm font-['Outfit'] flex items-center gap-1.5">
                  <Zap className="w-4 h-4" />
                  INNOVATE
                </div>
                <p className="text-xs text-slate-400">
                  Leveraging AI, cloud-native architecture, and zero-trust standards.
                </p>
              </div>

              <div className="glass-card p-4 rounded-xl border border-slate-800 space-y-1">
                <div className="text-indigo-400 font-bold text-sm font-['Outfit'] flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  INTEGRATE
                </div>
                <p className="text-xs text-slate-400">
                  Harmonizing legacy systems with automated cloud pipelines seamlessly.
                </p>
              </div>

              <div className="glass-card p-4 rounded-xl border border-slate-800 space-y-1">
                <div className="text-purple-400 font-bold text-sm font-['Outfit'] flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  ELEVATE
                </div>
                <p className="text-xs text-slate-400">
                  Delivering 99.99% uptime, rapid SOC response, and business expansion.
                </p>
              </div>
            </div>

            {/* Quality Checklist */}
            <div className="space-y-2 pt-2 text-sm text-slate-300">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Senior Engineering Lead assigned to every enterprise engagement.</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Strict adherence to OWASP top 10 security standards & data compliance.</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Transparent billing, zero hidden fees, and clear SLA contracts.</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
