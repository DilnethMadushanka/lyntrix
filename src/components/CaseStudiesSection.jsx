import React, { useState } from 'react';
import { Briefcase, ArrowRight, ExternalLink, CheckCircle2, TrendingUp, ShieldCheck, Zap, X, Code, Server } from 'lucide-react';

export default function CaseStudiesSection() {
  const [selectedCase, setSelectedCase] = useState(null);

  const caseStudies = [
    {
      id: 'finpulse',
      client: 'FinPulse Pay Inc.',
      category: 'Fintech & High-Concurrency Systems',
      title: 'Scaling Payment Infrastructure to 15,000 Req/Sec',
      summary: 'Engineered a fault-tolerant micro-frontend and distributed Node.js/Go payment gateway with sub-20ms latency.',
      impact: ['15,000+ Req/Sec', '<20ms Global Latency', '99.999% Availability'],
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      tech: ['React', 'Go', 'Node.js', 'PostgreSQL', 'Redis', 'Kubernetes'],
      fullStory: {
        challenge: 'FinPulse Pay experienced severe latency spikes during peak transaction hours, causing gateway timeouts and revenue loss.',
        solution: 'Lyntrix redesigned their payment pipeline using Go microservices with Redis caching, PostgreSQL read-replicas, and Cloudflare Enterprise WAF.',
        results: [
          'Reduced payment checkout latency from 450ms to 18ms.',
          'Zero-downtime deployment pipeline handling $40M+ monthly throughput.',
          'Achieved 100% PCI-DSS Level 1 compliance.'
        ],
        quote: 'Lyntrix transformed our fragile legacy gateway into a high-concurrency powerhouse. Unmatched engineering depth.',
        author: 'David Rajapakse — Head of Engineering, FinPulse Pay'
      }
    },
    {
      id: 'aerocloud',
      client: 'AeroCloud Systems',
      category: 'Cloud Migration & FinOps Architecture',
      title: 'Multi-Region Kubernetes Cloud Migration',
      summary: 'Migrated 40+ monolithic enterprise services to multi-region AWS EKS with Terraform IaC, cutting cloud spend by 38%.',
      impact: ['38% Cloud Spend Saved', '40+ Microservices Migrated', 'Zero Downtime'],
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
      tech: ['AWS EKS', 'Terraform', 'Docker', 'Prometheus', 'Datadog', 'GitHub Actions'],
      fullStory: {
        challenge: 'Uncontrolled cloud spending and legacy virtual machine sprawl led to bloated AWS bills and slow feature delivery.',
        solution: 'Automated infrastructure declaratively using Terraform IaC, containerized application workloads into Kubernetes clusters, and enabled auto-scaling spot instances.',
        results: [
          'Slashed monthly cloud bill from $62,000 to $38,400.',
          'Reduced deployment time from 4 hours to 6 minutes.',
          'Automated multi-region failover across N. Virginia and Frankfurt.'
        ],
        quote: 'The FinOps audit and Kubernetes migration delivered immediate ROI while doubling our development velocity.',
        author: 'Marcus Vance — VP of Technology, AeroCloud'
      }
    },
    {
      id: 'omnihealth',
      client: 'OmniHealth Global',
      category: 'Healthcare & Zero-Trust Cybersecurity',
      title: 'HIPAA & SOC 2 Type II Certified Telehealth Shield',
      summary: 'Implemented identity-first Zero-Trust mTLS architecture and automated SOC threat mitigation for a patient portal.',
      impact: ['SOC 2 Type II Certified', 'Zero Security Incidents', '100% HIPAA Compliant'],
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
      tech: ['Zero-Trust mTLS', 'Vault', 'SentinelOne', 'OAuth2/OIDC', 'Cloudflare WAF'],
      fullStory: {
        challenge: 'OmniHealth required strict security verification to achieve SOC 2 Type II compliance ahead of institutional investor audit.',
        solution: 'Deployed identity-bound Zero-Trust network policies, encrypted telemetry storage in AWS S3 KMS, and continuous vulnerability scanning.',
        results: [
          'Passed SOC 2 Type II audit on first evaluation with zero exceptions.',
          'Secured 1.2M patient records with end-to-end AES-256 encryption.',
          'Established 24/7 automated SOC alerting with <10 min SLA.'
        ],
        quote: 'Lyntrix made security compliance effortless. Their engineers understand both security and business urgency.',
        author: 'Dr. Sarah Lin — Chief Information Officer, OmniHealth'
      }
    }
  ];

  return (
    <section id="case-studies" className="py-20 sm:py-28 relative bg-slate-950 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-xs font-mono text-cyan-400">
            <Briefcase className="w-3.5 h-3.5" />
            <span>ENTERPRISE CASE STUDIES</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-['Outfit']">
            Proven <span className="text-gradient-cyan">Engineering Results</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base font-light">
            Explore how we help global organizations overcome complex technical challenges and scale seamlessly.
          </p>
        </div>

        {/* Case Studies Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {caseStudies.map((cs) => (
            <div
              key={cs.id}
              className="glass-card rounded-2xl overflow-hidden border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header Image */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                  <img
                    src={cs.image}
                    alt={cs.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  <span className="absolute top-3 left-3 text-[10px] font-mono font-semibold px-2.5 py-1 rounded bg-slate-950/90 text-cyan-400 border border-cyan-800/60 backdrop-blur-md">
                    {cs.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div className="text-xs font-mono text-slate-400">{cs.client}</div>
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors font-['Outfit'] leading-snug">
                    {cs.title}
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm font-light leading-relaxed">
                    {cs.summary}
                  </p>

                  {/* Impact Pills */}
                  <div className="space-y-2 pt-2">
                    <div className="text-[11px] font-mono text-slate-400 uppercase">Measurable Impact</div>
                    <div className="flex flex-wrap gap-1.5">
                      {cs.impact.map((imp, idx) => (
                        <span key={idx} className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-800/40 text-cyan-300">
                          ⚡ {imp}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="p-6 pt-0">
                <button
                  onClick={() => setSelectedCase(cs)}
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 font-mono text-xs font-bold border border-slate-800 transition-colors flex items-center justify-center gap-2"
                >
                  <span>View Deep-Dive Blueprint</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Case Study Deep-Dive Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-card max-w-2xl w-full p-6 sm:p-8 rounded-2xl border border-cyan-500/40 shadow-2xl shadow-cyan-950 max-h-[90vh] overflow-y-auto space-y-6 relative">
            
            <button
              onClick={() => setSelectedCase(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">{selectedCase.client} • {selectedCase.category}</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-['Outfit']">
                {selectedCase.title}
              </h3>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-300 font-light">
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                <div className="font-mono text-xs font-bold text-rose-400 uppercase">The Challenge</div>
                <p className="leading-relaxed">{selectedCase.fullStory.challenge}</p>
              </div>

              <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-800/40 space-y-1">
                <div className="font-mono text-xs font-bold text-cyan-400 uppercase">The Lyntrix Solution</div>
                <p className="leading-relaxed">{selectedCase.fullStory.solution}</p>
              </div>

              <div className="space-y-2">
                <div className="font-mono text-xs font-bold text-emerald-400 uppercase">Key Deliverable Results</div>
                <div className="space-y-2">
                  {selectedCase.fullStory.results.map((res, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-slate-200 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{res}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 italic text-slate-300 text-xs">
                "{selectedCase.fullStory.quote}"
                <div className="not-italic font-bold font-mono text-cyan-400 mt-2 text-[11px]">
                  — {selectedCase.fullStory.author}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedCase(null)}
                className="px-6 py-2.5 rounded-xl bg-cyan-400 text-slate-950 font-bold text-xs font-mono"
              >
                Close Case Study
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}
