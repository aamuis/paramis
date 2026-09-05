import { 
  DonationCampaign, 
  SocialActivityReport, 
  DonationTransaction, 
  VolunteerApplicant, 
  CmsConfig, 
  ServiceItem,
  EmailNotificationLog,
  PaymentMethodType,
  CampaignCategory,
  CampaignSubmission
} from '../types';

import { 
  INITIAL_CMS_CONFIG, 
  INITIAL_SERVICES, 
  INITIAL_CAMPAIGNS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_VOLUNTEERS, 
  INITIAL_ACTIVITY_REPORTS,
  INITIAL_EMAIL_LOGS,
  INITIAL_CAMPAIGN_SUBMISSIONS
} from '../data/initialData';

const STORAGE_KEYS = {
  CMS_CONFIG: 'paramis_cms_config_v4',
  SERVICES: 'paramis_services_v2',
  CAMPAIGNS: 'paramis_campaigns_v2',
  TRANSACTIONS: 'paramis_transactions_v2',
  VOLUNTEERS: 'paramis_volunteers_v2',
  REPORTS: 'paramis_reports_v2',
  EMAIL_LOGS: 'paramis_email_logs_v2',
  SUBMISSIONS: 'paramis_campaign_submissions_v1',
  DARK_MODE: 'paramis_dark_mode'
};

type Listener = () => void;
const listeners: Set<Listener> = new Set();

function notifySubscribers() {
  listeners.forEach(fn => fn());
}

export function subscribeToDatabase(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// Helpers for safe storage
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error loading key ${key}:`, err);
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving key ${key}:`, err);
  }
}

// Getters
export function getCmsConfig(): CmsConfig {
  const config = loadFromStorage<CmsConfig>(STORAGE_KEYS.CMS_CONFIG, INITIAL_CMS_CONFIG);
  // Auto-migrate if previous default banner text is present
  if (
    config.heroBannerTitle === "Wujudkan Harapan, Salurkan Donasi Terbaik Anda" ||
    !config.heroBannerTitle
  ) {
    config.heroBannerTitle = INITIAL_CMS_CONFIG.heroBannerTitle;
    config.heroBannerSubtitle = INITIAL_CMS_CONFIG.heroBannerSubtitle;
    saveToStorage(STORAGE_KEYS.CMS_CONFIG, config);
  }
  return config;
}

export function getServices(): ServiceItem[] {
  return loadFromStorage<ServiceItem[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
}

export function getCampaigns(): DonationCampaign[] {
  return loadFromStorage<DonationCampaign[]>(STORAGE_KEYS.CAMPAIGNS, INITIAL_CAMPAIGNS);
}

export function getTransactions(): DonationTransaction[] {
  return loadFromStorage<DonationTransaction[]>(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
}

export function getVolunteers(): VolunteerApplicant[] {
  return loadFromStorage<VolunteerApplicant[]>(STORAGE_KEYS.VOLUNTEERS, INITIAL_VOLUNTEERS);
}

export function getActivityReports(): SocialActivityReport[] {
  return loadFromStorage<SocialActivityReport[]>(STORAGE_KEYS.REPORTS, INITIAL_ACTIVITY_REPORTS);
}

export function getEmailLogs(): EmailNotificationLog[] {
  return loadFromStorage<EmailNotificationLog[]>(STORAGE_KEYS.EMAIL_LOGS, INITIAL_EMAIL_LOGS);
}

// Modifiers
export function updateCmsConfig(newConfig: Partial<CmsConfig>): CmsConfig {
  const current = getCmsConfig();
  const updated = { ...current, ...newConfig };
  saveToStorage(STORAGE_KEYS.CMS_CONFIG, updated);
  notifySubscribers();
  return updated;
}

export function saveServices(services: ServiceItem[]): void {
  saveToStorage(STORAGE_KEYS.SERVICES, services);
  notifySubscribers();
}

export function updateService(id: string, updated: Partial<ServiceItem>): void {
  const current = getServices();
  const index = current.findIndex(s => s.id === id);
  if (index !== -1) {
    current[index] = { ...current[index], ...updated };
    saveToStorage(STORAGE_KEYS.SERVICES, current);
    notifySubscribers();
  }
}

export function addService(serviceData: Omit<ServiceItem, 'id'>): ServiceItem {
  const current = getServices();
  const newService: ServiceItem = {
    ...serviceData,
    id: `srv-${Date.now()}`
  };
  current.push(newService);
  saveToStorage(STORAGE_KEYS.SERVICES, current);
  notifySubscribers();
  return newService;
}

export function deleteService(id: string): void {
  const current = getServices().filter(s => s.id !== id);
  saveToStorage(STORAGE_KEYS.SERVICES, current);
  notifySubscribers();
}

export function addReport(reportData: Omit<SocialActivityReport, 'id'>): SocialActivityReport {
  const reports = getActivityReports();
  const newReport: SocialActivityReport = {
    ...reportData,
    id: `rep-${Date.now()}`
  };
  reports.unshift(newReport);
  saveToStorage(STORAGE_KEYS.REPORTS, reports);
  notifySubscribers();
  return newReport;
}

export function updateReport(id: string, data: Partial<SocialActivityReport>): void {
  const reports = getActivityReports();
  const index = reports.findIndex(r => r.id === id);
  if (index !== -1) {
    reports[index] = { ...reports[index], ...data };
    saveToStorage(STORAGE_KEYS.REPORTS, reports);
    notifySubscribers();
  }
}

export function deleteReport(id: string): void {
  const reports = getActivityReports().filter(r => r.id !== id);
  saveToStorage(STORAGE_KEYS.REPORTS, reports);
  notifySubscribers();
}

export function addCampaign(campaignData: Omit<DonationCampaign, 'id' | 'collectedAmount' | 'donorCount' | 'updates' | 'transparencyReports'>): DonationCampaign {
  const campaigns = getCampaigns();
  const newCampaign: DonationCampaign = {
    ...campaignData,
    id: `camp-${Date.now()}`,
    collectedAmount: 0,
    donorCount: 0,
    updates: [],
    transparencyReports: [],
    active: true
  };
  campaigns.unshift(newCampaign);
  saveToStorage(STORAGE_KEYS.CAMPAIGNS, campaigns);
  notifySubscribers();
  return newCampaign;
}

export function updateCampaign(id: string, data: Partial<DonationCampaign>): void {
  const campaigns = getCampaigns();
  const index = campaigns.findIndex(c => c.id === id);
  if (index !== -1) {
    campaigns[index] = { ...campaigns[index], ...data };
    saveToStorage(STORAGE_KEYS.CAMPAIGNS, campaigns);
    notifySubscribers();
  }
}

export function deleteCampaign(id: string): void {
  const campaigns = getCampaigns().filter(c => c.id !== id);
  saveToStorage(STORAGE_KEYS.CAMPAIGNS, campaigns);
  notifySubscribers();
}

// Create & Process Donation Transaction
export function createDonationTransaction(input: {
  campaignId: string;
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  amount: number;
  paymentMethod: PaymentMethodType;
  isAnonymous: boolean;
  prayerMessage: string;
}): { transaction: DonationTransaction; paymentDetails: { code: string; label: string } } {
  const campaigns = getCampaigns();
  const campaign = campaigns.find(c => c.id === input.campaignId);
  const campaignTitle = campaign ? campaign.title : 'Donasi Umum PARAMIS FOUNDATION';

  const uniqueCode = Math.floor(100 + Math.random() * 899);
  const totalAmount = input.amount + uniqueCode;
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const invoiceNumber = `INV/PRM/${dateStr}/${randomSuffix}`;
  const receiptNumber = `RCPT-${dateStr}-${randomSuffix}`;

  // Generate payment code based on method
  let paymentCode = '';
  let paymentChannelName = '';

  switch (input.paymentMethod) {
    case 'qris':
      paymentChannelName = 'QRIS Real-Time Interaktif';
      paymentCode = `00020101021226580014ID.CO.QRIS.PARAMIS.FOUNDATION.${Date.now()}`;
      break;
    case 'va_bca':
      paymentChannelName = 'BCA Virtual Account';
      paymentCode = `8271${input.donorPhone.replace(/\D/g, '').slice(-8) || '10293847'}`;
      break;
    case 'va_mandiri':
      paymentChannelName = 'Mandiri Virtual Account';
      paymentCode = `8890${input.donorPhone.replace(/\D/g, '').slice(-8) || '55443322'}`;
      break;
    case 'va_bri':
      paymentChannelName = 'BRI Virtual Account';
      paymentCode = `1280${input.donorPhone.replace(/\D/g, '').slice(-8) || '99887766'}`;
      break;
    case 'va_bni':
      paymentChannelName = 'BNI Virtual Account';
      paymentCode = `9881${input.donorPhone.replace(/\D/g, '').slice(-8) || '44332211'}`;
      break;
    case 'gopay':
      paymentChannelName = 'GoPay';
      paymentCode = `GP-PRM-${randomSuffix}`;
      break;
    case 'ovo':
      paymentChannelName = 'OVO';
      paymentCode = `OVO-PRM-${randomSuffix}`;
      break;
    case 'dana':
      paymentChannelName = 'DANA';
      paymentCode = `DANA-PRM-${randomSuffix}`;
      break;
    case 'shopeepay':
      paymentChannelName = 'ShopeePay';
      paymentCode = `SP-PRM-${randomSuffix}`;
      break;
    default:
      paymentChannelName = 'Transfer Bank Manual';
      paymentCode = '7188 9090 12 (BSI)';
  }

  const transaction: DonationTransaction = {
    id: `tx-${Date.now()}`,
    invoiceNumber,
    campaignId: input.campaignId,
    campaignTitle,
    donorName: input.isAnonymous ? 'Hamba Allah' : (input.donorName || 'Hamba Allah'),
    donorEmail: input.donorEmail,
    donorPhone: input.donorPhone,
    amount: input.amount,
    uniqueCode,
    totalAmount,
    paymentMethod: input.paymentMethod,
    paymentChannelName,
    paymentCode,
    status: 'pending',
    isAnonymous: input.isAnonymous,
    prayerMessage: input.prayerMessage,
    createdAt: now.toISOString(),
    receiptNumber
  };

  const transactions = getTransactions();
  transactions.unshift(transaction);
  saveToStorage(STORAGE_KEYS.TRANSACTIONS, transactions);

  notifySubscribers();

  return {
    transaction,
    paymentDetails: {
      code: paymentCode,
      label: paymentChannelName
    }
  };
}

// Auto-verify transaction (instant payment gateway simulation)
export function verifyTransaction(transactionId: string): DonationTransaction | null {
  const transactions = getTransactions();
  const tx = transactions.find(t => t.id === transactionId);
  if (!tx) return null;

  tx.status = 'verified';
  tx.verifiedAt = new Date().toISOString();
  saveToStorage(STORAGE_KEYS.TRANSACTIONS, transactions);

  // Update campaign collected amount & donor count
  const campaigns = getCampaigns();
  const campaign = campaigns.find(c => c.id === tx.campaignId);
  if (campaign) {
    campaign.collectedAmount += tx.amount;
    campaign.donorCount += 1;
    saveToStorage(STORAGE_KEYS.CAMPAIGNS, campaigns);
  }

  // Create automatic email notification log
  const emailLogs = getEmailLogs();
  const newEmail: EmailNotificationLog = {
    id: `eml-${Date.now()}`,
    toEmail: tx.donorEmail,
    donorName: tx.donorName,
    subject: `Bukti Donasi Resmi & E-Kwitansi PARAMIS FOUNDATION #${tx.invoiceNumber}`,
    type: 'donation_receipt',
    sentAt: new Date().toISOString(),
    status: 'delivered',
    contentSnippet: `Terima kasih Bapak/Ibu ${tx.donorName}. Donasi sebesar Rp ${tx.totalAmount.toLocaleString('id-ID')} untuk ${tx.campaignTitle} telah kami terima dan diverifikasi secara otomatis.`,
    period: new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
  };
  emailLogs.unshift(newEmail);
  saveToStorage(STORAGE_KEYS.EMAIL_LOGS, emailLogs);

  notifySubscribers();
  return tx;
}

// Volunteer registration with Automated Verification System
export function registerVolunteer(input: {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  age: number;
  profession: string;
  skills: string[];
  interestCategory: CampaignCategory;
  motivation: string;
  availability: 'weekdays' | 'weekends' | 'flexible' | 'emergency';
}): { volunteer: VolunteerApplicant; passedAutoVerification: boolean } {
  let score = 0;
  const notes: string[] = [];

  // Automated scoring criteria
  const cleanPhone = input.phone.replace(/\D/g, '');
  if (cleanPhone.length >= 10 && (cleanPhone.startsWith('08') || cleanPhone.startsWith('628'))) {
    score += 25;
    notes.push('Kontak WhatsApp valid & aktif');
  } else {
    notes.push('Format nomor telepon perlu konfirmasi manual');
  }

  if (input.email.includes('@') && input.email.includes('.')) {
    score += 20;
    notes.push('Format email resmi valid');
  }

  if (input.age >= 17 && input.age <= 60) {
    score += 20;
    notes.push(`Usia memenuhi kriteria relawan aktif (${input.age} tahun)`);
  }

  if (input.motivation.trim().length >= 25) {
    score += 20;
    notes.push('Motivasi pengabdian jelas & memenuhi syarat');
  } else {
    notes.push('Motivasi singkat, direkomendasikan penguatan wawancara');
  }

  if (input.skills.length > 0) {
    score += 15;
    notes.push(`Keahlian spesifik terdeteksi (${input.skills.join(', ')})`);
  }

  const passedAuto = score >= 75;
  const randomIdNumber = Math.floor(1000 + Math.random() * 9000);
  const idCardNumber = `REL-PRM-${new Date().getFullYear()}-${randomIdNumber}`;

  const volunteer: VolunteerApplicant = {
    id: `vol-${Date.now()}`,
    ...input,
    status: passedAuto ? 'verified_auto' : 'pending_review',
    verificationScore: score,
    verificationNotes: notes,
    idCardNumber,
    registeredAt: new Date().toISOString()
  };

  const volunteers = getVolunteers();
  volunteers.unshift(volunteer);
  saveToStorage(STORAGE_KEYS.VOLUNTEERS, volunteers);

  // Auto-send welcome & verification email
  const emailLogs = getEmailLogs();
  emailLogs.unshift({
    id: `eml-${Date.now()}`,
    toEmail: volunteer.email,
    donorName: volunteer.fullName,
    subject: passedAuto 
      ? `Selamat! Verifikasi Otomatis Relawan PARAMIS Disetujui [No: ${idCardNumber}]`
      : `Konfirmasi Pendaftaran Relawan PARAMIS FOUNDATION`,
    type: 'volunteer_welcome',
    sentAt: new Date().toISOString(),
    status: 'delivered',
    contentSnippet: passedAuto
      ? `Halo ${volunteer.fullName}, sistem verifikasi otomatis PARAMIS FOUNDATION telah menyetujui pendaftaran Anda dengan skor ${score}/100. Kartu E-KTA Relawan Anda siap digunakan.`
      : `Halo ${volunteer.fullName}, berkas Anda sedang ditinjau oleh Koordinator Relawan PARAMIS.`
  });
  saveToStorage(STORAGE_KEYS.EMAIL_LOGS, emailLogs);

  notifySubscribers();
  return { volunteer, passedAutoVerification: passedAuto };
}

export function updateVolunteerStatus(id: string, status: VolunteerApplicant['status']): void {
  const volunteers = getVolunteers();
  const v = volunteers.find(item => item.id === id);
  if (v) {
    v.status = status;
    saveToStorage(STORAGE_KEYS.VOLUNTEERS, volunteers);
    notifySubscribers();
  }
}

// Add Activity Report
export function addActivityReport(report: Omit<SocialActivityReport, 'id' | 'publishedAt'>): SocialActivityReport {
  const reports = getActivityReports();
  const newReport: SocialActivityReport = {
    ...report,
    id: `rep-${Date.now()}`,
    publishedAt: new Date().toISOString()
  };
  reports.unshift(newReport);
  saveToStorage(STORAGE_KEYS.REPORTS, reports);
  notifySubscribers();
  return newReport;
}

// Send periodic report email to donors
export function sendPeriodicReportEmail(recipientEmail: string, recipientName: string, periodText: string, customMessage?: string): EmailNotificationLog {
  const emailLogs = getEmailLogs();
  const newEmail: EmailNotificationLog = {
    id: `eml-${Date.now()}`,
    toEmail: recipientEmail,
    donorName: recipientName || 'Donatur PARAMIS',
    subject: `Laporan Transparansi Penyaluran Donasi - Periode ${periodText} [PARAMIS FOUNDATION]`,
    type: 'monthly_report',
    sentAt: new Date().toISOString(),
    status: 'delivered',
    contentSnippet: customMessage || `Laporan audit penyaluran donasi Yayasan Prakarsa Hadji Abdul Muis periode ${periodText}. 100% donasi disalurkan amanah dan terdokumentasi.`,
    period: periodText
  };
  emailLogs.unshift(newEmail);
  saveToStorage(STORAGE_KEYS.EMAIL_LOGS, emailLogs);
  notifySubscribers();
  return newEmail;
}

// Campaign Submissions (Galang Dana dari Pengunjung - Tanpa Buat Akun)
export function getCampaignSubmissions(): CampaignSubmission[] {
  return loadFromStorage<CampaignSubmission[]>(STORAGE_KEYS.SUBMISSIONS, INITIAL_CAMPAIGN_SUBMISSIONS);
}

export function addCampaignSubmission(
  data: Omit<CampaignSubmission, 'id' | 'status' | 'submittedAt'>
): CampaignSubmission {
  const submissions = getCampaignSubmissions();
  const newSubmission: CampaignSubmission = {
    ...data,
    id: `sub-${Date.now()}`,
    status: 'pending',
    submittedAt: new Date().toISOString()
  };
  submissions.unshift(newSubmission);
  saveToStorage(STORAGE_KEYS.SUBMISSIONS, submissions);
  notifySubscribers();
  return newSubmission;
}

export function approveCampaignSubmission(
  id: string,
  notes?: string
): { submission: CampaignSubmission; campaign?: DonationCampaign } {
  const submissions = getCampaignSubmissions();
  const subIndex = submissions.findIndex(s => s.id === id);
  if (subIndex === -1) {
    throw new Error('Pengajuan donasi tidak ditemukan');
  }

  const sub = submissions[subIndex];
  
  // Create official active DonationCampaign from this submission
  const campaigns = getCampaigns();
  const newCampaignId = `camp-acc-${Date.now()}`;
  const slug = sub.title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 50);

  const newCampaign: DonationCampaign = {
    id: newCampaignId,
    title: sub.title,
    slug: `${slug}-${Math.floor(1000 + Math.random() * 9000)}`,
    category: sub.category,
    categoryLabel: sub.categoryLabel,
    shortDescription: sub.description.slice(0, 140) + '...',
    fullDescription: sub.description,
    targetAmount: sub.targetAmount,
    collectedAmount: 0,
    donorCount: 0,
    coverImage: sub.coverImage || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
    location: {
      city: sub.location.city,
      province: sub.location.province,
      distanceKm: 3.5,
      address: sub.location.address || `${sub.location.city}, ${sub.location.province}`,
      latitude: -6.2088,
      longitude: 106.8456
    },
    daysLeft: sub.durationDays || 30,
    isUrgent: false,
    isFeatured: true,
    organizer: sub.applicantName + (sub.organizationName ? ` (${sub.organizationName})` : ''),
    startDate: new Date().toISOString().slice(0, 10),
    endDate: sub.endDate || new Date(Date.now() + (sub.durationDays || 30) * 86400000).toISOString().slice(0, 10),
    updates: [
      {
        id: `upd-${Date.now()}`,
        date: new Date().toISOString().slice(0, 10),
        title: "Program Galang Dana Resmi Disetujui",
        description: `Pengajuan galang dana telah diverifikasi dan disetujui oleh Tim Pengelola PARAMIS FOUNDATION. Amanah donatur siap disalurkan kepada ${sub.applicantName}.`
      }
    ],
    transparencyReports: [],
    active: true
  };

  campaigns.unshift(newCampaign);
  saveToStorage(STORAGE_KEYS.CAMPAIGNS, campaigns);

  // Update submission record
  const updatedSubmission: CampaignSubmission = {
    ...sub,
    status: 'approved',
    reviewedAt: new Date().toISOString(),
    adminNotes: notes || 'Telah diverifikasi dan disetujui oleh Admin PARAMIS',
    createdCampaignId: newCampaignId
  };
  submissions[subIndex] = updatedSubmission;
  saveToStorage(STORAGE_KEYS.SUBMISSIONS, submissions);

  notifySubscribers();
  return { submission: updatedSubmission, campaign: newCampaign };
}

export function rejectCampaignSubmission(id: string, reason?: string): CampaignSubmission {
  const submissions = getCampaignSubmissions();
  const subIndex = submissions.findIndex(s => s.id === id);
  if (subIndex === -1) {
    throw new Error('Pengajuan donasi tidak ditemukan');
  }

  const updated: CampaignSubmission = {
    ...submissions[subIndex],
    status: 'rejected',
    reviewedAt: new Date().toISOString(),
    rejectionReason: reason || 'Dokumen belum lengkap atau tidak memenuhi kriteria verifikasi yayasan.'
  };

  submissions[subIndex] = updated;
  saveToStorage(STORAGE_KEYS.SUBMISSIONS, submissions);
  notifySubscribers();
  return updated;
}

export function deleteCampaignSubmission(id: string): void {
  const submissions = getCampaignSubmissions().filter(s => s.id !== id);
  saveToStorage(STORAGE_KEYS.SUBMISSIONS, submissions);
  notifySubscribers();
}

export function saveCampaigns(campaigns: DonationCampaign[]): void {
  saveToStorage(STORAGE_KEYS.CAMPAIGNS, campaigns);
  notifySubscribers();
}

export function saveReports(reports: SocialActivityReport[]): void {
  saveToStorage(STORAGE_KEYS.REPORTS, reports);
  notifySubscribers();
}

export function exportAllWebsiteData(): string {
  const data = {
    exportDate: new Date().toISOString(),
    cmsConfig: getCmsConfig(),
    campaigns: getCampaigns(),
    services: getServices(),
    reports: getActivityReports(),
    volunteers: getVolunteers(),
    submissions: getCampaignSubmissions(),
  };
  return JSON.stringify(data, null, 2);
}

export function importAllWebsiteData(jsonString: string): { success: boolean; message: string } {
  try {
    const data = JSON.parse(jsonString);
    if (data.cmsConfig) saveToStorage(STORAGE_KEYS.CMS_CONFIG, data.cmsConfig);
    if (data.campaigns) saveToStorage(STORAGE_KEYS.CAMPAIGNS, data.campaigns);
    if (data.services) saveToStorage(STORAGE_KEYS.SERVICES, data.services);
    if (data.reports) saveToStorage(STORAGE_KEYS.REPORTS, data.reports);
    if (data.volunteers) saveToStorage(STORAGE_KEYS.VOLUNTEERS, data.volunteers);
    if (data.submissions) saveToStorage(STORAGE_KEYS.SUBMISSIONS, data.submissions);
    notifySubscribers();
    return { success: true, message: 'Seluruh data dan file website berhasil diperbarui!' };
  } catch (err) {
    return { success: false, message: 'Format file JSON tidak valid: ' + (err as Error).message };
  }
}

// Reset data helper
export function resetDatabase(): void {
  saveToStorage(STORAGE_KEYS.CMS_CONFIG, INITIAL_CMS_CONFIG);
  saveToStorage(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
  saveToStorage(STORAGE_KEYS.CAMPAIGNS, INITIAL_CAMPAIGNS);
  saveToStorage(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
  saveToStorage(STORAGE_KEYS.VOLUNTEERS, INITIAL_VOLUNTEERS);
  saveToStorage(STORAGE_KEYS.REPORTS, INITIAL_ACTIVITY_REPORTS);
  saveToStorage(STORAGE_KEYS.EMAIL_LOGS, INITIAL_EMAIL_LOGS);
  saveToStorage(STORAGE_KEYS.SUBMISSIONS, INITIAL_CAMPAIGN_SUBMISSIONS);
  notifySubscribers();
}

