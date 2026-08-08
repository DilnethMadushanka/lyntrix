import React, { useState } from 'react';
import { Cpu, Terminal, Sparkles } from 'lucide-react';

export default function TechStackSection() {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Stack' },
    { id: 'frontend', label: 'Frontend & Mobile' },
    { id: 'backend', label: 'Backend & APIs' },
    { id: 'cloud', label: 'Cloud & DevOps' },
    { id: 'security', label: 'Security & DB' },
  ];

  const technologies = [
    { name: 'React / Next.js', category: 'frontend', desc: 'High-performance UI & Server-Side Rendering', badge: 'Primary' },
    { name: 'TypeScript', category: 'frontend', desc: 'Type-safe enterprise software architecture', badge: 'Standard' },
    { name: 'Tailwind CSS', category: 'frontend', desc: 'Modern responsive component styling', badge: 'Standard' },
    { name: 'React Native', category: 'frontend', desc: 'Cross-platform iOS and Android mobile apps', badge: 'Mobile' },
    
    { name: 'Node.js / Express', category: 'backend', desc: 'Event-driven high-concurrency microservices', badge: 'Primary' },
    { name: 'Python / FastAPI', category: 'backend', desc: 'AI integration, data engineering & REST APIs', badge: 'Primary' },
    { name: 'Go (Golang)', category: 'backend', desc: 'Ultra-low latency microservices & network systems', badge: 'High Perf' },
    { name: 'GraphQL & REST', category: 'backend', desc: 'Flexible data querying and API gateways', badge: 'API' },

    { name: 'Amazon Web Services', category: 'cloud', desc: 'EC2, EKS, Lambda, S3, RDS, CloudFront', badge: 'Cloud' },
    { name: 'Microsoft Azure', category: 'cloud', desc: 'Azure DevOps, App Services & Enterprise Cloud', badge: 'Cloud' },
    { name: 'Docker & Kubernetes', category: 'cloud', desc: 'Containerization & resilient orchestration', badge: 'DevOps' },
    { name: 'Terraform', category: 'cloud', desc: 'Declarative Infrastructure as Code (IaC)', badge: 'IaC' },

    { name: 'PostgreSQL & Redis', category: 'security', desc: 'Relational data integrity & ultra-fast caching', badge: 'Database' },
    { name: 'Zero-Trust mTLS', category: 'security', desc: 'Mutual TLS & identity-bound network policies', badge: 'Security' },
    { name: 'Cloudflare Enterprise', category: 'security', desc: 'DDoS mitigation, WAF & edge routing', badge: 'Security' },
    { name: 'Pinecone / Qdrant', category: 'security', desc: 'Vector databases for AI semantic retrieval', badge: 'AI DB' },
  ];

  const filteredTech = activeCategory === 'all'
    ? technologies
    : technologies.filter(t => t.category === activeCategory);

  return (
    <section id="tech-stack" className="py-24 relative bg-slate-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400">
            <Cpu className="w-3.5 h-3.5" />
            <span>MODERN STACK STANDARDS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-['Outfit']">
            Cutting-Edge <span className="text-gradient-cyan">Technology Stack</span>
          </h2>
          <p className="text-slate-400 text-base font-light">
            We rely on battled-tested, security-hardened open-source and enterprise frameworks.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`px-4 py-2 rounded-xl text-xs font-mono transition-all border ${
                activeCategory === c.id
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-500/60 shadow-md shadow-cyan-950'
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Tech Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredTech.map((tech, idx) => (
            <div
              key={idx}
              className="glass-card p-5 rounded-xl border border-slate-800/80 hover:border-cyan-500/40 transition-all space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-100 text-base group-hover:text-cyan-400 transition-colors font-['Outfit']">
                  {tech.name}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                  {tech.badge}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-light leading-relaxed">
                {tech.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
