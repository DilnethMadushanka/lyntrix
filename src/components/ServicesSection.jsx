import React, { useState } from 'react';
import { Code2, Cloud, Shield, Compass, Headphones, ArrowRight, CheckCircle2, Terminal, ExternalLink } from 'lucide-react';

export default function ServicesSection() {
  const [activeTab, setActiveTab] = useState(0);

  const services = [
    {
      id: 'software',
      icon: Code2,
      title: 'Software Development',
      badge: 'Core Competency',
      tagline: 'High-performance, scalable custom web & mobile enterprise platforms.',
      description: 'We build enterprise-grade software engineered for high concurrency, security, and effortless maintainability using modern technology stacks.',
      deliverables: [
        'Custom Web & Mobile App Development',
        'Microservice & REST/GraphQL API Design',
        'SaaS Product Development',
        'Legacy Code Modernization & Refactoring'
      ],
      tech: ['React', 'Node.js', 'Python', 'TypeScript', 'PostgreSQL', 'Docker'],
      color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/40 text-cyan-400'
    },
    {
      id: 'cloud',
      icon: Cloud,
      title: 'Cloud Solutions',
      badge: 'AWS / Azure / GCP',
      tagline: 'Elastic cloud infrastructure and automated CI/CD DevOps workflows.',
      description: 'Streamline your operations with auto-scaling multi-cloud architectures, infrastructure as code, and zero-downtime deployment pipelines.',
      deliverables: [
        'AWS & Azure Cloud Migration',
        'Kubernetes & Container Orchestration',
        'Infrastructure as Code (Terraform)',
        'Cloud Cost Optimization & FinOps Audit'
      ],
      tech: ['AWS', 'Azure', 'Kubernetes', 'Terraform', 'Docker', 'GitHub Actions'],
      color: 'from-sky-500/20 to-indigo-500/10 border-sky-500/40 text-sky-400'
    },
    {
      id: 'security',
      icon: Shield,
      title: 'Cybersecurity',
      badge: 'Zero-Trust Defense',
      tagline: 'Enterprise threat protection, vulnerability assessments, and compliance.',
      description: 'Safeguard your valuable enterprise data and customer trust with continuous penetration testing, SOC monitoring, and zero-trust access policies.',
      deliverables: [
        'Penetration Testing & Security Audits',
        'Zero-Trust Architecture Implementation',
        'ISO 27001 & SOC 2 Compliance Preparation',
        'Real-time Threat Monitoring & Incident Response'
      ],
      tech: ['SIEM', 'Cloudflare Enterprise', 'SentinelOne', 'Vault', 'OAuth2/OIDC', 'TLS 1.3'],
      color: 'from-purple-500/20 to-pink-500/10 border-purple-500/40 text-purple-400'
    },
    {
      id: 'consulting',
      icon: Compass,
      title: 'IT Consulting',
      badge: 'Strategic Advisory',
      tagline: 'Expert technology roadmapping and strategic enterprise architecture design.',
      description: 'Align tech investments with strategic business objectives. Our senior architects advise on technology selection, scalable systems, and digital transformation.',
      deliverables: [
        'Digital Transformation Roadmaps',
        'Enterprise Architecture Design',
        'Technology Stack Optimization',
        'Fractional CTO Advisory Services'
      ],
      tech: ['TOGAF', 'Agile/Scrum', 'System Architecture', 'FinOps', 'Data Strategy'],
      color: 'from-amber-500/20 to-orange-500/10 border-amber-500/40 text-amber-400'
    },
    {
      id: 'support',
      icon: Headphones,
      title: 'Support & Maintenance',
      badge: '24/7 Managed IT',
      tagline: 'Round-the-clock proactive monitoring, automated backups, and SLA support.',
      description: 'Ensure 99.99% uptime with dedicated engineering teams monitoring your infrastructure, managing updates, and responding to incidents in minutes.',
      deliverables: [
        '24/7 Monitoring & Automated Alerting',
        'Database Optimization & Backups',
        'SLA-Backed Incident Resolution',
        'Patch Management & Security Updates'
      ],
      tech: ['Prometheus', 'Grafana', 'PagerDuty', 'Datadog', 'Backup Vaults'],
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/40 text-emerald-400'
    }
  ];

  const currentService = services[activeTab];

  return (
    <section id="services" className="py-24 relative bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400">
            <Terminal className="w-3.5 h-3.5" />
            <span>CORE SERVICES MATRIX</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-['Outfit']">
            Comprehensive <span className="text-gradient-cyan">IT Capabilities</span>
          </h2>
          <p className="text-slate-400 text-base font-light">
            End-to-end technology solutions crafted for reliability, performance, and strategic growth.
          </p>
        </div>

        {/* Tab Selector Buttons */}
        <div className="flex overflow-x-auto pb-4 gap-3 no-scrollbar justify-start md:justify-center mb-12">
          {services.map((s, idx) => {
            const Icon = s.icon;
            const isActive = activeTab === idx;
            return (
              <button
                key={s.id}
                onClick={() => setActiveTab(idx)}
                className={`flex items-center gap-3 px-5 py-3 rounded-xl transition-all whitespace-nowrap font-medium text-sm border ${
                  isActive
                    ? 'bg-slate-800/90 text-white border-cyan-500/60 shadow-lg shadow-cyan-950/40'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{s.title}</span>
              </button>
            );
          })}
        </div>

        {/* Active Service Showcase Card */}
        <div className="glass-card rounded-2xl p-6 sm:p-10 border border-slate-800 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-br ${currentService.color} rounded-full blur-[100px] pointer-events-none opacity-30`} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Info Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400">
                  {React.createElement(currentService.icon, { className: 'w-6 h-6' })}
                </div>
                <div>
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/40">
                    {currentService.badge}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1 font-['Outfit']">
                    {currentService.title}
                  </h3>
                </div>
              </div>

              <p className="text-slate-300 text-base leading-relaxed">
                {currentService.description}
              </p>

              {/* Deliverables List */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">Key Deliverables & Capabilities</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentService.deliverables.map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-sm text-slate-200 bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technologies */}
              <div className="pt-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">Powered By Industry standard Tech</h4>
                <div className="flex flex-wrap gap-2">
                  {currentService.tech.map((t, idx) => (
                    <span key={idx} className="text-xs font-mono px-3 py-1 rounded-md bg-slate-900 text-slate-300 border border-slate-800">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 group"
                >
                  <span>Request Custom {currentService.title} Proposal</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

            </div>

            {/* Right Card / Interactive Preview */}
            <div className="lg:col-span-5">
              <div className="bg-slate-900/90 rounded-xl p-6 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="text-xs font-mono text-slate-400">SERVICE SLA SUMMARY</div>
                  <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    GUARANTEED
                  </span>
                </div>

                <div className="space-y-4 text-xs font-mono">
                  <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
                    <span className="text-slate-400">Deployment SLA:</span>
                    <span className="text-white font-bold">Zero-Downtime CI/CD</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
                    <span className="text-slate-400">Security Standard:</span>
                    <span className="text-white font-bold">SOC 2 / ISO 27001 Ready</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
                    <span className="text-slate-400">Target Response Time:</span>
                    <span className="text-cyan-400 font-bold">&lt; 15 Minutes</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-800/50">
                    <span className="text-slate-400">Dedicated Engineering Team:</span>
                    <span className="text-emerald-400 font-bold">Assigned Senior Lead</span>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-200">
                  <p className="font-sans">
                    💡 All Lyntrix services include comprehensive architecture review and dedicated post-deployment support.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
