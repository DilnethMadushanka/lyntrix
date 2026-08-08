import React, { useState } from 'react';
import { Calculator, Check, Sparkles, Send, ShieldAlert, Zap, Layers, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function InteractiveCostCalculator({ onSelectEstimate }) {
  const [serviceType, setServiceType] = useState('software');
  const [scale, setScale] = useState('growth');
  const [cloudEnv, setCloudEnv] = useState('aws');
  const [supportTier, setSupportTier] = useState('premium');
  const [selectedAddons, setSelectedAddons] = useState(['security_audit', 'ci_cd']);
  const [submitted, setSubmitted] = useState(false);

  const serviceOptions = [
    { id: 'software', name: 'Custom Software / Web Platform', base: 3500 },
    { id: 'cloud', name: 'Cloud Migration & Infrastructure', base: 2800 },
    { id: 'security', name: 'Zero-Trust Cybersecurity Shield', base: 3000 },
    { id: 'consulting', name: 'IT Strategy & CTO Advisory', base: 2000 },
    { id: 'support', name: '24/7 Managed IT Infrastructure', base: 1800 },
  ];

  const scaleOptions = [
    { id: 'mvp', name: 'Startup / MVP Scope', multiplier: 1.0, duration: '2-4 Weeks' },
    { id: 'growth', name: 'Growth Business Platform', multiplier: 1.8, duration: '4-8 Weeks' },
    { id: 'enterprise', name: 'Enterprise Scale Architecture', multiplier: 3.2, duration: '8-16 Weeks' },
  ];

  const cloudOptions = [
    { id: 'aws', name: 'AWS Native' },
    { id: 'azure', name: 'Microsoft Azure' },
    { id: 'multicloud', name: 'Multi-Cloud Hybrid (+20%)' },
  ];

  const supportOptions = [
    { id: 'standard', name: 'Standard (Business Hours)', cost: 0 },
    { id: 'premium', name: '24/7 Managed SOC (<15m SLA)', cost: 800 },
  ];

  const addonsList = [
    { id: 'security_audit', name: 'Pentest & Security Audit', price: 1200 },
    { id: 'ci_cd', name: 'Automated CI/CD Pipeline', price: 800 },
    { id: 'compliance', name: 'ISO 27001 / SOC 2 Prep', price: 1500 },
    { id: 'ai_module', name: 'AI & Data Integration', price: 1800 },
  ];

  const toggleAddon = (id) => {
    if (selectedAddons.includes(id)) {
      setSelectedAddons(selectedAddons.filter(item => item !== id));
    } else {
      setSelectedAddons([...selectedAddons, id]);
    }
  };

  // Calculate Total Estimate
  const selectedServiceObj = serviceOptions.find(s => s.id === serviceType);
  const selectedScaleObj = scaleOptions.find(s => s.id === scale);
  const selectedSupportObj = supportOptions.find(s => s.id === supportTier);

  let basePrice = selectedServiceObj ? selectedServiceObj.base : 3000;
  basePrice *= selectedScaleObj ? selectedScaleObj.multiplier : 1.5;
  if (cloudEnv === 'multicloud') basePrice *= 1.2;
  basePrice += selectedSupportObj ? selectedSupportObj.cost : 0;

  const addonsTotal = selectedAddons.reduce((sum, addonId) => {
    const found = addonsList.find(a => a.id === addonId);
    return sum + (found ? found.price : 0);
  }, 0);

  const totalEstimate = Math.round(basePrice + addonsTotal);
  const minEstimate = Math.round(totalEstimate * 0.9);
  const maxEstimate = Math.round(totalEstimate * 1.15);

  const handleRequestQuote = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 }
      });
    } catch (e) {
      // fallback
    }
    setSubmitted(true);
    if (onSelectEstimate) {
      onSelectEstimate({
        service: selectedServiceObj.name,
        scale: selectedScaleObj.name,
        estimateRange: `$${minEstimate.toLocaleString()} - $${maxEstimate.toLocaleString()}`,
        duration: selectedScaleObj.duration
      });
    }
  };

  return (
    <section id="calculator" className="py-24 relative bg-slate-900/60 border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-xs font-mono text-cyan-400">
            <Calculator className="w-3.5 h-3.5" />
            <span>TRANSPARENT ESTIMATION TOOL</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-['Outfit']">
            Instant <span className="text-gradient-cyan">Project Estimator</span>
          </h2>
          <p className="text-slate-400 text-base font-light">
            Configure your technical requirements below for an instant budget and timeline projection.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Controls Column */}
          <div className="lg:col-span-8 space-y-8 glass-card p-6 sm:p-8 rounded-2xl border border-slate-800">
            
            {/* Step 1: Service Type */}
            <div className="space-y-3">
              <label className="text-xs font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                <span>1. Select Primary Service Area</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {serviceOptions.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setServiceType(s.id)}
                    className={`p-3.5 rounded-xl text-left border transition-all text-sm flex items-center justify-between ${
                      serviceType === s.id
                        ? 'bg-cyan-950/60 border-cyan-500/80 text-white shadow-md shadow-cyan-950'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="font-medium">{s.name}</span>
                    {serviceType === s.id && <Check className="w-4 h-4 text-cyan-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Scale & Complexity */}
            <div className="space-y-3">
              <label className="text-xs font-mono uppercase tracking-wider text-cyan-400">
                2. Project Scale & Complexity
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {scaleOptions.map((sc) => (
                  <button
                    key={sc.id}
                    onClick={() => setScale(sc.id)}
                    className={`p-4 rounded-xl text-left border transition-all ${
                      scale === sc.id
                        ? 'bg-cyan-950/60 border-cyan-500/80 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-semibold text-sm">{sc.name}</div>
                    <div className="text-xs text-slate-400 font-mono mt-1">Est: {sc.duration}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Cloud & SLA Support */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-xs font-mono uppercase tracking-wider text-cyan-400">
                  3. Cloud Environment
                </label>
                <div className="space-y-2">
                  {cloudOptions.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setCloudEnv(c.id)}
                      className={`w-full p-3 rounded-lg text-left text-xs font-mono border transition-all ${
                        cloudEnv === c.id
                          ? 'bg-slate-800 border-cyan-500 text-white'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-mono uppercase tracking-wider text-cyan-400">
                  4. Support & SOC SLA
                </label>
                <div className="space-y-2">
                  {supportOptions.map((sp) => (
                    <button
                      key={sp.id}
                      onClick={() => setSupportTier(sp.id)}
                      className={`w-full p-3 rounded-lg text-left text-xs font-mono border transition-all ${
                        supportTier === sp.id
                          ? 'bg-slate-800 border-cyan-500 text-white'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400'
                      }`}
                    >
                      {sp.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 4: Optional Enhancements */}
            <div className="space-y-3">
              <label className="text-xs font-mono uppercase tracking-wider text-cyan-400">
                5. Optional Technical Add-ons
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {addonsList.map((addon) => {
                  const isChecked = selectedAddons.includes(addon.id);
                  return (
                    <button
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`p-3 rounded-xl border text-xs text-left transition-all flex items-center justify-between ${
                        isChecked
                          ? 'bg-indigo-950/50 border-indigo-500/60 text-white'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div>
                        <div className="font-medium text-slate-200">{addon.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">+${addon.price.toLocaleString()}</div>
                      </div>
                      <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                        isChecked ? 'bg-indigo-500 border-indigo-400 text-white' : 'border-slate-700'
                      }`}>
                        {isChecked && <Check className="w-3 h-3" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Summary Column */}
          <div className="lg:col-span-4 sticky top-28 space-y-4">
            <div className="glass-card p-6 rounded-2xl border border-cyan-500/40 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="text-xs font-mono uppercase text-slate-400">ESTIMATED INVESTMENT</span>
                <span className="text-xs font-mono text-cyan-400">USD $</span>
              </div>

              <div className="py-6 text-center space-y-1">
                <div className="text-xs text-slate-400 font-mono">Projected Budget Range</div>
                <div className="text-3xl sm:text-4xl font-extrabold text-white font-['Outfit']">
                  ${minEstimate.toLocaleString()} - ${maxEstimate.toLocaleString()}
                </div>
                <div className="text-xs font-mono text-emerald-400 pt-1">
                  Est. Delivery Time: {selectedScaleObj.duration}
                </div>
              </div>

              <div className="space-y-2 border-t border-slate-800 pt-4 text-xs text-slate-300 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Service:</span>
                  <span>{selectedServiceObj.name.split('/')[0]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Scope:</span>
                  <span>{selectedScaleObj.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Add-ons:</span>
                  <span>{selectedAddons.length} Selected</span>
                </div>
              </div>

              <div className="pt-6">
                {submitted ? (
                  <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-center text-xs text-emerald-300 font-mono space-y-1">
                    <div className="font-bold flex items-center justify-center gap-1.5 text-sm">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      Quote Specs Locked!
                    </div>
                    <div>Scroll down to submit your project contact details.</div>
                  </div>
                ) : (
                  <button
                    onClick={handleRequestQuote}
                    className="glow-btn w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25"
                  >
                    <span>Lock Estimate & Request Proposal</span>
                    <Send className="w-4 h-4" />
                  </button>
                )}
              </div>

              <p className="text-[10px] text-slate-500 text-center mt-4">
                * Note: Final scope and pricing are formally validated during our technical discovery session.
              </p>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
