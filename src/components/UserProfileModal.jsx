import React, { useState, useEffect, useRef } from 'react';
import { 
  User, Mail, Building, Calendar, Phone, Globe, ShieldCheck, 
  X, Lock, CheckCircle2, AlertCircle, FileText, Clock, Save, 
  Sparkles, ExternalLink, ChevronRight, Check, KeyRound, RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { db } from '../services/db';
import { emailService } from '../services/emailService';

export default function UserProfileModal({ isOpen, onClose, currentUser, onProfileUpdated, onOpenTracker }) {
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'security', 'orders'
  
  // Profile Form States
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    birthday: '',
    phone: '',
    country: 'Sri Lanka'
  });

  // Password States & OTP Flow
  const [passwordStep, setPasswordStep] = useState('input'); // 'input' or 'otp'
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(110);
  const [isRealEmailSent, setIsRealEmailSent] = useState(false);
  const otpInputsRef = useRef([]);

  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // OTP Countdown Timer
  useEffect(() => {
    let interval = null;
    if (passwordStep === 'otp' && timerSeconds > 0) {
      interval = setInterval(() => setTimerSeconds(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [passwordStep, timerSeconds]);

  // Sync user data
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        company: currentUser.company || '',
        birthday: currentUser.birthday || '',
        phone: currentUser.phone || '',
        country: currentUser.country || 'Sri Lanka'
      });
      setPasswordStep('input');
      setNewPassword('');
      setConfirmPassword('');
      setOtpDigits(['', '', '', '', '', '']);
    }
  }, [currentUser, isOpen]);

  if (!isOpen || !currentUser) return null;

  // Filter inquiries for this user
  const userInquiries = db.getInquiries().filter(
    inq => inq.email?.toLowerCase() === currentUser.email?.toLowerCase()
  );

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setError('');
    setNotice('');
    setLoading(true);

    try {
      const updated = db.updateUserProfile({
        ...currentUser,
        name: formData.name,
        company: formData.company,
        birthday: formData.birthday,
        phone: formData.phone,
        country: formData.country
      });

      setLoading(false);
      setNotice('✅ Profile details successfully updated in Cloud DB!');
      try { confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } }); } catch (err) {}
      if (onProfileUpdated) onProfileUpdated(updated);
      setTimeout(() => setNotice(''), 4000);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Failed to update profile.');
    }
  };

  // Step 1: Initiate Password Change with OTP
  const handleInitiatePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);

    // Dispatch 6-Digit OTP via Gmail Nodemailer
    const otpResult = await emailService.generateAndSendOTP(currentUser.email, 'Change Password Security Verification');
    setGeneratedOtp(otpResult.otpCode);
    setIsRealEmailSent(otpResult.realSent);
    setTimerSeconds(110);
    setOtpDigits(['', '', '', '', '', '']);
    setLoading(false);
    setPasswordStep('otp');
  };

  // Handle OTP Digit Input Change
  const handleOtpDigitChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);

    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  // Step 2: Verify OTP & Save New Password
  const handleVerifyPasswordOtp = (e) => {
    e.preventDefault();
    setError('');
    const enteredOtp = otpDigits.join('');

    if (enteredOtp.length < 6) {
      setError('Please enter all 6 digits of the OTP verification code.');
      return;
    }

    if (enteredOtp !== generatedOtp) {
      setError('Invalid OTP code. Please check your verification email and try again.');
      return;
    }

    setLoading(true);

    try {
      db.updateUserPassword(currentUser.email, newPassword);
      setLoading(false);
      setPasswordStep('input');
      setNewPassword('');
      setConfirmPassword('');
      setNotice('🔒 Password successfully updated and verified via Email OTP!');
      try { confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } }); } catch (err) {}
      setTimeout(() => setNotice(''), 4000);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Failed to update password.');
    }
  };

  const handleResendOtp = async () => {
    setError('');
    const otpResult = await emailService.generateAndSendOTP(currentUser.email, 'Change Password Security Verification');
    setGeneratedOtp(otpResult.otpCode);
    setIsRealEmailSent(otpResult.realSent);
    setTimerSeconds(110);
    setOtpDigits(['', '', '', '', '', '']);
    alert(`📧 A fresh 6-digit authorization code has been dispatched to ${currentUser.email}.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl glass-card p-6 sm:p-8 rounded-2xl border border-cyan-500/40 shadow-2xl shadow-cyan-950 max-h-[90vh] overflow-y-auto">
        
        {/* Glow Element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        {/* User Hero Banner */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pb-6 border-b border-slate-800">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-indigo-500 text-slate-950 font-extrabold flex items-center justify-center text-2xl shadow-lg shadow-cyan-500/30 border-2 border-white/20">
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-950" title="Active Client" />
          </div>

          <div className="text-center sm:text-left space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h3 className="text-xl font-bold text-white font-['Outfit']">{currentUser.name}</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                {currentUser.role || 'Client'}
              </span>
              {currentUser.authProvider === 'Google' && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Google Verified
                </span>
              )}
            </div>
            <p className="text-xs font-mono text-slate-400">{currentUser.email}</p>
            <div className="text-[11px] font-mono text-slate-500 flex items-center justify-center sm:justify-start gap-3 pt-0.5">
              <span>ID: <strong className="text-slate-300">{currentUser.id || 'USR-1001'}</strong></span>
              <span>Joined: <strong className="text-slate-300">{currentUser.joinedDate || '2026-08-01'}</strong></span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 my-5 text-xs font-mono">
          <button
            onClick={() => { setActiveTab('profile'); setError(''); setNotice(''); }}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'profile' ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800' : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile Details</span>
          </button>

          <button
            onClick={() => { setActiveTab('security'); setError(''); setNotice(''); }}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'security' ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Security & 2FA</span>
          </button>

          <button
            onClick={() => { setActiveTab('orders'); setError(''); setNotice(''); }}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'orders' ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>My Proposals ({userInquiries.length})</span>
          </button>
        </div>

        {/* Notice Banners */}
        {notice && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/70 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{notice}</span>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/70 text-rose-300 text-xs font-mono flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* TAB 1: EDIT PROFILE DETAILS */}
        {activeTab === 'profile' && (
          <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs font-mono animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="space-y-1.5">
                <label className="text-slate-300 block">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 block">Corporate Email (Verified)</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    disabled
                    value={formData.email}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 cursor-not-allowed opacity-80"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 block">Company / Organization</label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="e.g. Lyntrix Global"
                    value={formData.company}
                    onChange={e => setFormData({ ...formData, company: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 block">Date of Birth / Founded</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="date"
                    value={formData.birthday}
                    onChange={e => setFormData({ ...formData, birthday: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 block">Phone / Direct Line</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    placeholder="+94 7X XXX XXXX"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 block">Country / Region</label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <select
                    value={formData.country}
                    onChange={e => setFormData({ ...formData, country: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option>Sri Lanka</option>
                    <option>United States</option>
                    <option>United Kingdom</option>
                    <option>Germany</option>
                    <option>Singapore</option>
                    <option>Australia</option>
                  </select>
                </div>
              </div>

            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="glow-btn px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-bold text-xs font-mono flex items-center gap-2 shadow-lg shadow-cyan-500/20"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Saving Changes...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: SECURITY & PASSWORD WITH 6-DIGIT EMAIL OTP */}
        {activeTab === 'security' && (
          <div className="space-y-4 text-xs font-mono animate-in fade-in duration-200">
            
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
              <div className="text-cyan-400 font-bold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>2FA Email OTP Password Sentinel</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                To guarantee maximum enterprise account security, updating your password requires 6-digit Email OTP authorization sent to <strong className="text-white">{currentUser.email}</strong>.
              </p>
            </div>

            {passwordStep === 'input' ? (
              <form onSubmit={handleInitiatePasswordChange} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-slate-300 block">New Password *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      placeholder="Min 6 characters..."
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 block">Confirm New Password *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      placeholder="Re-enter new password..."
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="glow-btn px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-bold text-xs font-mono flex items-center gap-2 shadow-lg shadow-cyan-500/20"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>{loading ? 'Dispatching OTP Code...' : 'Send OTP to Authorize Change'}</span>
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyPasswordOtp} className="space-y-5 animate-in fade-in zoom-in-95 duration-200">
                <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-800/60 text-xs font-mono text-center space-y-2">
                  <div className="text-cyan-400 font-bold">Verification Code Dispatched!</div>
                  <div className="text-slate-300">
                    We sent a 6-digit OTP code to <strong className="text-white">{currentUser.email}</strong>.
                  </div>

                  {isRealEmailSent ? (
                    <div className="mt-2 p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-500/80 text-[11px] text-emerald-300 font-bold flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Real Email Dispatched via Gmail! Check Inbox / Spam.</span>
                    </div>
                  ) : (
                    <div className="mt-2 p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-emerald-400 font-bold">
                      [SIMULATED MAILBOX] Your OTP is: <u className="tracking-widest font-extrabold text-sm">{generatedOtp}</u>
                    </div>
                  )}
                </div>

                {/* 6 Single-Digit Input Boxes */}
                <div className="flex justify-center gap-2 sm:gap-3">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={el => otpInputsRef.current[idx] = el}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpDigitChange(idx, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(idx, e)}
                      className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold font-mono rounded-xl bg-slate-900 border border-slate-800 text-cyan-300 focus:border-cyan-400 focus:outline-none transition-colors"
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>Code expires in: <strong className="text-white">{Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}</strong></span>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-cyan-400 hover:underline flex items-center gap-1 font-bold"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Resend Code</span>
                  </button>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPasswordStep('input')}
                    className="flex-1 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-mono text-xs font-bold hover:bg-slate-800 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-2 py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 text-slate-950 font-bold text-xs font-mono flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25"
                  >
                    {loading ? 'Verifying Code...' : 'Verify OTP & Save Password'}
                  </button>
                </div>
              </form>
            )}

          </div>
        )}

        {/* TAB 3: MY PROPOSALS & ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {userInquiries.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3 font-mono text-xs">
                <FileText className="w-8 h-8 text-slate-600 mx-auto" />
                <div className="text-slate-300 font-bold">No Proposals Submitted Yet</div>
                <p className="text-slate-500 max-w-sm mx-auto text-[11px]">
                  You haven't requested any technical architecture proposals under this email address yet.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {userInquiries.map((inq) => (
                  <div 
                    key={inq.id}
                    className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all font-mono text-xs space-y-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-cyan-400">{inq.id}</span>
                        <span className="text-slate-400">• {inq.service}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        inq.status === 'Accepted' ? 'bg-emerald-950 text-emerald-300 border-emerald-800' :
                        inq.status === 'New' ? 'bg-cyan-950 text-cyan-300 border-cyan-800' :
                        inq.status === 'In Review' ? 'bg-amber-950 text-amber-300 border-amber-800' :
                        'bg-purple-950 text-purple-300 border-purple-800'
                      }`}>
                        {inq.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                      <div>Scale: <strong className="text-white">{inq.scale || 'Enterprise'}</strong></div>
                      <div>Budget: <strong className="text-emerald-400">{inq.budget}</strong></div>
                      <div>Date: <strong className="text-slate-300">{inq.date}</strong></div>
                    </div>

                    {inq.details && (
                      <p className="text-[11px] text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800/60 leading-relaxed font-sans">
                        "{inq.details}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
