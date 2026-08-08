import React, { useState } from 'react';
import { 
  Users, DollarSign, Activity, ShieldCheck, Search, Filter, Plus, 
  Trash2, Edit, CheckCircle2, AlertTriangle, Eye, ArrowLeft, Download, 
  RefreshCcw, Server, Cpu, Database, Lock, LogOut, Sparkles, Save, Check
} from 'lucide-react';
import { db } from '../services/db';

export default function AdminDashboard({ onLogout, onReturnToSite, onDataUpdated }) {
  const [activeTab, setActiveTab] = useState('pricing');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  // Cloud DB States
  const [services, setServices] = useState(db.getServices());
  const [addons, setAddons] = useState(db.getAddons());
  const [inquiries, setInquiries] = useState(db.getInquiries());
  const [saveNotice, setSaveNotice] = useState('');

  // System Telemetry Logs
  const [logs, setLogs] = useState([
    { id: 1, time: new Date().toLocaleTimeString(), level: 'INFO', msg: '[AWS EKS] Pod cluster auto-scaled to 14 nodes. CPU load 34%.' },
    { id: 2, time: '20:51:04', level: 'SUCCESS', msg: '[Cloud DB] Authenticated admin session for user admin@lyntrix.tech.' },
    { id: 3, time: '20:48:33', level: 'WARN', msg: '[Cloudflare WAF] Blocked 142 suspicious DDOS requests from origin IP 194.26.x.x.' },
    { id: 4, time: '20:45:00', level: 'INFO', msg: '[PostgreSQL] Automated WAL backup snapshot stored in S3 Encrypted Vault.' },
  ]);

  // Handle Price Change for Services
  const handleServicePriceChange = (id, newPrice) => {
    const numericPrice = parseInt(newPrice, 10) || 0;
    const updated = services.map(s => s.id === id ? { ...s, basePrice: numericPrice } : s);
    setServices(updated);
  };

  // Handle Price Change for Addons
  const handleAddonPriceChange = (id, newPrice) => {
    const numericPrice = parseInt(newPrice, 10) || 0;
    const updated = addons.map(a => a.id === id ? { ...a, price: numericPrice } : a);
    setAddons(updated);
  };

  // Save All Price Changes to Cloud Database
  const handleSavePrices = () => {
    db.saveServices(services);
    db.saveAddons(addons);
    if (onDataUpdated) onDataUpdated();

    setSaveNotice('✨ All prices & service configs successfully updated and synced to Cloud DB!');
    setTimeout(() => setSaveNotice(''), 4000);
  };

  // Filtered Inquiries
  const filteredInquiries = inquiries.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.service.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || item.status.toLowerCase().replace(' ', '') === filterStatus.toLowerCase().replace(' ', '');
    return matchesSearch && matchesStatus;
  });

  const updateStatus = (id, newStatus) => {
    const updated = inquiries.map(item => item.id === id ? { ...item, status: newStatus } : item);
    setInquiries(updated);
    db.saveInquiries(updated);
    if (selectedInquiry && selectedInquiry.id === id) {
      setSelectedInquiry({ ...selectedInquiry, status: newStatus });
    }
  };

  const deleteInquiry = (id) => {
    if (confirm(`Are you sure you want to delete lead ${id}?`)) {
      const updated = inquiries.filter(item => item.id !== id);
      setInquiries(updated);
      db.saveInquiries(updated);
      if (selectedInquiry && selectedInquiry.id === id) setSelectedInquiry(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans pb-16">
      
      {/* Top Admin Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#0d111a]/95 backdrop-blur-md border-b border-slate-800 py-3.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 p-1 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-white font-['Outfit']">LYNTRIX</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                  CLOUD CONSOLE
                </span>
              </div>
              <p className="text-[9px] text-slate-400 font-mono">LIVE CLOUD DB ADMIN & PRICING CONTROL</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onReturnToSite}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-mono text-slate-300 hover:text-white border border-slate-700 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Main Website</span>
            </button>

            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/60 text-xs font-mono text-rose-300 hover:bg-rose-900 border border-rose-800/60 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {saveNotice && (
          <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs font-mono flex items-center justify-between animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{saveNotice}</span>
            </div>
            <button onClick={() => setSaveNotice('')} className="text-emerald-400 hover:text-white">✕</button>
          </div>
        )}

        {/* Top Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
              <span>ACTIVE LEADS</span>
              <Users className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-3xl font-extrabold text-white font-['Outfit']">{inquiries.length}</div>
            <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <span>Saved in Cloud DB</span>
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
              <span>ACTIVE SERVICES</span>
              <Cpu className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-3xl font-extrabold text-white font-['Outfit']">{services.length} Configured</div>
            <div className="text-[10px] text-slate-400 font-mono">All prices editable</div>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
              <span>ADDONS CONFIGURED</span>
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-3xl font-extrabold text-purple-400 font-['Outfit']">{addons.length} Add-ons</div>
            <div className="text-[10px] text-emerald-400 font-mono">Live in Estimator</div>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
              <span>CLOUD DB SYNC</span>
              <Database className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-extrabold text-emerald-400 font-['Outfit']">ONLINE</div>
            <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Encrypted Storage Active</span>
            </div>
          </div>
        </div>

        {/* Console Navigation Tabs */}
        <div className="flex overflow-x-auto pb-2 gap-2 border-b border-slate-800 no-scrollbar">
          <button
            onClick={() => setActiveTab('pricing')}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs transition-all flex items-center gap-2 border whitespace-nowrap ${
              activeTab === 'pricing'
                ? 'bg-cyan-950 text-cyan-300 border-cyan-500/60 font-bold'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Service & Add-on Price Editor</span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs transition-all flex items-center gap-2 border whitespace-nowrap ${
              activeTab === 'inquiries'
                ? 'bg-cyan-950 text-cyan-300 border-cyan-500/60 font-bold'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Client Proposals & Leads ({inquiries.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('telemetry')}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs transition-all flex items-center gap-2 border whitespace-nowrap ${
              activeTab === 'telemetry'
                ? 'bg-cyan-950 text-cyan-300 border-cyan-500/60 font-bold'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Real-time Telemetry Monitor</span>
          </button>
        </div>

        {/* Tab 1: Pricing Editor (Core Admin Request!) */}
        {activeTab === 'pricing' && (
          <div className="space-y-8">
            
            {/* Header with Save Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 rounded-2xl border border-slate-800">
              <div>
                <h3 className="text-xl font-bold text-white font-['Outfit']">Global Price Management</h3>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Edit baseline service prices and technical add-on rates below. Changes sync instantly across the entire platform.
                </p>
              </div>
              <button
                onClick={handleSavePrices}
                className="glow-btn px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 text-slate-950 font-bold text-xs font-mono flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 shrink-0"
              >
                <Save className="w-4 h-4" />
                <span>Save All Price Changes to Cloud DB</span>
              </button>
            </div>

            {/* Service Base Prices Editor */}
            <div className="space-y-4">
              <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                1. EDIT SERVICE BASE PRICES (USD $)
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((serv) => (
                  <div key={serv.id} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white font-['Outfit'] text-base">{serv.title}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-cyan-400 border border-slate-800">
                        {serv.badge}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-400">Base Investment (USD $)</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-2.5 text-slate-400 font-mono text-sm font-bold">$</span>
                        <input
                          type="number"
                          value={serv.basePrice}
                          onChange={e => handleServicePriceChange(serv.id, e.target.value)}
                          className="w-full pl-8 pr-4 py-2 rounded-xl bg-slate-950 border border-cyan-500/40 text-emerald-400 font-mono font-bold text-lg focus:border-cyan-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="text-xs text-slate-400 space-y-1 font-mono">
                      <div><span className="text-slate-500">Architect:</span> {serv.architect}</div>
                      <div><span className="text-slate-500">SLA Standard:</span> {serv.sla}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add-ons Prices Editor */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                2. EDIT ESTIMATOR ADD-ON PRICES (USD $)
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {addons.map((addon) => (
                  <div key={addon.id} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
                    <div className="font-bold text-slate-200 text-sm font-['Outfit']">{addon.name}</div>
                    
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-slate-400">Add-on Rate (USD $)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-slate-400 font-mono text-xs font-bold">$</span>
                        <input
                          type="number"
                          value={addon.price}
                          onChange={e => handleAddonPriceChange(addon.id, e.target.value)}
                          className="w-full pl-7 pr-3 py-1.5 rounded-lg bg-slate-950 border border-indigo-500/40 text-cyan-300 font-mono font-bold text-sm focus:border-cyan-400 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Save Trigger */}
            <div className="flex justify-end pt-4">
              <button
                onClick={handleSavePrices}
                className="glow-btn px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 text-slate-950 font-bold text-sm font-mono flex items-center gap-2 shadow-lg shadow-cyan-500/25"
              >
                <Save className="w-4 h-4" />
                <span>Save All Price Changes to Cloud DB</span>
              </button>
            </div>

          </div>
        )}

        {/* Tab 2: Inquiries Table */}
        {activeTab === 'inquiries' && (
          <div className="space-y-4">
            
            {/* Search and Filters Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search by client name, email, ID, or service..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                <select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 focus:outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="new">New</option>
                  <option value="inreview">In Review</option>
                  <option value="proposalsent">Proposal Sent</option>
                  <option value="closedwon">Closed Won</option>
                </select>
              </div>
            </div>

            {/* Inquiries Table */}
            <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900/90 border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase">
                      <th className="p-4">Lead ID / Date</th>
                      <th className="p-4">Client Contact</th>
                      <th className="p-4">Service Area</th>
                      <th className="p-4">Est. Budget</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-xs">
                    {filteredInquiries.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400 font-mono">
                          No matching lead inquiries found.
                        </td>
                      </tr>
                    ) : (
                      filteredInquiries.map((lead) => (
                        <tr key={lead.id} className="hover:bg-slate-900/50 transition-colors">
                          <td className="p-4 font-mono">
                            <div className="font-bold text-cyan-400">{lead.id}</div>
                            <div className="text-[10px] text-slate-400">{lead.date}</div>
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-white font-['Outfit']">{lead.name}</div>
                            <div className="text-[11px] text-slate-400 font-mono">{lead.email}</div>
                          </td>
                          <td className="p-4 text-slate-300 font-mono">
                            {lead.service}
                          </td>
                          <td className="p-4 font-mono font-bold text-emerald-400">
                            {lead.budget}
                          </td>
                          <td className="p-4">
                            <select
                              value={lead.status}
                              onChange={e => updateStatus(lead.id, e.target.value)}
                              className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold border bg-slate-950 focus:outline-none ${
                                lead.status === 'New' ? 'border-cyan-500/80 text-cyan-400' :
                                lead.status === 'In Review' ? 'border-amber-500/80 text-amber-400' :
                                lead.status === 'Proposal Sent' ? 'border-indigo-500/80 text-indigo-400' :
                                'border-emerald-500/80 text-emerald-400'
                              }`}
                            >
                              <option value="New">New</option>
                              <option value="In Review">In Review</option>
                              <option value="Proposal Sent">Proposal Sent</option>
                              <option value="Closed Won">Closed Won</option>
                            </select>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => setSelectedInquiry(lead)}
                              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-700 transition-colors"
                              title="View Full Scope"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteInquiry(lead.id)}
                              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-rose-400 border border-slate-700 transition-colors"
                              title="Delete Lead"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* Tab 3: Telemetry Console */}
        {activeTab === 'telemetry' && (
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>REAL-TIME TELEMETRY LOG MONITOR</span>
              </div>
              <button
                onClick={() => setLogs([
                  { id: Date.now(), time: new Date().toLocaleTimeString(), level: 'INFO', msg: '[SOC Alert] Manual telemetry sweep initiated. All node clusters healthy.' },
                  ...logs
                ])}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-mono text-slate-200 hover:text-white border border-slate-700 flex items-center gap-1.5"
              >
                <RefreshCcw className="w-3.5 h-3.5 text-cyan-400" />
                <span>Trigger Diagnostic</span>
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 font-mono text-xs space-y-2 max-h-96 overflow-y-auto">
              {logs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 py-1 border-b border-slate-900">
                  <span className="text-slate-500 shrink-0">[{log.time}]</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                    log.level === 'SUCCESS' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                    log.level === 'WARN' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                    'bg-slate-800 text-cyan-400'
                  }`}>
                    {log.level}
                  </span>
                  <span className="text-slate-300 leading-relaxed">{log.msg}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Selected Inquiry Inspection Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-card max-w-xl w-full p-6 rounded-2xl border border-cyan-500/40 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono text-cyan-400">{selectedInquiry.id}</span>
                <h3 className="text-xl font-bold text-white font-['Outfit']">{selectedInquiry.name}</h3>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="p-1 rounded bg-slate-900 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div><span className="text-slate-400">Email:</span> <span className="text-white">{selectedInquiry.email}</span></div>
              <div><span className="text-slate-400">Phone:</span> <span className="text-white">{selectedInquiry.phone}</span></div>
              <div><span className="text-slate-400">Service Needed:</span> <span className="text-cyan-400">{selectedInquiry.service}</span></div>
              <div><span className="text-slate-400">Scale:</span> <span className="text-white">{selectedInquiry.scale}</span></div>
              <div><span className="text-slate-400">Estimated Budget:</span> <span className="text-emerald-400">{selectedInquiry.budget}</span></div>
              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-slate-400 block mb-1">Technical Requirement Scope:</span>
                <p className="font-sans text-sm text-slate-200 bg-slate-950 p-3 rounded-lg border border-slate-800">
                  {selectedInquiry.details}
                </p>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-800">
              <span className="text-xs font-mono text-slate-400">Status: {selectedInquiry.status}</span>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="px-4 py-2 rounded-lg bg-cyan-400 text-slate-950 font-bold text-xs"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
