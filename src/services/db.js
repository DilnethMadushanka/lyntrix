/**
 * LYNTRIX CLOUD DATABASE & PERSISTENCE SERVICE
 * Cloud DB Client supporting Services, Pricing, Inquiries, and User Management
 */

const STORAGE_KEYS = {
  SERVICES: 'lyntrix_cloud_services',
  ADDONS: 'lyntrix_cloud_addons',
  INQUIRIES: 'lyntrix_cloud_inquiries',
  USERS: 'lyntrix_cloud_users',
  CURRENT_USER: 'lyntrix_current_user'
};

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
    id: 'support',
    title: 'Support & Maintenance',
    basePrice: 1800,
    badge: '24/7 Managed IT',
    tagline: 'Round-the-clock proactive monitoring, automated backups, and SLA support.',
    description: 'Ensure 99.99% uptime with dedicated engineering teams monitoring your infrastructure, managing updates, and responding to incidents in minutes.',
    architect: 'SOC Operations Director',
    sla: '24/7 Monitoring & Backups'
  }
];

// Initial Default Addons
const DEFAULT_ADDONS = [
  { id: 'security_audit', name: 'Pentest & Security Audit', price: 1200 },
  { id: 'ci_cd', name: 'Automated CI/CD Pipeline', price: 800 },
  { id: 'compliance', name: 'ISO 27001 / SOC 2 Prep', price: 1500 },
  { id: 'ai_module', name: 'AI & Data Integration', price: 1800 }
];

// Initial Default Registered Users
const DEFAULT_USERS = [
  {
    id: 'USR-1001',
    name: 'Dilneth Madushanka',
    email: 'dilneth@enterprise.io',
    company: 'Lyntrix Global Enterprise',
    birthday: '1998-05-14',
    phone: '+94 77 987 6543',
    country: 'Sri Lanka',
    role: 'Enterprise Client',
    status: 'Active',
    joinedDate: '2026-08-01',
    authProvider: 'Email'
  },
  {
    id: 'USR-1002',
    name: 'Sarah Vance',
    email: 'sarah.v@aerocloud.com',
    company: 'AeroCloud Systems',
    birthday: '1992-11-20',
    phone: '+1 415 889 0123',
    country: 'United States',
    role: 'Enterprise Client',
    status: 'Active',
    joinedDate: '2026-08-04',
    authProvider: 'Google'
  },
  {
    id: 'USR-1003',
    name: 'Dr. Michael Chang',
    email: 'mchang@omnihealth.org',
    company: 'OmniHealth Global',
    birthday: '1985-03-09',
    phone: '+1 650 443 8910',
    country: 'United States',
    role: 'VIP Client',
    status: 'Active',
    joinedDate: '2026-08-06',
    authProvider: 'Google'
  }
];

// Initial Default Inquiries
const DEFAULT_INQUIRIES = [
  {
    id: 'LYN-9021',
    name: 'Dilneth Madushanka',
    email: 'dilneth@enterprise.io',
    phone: '+94 77 987 6543',
    service: 'Software Development',
    scale: 'Growth Business Platform',
    budget: '$8,500 - $12,500',
    status: 'New',
    date: '2026-08-08 19:42',
    details: 'Needs modern React + Node.js high concurrency payment dashboard integration with PostgreSQL.'
  },
  {
    id: 'LYN-9020',
    name: 'Sarah Vance',
    email: 'sarah.v@aerocloud.com',
    phone: '+1 415 889 0123',
    service: 'Cloud Solutions',
    scale: 'Enterprise Scale Architecture',
    budget: '$25,000 - $40,000',
    status: 'In Review',
    date: '2026-08-07 14:15',
    details: 'AWS multi-region failover setup with Terraform IaC declarations and Kubernetes EKS auto-scaling.'
  }
];

export const db = {
  // Load Services
  getServices: () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SERVICES);
      return saved ? JSON.parse(saved) : DEFAULT_SERVICES;
    } catch (e) {
      return DEFAULT_SERVICES;
    }
  },

  saveServices: (services) => {
    try {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
    } catch (e) {}
  },

  // Load Addons
  getAddons: () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ADDONS);
      return saved ? JSON.parse(saved) : DEFAULT_ADDONS;
    } catch (e) {
      return DEFAULT_ADDONS;
    }
  },

  saveAddons: (addons) => {
    try {
      localStorage.setItem(STORAGE_KEYS.ADDONS, JSON.stringify(addons));
    } catch (e) {}
  },

  // Load Inquiries
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

  addInquiry: (newInquiry) => {
    const inquiries = db.getInquiries();
    const updated = [newInquiry, ...inquiries];
    db.saveInquiries(updated);
    return updated;
  },

  // User Management
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

  registerUser: (userData) => {
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
      company: userData.company || 'Personal / Unspecified',
      birthday: userData.birthday || 'N/A',
      phone: userData.phone || 'N/A',
      country: userData.country || 'Global',
      role: 'Client',
      status: 'Active',
      joinedDate: new Date().toISOString().split('T')[0],
      authProvider: userData.authProvider || 'Email'
    };

    const updated = [newUser, ...users];
    db.saveUsers(updated);
    db.setCurrentUser(newUser);
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

  googleAuth: (googleProfile) => {
    const users = db.getUsers();
    let found = users.find(u => u.email.toLowerCase() === googleProfile.email.toLowerCase());
    
    if (!found) {
      // Auto-register via Google OAuth
      found = {
        id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
        name: googleProfile.name || 'Google User',
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

  // Validate Admin Credentials
  validateAdminCredentials: (email, password) => {
    const validEmail = 'admin@lyntrix.tech';
    const validPassword = 'admin123';
    return email.trim().toLowerCase() === validEmail && password === validPassword;
  }
};
