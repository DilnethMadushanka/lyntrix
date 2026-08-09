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
  const [viewMode, setViewMode] = useState('site'); // 'site' or 'admin'
  const [dbTrigger, setDbTrigger] = useState(0);

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
        <ContactSection estimateData={estimateData} onInquirySubmitted={triggerDataRefresh} />
      </main>

      <Footer
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAdminDashboard={() => setViewMode('admin')}
      />

      {/* Unified Login / Register Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
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
