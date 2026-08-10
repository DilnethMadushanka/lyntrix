import React, { useState, useEffect } from 'react';
import { ArrowUp, Shield, Heart, Terminal, Globe, ExternalLink, Code2, Lock, LayoutDashboard } from 'lucide-react';

export default function Footer({ onOpenAdminLogin, isAdminLoggedIn, onOpenAdminDashboard }) {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { timeZone: 'Asia/Colombo', hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-sm font-light pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-900 border border-cyan-500/30 p-1 flex items-center justify-center">
                <img src="/logo-icon.svg" alt="Lyntrix Icon" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-wider text-white font-['Outfit']">LYNTRIX</span>
                <span className="text-[10px] font-mono ml-2 text-cyan-400">IT SERVICES</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 max-w-sm leading-relaxed">
              Engineering resilient custom software, high-concurrency cloud architectures, and zero-trust cybersecurity for modern global organizations.
            </p>

            <div className="text-xs font-mono text-cyan-400 pt-1 space-y-1">
              <div>INNOVATE • INTEGRATE • ELEVATE</div>
              <div className="text-slate-300 font-sans text-xs">
                Email: <a href="mailto:lyntrixtec@gmail.com" className="text-cyan-400 font-mono hover:underline">lyntrixtec@gmail.com</a>
              </div>
              <div className="text-slate-300 font-sans text-xs">
                Hotline / WhatsApp: <a href="https://wa.me/94714557857" target="_blank" rel="noopener noreferrer" className="text-emerald-400 font-mono hover:underline font-bold">+94 71 455 7857</a>
              </div>
            </div>

            {/* Social & Git Repo */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="https://github.com/raveeshaheshan/lyntrix.git"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors flex items-center gap-1.5 text-xs font-mono"
                aria-label="GitHub Repository"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                <span>GitHub Repo</span>
              </a>

              {isAdminLoggedIn && (
                <button
                  onClick={onOpenAdminDashboard}
                  className="p-2 rounded-lg bg-cyan-950 text-cyan-300 hover:text-white border border-cyan-800 transition-colors flex items-center gap-1.5 text-xs font-mono font-bold"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Admin Console</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold uppercase text-white tracking-wider">Services</div>
            <ul className="space-y-2 text-xs">
              <li><a href="#services" className="hover:text-cyan-400 transition-colors">Software Development</a></li>
              <li><a href="#services" className="hover:text-cyan-400 transition-colors">Cloud Solutions</a></li>
              <li><a href="#services" className="hover:text-cyan-400 transition-colors">Cybersecurity Shield</a></li>
              <li><a href="#services" className="hover:text-cyan-400 transition-colors">IT Advisory & Consulting</a></li>
              <li><a href="#services" className="hover:text-cyan-400 transition-colors">24/7 Managed Infrastructure</a></li>
            </ul>
          </div>

          {/* Solutions & Tools */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold uppercase text-white tracking-wider">Solutions & Tools</div>
            <ul className="space-y-2 text-xs">
              <li><a href="#solutions" className="hover:text-cyan-400 transition-colors">Enterprise SaaS Architecture</a></li>
              <li><a href="#solutions" className="hover:text-cyan-400 transition-colors">Multi-Cloud Migration</a></li>
              <li><a href="#solutions" className="hover:text-cyan-400 transition-colors">Zero-Trust Audit</a></li>
              <li><a href="#calculator" className="hover:text-cyan-400 transition-colors">Cost Estimator Calculator</a></li>
              <li><a href="#tech-stack" className="hover:text-cyan-400 transition-colors">Technology Radar</a></li>
            </ul>
          </div>

          {/* Operations & Live Status */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold uppercase text-white tracking-wider">Operations & Status</div>
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between text-emerald-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  SOC Online
                </span>
                <span>99.99%</span>
              </div>
              <div className="text-[11px] text-slate-300">
                HQ Time: <span className="text-white font-bold">{timeStr || '12:00:00 AM'}</span> (Asia/Colombo)
              </div>
              <div className="text-[10px] text-slate-400 border-t border-slate-800/80 pt-1.5">
                Target Incident SLA: &lt;15 mins
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} LYNTRIX IT SERVICES. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-200 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-200 transition-colors">Terms of Service</a>

            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-all flex items-center gap-1 text-[11px] font-mono"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
