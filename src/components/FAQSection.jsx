import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ShieldCheck, FileText, Cpu, CheckCircle2 } from 'lucide-react';

export default function FAQSection() {
  const [activeCategory, setActiveCategory] = useState('engagement');
  const [openIndex, setOpenIndex] = useState(0);

  const categories = [
    { id: 'engagement', label: 'Engagement & Process' },
    { id: 'security', label: 'Security & Compliance' },
    { id: 'cloud', label: 'Cloud Architecture & SLAs' }
  ];

  const faqs = {
    engagement: [
      {
        q: 'Who owns the Intellectual Property (IP) of the software developed?',
        a: 'You retain 100% full legal ownership of all source code, architecture blueprints, database schemas, and intellectual property. Upon contract completion, all repositories are handed over completely with zero lock-in.'
      },
      {
        q: 'How fast can a senior engineering team be onboarded?',
        a: 'We initiate discovery sessions within 48 hours of proposal approval. Dedicated engineering pods typically start active sprint development within 5 to 7 business days.'
      },
      {
        q: 'What is your billing structure and contract terms?',
        a: 'We offer fixed-scope milestone billing for project deliverables or monthly dedicated team retainers. All pricing is fully transparent with zero hidden fees.'
      }
    ],
    security: [
      {
        q: 'How do you ensure SOC 2 and ISO 27001 compliance readiness?',
        a: 'Our code adheres strictly to OWASP Top 10 security standards, identity-bound Zero-Trust mTLS access controls, encrypted data vaults (AWS KMS / HashiCorp Vault), and continuous vulnerability pentesting.'
      },
      {
        q: 'Do you execute non-disclosure agreements (NDAs) prior to discovery?',
        a: 'Yes, we provide standard mutual non-disclosure agreements (NDAs) prior to reviewing any proprietary technical architecture or business data.'
      },
      {
        q: 'How are database backups and customer data protected?',
        a: 'All data in transit is encrypted using TLS 1.3, and data at rest is encrypted with AES-256. Backups are snapshot-stored automatically with multi-region failover redundancy.'
      }
    ],
    cloud: [
      {
        q: 'What is your guaranteed Service Level Agreement (SLA) for uptime?',
        a: 'We provide a 99.99% availability target SLA for managed cloud environments, supported by automated Kubernetes cluster auto-scaling and 24/7 SOC monitoring.'
      },
      {
        q: 'What happens if a critical system incident occurs?',
        a: 'Our Managed IT and SOC team provides an incident response SLA of under 15 minutes. Automated PagerDuty escalation protocols immediately alert assigned senior leads.'
      },
      {
        q: 'Can you help optimize existing high cloud spending (FinOps)?',
        a: 'Yes, our FinOps cloud audit analyzes AWS/Azure infrastructure, identifies underutilized instances, introduces Kubernetes containerization, and typically reduces cloud costs by 25% to 40%.'
      }
    ]
  };

  const currentFaqs = faqs[activeCategory] || faqs.engagement;

  return (
    <section id="faq" className="py-20 sm:py-28 relative bg-slate-900/40 border-t border-slate-800/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-xs font-mono text-cyan-400">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>EXECUTIVE FAQ & COMPLIANCE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-['Outfit']">
            Frequently Asked <span className="text-gradient-cyan">Questions</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base font-light">
            Everything you need to know about our engineering standards, IP ownership, and SLAs.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.id); setOpenIndex(0); }}
              className={`px-4 py-2 rounded-xl text-xs font-mono transition-all border ${
                activeCategory === cat.id
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-500/60 font-bold shadow-md shadow-cyan-950'
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Accordions */}
        <div className="space-y-3">
          {currentFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="glass-card rounded-xl border border-slate-800/80 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-slate-100 font-['Outfit'] hover:text-cyan-400 transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transform transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-cyan-400' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 font-light leading-relaxed border-t border-slate-800/50 pt-3 animate-in fade-in duration-200 font-sans">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
