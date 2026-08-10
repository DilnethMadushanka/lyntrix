import React, { useState } from 'react';
import { 
  Users, DollarSign, Activity, ShieldCheck, Search, Filter, Plus, 
  Trash2, Edit, CheckCircle2, AlertTriangle, Eye, ArrowLeft, Download, 
  RefreshCcw, Server, Cpu, Database, Lock, LogOut, Sparkles, Save, Check,
  UserPlus, UserCheck, Calendar, Building, Globe, Phone, UserX, Mail, Send
} from 'lucide-react';
import { db } from '../services/db';
import { emailService } from '../services/emailService';

export default function AdminDashboard({ onLogout, onReturnToSite, onDataUpdated }) {
  const [activeTab, setActiveTab] = useState('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [newUserModalOpen, setNewUserModalOpen] = useState(false);

  // Cloud DB States
  const [users, setUsers] = useState(db.getUsers());
  const [services, setServices] = useState(db.getServices());
  const [addons, setAddons] = useState(db.getAddons());
  const [inquiries, setInquiries] = useState(db.getInquiries());
  const [admins, setAdmins] = useState(db.getAdmins());
  const [saveNotice, setSaveNotice] = useState('');

  // Admin Management Modal States
  const [newAdminModalOpen, setNewAdminModalOpen] = useState(false);
  const [newAdminData, setNewAdminData] = useState({ name: '', email: '', password: '', role: 'Master Admin' });
  const [editingPasswordAdmin, setEditingPasswordAdmin] = useState(null);
  const [newPasswordValue, setNewPasswordValue] = useState('');

  // New User Form State
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    company: '',
    birthday: '',
    phone: '',
    country: 'Sri Lanka',
    role: 'Client'
  });

  // System Telemetry Logs
  const [logs, setLogs] = useState([
    { id: 1, time: new Date().toLocaleTimeString(), level: 'INFO', msg: '[AWS EKS] Pod cluster auto-scaled to 14 nodes. CPU load 34%.' },
    { id: 2, time: '20:51:04', level: 'SUCCESS', msg: '[Cloud DB] Authenticated admin session for user admin@lyntrixtec.com.' },
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

  // User Management Handlers
  const handleToggleUserStatus = (userId) => {
    const updated = users.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'Active' ? 'Suspended' : 'Active';
        return { ...u, status: nextStatus };
      }
      return u;
    });
    setUsers(updated);
    db.saveUsers(updated);
  };

  const handleUserRoleChange = (userId, newRole) => {
    const updated = users.map(u => u.id === userId ? { ...u, role: newRole } : u);
    setUsers(updated);
    db.saveUsers(updated);
  };

  const handleDeleteUser = (userId) => {
    if (confirm(`Are you sure you want to delete user account ${userId}?`)) {
      const updated = users.filter(u => u.id !== userId);
      setUsers(updated);
      db.saveUsers(updated);
      if (selectedUser && selectedUser.id === userId) setSelectedUser(null);
    }
  };

  const handleCreateNewUser = (e) => {
    e.preventDefault();
    try {
      const created = db.registerUser(newUserData);
      setUsers(db.getUsers());
      setNewUserModalOpen(false);
      setNewUserData({ name: '', email: '', company: '', birthday: '', phone: '', country: 'Sri Lanka', role: 'Client' });
      setSaveNotice(`✨ New user ${created.name} registered in Cloud DB!`);
      setTimeout(() => setSaveNotice(''), 4000);
    } catch (err) {
      alert(err.message || 'Failed to create user.');
    }
  };

  // Admin Account Handlers
  const handleCreateAdmin = (e) => {
    e.preventDefault();
    try {
      const created = db.addAdmin(newAdminData);
      setAdmins(db.getAdmins());
      setNewAdminModalOpen(false);
      setNewAdminData({ name: '', email: '', password: '', role: 'Master Admin' });
      setSaveNotice(`🔐 New Admin ${created.name} (${created.email}) added to DB!`);
      setTimeout(() => setSaveNotice(''), 4000);
    } catch (err) {
      alert(err.message || 'Failed to add admin.');
    }
  };

  const handleUpdateAdminPassword = (e) => {
    e.preventDefault();
    if (!newPasswordValue || newPasswordValue.length < 4) {
      alert('Password must be at least 4 characters long.');
      return;
    }
    db.updateAdminPassword(editingPasswordAdmin.id, newPasswordValue);
    setAdmins(db.getAdmins());
    setEditingPasswordAdmin(null);
    setNewPasswordValue('');
    setSaveNotice('🔑 Admin password successfully updated in Cloud Database!');
    setTimeout(() => setSaveNotice(''), 4000);
  };

  const handleDeleteAdmin = (adminId) => {
    if (confirm('Are you sure you want to revoke and delete this admin account?')) {
      try {
        const updated = db.deleteAdmin(adminId);
        setAdmins(updated);
        setSaveNotice('🗑️ Admin account removed from Cloud Database.');
        setTimeout(() => setSaveNotice(''), 4000);
      } catch (err) {
        alert(err.message || 'Failed to delete admin.');
      }
    }
  };

  // Inquiry / Order Management Handlers
  const handleAcceptOrder = async (lead) => {
    db.updateInquiryStatus(lead.id, 'Accepted');
    setInquiries(db.getInquiries());
    if (onDataUpdated) onDataUpdated();

    await emailService.sendClientOrderAccepted(lead);
    await emailService.sendAdminOrderAlert({ ...lead, status: 'Order Accepted by Admin' });

    setSaveNotice(`✅ Order ${lead.id} accepted! Automated confirmation email dispatched to ${lead.email}.`);
    setTimeout(() => setSaveNotice(''), 4000);
  };

  const handleInquiryStatusChange = async (leadId, newStatus) => {
    db.updateInquiryStatus(leadId, newStatus);
    setInquiries(db.getInquiries());
    if (onDataUpdated) onDataUpdated();

    const lead = inquiries.find(i => i.id === leadId);
    if (lead) {
      await emailService.sendOrderStatusUpdate(lead, newStatus);
    }

    setSaveNotice(`✨ Proposal ${leadId} status updated to "${newStatus}" & automated email dispatched!`);
    setTimeout(() => setSaveNotice(''), 4000);
  };

  const handleOpenDirectGmail = (lead) => {
    const subject = `Lyntrix IT Services: Update Regarding Your Proposal [${lead.id}] - ${lead.service}`;
    const body = `Dear ${lead.name},\n\nThank you for choosing Lyntrix IT Services for your ${lead.service} project (${lead.scale || 'Enterprise'}).\n\nWe have reviewed your project requirements:\n"${lead.details}"\n\nOur Senior Solutions Architecture Lead has accepted your scope and is ready to schedule our technical discovery call.\n\nProposal Tracking ID: ${lead.id}\nEstimated Investment: ${lead.budget}\nClient Contact: ${lead.phone || lead.email}\n\nBest regards,\nLyntrix Architecture & Engineering Advisory Team\nadmin@lyntrixtec.com | https://lyntrixtec.com`;
    emailService.openDirectGmailComposer(lead.email, subject, body);
  };

  const handleDeleteInquiry = (leadId) => {
    if (confirm(`Are you sure you want to delete proposal ${leadId}?`)) {
      const updated = db.deleteInquiry(leadId);
      setInquiries(updated);
      if (onDataUpdated) onDataUpdated();
      setSaveNotice(`🗑️ Proposal ${leadId} deleted.`);
      setTimeout(() => setSaveNotice(''), 3000);
    }
  };

  // Filtered Users
  const filteredUsers = users.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || item.role.toLowerCase().replace(' ', '') === filterRole.toLowerCase().replace(' ', '');
    return matchesSearch && matchesRole;
  });

  // Filtered Inquiries
  const filteredInquiries = inquiries.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.service.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

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
                  ADMIN CONSOLE
                </span>
              </div>
              <p className="text-[9px] text-slate-400 font-mono">USER MANAGEMENT & CLOUD PRICING PORTAL</p>
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
              <span>REGISTERED USERS</span>
              <Users className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-3xl font-extrabold text-white font-['Outfit']">{users.length}</div>
            <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <span>All Active Client Accounts</span>
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
              <span>ACTIVE PROPOSALS</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-extrabold text-white font-['Outfit']">{inquiries.length}</div>
            <div className="text-[10px] text-slate-400 font-mono">Client inquiries</div>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
              <span>GOOGLE OAUTH USERS</span>
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-3xl font-extrabold text-purple-400 font-['Outfit']">
              {users.filter(u => u.authProvider === 'Google').length}
            </div>
            <div className="text-[10px] text-emerald-400 font-mono">Google Verified</div>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
              <span>CLOUD DB PERSISTENCE</span>
              <Database className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-extrabold text-emerald-400 font-['Outfit']">ONLINE</div>
            <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Encrypted User Storage</span>
            </div>
          </div>
        </div>

        {/* Console Navigation Tabs */}
        <div className="flex overflow-x-auto pb-2 gap-2 border-b border-slate-800 no-scrollbar">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs transition-all flex items-center gap-2 border whitespace-nowrap ${
              activeTab === 'users'
                ? 'bg-cyan-950 text-cyan-300 border-cyan-500/60 font-bold'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4 text-cyan-400" />
            <span>User Management & Client Profiles ({users.length})</span>
          </button>

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
            onClick={() => setActiveTab('admins')}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs transition-all flex items-center gap-2 border whitespace-nowrap ${
              activeTab === 'admins'
                ? 'bg-cyan-950 text-cyan-300 border-cyan-500/60 font-bold'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Lock className="w-4 h-4 text-cyan-400" />
            <span>Admin DB Credentials & Access ({admins.length})</span>
          </button>
        </div>

        {/* TAB: USER MANAGEMENT (New Core Requirement) */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            
            {/* Search and Add User Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search user by name, email, company, or ID..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={filterRole}
                  onChange={e => setFilterRole(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 focus:outline-none"
                >
                  <option value="all">All Roles</option>
                  <option value="client">Client</option>
                  <option value="enterpriseclient">Enterprise Client</option>
                  <option value="vipclient">VIP Client</option>
                </select>

                <button
                  onClick={() => setNewUserModalOpen(true)}
                  className="glow-btn px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 text-slate-950 font-bold text-xs font-mono flex items-center gap-1.5 shrink-0"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Add New Client Account</span>
                </button>
              </div>
            </div>

            {/* Users Table */}
            <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900/90 border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase">
                      <th className="p-4">User ID / Date</th>
                      <th className="p-4">Client Name & Email</th>
                      <th className="p-4">Company Name</th>
                      <th className="p-4">Date of Birth / Founded</th>
                      <th className="p-4">Auth Provider</th>
                      <th className="p-4">Role & Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-xs">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-400 font-mono">
                          No matching registered users found.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-900/50 transition-colors">
                          <td className="p-4 font-mono">
                            <div className="font-bold text-cyan-400">{u.id}</div>
                            <div className="text-[10px] text-slate-400">{u.joinedDate}</div>
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-white font-['Outfit']">{u.name}</div>
                            <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                          </td>
                          <td className="p-4 font-mono text-slate-300">
                            {u.company}
                          </td>
                          <td className="p-4 font-mono text-slate-400">
                            {u.birthday}
                          </td>
                          <td className="p-4">
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                              u.authProvider === 'Google' ? 'bg-indigo-950 text-indigo-300 border-indigo-800' : 'bg-slate-900 text-slate-300 border-slate-800'
                            }`}>
                              {u.authProvider === 'Google' ? 'Google OAuth' : 'Email/Pass'}
                            </span>
                          </td>
                          <td className="p-4 space-y-1">
                            <select
                              value={u.role}
                              onChange={e => handleUserRoleChange(u.id, e.target.value)}
                              className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-950 border border-slate-800 text-cyan-300 focus:outline-none"
                            >
                              <option value="Client">Client</option>
                              <option value="Enterprise Client">Enterprise Client</option>
                              <option value="VIP Client">VIP Client</option>
                            </select>

                            <div>
                              <button
                                onClick={() => handleToggleUserStatus(u.id)}
                                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                                  u.status === 'Active' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-rose-950 text-rose-400 border-rose-800'
                                }`}
                              >
                                {u.status} (Click to toggle)
                              </button>
                            </div>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() => setSelectedUser(u)}
                              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-700 transition-colors"
                              title="View Full Profile"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-rose-400 border border-slate-700 transition-colors"
                              title="Delete Account"
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

        {/* TAB: PRICING EDITOR */}
        {activeTab === 'pricing' && (
          <div className="space-y-8">
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
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: INQUIRIES & AUTOMATED ORDER MANAGEMENT */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6">
            
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 rounded-2xl border border-slate-800">
              <div>
                <h3 className="text-xl font-bold text-white font-['Outfit']">Client Proposals & Automated Order Dispatch</h3>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Accept incoming project proposals, dispatch automated confirmation emails to clients, and send 1-click Direct Gmail messages.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-800 text-xs font-mono font-bold flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Admin Relay: Active</span>
                </span>
              </div>
            </div>

            <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900/90 border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase">
                      <th className="p-4">Lead ID / Date</th>
                      <th className="p-4">Client Contact</th>
                      <th className="p-4">Service Area & Scale</th>
                      <th className="p-4">Est. Budget</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Order Actions & Gmail</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-xs">
                    {filteredInquiries.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400 font-mono">
                          No client proposals or inquiries recorded in database.
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
                            {lead.phone && lead.phone !== 'N/A' && (
                              <div className="text-[10px] text-slate-500 font-mono">{lead.phone}</div>
                            )}
                          </td>
                          <td className="p-4 font-mono text-slate-300">
                            <div>{lead.service}</div>
                            <div className="text-[10px] text-cyan-400/80">{lead.scale || 'Enterprise'}</div>
                          </td>
                          <td className="p-4 font-mono font-bold text-emerald-400">
                            {lead.budget}
                          </td>
                          <td className="p-4">
                            <select
                              value={lead.status}
                              onChange={e => handleInquiryStatusChange(lead.id, e.target.value)}
                              className={`px-2.5 py-1 rounded text-xs font-mono font-bold border focus:outline-none ${
                                lead.status === 'Accepted' ? 'bg-emerald-950 text-emerald-300 border-emerald-800' :
                                lead.status === 'New' ? 'bg-cyan-950 text-cyan-300 border-cyan-800' :
                                lead.status === 'In Review' ? 'bg-amber-950 text-amber-300 border-amber-800' :
                                lead.status === 'Proposal Sent' ? 'bg-indigo-950 text-indigo-300 border-indigo-800' :
                                'bg-purple-950 text-purple-300 border-purple-800'
                              }`}
                            >
                              <option value="New">New</option>
                              <option value="Accepted">Accepted</option>
                              <option value="In Review">In Review</option>
                              <option value="Proposal Sent">Proposal Sent</option>
                              <option value="Closed Won">Closed Won</option>
                            </select>
                          </td>
                          <td className="p-4 text-right space-x-2 whitespace-nowrap">
                            {lead.status !== 'Accepted' && (
                              <button
                                onClick={() => handleAcceptOrder(lead)}
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 text-xs font-mono font-bold border border-emerald-700/80 transition-all inline-flex items-center gap-1 shadow-sm"
                                title="Accept Order and dispatch automated confirmation email to Client"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Accept Order</span>
                              </button>
                            )}

                            <button
                              onClick={() => handleOpenDirectGmail(lead)}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 text-xs font-mono border border-slate-700 transition-all inline-flex items-center gap-1"
                              title="Open Direct Gmail Web Composer with pre-filled proposal reply"
                            >
                              <Mail className="w-3.5 h-3.5 text-cyan-400" />
                              <span>Direct Gmail</span>
                            </button>

                            <button
                              onClick={() => setSelectedInquiry(lead)}
                              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-700 transition-colors inline-flex items-center"
                              title="View Full Scope & Requirements"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleDeleteInquiry(lead.id)}
                              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-rose-400 border border-slate-700 transition-colors inline-flex items-center"
                              title="Delete Proposal"
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

        {/* TAB: ADMIN MANAGEMENT & DB CREDENTIALS */}
        {activeTab === 'admins' && (
          <div className="space-y-6">
            
            {/* Header & Add Admin Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 rounded-2xl border border-slate-800">
              <div>
                <h3 className="text-xl font-bold text-white font-['Outfit']">Database Admin Authentication Sentinel</h3>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Manage privileged administrator logins stored in the Cloud Database. Passwords and access rights can be configured below.
                </p>
              </div>

              <button
                onClick={() => setNewAdminModalOpen(true)}
                className="glow-btn px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 text-slate-950 font-bold text-xs font-mono flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Admin to DB</span>
              </button>
            </div>

            {/* Admins Table */}
            <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900/90 border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase">
                      <th className="p-4">Admin ID / Created</th>
                      <th className="p-4">Admin Name</th>
                      <th className="p-4">Database Login Email</th>
                      <th className="p-4">DB Password Status</th>
                      <th className="p-4">Security Role</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-xs">
                    {admins.map((adm) => (
                      <tr key={adm.id} className="hover:bg-slate-900/50 transition-colors">
                        <td className="p-4 font-mono font-bold text-cyan-400">
                          <div>{adm.id}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{adm.createdDate}</div>
                        </td>
                        <td className="p-4 font-bold text-white font-['Outfit']">
                          {adm.name}
                        </td>
                        <td className="p-4 font-mono text-cyan-300">
                          {adm.email}
                        </td>
                        <td className="p-4 font-mono">
                          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[11px]">
                            •••••••• (Encrypted in DB)
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px] font-mono font-bold">
                            {adm.role}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingPasswordAdmin(adm);
                              setNewPasswordValue('');
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-slate-700 transition-colors"
                          >
                            Change Password
                          </button>
                          {admins.length > 1 && (
                            <button
                              onClick={() => handleDeleteAdmin(adm.id)}
                              className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/60 transition-colors"
                              title="Delete Admin"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Inspection Modal for User Profile */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-card max-w-lg w-full p-6 rounded-2xl border border-cyan-500/40 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono text-cyan-400">{selectedUser.id}</span>
                <h3 className="text-xl font-bold text-white font-['Outfit']">{selectedUser.name}</h3>
              </div>
              <button onClick={() => setSelectedUser(null)} className="p-1 rounded bg-slate-900 text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              <div><span className="text-slate-400">Corporate Email:</span> <span className="text-white">{selectedUser.email}</span></div>
              <div><span className="text-slate-400">Company Name:</span> <span className="text-cyan-400 font-bold">{selectedUser.company}</span></div>
              <div><span className="text-slate-400">Date of Birth / Founded:</span> <span className="text-white">{selectedUser.birthday}</span></div>
              <div><span className="text-slate-400">Phone:</span> <span className="text-white">{selectedUser.phone}</span></div>
              <div><span className="text-slate-400">Country:</span> <span className="text-white">{selectedUser.country}</span></div>
              <div><span className="text-slate-400">Auth Method:</span> <span className="text-indigo-400">{selectedUser.authProvider}</span></div>
              <div><span className="text-slate-400">Account Role:</span> <span className="text-emerald-400 font-bold">{selectedUser.role}</span></div>
            </div>

            <div className="pt-4 flex justify-end">
              <button onClick={() => setSelectedUser(null)} className="px-4 py-2 rounded-lg bg-cyan-400 text-slate-950 font-bold text-xs font-mono">
                Close User Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Creating New User */}
      {newUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-card max-w-lg w-full p-6 rounded-2xl border border-cyan-500/40 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xl font-bold text-white font-['Outfit']">Register New Client Account</h3>
              <button onClick={() => setNewUserModalOpen(false)} className="p-1 rounded bg-slate-900 text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateNewUser} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-mono block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newUserData.name}
                    onChange={e => setNewUserData({ ...newUserData, name: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-mono block mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={newUserData.email}
                    onChange={e => setNewUserData({ ...newUserData, email: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-mono block mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={newUserData.company}
                    onChange={e => setNewUserData({ ...newUserData, company: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-mono block mb-1">Date of Birth / Founded *</label>
                  <input
                    type="date"
                    required
                    value={newUserData.birthday}
                    onChange={e => setNewUserData({ ...newUserData, birthday: e.target.value })}
                    className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setNewUserModalOpen(false)} className="px-4 py-2 rounded-lg bg-slate-900 text-slate-400">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-lg bg-cyan-400 text-slate-950 font-bold font-mono">Create User</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Creating New Admin Account */}
      {newAdminModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-card max-w-md w-full p-6 rounded-2xl border border-cyan-500/40 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xl font-bold text-white font-['Outfit']">Add Admin to Cloud DB</h3>
              <button onClick={() => setNewAdminModalOpen(false)} className="p-1 rounded bg-slate-900 text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateAdmin} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-mono block mb-1">Admin Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lead Administrator"
                  value={newAdminData.name}
                  onChange={e => setNewAdminData({ ...newAdminData, name: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-300 font-mono block mb-1">Login Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. admin@lyntrixtec.com"
                  value={newAdminData.email}
                  onChange={e => setNewAdminData({ ...newAdminData, email: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-300 font-mono block mb-1">Access Key / Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Enter strong password..."
                  value={newAdminData.password}
                  onChange={e => setNewAdminData({ ...newAdminData, password: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-300 font-mono block mb-1">Security Role</label>
                <select
                  value={newAdminData.role}
                  onChange={e => setNewAdminData({ ...newAdminData, role: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono"
                >
                  <option value="Master Admin">Master Admin</option>
                  <option value="Lead Architect & Admin">Lead Architect & Admin</option>
                  <option value="Security Officer">Security Officer</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setNewAdminModalOpen(false)} className="px-4 py-2 rounded-lg bg-slate-900 text-slate-400">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-lg bg-cyan-400 text-slate-950 font-bold font-mono">Save Admin to DB</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Updating Admin Password */}
      {editingPasswordAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-card max-w-md w-full p-6 rounded-2xl border border-cyan-500/40 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white font-['Outfit']">Change Admin Password</h3>
                <p className="text-xs font-mono text-cyan-400">{editingPasswordAdmin.email}</p>
              </div>
              <button onClick={() => setEditingPasswordAdmin(null)} className="p-1 rounded bg-slate-900 text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleUpdateAdminPassword} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-mono block mb-1">New Access Key / Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Enter new password (min 4 characters)..."
                  value={newPasswordValue}
                  onChange={e => setNewPasswordValue(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setEditingPasswordAdmin(null)} className="px-4 py-2 rounded-lg bg-slate-900 text-slate-400 font-mono">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-lg bg-cyan-400 text-slate-950 font-bold font-mono">Update DB Password</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inspection Modal for Proposal Inquiry */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-card max-w-lg w-full p-6 rounded-2xl border border-cyan-500/40 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono text-cyan-400">{selectedInquiry.id} • {selectedInquiry.date}</span>
                <h3 className="text-xl font-bold text-white font-['Outfit']">{selectedInquiry.name}</h3>
              </div>
              <button onClick={() => setSelectedInquiry(null)} className="p-1 rounded bg-slate-900 text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              <div><span className="text-slate-400">Client Corporate Email:</span> <span className="text-cyan-300 font-bold">{selectedInquiry.email}</span></div>
              <div><span className="text-slate-400">Phone / Hotline:</span> <span className="text-white">{selectedInquiry.phone || 'N/A'}</span></div>
              <div><span className="text-slate-400">Target Service:</span> <span className="text-white font-bold">{selectedInquiry.service}</span></div>
              <div><span className="text-slate-400">Architecture Scale:</span> <span className="text-indigo-400">{selectedInquiry.scale || 'Custom Enterprise'}</span></div>
              <div><span className="text-slate-400">Estimated Budget:</span> <span className="text-emerald-400 font-bold">{selectedInquiry.budget}</span></div>
              <div><span className="text-slate-400">Current Status:</span> <span className="text-cyan-400 font-bold uppercase">{selectedInquiry.status}</span></div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-500 uppercase">Project Scope & Client Requirements:</div>
                <p className="text-slate-200 text-xs font-normal leading-relaxed">{selectedInquiry.details}</p>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800">
              <button
                onClick={() => {
                  handleAcceptOrder(selectedInquiry);
                  setSelectedInquiry(null);
                }}
                className="px-3.5 py-2 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs font-mono flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
              >
                <Check className="w-4 h-4" />
                <span>Accept Order & Notify</span>
              </button>

              <button
                onClick={() => {
                  handleOpenDirectGmail(selectedInquiry);
                  setSelectedInquiry(null);
                }}
                className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs font-mono flex items-center gap-1.5 border border-slate-700"
              >
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>Direct Gmail</span>
              </button>

              <button
                onClick={() => setSelectedInquiry(null)}
                className="px-4 py-2 rounded-lg bg-slate-900 text-slate-400 text-xs font-mono"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
