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

export default function App() {
  const [estimateData, setEstimateData] = useState(null);

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

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-300">
      <Navbar onOpenCalculator={handleOpenCalculator} />
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
      <Footer />
    </div>
  );
}
