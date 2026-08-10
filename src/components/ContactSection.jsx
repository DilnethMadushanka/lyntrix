import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, ShieldCheck, Clock, Sparkles, AlertCircle, Calendar, UserCheck, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { db } from '../services/db';
import { emailService } from '../services/emailService';

export default function ContactSection({ estimateData, onInquirySubmitted, currentUser, onOpenAuth }) {
  const tomorrowDate = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    service: 'Software Development',
    budget: '$5,000 - $15,000',
    details: '',
  });

  // Free 1-on-1 Consultation States
  const [wantConsultation, setWantConsultation] = useState(true);
  const [consultationDate, setConsultationDate] = useState(tomorrowDate);
  const [consultationTime, setConsultationTime] = useState('10:00 AM - 10:30 AM (IST)');
  const [meetingPlatform, setMeetingPlatform] = useState('Google Meet (Video Call)');

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailNotice, setEmailNotice] = useState('');

  // Auto-sync with current logged-in user profile
  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        name: currentUser.name || prev.name || '',
        email: currentUser.email || prev.email,
        phone: currentUser.phone || prev.phone || ''
      }));
    }
  }, [currentUser]);

  useEffect(() => {
    if (estimateData) {
      setFormData(prev => ({
        ...prev,
        service: estimateData.service ? estimateData.service.split('(')[0].trim() : prev.service,
        budget: estimateData.estimateRange || prev.budget,
        details: `Pre-configured from Estimator: ${estimateData.service} (${estimateData.scale}). Est. Budget: ${estimateData.estimateRange}.`
      }));
    }
  }, [estimateData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      if (onOpenAuth) onOpenAuth('signin');
      return;
    }

    setIsSubmitting(true);

    const newLead = {
      id: `LYN-${Math.floor(1000 + Math.random() * 9000)}`,
      name: formData.name || currentUser.name || 'Valued Client',
      email: formData.email || currentUser.email,
      phone: formData.phone || currentUser.phone || 'N/A',
      service: formData.service,
      scale: estimateData ? estimateData.scale : 'Custom Project',
      budget: formData.budget,
      status: 'New',
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      details: formData.details,
      hasConsultation: wantConsultation,
      consultationDate: wantConsultation ? consultationDate : null,
      consultationTime: wantConsultation ? consultationTime : null,
      meetingPlatform: wantConsultation ? meetingPlatform : null,
    };

    // 1. Save lead proposal to Cloud DB!
    await db.addInquiry(newLead);
    if (onInquirySubmitted) onInquirySubmitted();

    // 2. Trigger Automated Order Alert to Admin Gmail!
    const adminAlertResult = await emailService.sendAdminOrderAlert(newLead);

    // 3. Trigger Automated "Order Accepted & Received" Confirmation with Consultation to Client!
    await emailService.sendClientOrderAccepted(newLead);

    const noticeText = wantConsultation 
      ? `📧 Proposal & Consultation confirmed for ${consultationDate} at ${consultationTime}. Confirmation email sent to ${newLead.email}!`
      : `📧 Automated Proposal confirmation email dispatched to ${newLead.email}!`;

    setEmailNotice(noticeText);

    setIsSubmitting(false);
    setSubmitted(true);
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (err) {}
  };

  return (
    <section id="contact" className="py-16 sm:py-24 relative bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Direct Contact & SLA Details */}
          <div className="lg:col-span-5 space-y-6 sm:space-y-8">
            <div className="space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400">
                <Mail className="w-3.5 h-3.5" />
                <span>EXECUTIVE ADVISORY CONTACT</span>
              </div>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white font-['Outfit']">
                Let's Build Your <span className="text-gradient-cyan">Next Platform</span>
              </h2>
              <p className="text-slate-300 text-xs sm:text-base font-light">
                Ready to accelerate software development, migrate to cloud, or lock down cybersecurity? Connect directly with our lead architects.
              </p>
            </div>

            {/* Direct Channels */}
            <div className="space-y-3 sm:space-y-4">
              <div className="glass-card p-3.5 sm:p-4 rounded-xl border border-slate-800 flex items-center gap-3 sm:gap-4">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <div className="text-[10px] sm:text-xs text-slate-400 font-mono uppercase">Direct Advisory Email</div>
                  <a href="mailto:contact@lyntrixtec.com" className="text-xs sm:text-sm font-bold text-white hover:text-cyan-400 font-mono">
                    contact@lyntrixtec.com
                  </a>
                </div>
              </div>

              <div className="glass-card p-3.5 sm:p-4 rounded-xl border border-slate-800 flex items-center gap-3 sm:gap-4">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <div className="text-[10px] sm:text-xs text-slate-400 font-mono uppercase">Client Hotline / SOC</div>
                  <div className="text-xs sm:text-sm font-bold text-white font-mono">
                    +94 77 123 4567
                  </div>
                </div>
              </div>

              <div className="glass-card p-3.5 sm:p-4 rounded-xl border border-slate-800 flex items-center gap-3 sm:gap-4">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <div className="text-[10px] sm:text-xs text-slate-400 font-mono uppercase">Headquarters</div>
                  <div className="text-xs sm:text-sm font-bold text-white">
                    Colombo, Sri Lanka & Global Remote Teams
                  </div>
                </div>
              </div>
            </div>

            {/* Response Guarantee Badge */}
            <div className="p-4 sm:p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5 sm:space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                <Clock className="w-4 h-4" />
                <span>RAPID DISCOVERY GUARANTEE</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                All business inquiries trigger an <strong>Instant Automated Email to Admin</strong> and are acknowledged within 2 hours.
              </p>
            </div>

          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 glass-card p-5 sm:p-8 lg:p-10 rounded-2xl border border-slate-800 relative w-full">
            
            {submitted ? (
              <div className="py-8 sm:py-12 text-center space-y-4 animate-in fade-in zoom-in duration-300">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                  <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white font-['Outfit']">Proposal Request Saved to Cloud!</h3>
                <p className="text-slate-300 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                  Thank you <strong className="text-cyan-400">{formData.name}</strong>. Your project proposal details have been stored in Cloud DB.
                </p>

                {emailNotice && (
                  <div className="p-3 bg-cyan-950/80 border border-cyan-500/60 rounded-xl text-xs font-mono text-cyan-300 max-w-md mx-auto flex items-center justify-center gap-2">
                    <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>{emailNotice}</span>
                  </div>
                )}

                <button
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-mono hover:bg-slate-700 transition-colors"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : !currentUser ? (
              /* Auth Restriction Banner for Unauthenticated Users */
              <div className="py-8 px-4 text-center space-y-6 animate-in fade-in duration-300">
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mx-auto">
                  <Lock className="w-8 h-8" />
                </div>

                <div className="space-y-2 max-w-md mx-auto">
                  <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 uppercase">
                    REGISTERED CLIENTS ONLY
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white font-['Outfit']">
                    Sign In to Submit Proposals
                  </h3>
                  <p className="text-xs text-slate-300 font-mono leading-relaxed">
                    To maintain enterprise security and schedule 1-on-1 architecture consultations, technical proposals can only be submitted by verified Lyntrix accounts.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-md mx-auto">
                  <button
                    type="button"
                    onClick={() => onOpenAuth && onOpenAuth('signin')}
                    className="glow-btn w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 text-slate-950 font-bold font-mono text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Sign In to Request Proposal</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenAuth && onOpenAuth('signup')}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 text-slate-200 border border-slate-700 hover:text-white font-bold font-mono text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>Register Free Account</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white font-['Outfit']">Request Technical Proposal</h3>
                    <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1 mt-0.5">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Authenticated Client: <strong>{currentUser.email}</strong></span>
                    </div>
                  </div>
                  {estimateData && (
                    <span className="text-[10px] sm:text-xs font-mono text-cyan-400 bg-cyan-950 px-2.5 py-1 rounded border border-cyan-800 w-fit">
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
                      className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:border-cyan-400 focus:outline-none transition-colors"
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
                      className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:border-cyan-400 focus:outline-none transition-colors font-mono"
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
                      className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:border-cyan-400 focus:outline-none transition-colors font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">Primary Service Area</label>
                    <select
                      value={formData.service}
                      onChange={e => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:border-cyan-400 focus:outline-none transition-colors"
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
                  <label className="text-xs font-mono text-slate-300">Project Requirements & Scope Details *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Briefly describe your application goals, target platform, legacy integrations, or expected deliverables..."
                    value={formData.details}
                    onChange={e => setFormData({ ...formData, details: e.target.value })}
                    className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm focus:border-cyan-400 focus:outline-none transition-colors resize-none"
                  />
                </div>

                {/* Free 1-on-1 Consultation Time Scheduler Section */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-mono text-xs text-cyan-400 font-bold">
                      <Calendar className="w-4 h-4 text-cyan-400" />
                      <span>SCHEDULE FREE 1-ON-1 ARCHITECTURE CONSULTATION</span>
                    </div>
                    <label className="flex items-center gap-2 text-xs font-mono text-slate-300 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={wantConsultation}
                        onChange={e => setWantConsultation(e.target.checked)}
                        className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-cyan-400 focus:ring-0 cursor-pointer"
                      />
                      <span>Include Free Consultation</span>
                    </label>
                  </div>

                  {wantConsultation && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                      <div>
                        <label className="text-[11px] font-mono text-slate-300 block mb-1">Preferred Date *</label>
                        <input
                          type="date"
                          required={wantConsultation}
                          min={tomorrowDate}
                          value={consultationDate}
                          onChange={e => setConsultationDate(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-mono text-slate-300 block mb-1">Preferred Time Slot *</label>
                        <select
                          value={consultationTime}
                          onChange={e => setConsultationTime(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-cyan-300 text-xs font-mono focus:border-cyan-400 focus:outline-none"
                        >
                          <option value="09:00 AM - 09:30 AM (IST)">09:00 AM - 09:30 AM (IST)</option>
                          <option value="11:00 AM - 11:30 AM (IST)">11:00 AM - 11:30 AM (IST)</option>
                          <option value="02:00 PM - 02:30 PM (IST)">02:00 PM - 02:30 PM (IST)</option>
                          <option value="04:00 PM - 04:30 PM (IST)">04:00 PM - 04:30 PM (IST)</option>
                          <option value="06:00 PM - 06:30 PM (IST)">06:00 PM - 06:30 PM (IST)</option>
                          <option value="08:00 PM - 08:30 PM (IST)">08:00 PM - 08:30 PM (IST)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-mono text-slate-300 block mb-1">Meeting Platform *</label>
                        <select
                          value={meetingPlatform}
                          onChange={e => setMeetingPlatform(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-indigo-300 text-xs font-mono focus:border-cyan-400 focus:outline-none"
                        >
                          <option value="Google Meet (Video Call)">Google Meet (Video Call)</option>
                          <option value="Zoom Workplace">Zoom Workplace</option>
                          <option value="Microsoft Teams">Microsoft Teams</option>
                          <option value="Direct Phone Call">Direct Phone Call</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="glow-btn w-full py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 text-slate-950 font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2 font-mono">
                      <span className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                      Dispatching Order & Email Confirmation...
                    </span>
                  ) : (
                    <>
                      <span>Submit Proposal & Confirm Consultation</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-[10px] sm:text-[11px] text-slate-400 text-center font-mono">
                  📧 Automatically sends instant notification to admin@lyntrixtec.com.
                </p>

              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
