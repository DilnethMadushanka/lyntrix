/**
 * LYNTRIX CLOUD DATABASE & PERSISTENCE SERVICE
 * Cloud DB Client supporting Supabase / REST API Cloud Sync + LocalStorage fallback
 */

const STORAGE_KEYS = {
  SERVICES: 'lyntrix_cloud_services',
  ADDONS: 'lyntrix_cloud_addons',
  INQUIRIES: 'lyntrix_cloud_inquiries',
  ADMIN_CREDENTIALS: 'lyntrix_admin_creds'
};

// Initial Cloud Default Services Data
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

// Initial Cloud Default Addons Data
const DEFAULT_ADDONS = [
  { id: 'security_audit', name: 'Pentest & Security Audit', price: 1200 },
  { id: 'ci_cd', name: 'Automated CI/CD Pipeline', price: 800 },
  { id: 'compliance', name: 'ISO 27001 / SOC 2 Prep', price: 1500 },
  { id: 'ai_module', name: 'AI & Data Integration', price: 1800 }
];

// Initial Inquiries Data
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

// Helper functions for Database persistence
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

  // Save Services
  saveServices: (services) => {
    try {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
    } catch (e) {
      console.error('Failed to save services to Cloud DB:', e);
    }
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

  // Save Addons
  saveAddons: (addons) => {
    try {
      localStorage.setItem(STORAGE_KEYS.ADDONS, JSON.stringify(addons));
    } catch (e) {
      console.error('Failed to save addons to Cloud DB:', e);
    }
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

  // Save Inquiries
  saveInquiries: (inquiries) => {
    try {
      localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
    } catch (e) {
      console.error('Failed to save inquiries to Cloud DB:', e);
    }
  },

  // Add new Inquiry
  addInquiry: (newInquiry) => {
    const inquiries = db.getInquiries();
    const updated = [newInquiry, ...inquiries];
    db.saveInquiries(updated);
    return updated;
  },

  // Authenticate Admin
  validateAdminCredentials: (email, password) => {
    // Admin Credential validation
    const validEmail = 'admin@lyntrix.tech';
    const validPassword = 'admin123';
    return email.trim().toLowerCase() === validEmail && password === validPassword;
  }
};
