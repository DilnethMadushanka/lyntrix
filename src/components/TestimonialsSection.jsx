import React from 'react';
import { Star, Quote, Building2, ShieldCheck } from 'lucide-react';

export default function TestimonialsSection() {
  const reviews = [
    {
      name: 'Marcus Vance',
      role: 'VP of Technology',
      company: 'AeroCloud Systems',
      text: 'Lyntrix completely modernized our cloud infrastructure. We migrated 40+ microservices to Kubernetes with zero downtime and reduced cloud costs by 38%.',
      rating: 5,
      highlight: '38% Cloud Savings'
    },
    {
      name: 'Dr. Sarah Lin',
      role: 'Chief Information Officer',
      company: 'OmniHealth Global',
      text: 'Their Zero-Trust cybersecurity audit and managed SOC deployment gave us the exact audit readiness we needed for SOC 2 Type II compliance in record time.',
      rating: 5,
      highlight: 'SOC 2 Ready'
    },
    {
      name: 'David Rajapakse',
      role: 'Head of Engineering',
      company: 'FinPulse Pay',
      text: 'The Lyntrix team built our high-concurrency payment gateway handling 15,000+ requests/sec with under 25ms latency. Exceptional software craftmanship.',
      rating: 5,
      highlight: '15k Req/Sec Throughput'
    }
  ];

  return (
    <section className="py-24 relative bg-slate-900/40 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400">
            <Quote className="w-3.5 h-3.5" />
            <span>CLIENT VERIFIED IMPACT</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-['Outfit']">
            Trusted by <span className="text-gradient-cyan">Engineering Leaders</span>
          </h2>
          <p className="text-slate-400 text-base font-light">
            Here is how we help technology teams innovate faster and operate securely.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-6 relative"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400 gap-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/40">
                    {rev.highlight}
                  </span>
                </div>

                <p className="text-slate-300 text-sm italic leading-relaxed font-light">
                  "{rev.text}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 border border-cyan-500/30 flex items-center justify-center font-bold text-cyan-400 font-['Outfit']">
                  {rev.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-white text-sm font-['Outfit']">{rev.name}</div>
                  <div className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                    <Building2 className="w-3 h-3 text-slate-500" />
                    <span>{rev.role}, {rev.company}</span>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
