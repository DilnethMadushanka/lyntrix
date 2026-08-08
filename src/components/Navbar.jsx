import React, { useState, useEffect } from 'react';
import { ShieldCheck, Menu, X, ArrowRight, Sparkles, Terminal, Lock, LayoutDashboard, Search, User, LogOut } from 'lucide-react';

export default function Navbar({ 
  onOpenCalculator, 
  onOpenAdminLogin, 
  isAdminLoggedIn, 
  onOpenAdminDashboard, 
  onOpenTracker,
  onOpenAuth,
  currentUser,
  onLogoutUser
}) {
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
    { name: 'Case Studies', href: '#case-studies' },
    { name: 'Tech Stack', href: '#tech-stack' },
    { name: 'Estimator', href: '#calculator' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <>
      {/* Mobile & Tablet Fullscreen Background Blur Overlay when menu open */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-xl transition-all duration-300 lg:hidden"
          aria-hidden="true"
        />
      )}

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
                  className="text-xs xl:text-sm font-medium text-slate-300 hover:text-cyan-400 px-2.5 py-1 rounded-full hover:bg-slate-800/50 transition-all duration-200"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* Right Action Buttons */}
            <div className="hidden md:flex items-center gap-2 shrink-0">
              <button
                onClick={onOpenTracker}
                className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-all"
                title="Track Project Status"
              >
                <Search className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">Track Project</span>
              </button>

              {/* User Account Button or Sign In Button */}
              {currentUser ? (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-[10px] border border-cyan-500/40">
                    {currentUser.name.charAt(0)}
                  </div>
                  <span className="text-white font-semibold max-w-[100px] truncate">{currentUser.name}</span>
                  <button onClick={onLogoutUser} className="text-slate-400 hover:text-rose-400 ml-1" title="Sign Out">
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-all"
                >
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Client Login</span>
                </button>
              )}

              {isAdminLoggedIn ? (
                <button
                  onClick={onOpenAdminDashboard}
                  className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400 px-3 py-2 rounded-lg bg-cyan-950 border border-cyan-800 hover:bg-cyan-900 transition-all"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </button>
              ) : (
                <button
                  onClick={onOpenAdminLogin}
                  className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-cyan-400 border border-slate-800 hover:border-slate-700 transition-all"
                  title="Admin Portal Login"
                >
                  <Lock className="w-4 h-4" />
                </button>
              )}

              <button 
                onClick={onOpenCalculator}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden xl:inline">Estimator</span>
              </button>
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

        {/* Mobile & Tablet Drawer with Blur Overlay */}
        {mobileMenuOpen && (
          <div className="relative z-50 lg:hidden glass-panel border-b border-slate-800 px-4 pt-4 pb-6 mt-3 space-y-3 max-h-[85vh] overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-200">
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
              {currentUser ? (
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs">
                  <div>
                    <div className="text-white font-bold">{currentUser.name}</div>
                    <div className="text-[10px] text-slate-400">{currentUser.email}</div>
                  </div>
                  <button onClick={onLogoutUser} className="text-rose-400 hover:underline">Sign Out</button>
                </div>
              ) : (
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenAuth(); }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-cyan-950 text-cyan-300 font-mono text-xs border border-cyan-800 font-bold"
                >
                  <User className="w-4 h-4 text-cyan-400" />
                  Client Login / Register
                </button>
              )}

              <button
                onClick={() => { setMobileMenuOpen(false); onOpenTracker(); }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-slate-900 text-cyan-300 font-mono text-xs border border-slate-800"
              >
                <Search className="w-4 h-4 text-cyan-400" />
                Track Project Status
              </button>

              {isAdminLoggedIn ? (
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenAdminDashboard(); }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-cyan-950 text-cyan-300 font-mono text-sm font-bold border border-cyan-800"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Launch Admin Console
                </button>
              ) : (
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenAdminLogin(); }}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-900 text-slate-300 font-mono text-xs border border-slate-800"
                >
                  <Lock className="w-3.5 h-3.5 text-cyan-400" />
                  Admin Login
                </button>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
