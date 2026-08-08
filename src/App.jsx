import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ServicesSection from './components/ServicesSection';
import SolutionsSection from './components/SolutionsSection';
import InteractiveCostCalculator from './components/InteractiveCostCalculator';
import TechStackSection from './components/TechStackSection';
import AboutSection from './components/AboutSection';
import TestimonialsSection from './components/TestimonialsSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import AdminLoginModal from './components/AdminLoginModal';
import AdminDashboard from './components/AdminDashboard';
import { LayoutDashboard, Globe, Lock } from 'lucide-react';

export default function App() {
  const [estimateData, setEstimateData] = useState(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [viewMode, setViewMode] = useState('site'); // 'site' or 'admin'

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

  const handleLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    setViewMode('admin');
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setViewMode('site');
  };

  if (viewMode === 'admin' && isAdminLoggedIn) {
    return (
      <AdminDashboard
        onLogout={handleLogout}
        onReturnToSite={() => setViewMode('site')}
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
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAdminDashboard={() => setViewMode('admin')}
      />

      <main>
        <Hero onOpenCalculator={handleOpenCalculator} />
        <ServicesSection />
        <SolutionsSection />
        <InteractiveCostCalculator onSelectEstimate={handleSelectEstimate} />
        <TechStackSection />
        <AboutSection />
        <TestimonialsSection />
        <ContactSection estimateData={estimateData} />
      </main>

      <Footer
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAdminDashboard={() => setViewMode('admin')}
      />

      {/* Admin Login Modal Dialog */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
