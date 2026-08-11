import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ServicesSection from './components/ServicesSection';
import SolutionsSection from './components/SolutionsSection';
import CaseStudiesSection from './components/CaseStudiesSection';
import InteractiveCostCalculator from './components/InteractiveCostCalculator';
import TechStackSection from './components/TechStackSection';
import AboutSection from './components/AboutSection';
import TestimonialsSection from './components/TestimonialsSection';
import FAQSection from './components/FAQSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import ProjectTrackerModal from './components/ProjectTrackerModal';
import AuthModal from './components/AuthModal';
import UserProfileModal from './components/UserProfileModal';
import { db } from './services/db';
import { LayoutDashboard, AlertTriangle } from 'lucide-react';

export default function App() {
  const [estimateData, setEstimateData] = useState(null);
  const [currentUser, setCurrentUser] = useState(db.getCurrentUser());
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    const admin = db.getCurrentAdmin();
    const user = db.getCurrentUser();
    return !!admin || user?.role === 'Admin';
  });
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [initialAuthMode, setInitialAuthMode] = useState('signin');
  const [initialAuthEmail, setInitialAuthEmail] = useState('');
  const [verificationToast, setVerificationToast] = useState('');
  const [viewMode, setViewMode] = useState('site'); // 'site' or 'admin'
  const [dbTrigger, setDbTrigger] = useState(0);

  // Server Maintenance Mode Config State
  const [maintenanceConfig, setMaintenanceConfig] = useState(() => db.getMaintenanceConfig());

  useEffect(() => {
    const syncMaintenance = () => {
      setMaintenanceConfig(db.getMaintenanceConfig());
    };
    window.addEventListener('lyntrix-maintenance-updated', syncMaintenance);
    return () => window.removeEventListener('lyntrix-maintenance-updated', syncMaintenance);
  }, []);

  // 1-Click Magic Email Verification Link Listener & Cloud DB Sync
  useEffect(() => {
    // Background sync with Supabase Cloud DB
    db.syncWithCloud().then(() => {
      setDbTrigger(prev => prev + 1);
    });

    try {
      const params = new URLSearchParams(window.location.search);
      const verifyOtp = params.get('verify_otp');
      const email = params.get('email');
      const action = params.get('action'); // 'register', 'reset', 'change_password'

      if (verifyOtp && email) {
        // Clean URL parameters without reloading page
        window.history.replaceState({}, document.title, window.location.pathname);

        if (action === 'reset') {
          // Open password reset directly
          setInitialAuthMode('set_new_password');
          setInitialAuthEmail(email);
          setIsAuthOpen(true);
        } else if (action === 'change_password') {
          // Open profile modal directly for password update
          setVerificationToast(`✨ 1-Click Verification Confirmed for ${email}!`);
          setIsProfileOpen(true);
          setTimeout(() => setVerificationToast(''), 6000);
        } else {
          // Instant 1-Click Account Activation & Login
          const existingUsers = db.getUsers();
          let matched = existingUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
          if (!matched) {
            matched = {
              id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
              name: email.split('@')[0],
              email: email,
              company: 'Verified Corporate Client',
              birthday: '1998-05-14',
              phone: '+94 71 455 7857',
              country: 'Sri Lanka',
              role: 'Client',
              status: 'Active',
              joinedDate: new Date().toISOString().split('T')[0],
              authProvider: '1-Click Email Link'
            };
            db.saveUsers([matched, ...existingUsers]);
          }
          db.setCurrentUser(matched);
          setCurrentUser(matched);
          setVerificationToast(`🎉 1-Click Email Verification Success! Welcome, ${matched.name}.`);
          setTimeout(() => setVerificationToast(''), 6000);
        }
      }
    } catch (err) {
      console.warn('URL verification handler note:', err);
    }
  }, []);

  const handleSelectEstimate = (data) => {
    setEstimateData(data);
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenCalculator = () => {
    const calcSection = document.getElementById('calculator');
    if (calcSection) {
      calcSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setViewMode('site');
    db.logoutAdmin();
    db.logoutUser();
    setCurrentUser(null);
  };

  const handleAuthSuccess = (user, isAdmin = false) => {
    setCurrentUser(user);
    if (isAdmin || user.role === 'Admin') {
      setIsAdminLoggedIn(true);
      setViewMode('admin');
    }
    setDbTrigger(prev => prev + 1);
  };

  const handleLogoutUser = () => {
    db.logoutUser();
    db.logoutAdmin();
    setCurrentUser(null);
    setIsAdminLoggedIn(false);
    setViewMode('site');
  };

  const triggerDataRefresh = () => {
    setDbTrigger(prev => prev + 1);
  };

  if (viewMode === 'admin' && isAdminLoggedIn) {
    return (
      <AdminDashboard
        key={dbTrigger}
        onLogout={handleLogout}
        onReturnToSite={() => setViewMode('site')}
        onDataUpdated={triggerDataRefresh}
      />
    );
  }

  // Check if Full Maintenance Lock Overlay is active (and visitor is not Master Admin)
  if (maintenanceConfig.enabled && maintenanceConfig.mode === 'full' && !isAdminLoggedIn && viewMode !== 'admin') {
    return (
      <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-amber-500/30 selection:text-amber-300 font-sans">
        {/* Background Cyber Glowing Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-xl w-full glass-card p-8 sm:p-12 rounded-3xl border border-amber-500/40 text-center space-y-6 relative z-10 shadow-2xl shadow-amber-950/40 animate-in fade-in zoom-in duration-300">
          
          <div className="w-20 h-20 rounded-3xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
            <AlertTriangle className="w-10 h-10 animate-bounce" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/90 border border-amber-600/80 text-xs font-mono text-amber-300 font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>SYSTEM UPGRADE IN PROGRESS</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit']">
              Scheduled Platform Maintenance
            </h1>
          </div>

          <p className="text-sm text-slate-300 font-mono leading-relaxed bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
            {maintenanceConfig.message || '⚠️ Scheduled Platform Upgrade in Progress. Systems are undergoing routine maintenance.'}
          </p>

          <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs font-mono">
            <div>
              <div className="text-slate-400">ESTIMATED ETA</div>
              <div className="text-amber-400 font-bold text-base mt-0.5">{maintenanceConfig.eta || '30 Minutes'}</div>
            </div>
            <div>
              <div className="text-slate-400">SECURITY STATUS</div>
              <div className="text-emerald-400 font-bold text-base mt-0.5">TLS 1.3 Secure</div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-center gap-3 text-xs font-mono">
            <a
              href="mailto:lyntrixtec@gmail.com"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 text-slate-200 border border-slate-700 hover:text-cyan-400 transition-colors flex items-center justify-center gap-2"
            >
              <span>Email Advisory</span>
            </a>
            <a
              href="https://wa.me/94714557857"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900 transition-colors flex items-center justify-center gap-2 font-bold"
            >
              <span>Hotline / WhatsApp: +94 71 455 7857</span>
            </a>
          </div>

          {/* Admin Login Bypass Link */}
          <div className="pt-2">
            <button
              onClick={() => {
                setInitialAuthMode('signin');
                setIsAuthOpen(true);
              }}
              className="text-[11px] text-slate-400 hover:text-cyan-400 underline font-mono"
            >
              Admin Sign In / Login Bypass
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-300 relative">
      
      {/* Floating Admin Switcher when logged in */}
      {isAdminLoggedIn && (
        <div className="fixed bottom-5 right-5 z-50">
          <button
            onClick={() => setViewMode('admin')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-cyan-500 text-slate-950 font-bold font-mono text-xs shadow-2xl shadow-cyan-500/50 hover:bg-cyan-400 transition-all border border-cyan-300"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Open Admin Console</span>
          </button>
        </div>
      )}

      <Navbar
        onOpenCalculator={handleOpenCalculator}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAdminDashboard={() => setViewMode('admin')}
        onOpenTracker={() => setIsTrackerOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenUserProfile={() => setIsProfileOpen(true)}
        currentUser={currentUser}
        onLogoutUser={handleLogoutUser}
        maintenanceConfig={maintenanceConfig}
      />

      <main>
        <Hero onOpenCalculator={handleOpenCalculator} onOpenTracker={() => setIsTrackerOpen(true)} />
        <ServicesSection dbTrigger={dbTrigger} />
        <SolutionsSection />
        <CaseStudiesSection />
        <InteractiveCostCalculator onSelectEstimate={handleSelectEstimate} dbTrigger={dbTrigger} />
        <TechStackSection />
        <AboutSection />
        <TestimonialsSection />
        <FAQSection />
        <ContactSection
          estimateData={estimateData}
          onInquirySubmitted={triggerDataRefresh}
          currentUser={currentUser}
          onOpenAuth={(mode = 'signin') => {
            setInitialAuthMode(mode);
            setIsAuthOpen(true);
          }}
        />
      </main>

      <Footer
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAdminDashboard={() => setViewMode('admin')}
      />

      {/* 1-Click Verification Success Toast Notification */}
      {verificationToast && (
        <div className="fixed top-20 right-5 z-50 p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500/80 text-emerald-300 text-xs font-mono font-bold shadow-2xl shadow-emerald-950 flex items-center gap-2.5 animate-in slide-in-from-top-4 duration-300">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span>{verificationToast}</span>
        </div>
      )}

      {/* Unified Login / Register Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => {
          setIsAuthOpen(false);
          setInitialAuthMode('signin');
          setInitialAuthEmail('');
        }}
        onAuthSuccess={handleAuthSuccess}
        initialMode={initialAuthMode}
        initialEmail={initialAuthEmail}
      />

      {/* User Profile & Account Management Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentUser={currentUser}
        onProfileUpdated={(updated) => {
          setCurrentUser(updated);
          triggerDataRefresh();
        }}
        onOpenTracker={() => {
          setIsProfileOpen(false);
          setIsTrackerOpen(true);
        }}
      />

      {/* Project Status Tracker Modal */}
      <ProjectTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
      />
    </div>
  );
}
