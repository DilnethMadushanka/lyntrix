import React, { useState } from 'react';
import { Layers, Server, ShieldAlert, Cpu, CheckCircle2, ArrowRight, Zap, Database } from 'lucide-react';

export default function SolutionsSection() {
  const [activeSolution, setActiveSolution] = useState(0);

  const solutions = [
    {
      title: 'High-Concurrency Enterprise SaaS',
      subtitle: 'Scalable cloud-native web architectures engineered for millions of active users.',
      icon: Layers,
      metrics: ['99.999% Availability', 'Sub-50ms Response', 'Auto-scaling Pods'],
      architecture: [
        'React / Next.js Micro-frontend Architecture',
        'Node.js & Go High-Throughput Microservices',
        'PostgreSQL with Redis Caching Layer',
        'Global CDN & Web Application Firewall (WAF)'
      ],
      highlights: 'Designed for enterprise tech brands needing high throughput and fault-tolerant infrastructure.'
    },
    {
      title: 'Multi-Cloud Infrastructure & FinOps',
      subtitle: 'Migrate, automate, and reduce cloud expenditure without performance loss.',
      icon: Server,
      metrics: ['Up to 40% Cost Savings', 'Zero-Downtime Migration', 'IaC Terraform'],
      architecture: [
        'Automated Multi-Region AWS / Azure Failover',
        'Kubernetes Container Clustering',
        'Terraform Infrastructure-as-Code Declarations',
        'Datadog / Prometheus Real-Time Telemetry'
      ],
      highlights: 'Transform legacy workloads into cloud-native auto-scaling environments.'
    },
    {
      title: 'Zero-Trust Defense & Managed SOC',
      subtitle: 'Continuous threat detection, automated isolation, and audit readiness.',
      icon: ShieldAlert,
      metrics: ['SOC 2 & ISO 27001 Ready', 'Real-time Isolation', '< 15min Incident SLA'],
      architecture: [
        'Identity-based Zero-Trust Access Control (mTLS)',
        'Continuous Vulnerability Scanning & Pentesting',
        'Automated Incident Isolation Pipelines',
        'Encrypted Data Vaults & Audit Trail Storage'
      ],
      highlights: 'Protect high-value intellectual property and consumer data against advanced security threats.'
    },
    {
      title: 'Enterprise AI & Automation Workflows',
      subtitle: 'Integrate LLMs, vector search, and intelligent automation into business tools.',
      icon: Cpu,
      metrics: ['Vector DB Retrieval', 'Custom Fine-tuning', 'Automated Workflows'],
      architecture: [
        'Private LLM Deployment (Llama / Claude APIs)',
        'Pinecone / Qdrant Vector Search Engine',
        'Custom Business Process Automation Connectors',
        'Data Governance & Privacy Safeguards'
      ],
      highlights: 'Empower your workforce with custom AI assistants and automated data pipelines.'
    }
  ];

  const current = solutions[activeSolution];

  return (
    <section id="solutions" className="py-24 relative bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400">
            <Zap className="w-3.5 h-3.5" />
            <span>SOLUTIONS ARCHITECTURE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-['Outfit']">
            Engineered for <span className="text-gradient-cyan">Mission-Critical Scale</span>
          </h2>
          <p className="text-slate-400 text-base font-light">
            Proven architecture patterns built by senior software and cloud engineers.
          </p>
        </div>

        {/* Grid Selection */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          {solutions.map((sol, idx) => {
            const Icon = sol.icon;
            const isActive = activeSolution === idx;
            return (
              <button
                key={idx}
                onClick={() => setActiveSolution(idx)}
                className={`p-5 rounded-xl border text-left transition-all ${
                  isActive
                    ? 'bg-slate-900 border-cyan-500 shadow-lg shadow-cyan-950/40 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-900/50 hover:text-slate-200'
                }`}
              >
                <div className={`p-2.5 rounded-lg w-fit mb-3 ${isActive ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-400'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="font-bold text-sm font-['Outfit'] mb-1">{sol.title}</div>
                <div className="text-xs text-slate-400 line-clamp-2">{sol.subtitle}</div>
              </button>
            );
          })}
        </div>

        {/* Selected Solution Visualizer */}
        <div className="glass-card rounded-2xl p-6 sm:p-10 border border-slate-800 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">FEATURED ARCHITECTURE SOLUTION</span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-['Outfit']">
                  {current.title}
                </h3>
                <p className="text-slate-300 text-sm sm:text-base mt-2 font-light">
                  {current.subtitle}
                </p>
              </div>

              {/* Metrics Pill Grid */}
              <div className="flex flex-wrap gap-2 pt-1">
                {current.metrics.map((m, i) => (
                  <span key={i} className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/50 text-cyan-300">
                    ✨ {m}
                  </span>
                ))}
              </div>

              {/* Architecture Blueprint List */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-mono uppercase text-slate-400">Technical Blueprint Specs</div>
                <div className="space-y-2">
                  {current.architecture.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm text-slate-200 bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span className="font-mono">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300"
                >
                  <span>Schedule Technical Architecture Deep-Dive</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

            </div>

            {/* Architecture Diagram Interactive Mockup */}
            <div className="lg:col-span-5 bg-slate-950 p-6 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-slate-400">BLUEPRINT CONSOLE</span>
                <span className="text-cyan-400">LIVE TOPOLOGY</span>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded bg-slate-900 border border-slate-800 flex justify-between items-center">
                  <span>🌐 Global Cloudflare CDN & WAF</span>
                  <span className="text-emerald-400">ACTIVE</span>
                </div>
                <div className="w-0.5 h-3 bg-cyan-500/50 mx-auto" />
                <div className="p-3 rounded bg-slate-900 border border-cyan-500/40 flex justify-between items-center text-cyan-300">
                  <span>⚡ Kubernetes Microservices Cluster</span>
                  <span className="text-emerald-400">AUTO-SCALE</span>
                </div>
                <div className="w-0.5 h-3 bg-cyan-500/50 mx-auto" />
                <div className="p-3 rounded bg-slate-900 border border-slate-800 flex justify-between items-center">
                  <span>🛡️ Zero-Trust Identity Guard</span>
                  <span className="text-emerald-400">ENFORCED</span>
                </div>
                <div className="w-0.5 h-3 bg-cyan-500/50 mx-auto" />
                <div className="p-3 rounded bg-slate-900 border border-slate-800 flex justify-between items-center">
                  <span>💾 Multi-Region PostgreSQL & Redis</span>
                  <span className="text-emerald-400">SYNCED</span>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-800">
                🔒 Protected by Lyntrix Enterprise SLA & Automated Security Sentinel.
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
