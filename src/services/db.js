/**
 * LYNTRIX HYBRID CLOUD DATABASE & PERSISTENCE ENGINE
 * Powered by Supabase (PostgreSQL Cloud DB) with local client-side persistence & auto-sync.
 */

import { supabase, isSupabaseConfigured } from './supabase';

const STORAGE_KEYS = {
  SERVICES: 'lyntrix_cloud_services',
  ADDONS: 'lyntrix_cloud_addons',
  INQUIRIES: 'lyntrix_cloud_inquiries',
  USERS: 'lyntrix_cloud_users',
  CURRENT_USER: 'lyntrix_current_user',
  ADMINS: 'lyntrix_cloud_admins',
  CURRENT_ADMIN: 'lyntrix_current_admin'
};

// Initial Default Admin Accounts in DB
const DEFAULT_ADMINS = [
  {
    id: 'ADM-001',
    email: 'admin@lyntrixtec.com',
    password: 'admin123',
    name: 'Super Admin',
    role: 'Master Admin',
    createdDate: '2026-08-01',
    status: 'Active'
  },
  {
    id: 'ADM-002',
    email: 'dilneth@lyntrixtec.com',
    password: 'admin123',
    name: 'Dilneth Madushanka',
    role: 'Lead Architect & Admin',
    createdDate: '2026-08-01',
    status: 'Active'
  }
];

// Initial Default Services
const DEFAULT_SERVICES = [
  {
    id: 'software',
    title: 'Software Development',
    basePrice: 3500,
    badge: 'Core Competency',
    tagline: 'High-performance, scalable custom web & mobile enterprise platforms.',
    description: 'We build enterprise-grade software engineered for high concurrency, security, and effortless maintainability using modern technology stacks.',
    architect: 'Senior Full-Stack Specialist',
    sla: '99.99% Guaranteed'
  },
  {
    id: 'cloud',
    title: 'Cloud Solutions',
    basePrice: 2800,
    badge: 'AWS / Azure / GCP',
    tagline: 'Elastic cloud infrastructure and automated CI/CD DevOps workflows.',
    description: 'Streamline your operations with auto-scaling multi-cloud architectures, infrastructure as code, and zero-downtime deployment pipelines.',
    architect: 'AWS / Azure Principal Engineer',
    sla: 'Zero Downtime Migration'
  },
  {
    id: 'security',
    title: 'Cybersecurity',
    basePrice: 3000,
    badge: 'Zero-Trust Defense',
    tagline: 'Enterprise threat protection, vulnerability assessments, and compliance.',
    description: 'Safeguard your valuable enterprise data and customer trust with continuous penetration testing, SOC monitoring, and zero-trust access policies.',
    architect: 'Certified CISSP Specialist',
    sla: '< 15 Mins Incident Response'
  },
  {
    id: 'consulting',
    title: 'IT Consulting',
    basePrice: 2000,
    badge: 'Strategic Advisory',
    tagline: 'Expert technology roadmapping and strategic enterprise architecture design.',
    description: 'Align tech investments with strategic business objectives. Our senior architects advise on technology selection, scalable systems, and digital transformation.',
    architect: 'Principal Enterprise Architect',
    sla: 'Strategic Roadmap Guaranteed'
  },
  {
    id: 'data-ai',
    title: 'Data & AI Systems',
    basePrice: 4200,
    badge: 'Enterprise Intelligence',
    tagline: 'Predictive analytics, custom LLM pipelines, and automated intelligence.',
    description: 'Empower decision-making with automated ETL data pipelines, custom machine learning models, and real-time enterprise intelligence dashboards.',
    architect: 'Lead AI & Data Engineer',
    sla: 'Sub-second Inference'
  },
  {
    id: 'support',
    title: '24/7 Managed IT Support',
    basePrice: 1500,
    badge: 'Round-the-Clock',
    tagline: 'Proactive infrastructure monitoring, automated backups, and incident response.',
    description: 'Continuous uptime monitoring, automated failover management, and immediate expert engineering intervention whenever an issue arises.',
    architect: 'SOC Operations Lead',
    sla: '< 5 Mins Critical Response'
  }
];

// Initial Default Add-ons
const DEFAULT_ADDONS = [
  { id: 'compliance', title: 'HIPAA / SOC2 / GDPR Compliance Package', price: 1200, popular: true },
  { id: 'ha', title: 'Multi-Region High Availability & Active-Active Failover', price: 1800, popular: true },
  { id: 'cicd', title: 'Automated CI/CD DevOps Pipeline Deployment', price: 950, popular: false },
  { id: 'pentest', title: 'Full Penetration Testing & Threat Audit', price: 1400, popular: true },
  { id: 'monitoring', title: '24/7 Live SOC Infrastructure Monitoring', price: 750, popular: false }
];

// Initial Default Inquiries
const DEFAULT_INQUIRIES = [
  {
    id: 'LYN-9024',
    name: 'Sarah Vance',
    email: 'sarah.v@aerocloud.com',
    phone: '+1 (415) 892-0192',
    service: 'Cloud Solutions',
    scale: 'Global Enterprise Scale',
    budget: '$15,000 - $25,000',
    status: 'In Review',
    date: '2026-08-04 14:22',
    details: 'Need multi-region AWS EKS architecture migration with automated Kubernetes autoscaling.'
  },
  {
    id: 'LYN-8812',
    name: 'Dr. Michael Chang',
    email: 'mchang@omnihealth.org',
    phone: '+1 (617) 492-3811',
    service: 'Cybersecurity',
    scale: 'Mid-Market Enterprise',
    budget: '$8,000 - $15,000',
    status: 'Accepted',
    date: '2026-08-06 09:15',
    details: 'HIPAA zero-trust vulnerability assessment and patient portal penetration testing.'
  }
];

// Initial Default Users
const DEFAULT_USERS = [
  {
    id: 'USR-1001',
    name: 'Dilneth Madushanka',
    email: 'dilneth@enterprise.io',
    password: 'password123',
    company: 'Lyntrix Global Enterprise',
    birthday: '1998-05-14',
    phone: '+94 77 123 4567',
    country: 'Sri Lanka',
    role: 'Enterprise Client',
    status: 'Active',
    joinedDate: '2026-08-01',
    authProvider: 'Email/Pass'
  },
  {
    id: 'USR-1002',
    name: 'Sarah Vance',
    email: 'sarah.v@aerocloud.com',
    company: 'AeroCloud Systems',
    birthday: '1992-11-20',
    phone: '+1 (415) 892-0192',
    country: 'United States',
    role: 'Enterprise Client',
    status: 'Active',
    joinedDate: '2026-08-04',
    authProvider: 'Google OAuth'
  },
  {
    id: 'USR-1003',
    name: 'Dr. Michael Chang',
    email: 'mchang@omnihealth.org',
    company: 'OmniHealth Global',
    birthday: '1985-03-09',
    phone: '+1 (617) 492-3811',
    country: 'United States',
    role: 'VIP Client',
    status: 'Active',
    joinedDate: '2026-08-06',
    authProvider: 'Google OAuth'
  }
];

export const db = {
  isCloudConnected: () => isSupabaseConfigured,

  // --- Real-Time Background Synchronization with Supabase Cloud DB ---
  syncWithCloud: async () => {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      // Sync Inquiries
      const { data: cloudInquiries } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
      if (cloudInquiries && cloudInquiries.length > 0) {
        localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(cloudInquiries));
      }

      // Sync Users
      const { data: cloudUsers } = await supabase.from('users').select('*').order('created_at', { ascending: false });
      if (cloudUsers && cloudUsers.length > 0) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(cloudUsers));
      }

      // Sync Admins
      const { data: cloudAdmins } = await supabase.from('admins').select('*').order('created_at', { ascending: false });
      if (cloudAdmins && cloudAdmins.length > 0) {
        localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(cloudAdmins));
      }

      // Sync Services
      const { data: cloudServices } = await supabase.from('services').select('*');
      if (cloudServices && cloudServices.length > 0) {
        localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(cloudServices));
      }
    } catch (e) {
      console.warn('[SUPABASE SYNC NOTE]:', e.message);
    }
  },

  // --- Services Management ---
  getServices: () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SERVICES);
      return saved ? JSON.parse(saved) : DEFAULT_SERVICES;
    } catch (e) {
      return DEFAULT_SERVICES;
    }
  },

  saveServices: async (services) => {
    try {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
      if (isSupabaseConfigured && supabase) {
        await supabase.from('services').upsert(services);
      }
    } catch (e) {}
  },

  updateServicePrice: (serviceId, newBasePrice) => {
    const services = db.getServices();
    const updated = services.map(s => {
      if (s.id === serviceId) {
        return { ...s, basePrice: Number(newBasePrice) };
      }
      return s;
    });
    db.saveServices(updated);
    return updated;
  },

  // --- Addons Management ---
  getAddons: () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ADDONS);
      return saved ? JSON.parse(saved) : DEFAULT_ADDONS;
    } catch (e) {
      return DEFAULT_ADDONS;
    }
  },

  saveAddons: async (addons) => {
    try {
      localStorage.setItem(STORAGE_KEYS.ADDONS, JSON.stringify(addons));
      if (isSupabaseConfigured && supabase) {
        await supabase.from('addons').upsert(addons);
      }
    } catch (e) {}
  },

  // --- Inquiries / Proposals Management ---
  getInquiries: () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
      return saved ? JSON.parse(saved) : DEFAULT_INQUIRIES;
    } catch (e) {
      return DEFAULT_INQUIRIES;
    }
  },

  saveInquiries: (inquiries) => {
    try {
      localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
    } catch (e) {}
  },

  addInquiry: async (newInquiry) => {
    const inquiries = db.getInquiries();
    const updated = [newInquiry, ...inquiries];
    db.saveInquiries(updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('inquiries').insert([newInquiry]);
      } catch (e) {
        console.warn('Supabase inquiry insert note:', e);
      }
    }
    return updated;
  },

  updateInquiryStatus: async (inquiryId, newStatus) => {
    const inquiries = db.getInquiries();
    const updated = inquiries.map(item => {
      if (item.id === inquiryId) {
        return { ...item, status: newStatus };
      }
      return item;
    });
    db.saveInquiries(updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('inquiries').update({ status: newStatus }).eq('id', inquiryId);
      } catch (e) {}
    }
    return updated;
  },

  deleteInquiry: async (inquiryId) => {
    const inquiries = db.getInquiries();
    const updated = inquiries.filter(item => item.id !== inquiryId);
    db.saveInquiries(updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('inquiries').delete().eq('id', inquiryId);
      } catch (e) {}
    }
    return updated;
  },

  // --- User Management ---
  getUsers: () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      return saved ? JSON.parse(saved) : DEFAULT_USERS;
    } catch (e) {
      return DEFAULT_USERS;
    }
  },

  saveUsers: (users) => {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch (e) {}
  },

  registerUser: async (userData) => {
    const users = db.getUsers();
    
    // Check if email already exists
    const existing = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existing) {
      throw new Error('An account with this corporate email already exists.');
    }

    const newUser = {
      id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      name: userData.name,
      email: userData.email,
      password: userData.password,
      company: userData.company || 'Corporate Client',
      birthday: userData.birthday || '1998-05-14',
      phone: userData.phone || 'N/A',
      country: userData.country || 'Sri Lanka',
      role: 'Client',
      status: 'Active',
      joinedDate: new Date().toISOString().split('T')[0],
      authProvider: userData.authProvider || 'Email'
    };

    const updated = [newUser, ...users];
    db.saveUsers(updated);
    db.setCurrentUser(newUser);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('users').insert([newUser]);
      } catch (e) {}
    }

    return newUser;
  },

  loginUser: (email, password) => {
    const users = db.getUsers();
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!found) {
      throw new Error('No account found with this email. Please sign up first.');
    }
    if (found.status === 'Suspended') {
      throw new Error('Account suspended. Please contact Lyntrix Compliance Support.');
    }
    db.setCurrentUser(found);
    return found;
  },

  updateUserPassword: async (email, newPassword) => {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Check if email belongs to an Admin in Cloud DB
    const admins = db.getAdmins();
    const adminIndex = admins.findIndex(a => a.email.toLowerCase() === cleanEmail);
    if (adminIndex !== -1) {
      admins[adminIndex].password = newPassword;
      db.saveAdmins(admins);

      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.from('admins').update({ password: newPassword }).eq('email', cleanEmail);
        } catch (e) {}
      }
      return { success: true, type: 'admin', user: admins[adminIndex] };
    }

    // 2. Check if email belongs to a regular Client in Cloud DB
    const users = db.getUsers();
    const userIndex = users.findIndex(u => u.email.toLowerCase() === cleanEmail);
    if (userIndex !== -1) {
      users[userIndex].password = newPassword;
      db.saveUsers(users);

      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.from('users').update({ password: newPassword }).eq('email', cleanEmail);
        } catch (e) {}
      }
      return { success: true, type: 'client', user: users[userIndex] };
    }

    // If account doesn't exist yet, register new credentials
    const newUser = {
      id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      name: cleanEmail.split('@')[0],
      email: cleanEmail,
      password: newPassword,
      company: 'Corporate Client',
      role: 'Client',
      status: 'Active',
      joinedDate: new Date().toISOString().split('T')[0],
      authProvider: 'Email'
    };
    db.saveUsers([newUser, ...users]);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('users').insert([newUser]);
      } catch (e) {}
    }

    return { success: true, type: 'client', user: newUser };
  },

  updateUserProfile: async (updatedData) => {
    const users = db.getUsers();
    const index = users.findIndex(u => u.email?.toLowerCase() === updatedData.email?.toLowerCase() || u.id === updatedData.id);
    let finalUser = updatedData;
    if (index !== -1) {
      users[index] = { ...users[index], ...updatedData };
      finalUser = users[index];
      db.saveUsers(users);
    }
    db.setCurrentUser(finalUser);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('users').update(updatedData).eq('email', updatedData.email);
      } catch (e) {}
    }

    return finalUser;
  },

  googleAuth: async (googleProfile) => {
    const users = db.getUsers();
    let found = users.find(u => u.email.toLowerCase() === googleProfile.email.toLowerCase());
    
    if (!found) {
      found = {
        id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
        name: googleProfile.name || googleProfile.email.split('@')[0],
        email: googleProfile.email,
        company: googleProfile.company || 'Google Verified Org',
        birthday: googleProfile.birthday || '1995-01-01',
        phone: googleProfile.phone || '+1 415 555 0199',
        country: 'United States',
        role: 'Client',
        status: 'Active',
        joinedDate: new Date().toISOString().split('T')[0],
        authProvider: 'Google'
      };
      db.saveUsers([found, ...users]);

      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.from('users').insert([found]);
        } catch (e) {}
      }
    }

    db.setCurrentUser(found);
    return found;
  },

  getCurrentUser: () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  },

  setCurrentUser: (user) => {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } catch (e) {}
  },

  logoutUser: () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  // --- Admin DB Management ---
  getAdmins: () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ADMINS);
      if (!saved) {
        localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(DEFAULT_ADMINS));
        return DEFAULT_ADMINS;
      }
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_ADMINS;
    } catch (e) {
      return DEFAULT_ADMINS;
    }
  },

  saveAdmins: async (admins) => {
    try {
      localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(admins));
      if (isSupabaseConfigured && supabase) {
        await supabase.from('admins').upsert(admins);
      }
    } catch (e) {}
  },

  validateAdminCredentials: (email, password) => {
    const admins = db.getAdmins();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    const matched = admins.find(
      a => a.email.toLowerCase() === cleanEmail && a.password === cleanPass && a.status === 'Active'
    );

    if (matched) {
      db.setCurrentAdmin(matched);
      return { success: true, admin: matched };
    }
    return { success: false, admin: null };
  },

  addAdmin: async (adminData) => {
    const admins = db.getAdmins();
    const existing = admins.find(a => a.email.toLowerCase() === adminData.email.toLowerCase());
    if (existing) {
      throw new Error('An administrator account with this corporate email already exists.');
    }

    const newAdmin = {
      id: `ADM-${Math.floor(100 + Math.random() * 900)}`,
      name: adminData.name,
      email: adminData.email,
      password: adminData.password,
      role: adminData.role || 'Master Admin',
      status: 'Active',
      createdDate: new Date().toISOString().split('T')[0]
    };

    const updated = [newAdmin, ...admins];
    db.saveAdmins(updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('admins').insert([newAdmin]);
      } catch (e) {}
    }
    return updated;
  },

  updateAdminPassword: async (adminId, newPassword) => {
    const admins = db.getAdmins();
    const updated = admins.map(a => {
      if (a.id === adminId) {
        return { ...a, password: newPassword };
      }
      return a;
    });
    db.saveAdmins(updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('admins').update({ password: newPassword }).eq('id', adminId);
      } catch (e) {}
    }
    return updated;
  },

  deleteAdmin: async (adminId) => {
    const admins = db.getAdmins();
    if (admins.length <= 1) {
      throw new Error('Cannot delete the primary root administrator account.');
    }
    const updated = admins.filter(a => a.id !== adminId);
    db.saveAdmins(updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('admins').delete().eq('id', adminId);
      } catch (e) {}
    }
    return updated;
  },

  getCurrentAdmin: () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_ADMIN);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  },

  setCurrentAdmin: (admin) => {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_ADMIN, JSON.stringify(admin));
    } catch (e) {}
  },

  logoutAdmin: () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_ADMIN);
  }
};
