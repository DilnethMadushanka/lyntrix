import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, ShieldCheck, Clock, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ContactSection({ estimateData }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'Software Development',
    budget: 'Medium ($5k - $15k)',
    details: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (estimateData) {
      setFormData(prev => ({
        ...prev,
        service: estimateData.service || prev.service,
        details: `Pre-configured from Estimator: ${estimateData.service} (${estimateData.scale}). Est. Budget: ${estimateData.estimateRange}.`
      }));
    }
  }, [estimateData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (err) {}
    }, 800);
  };

  return (
    <section id="contact" className="py-24 relative bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Contact & SLA Details */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400">
                <Mail className="w-3.5 h-3.5" />
                <span>EXECUTIVE ADVISORY CONTACT</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-['Outfit']">
                Let's Build Your <span className="text-gradient-cyan">Next Platform</span>
              </h2>
              <p className="text-slate-300 text-base font-light">
                Ready to accelerate software development, migrate to cloud, or lock down cybersecurity? Connect directly with our lead architects.
              </p>
            </div>

            {/* Direct Channels */}
            <div className="space-y-4">
              <div className="glass-card p-4 rounded-xl border border-slate-800 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-mono uppercase">Direct Advisory Email</div>
                  <a href="mailto:contact@lyntrix.tech" className="text-sm font-bold text-white hover:text-cyan-400 font-mono">
                    contact@lyntrix.tech
                  </a>
                </div>
              </div>

              <div className="glass-card p-4 rounded-xl border border-slate-800 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-mono uppercase">Client Hotline / SOC</div>
                  <div className="text-sm font-bold text-white font-mono">
                    +94 77 123 4567
                  </div>
                </div>
              </div>

              <div className="glass-card p-4 rounded-xl border border-slate-800 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-mono uppercase">Headquarters</div>
                  <div className="text-sm font-bold text-white">
                    Colombo, Sri Lanka & Global Remote Teams
                  </div>
                </div>
              </div>
            </div>

            {/* Response Guarantee Badge */}
            <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                <Clock className="w-4 h-4" />
                <span>RAPID DISCOVERY GUARANTEE</span>
              </div>
              <p className="text-xs text-slate-300">
                All business inquiries are acknowledged within <strong>2 hours</strong> during standard business hours. NDA provided upon request.
              </p>
            </div>

          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 glass-card p-6 sm:p-10 rounded-2xl border border-slate-800 relative">
            
            {submitted ? (
              <div className="py-12 text-center space-y-4 animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white font-['Outfit']">Proposal Request Received!</h3>
                <p className="text-slate-300 text-sm max-w-md mx-auto">
                  Thank you <strong className="text-cyan-400">{formData.name}</strong>. Our senior technical consultant will review your project requirements and reach out at <strong className="text-cyan-400">{formData.email}</strong> within 2 business hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-mono hover:bg-slate-700 transition-colors"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h3 className="text-xl font-bold text-white font-['Outfit']">Request Technical Proposal</h3>
                  {estimateData && (
                    <span className="text-xs font-mono text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded border border-cyan-800">
                      ⚡ Pre-filled from Estimator
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dilneth Madushanka"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-cyan-400 focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">Corporate Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. name@company.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-cyan-400 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">Phone Number (Optional)</label>
                    <input
                      type="tel"
                      placeholder="+94 7X XXX XXXX"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-cyan-400 focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">Primary Service Area</label>
                    <select
                      value={formData.service}
                      onChange={e => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-cyan-400 focus:outline-none transition-colors"
                    >
                      <option>Software Development</option>
                      <option>Cloud Migration & DevOps</option>
                      <option>Cybersecurity Defense</option>
                      <option>IT Consulting & Strategy</option>
                      <option>24/7 Managed IT Support</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300">Project Requirements & Timeline</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Briefly describe your application goals, target platform, legacy integrations, or expected deliverables..."
                    value={formData.details}
                    onChange={e => setFormData({ ...formData, details: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-cyan-400 focus:outline-none transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="glow-btn w-full py-4 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 text-slate-950 font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2 font-mono">
                      <span className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                      Encrypting & Sending...
                    </span>
                  ) : (
                    <>
                      <span>Submit Proposal Request</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-[11px] text-slate-400 text-center font-mono">
                  🔒 We respect your privacy. All information is protected under standard non-disclosure terms.
                </p>

              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
