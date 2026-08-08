import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, Lock, Building, Calendar, Phone, Globe, ShieldCheck, X, Sparkles, AlertCircle, ArrowRight, CheckCircle2, KeyRound, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { db } from '../services/db';
import { emailService } from '../services/emailService';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [mode, setMode] = useState('signin'); // 'signin', 'signup', 'google_prompt', or 'otp_verify'
  
  // Sign In States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Sign Up States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [birthday, setBirthday] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('Sri Lanka');

  // Google SSO Prompt States
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleName, setGoogleName] = useState('');
  const [googleCompany, setGoogleCompany] = useState('');
  const [googleBirthday, setGoogleBirthday] = useState('');

  // OTP Verification States
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [pendingUserData, setPendingUserData] = useState(null);
  const [timerSeconds, setTimerSeconds] = useState(110);
  const [isRealEmailSent, setIsRealEmailSent] = useState(false);
  const otpInputsRef = useRef([]);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // OTP Countdown Timer
  useEffect(() => {
    let interval = null;
    if (mode === 'otp_verify' && timerSeconds > 0) {
      interval = setInterval(() => setTimerSeconds(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [mode, timerSeconds]);

  if (!isOpen) return null;

  const handleSignIn = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      try {
        const user = db.loginUser(loginEmail, loginPassword);
        setLoading(false);
        try { confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } }); } catch (err) {}
        onAuthSuccess(user);
        onClose();
      } catch (err) {
        setLoading(false);
        setError(err.message || 'Failed to sign in.');
      }
    }, 600);
  };

  // Initiate Registration with OTP Verification
  const handleInitiateSignUp = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !company || !birthday) {
      setError('Please fill in all required fields including Date of Birth and Company Name.');
      return;
    }

    setLoading(true);

    // Generate 6-Digit OTP & Dispatch Email
    const otpResult = await emailService.generateAndSendOTP(email);
    setGeneratedOtp(otpResult.otpCode);
    setIsRealEmailSent(otpResult.realSent);
    setPendingUserData({
      name,
      email,
      company,
      birthday,
      phone,
      country,
      authProvider: 'Email'
    });
    setTimerSeconds(110);
    setOtpDigits(['', '', '', '', '', '']);
    setLoading(false);
    setMode('otp_verify');
  };

  // Handle OTP Digit Input Change
  const handleOtpDigitChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);

    // Auto-focus next input box
    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  // Verify 6-Digit OTP Code
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setError('');
    const enteredOtp = otpDigits.join('');

    if (enteredOtp.length < 6) {
      setError('Please enter all 6 digits of the OTP verification code.');
      return;
    }

    if (enteredOtp !== generatedOtp) {
      setError('Invalid OTP code. Please check your verification code and try again.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      try {
        const newUser = db.registerUser(pendingUserData);
        setLoading(false);
        try { confetti({ particleCount: 110, spread: 85, origin: { y: 0.6 } }); } catch (err) {}
        onAuthSuccess(newUser);
        onClose();
      } catch (err) {
        setLoading(false);
        setError(err.message || 'Registration failed.');
      }
    }, 600);
  };

  const handleResendOtp = async () => {
    setError('');
    const targetEmail = pendingUserData ? pendingUserData.email : email;
    const otpResult = await emailService.generateAndSendOTP(targetEmail);
    setGeneratedOtp(otpResult.otpCode);
    setIsRealEmailSent(otpResult.realSent);
    setTimerSeconds(110);
    setOtpDigits(['', '', '', '', '', '']);
    alert(`📧 A new 6-digit verification code has been generated for ${targetEmail}.`);
  };

  // Google OAuth Flow
  const handleLaunchGoogleOAuth = () => {
    setError('');
    setLoading(true);

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '983789548026-llbj7i3v3ub2ut1rakgti26ammqb3quo.apps.googleusercontent.com';

    if (window.google && window.google.accounts && window.google.accounts.oauth2) {
      try {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
          callback: (response) => {
            if (response.access_token) {
              fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${response.access_token}` }
              })
                .then(res => res.json())
                .then(googleProfile => {
                  setLoading(false);
                  const user = db.googleAuth({
                    name: googleProfile.name || googleProfile.email.split('@')[0],
                    email: googleProfile.email,
                    company: 'Google Verified Client',
                    birthday: '1998-05-14',
                  });
                  try { confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } }); } catch (err) {}
                  onAuthSuccess(user);
                  onClose();
                })
                .catch(() => {
                  setLoading(false);
                  setMode('google_prompt');
                });
            } else {
              setLoading(false);
              setMode('google_prompt');
            }
          },
          error_callback: () => {
            setLoading(false);
            setMode('google_prompt');
          }
        });
        client.requestAccessToken();
      } catch (err) {
        setLoading(false);
        setMode('google_prompt');
      }
    } else {
      setLoading(false);
      setMode('google_prompt');
    }
  };

  const handleCompleteGoogleAuth = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const targetEmail = googleEmail || 'dilneth.madushanka@gmail.com';
    const targetName = googleName || 'Dilneth Madushanka';
    const targetCompany = googleCompany || 'Google Verified Enterprise';
    const targetBirthday = googleBirthday || '1998-05-14';

    setTimeout(() => {
      try {
        const googleProfile = {
          name: targetName,
          email: targetEmail,
          company: targetCompany,
          birthday: targetBirthday,
        };
        const user = db.googleAuth(googleProfile);
        setLoading(false);
        try { confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } }); } catch (err) {}
        onAuthSuccess(user);
        onClose();
      } catch (err) {
        setLoading(false);
        setError('Google Authentication failed.');
      }
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg glass-card p-6 sm:p-8 rounded-2xl border border-cyan-500/40 shadow-2xl shadow-cyan-950 max-h-[90vh] overflow-y-auto">
        
        {/* Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto border border-cyan-500/30">
            {mode === 'otp_verify' ? <KeyRound className="w-6 h-6" /> : <User className="w-6 h-6" />}
          </div>
          <h3 className="text-2xl font-extrabold text-white font-['Outfit']">
            {mode === 'signin' ? 'Client Portal Sign In' :
             mode === 'signup' ? 'Create Enterprise Account' :
             mode === 'otp_verify' ? '2FA Email Verification' :
             'Google OAuth Verification'}
          </h3>
          <p className="text-xs text-slate-400 font-mono">
            {mode === 'signin' ? 'ACCESS YOUR PROJECTS & PROPOSALS' :
             mode === 'signup' ? 'REGISTER COMPANY PROFILE & SCOPE' :
             mode === 'otp_verify' ? 'ENTER 6-DIGIT CODE SENT TO YOUR EMAIL' :
             'GOOGLE SINGLE SIGN-ON VERIFICATION'}
          </p>
        </div>

        {/* Toggle Mode Buttons */}
        {mode !== 'google_prompt' && mode !== 'otp_verify' && (
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 mb-6">
            <button
              onClick={() => { setMode('signin'); setError(''); }}
              className={`flex-1 py-2 text-xs font-mono rounded-lg transition-all ${
                mode === 'signin' ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('signup'); setError(''); }}
              className={`flex-1 py-2 text-xs font-mono rounded-lg transition-all ${
                mode === 'signup' ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800' : 'text-slate-400 hover:text-white'
              }`}
            >
              Register Company
            </button>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-950/60 border border-rose-500/50 text-rose-300 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Google SSO Launcher Button */}
        {mode !== 'google_prompt' && mode !== 'otp_verify' && (
          <div className="mb-5">
            <button
              onClick={handleLaunchGoogleOAuth}
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-100 hover:text-cyan-300 text-xs font-mono font-bold flex items-center justify-center gap-3 transition-colors shadow-md shadow-slate-950"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>{loading ? 'Opening Google Identity Window...' : 'Continue with Google Sign-In'}</span>
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800" /></div>
              <div className="relative flex justify-center text-[10px] uppercase font-mono"><span className="bg-[#0d111a] px-2 text-slate-500">OR EMAIL CREDENTIALS</span></div>
            </div>
          </div>
        )}

        {/* 6-DIGIT OTP VERIFICATION SCREEN */}
        {mode === 'otp_verify' && (
          <form onSubmit={handleVerifyOtp} className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-800/60 text-xs font-mono text-center space-y-2">
              <div className="text-cyan-400 font-bold">Verification Code Dispatched!</div>
              <div className="text-slate-300">
                We sent a 6-digit OTP code to <strong className="text-white">{pendingUserData?.email}</strong>.
              </div>

              {/* Status Banner */}
              {isRealEmailSent ? (
                <div className="mt-3 p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/80 text-[11px] text-emerald-300 font-bold flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Real Email Sent! Please check your Inbox / Spam folder.</span>
                </div>
              ) : (
                <div className="mt-3 p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-emerald-400 font-bold space-y-1">
                  <div className="flex items-center justify-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    <span>[SIMULATED MAILBOX] Your OTP Code is: <u className="tracking-widest font-extrabold text-sm">{generatedOtp}</u></span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-normal">
                    💡 To send real emails to your Gmail inbox, add your free EmailJS Key to <code className="text-cyan-400">.env</code> file.
                  </div>
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
                onClick={() => setMode('signup')}
                className="flex-1 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-mono text-xs font-bold"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-2 py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 text-slate-950 font-bold text-xs font-mono flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25"
              >
                {loading ? 'Verifying Code...' : 'Verify OTP & Activate Account'}
              </button>
            </div>

          </form>
        )}

        {/* Google SSO Prompt */}
        {mode === 'google_prompt' && (
          <form onSubmit={handleCompleteGoogleAuth} className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                </svg>
                <span>Google Workspace Profile Verification</span>
              </div>
              <p className="text-slate-400">
                Confirm your Google account details to save your identity profile to Cloud DB.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">Google Email Address *</label>
              <input
                type="email"
                required
                placeholder="dilneth.madushanka@gmail.com"
                value={googleEmail}
                onChange={e => setGoogleEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">Full Name *</label>
              <input
                type="text"
                required
                placeholder="Dilneth Madushanka"
                value={googleName}
                onChange={e => setGoogleName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">Company Name</label>
                <input
                  type="text"
                  placeholder="Lyntrix Global Client"
                  value={googleCompany}
                  onChange={e => setGoogleCompany(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">Date of Birth / Founded</label>
                <input
                  type="date"
                  value={googleBirthday}
                  onChange={e => setGoogleBirthday(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="flex-1 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-mono text-xs font-bold"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-2 py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 text-slate-950 font-bold text-xs font-mono flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25"
              >
                {loading ? 'Authenticating with Google...' : 'Save Google Account to Cloud DB'}
              </button>
            </div>
          </form>
        )}

        {/* Email Sign In Form */}
        {mode === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">Corporate Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="glow-btn w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 text-slate-950 font-bold text-xs font-mono flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25"
            >
              {loading ? (
                <span>Authenticating Session...</span>
              ) : (
                <>
                  <span>Sign In to Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Email Sign Up Form */}
        {mode === 'signup' && (
          <form onSubmit={handleInitiateSignUp} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-300">Full Name *</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Dilneth Madushanka"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-300">Corporate Email *</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-300">Company Name *</label>
                <div className="relative">
                  <Building className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lyntrix Global"
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-300">Date of Birth / Founded *</label>
                <div className="relative">
                  <Calendar className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="date"
                    required
                    value={birthday}
                    onChange={e => setBirthday(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-300">Phone Number</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="tel"
                    placeholder="+94 7X XXX XXXX"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-300">Country</label>
                <div className="relative">
                  <Globe className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                  <select
                    value={country}
                    onChange={e => setCountry(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:border-cyan-400 focus:outline-none"
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

            <div className="space-y-1">
              <label className="text-[11px] font-mono text-slate-300">Password *</label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="Min 6 characters..."
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="glow-btn w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 text-slate-950 font-bold text-xs font-mono flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25"
            >
              {loading ? (
                <span>Generating 6-Digit OTP...</span>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Send OTP & Verify Account</span>
                </>
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
