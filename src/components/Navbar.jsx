import React, { useState, useEffect } from 'react';
import { ShieldCheck, Menu, X, ArrowRight, Sparkles, Terminal } from 'lucide-react';

export default function Navbar({ onOpenCalculator }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Services', href: '#services' },
    { name: 'Solutions', href: '#solutions' },
    { name: 'Tech Stack', href: '#tech-stack' },
    { name: 'Estimator', href: '#calculator' },
    { name: 'About Us', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-[#07090e]/95 backdrop-blur-md border-b border-slate-800/80 py-2.5 sm:py-3 shadow-xl shadow-black/40' 
        : 'bg-transparent py-3.5 sm:py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2">
          
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden bg-slate-900 border border-cyan-500/30 p-1 flex items-center justify-center group-hover:border-cyan-400 transition-colors shadow-lg shadow-cyan-500/10">
              <img src="/logo-icon.svg" alt="Lyntrix Icon" className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-lg sm:text-xl tracking-wider text-white font-['Outfit'] group-hover:text-cyan-400 transition-colors">LYNTRIX</span>
                <span className="text-[9px] sm:text-[10px] font-mono font-semibold px-1 sm:px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/50">IT SERVICES</span>
              </div>
              <p className="text-[8px] sm:text-[9px] text-slate-400 tracking-widest uppercase font-mono hidden xs:block">Innovate • Integrate • Elevate</p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 glass-panel px-3 py-1.5 rounded-full border border-slate-800">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs xl:text-sm font-medium text-slate-300 hover:text-cyan-400 px-3 py-1.5 rounded-full hover:bg-slate-800/50 transition-all duration-200"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-2.5 shrink-0">
            <button 
              onClick={onOpenCalculator}
              className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden lg:inline">Project Estimator</span>
              <span className="lg:hidden">Estimator</span>
            </button>

            <a
              href="#contact"
              className="glow-btn flex items-center gap-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 hover:from-cyan-300 hover:to-indigo-300 px-3.5 py-2 rounded-lg transition-all"
            >
              <span>Get Proposal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700/60"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>
      </div>

      {/* Mobile & Tablet Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-panel border-b border-slate-800 px-4 pt-4 pb-6 mt-3 space-y-3 max-h-[85vh] overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-800 text-xs font-mono text-cyan-400">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Systems Operational
            </span>
            <span>v2.4 Enterprise</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800/80 hover:text-cyan-400"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-2">
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenCalculator(); }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-slate-800 text-sm font-medium text-slate-200"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Launch Project Cost Estimator
            </button>

            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-cyan-400 text-slate-950 font-bold text-sm"
            >
              Contact Advisory Team
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
