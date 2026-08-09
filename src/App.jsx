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
import { LayoutDashboard } from 'lucide-react';

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
              phone: '+94 7X XXX XXXX',
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
        onLogout={handleLogout}
        onReturnToSite={() => setViewMode('site')}
        onDataUpdated={triggerDataRefresh}
      />
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
        <ContactSection estimateData={estimateData} onInquirySubmitted={triggerDataRefresh} currentUser={currentUser} />
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
