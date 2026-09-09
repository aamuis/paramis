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

import { LEGAL_ARTICLES, LegalArticle } from '../data/legalArticlesData';
import { supabase, isSupabaseConfigured } from './supabaseClient';

// =====================================================================
// Ini adalah versi storage.ts yang tersambung ke Supabase (Postgres asli),
// menggantikan versi lama yang hanya menyimpan data di localStorage browser.
//
// Semua fungsi export di bawah (getCampaigns, addCampaign, dst) SENGAJA
// dibuat dengan nama & bentuk yang sama seperti sebelumnya, supaya semua
// komponen React yang sudah ada TIDAK perlu diubah sama sekali.
//
// Caranya: data disimpan di cache memori (`cache`) yang dibaca secara
// instan (synchronous) oleh komponen, sementara di belakang layar setiap
// perubahan langsung dikirim ke Supabase (async, "fire and forget") dan
// saat aplikasi pertama kali dibuka, data terbaru diambil dari Supabase
// lalu didorong ke semua komponen lewat subscribeToDatabase().
// =====================================================================

type TableName =
  | 'services'
  | 'campaigns'
  | 'transactions'
  | 'volunteers'
  | 'reports'
  | 'email_logs'
  | 'submissions'
  | 'legal_articles';

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

// Status koneksi database, bisa dipakai komponen untuk menampilkan indikator
// "menyinkronkan..." bila diperlukan (opsional, tidak wajib dipakai).
export let isDatabaseReady = false;
export function onDatabaseReady(cb: () => void) {
  if (isDatabaseReady) cb();
  else {
    const unsub = subscribeToDatabase(() => {
      if (isDatabaseReady) {
        cb();
        unsub();
      }
    });
  }
}

// ---------------------------------------------------------------------
// Cache di memori. Diisi dengan data bawaan dulu supaya UI tidak blank,
// lalu ditimpa dengan data asli dari Supabase begitu selesai dimuat.
// ---------------------------------------------------------------------
const cache = {
  cmsConfig: INITIAL_CMS_CONFIG as CmsConfig,
  services: INITIAL_SERVICES as ServiceItem[],
  campaigns: INITIAL_CAMPAIGNS as DonationCampaign[],
  transactions: INITIAL_TRANSACTIONS as DonationTransaction[],
  volunteers: INITIAL_VOLUNTEERS as VolunteerApplicant[],
  reports: INITIAL_ACTIVITY_REPORTS as SocialActivityReport[],
  emailLogs: INITIAL_EMAIL_LOGS as EmailNotificationLog[],
  submissions: INITIAL_CAMPAIGN_SUBMISSIONS as CampaignSubmission[],
  legalArticles: LEGAL_ARTICLES as LegalArticle[]
};

// ---------------------------------------------------------------------
// Helper generik untuk baca/tulis ke Supabase. Setiap tabel berbentuk
// (id text primary key, data jsonb) supaya cocok dengan struktur data
// TypeScript yang sudah ada tanpa perlu bikin puluhan kolom manual.
// ---------------------------------------------------------------------
async function fetchList<T>(table: TableName, order: 'asc' | 'desc'): Promise<T[]> {
  const { data, error } = await supabase
    .from(table)
    .select('data')
    .order('created_at', { ascending: order === 'asc' });
  if (error) {
    console.error(`[Supabase] Gagal memuat tabel "${table}":`, error.message);
    return [];
  }
  return (data || []).map((row: { data: T }) => row.data);
}

async function upsertRow(table: TableName, id: string, data: unknown): Promise<void> {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase
    .from(table)
    .upsert({ id, data, updated_at: new Date().toISOString() });
  if (error) {
    console.error(`[Supabase] Gagal menyimpan ke "${table}" (id=${id}):`, error.message);
  }
}

async function deleteRow(table: TableName, id: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) {
    console.error(`[Supabase] Gagal menghapus dari "${table}" (id=${id}):`, error.message);
  }
}

// Mengganti seluruh isi satu tabel dengan list baru (dipakai oleh fungsi
// saveServices/saveCampaigns/saveReports/importAllWebsiteData/dst).
async function replaceTable(table: TableName, items: Array<{ id: string }>): Promise<void> {
  if (!isSupabaseConfigured) return;
  const { data: existing, error: fetchErr } = await supabase.from(table).select('id');
  if (fetchErr) {
    console.error(`[Supabase] Gagal membaca daftar id "${table}":`, fetchErr.message);
    return;
  }
  const existingIds = new Set((existing || []).map((r: { id: string }) => r.id));
  const newIds = new Set(items.map(i => i.id));
  const idsToDelete = [...existingIds].filter(id => !newIds.has(id));

  if (idsToDelete.length > 0) {
    const { error } = await supabase.from(table).delete().in('id', idsToDelete);
    if (error) console.error(`[Supabase] Gagal membersihkan "${table}":`, error.message);
  }
  if (items.length > 0) {
    const rows = items.map(item => ({
      id: item.id,
      data: item,
      updated_at: new Date().toISOString()
    }));
    const { error } = await supabase.from(table).upsert(rows);
    if (error) console.error(`[Supabase] Gagal menulis batch "${table}":`, error.message);
  }
}

async function fetchCmsConfig(): Promise<CmsConfig | null> {
  const { data, error } = await supabase
    .from('cms_config')
    .select('data')
    .eq('id', 'main')
    .maybeSingle();
  if (error) {
    console.error('[Supabase] Gagal memuat cms_config:', error.message);
    return null;
  }
  return data ? (data.data as CmsConfig) : null;
}

async function persistCmsConfig(config: CmsConfig): Promise<void> {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase
    .from('cms_config')
    .upsert({ id: 'main', data: config, updated_at: new Date().toISOString() });
  if (error) console.error('[Supabase] Gagal menyimpan cms_config:', error.message);
}

// ---------------------------------------------------------------------
// Migrasi/self-heal CmsConfig, dipindah dari getCmsConfig lama supaya
// bisa dipakai ulang baik saat init maupun tiap kali getCmsConfig() dipanggil.
// ---------------------------------------------------------------------
function applyCmsMigrations(input: CmsConfig): { config: CmsConfig; changed: boolean } {
  const config: CmsConfig = { ...input };
  let changed = false;

  if (config.heroBannerTitle === 'Wujudkan Harapan, Salurkan Donasi Terbaik Anda' || !config.heroBannerTitle) {
    config.heroBannerTitle = INITIAL_CMS_CONFIG.heroBannerTitle;
    config.heroBannerSubtitle = INITIAL_CMS_CONFIG.heroBannerSubtitle;
    changed = true;
  }

  if (config.tagline && (config.tagline.includes('Ummat') || config.tagline.includes('ummat'))) {
    config.tagline = INITIAL_CMS_CONFIG.tagline;
    changed = true;
  }

  if (config.aboutStory && (
    config.aboutStory.includes('filantropi Islam') || 
    config.aboutStory.includes('kaum dhuafa') ||
    config.aboutStory.includes('melanjutkan nilai-nilai luhur') ||
    config.aboutStory.includes('almarhum')
  )) {
    config.aboutStory = INITIAL_CMS_CONFIG.aboutStory;
    changed = true;
  }

  if (config.vision && (config.vision.includes('filantropi Islam') || config.vision.includes('martabat kaum dhuafa'))) {
    config.vision = INITIAL_CMS_CONFIG.vision;
    changed = true;
  }

  if (config.missions && Array.isArray(config.missions)) {
    const hasAmbulance = config.missions.some(m => m.toLowerCase().includes('ambulans') || m.toLowerCase().includes('riba'));
    if (hasAmbulance) {
      config.missions = INITIAL_CMS_CONFIG.missions;
      changed = true;
    }
  }

  if (config.customMenuItems && Array.isArray(config.customMenuItems)) {
    // Migrate ambulance menu item to social aid / sembako
    const ambMenu = config.customMenuItems.find(m => m.id === 'menu-ambulance' || (m.title && m.title.toLowerCase().includes('ambulan')));
    if (ambMenu) {
      ambMenu.id = 'menu-bansos';
      ambMenu.title = 'Bantuan Sosial & Sembako';
      ambMenu.pathOrTab = 'bansos';
      ambMenu.iconName = 'HeartHandshake';
      changed = true;
    }

    const zakatMenu = config.customMenuItems.find(m => m.id === 'menu-zakat');
    if (zakatMenu && (zakatMenu.pathOrTab === 'donations' || zakatMenu.pathOrTab === '')) {
      zakatMenu.pathOrTab = 'zakat';
      changed = true;
    }
    if (!config.customMenuItems.some(m => m.id === 'menu-terms' || m.pathOrTab === 'terms')) {
      config.customMenuItems = [
        ...config.customMenuItems,
        {
          id: 'menu-terms',
          title: 'Syarat & Ketentuan',
          pathOrTab: 'terms',
          iconName: 'FileText',
          isExternal: false,
          isActive: true
        }
      ];
      changed = true;
    }
    const paramisMenu = config.customMenuItems.find(m => m.id === 'menu-institut-paramis' || (m.externalUrl && m.externalUrl.includes('institutparamis.com')) || (m.title && m.title.toLowerCase().includes('institut paramis')));
    if (!paramisMenu) {
      config.customMenuItems = [
        ...config.customMenuItems,
        {
          id: 'menu-institut-paramis',
          title: 'Pelatihan Gratis di Institut Paramis untuk Janda Yatim supaya dapat penghasilan tambahan',
          pathOrTab: 'https://institutparamis.com',
          iconName: 'GraduationCap',
          isExternal: true,
          externalUrl: 'https://institutparamis.com',
          isActive: true
        }
      ];
      changed = true;
    } else {
      if (paramisMenu.title !== 'Pelatihan Gratis di Institut Paramis untuk Janda Yatim supaya dapat penghasilan tambahan' || paramisMenu.externalUrl !== 'https://institutparamis.com' || !paramisMenu.isActive) {
        paramisMenu.title = 'Pelatihan Gratis di Institut Paramis untuk Janda Yatim supaya dapat penghasilan tambahan';
        paramisMenu.externalUrl = 'https://institutparamis.com';
        paramisMenu.pathOrTab = 'https://institutparamis.com';
        paramisMenu.isExternal = true;
        paramisMenu.isActive = true;
        paramisMenu.iconName = 'GraduationCap';
        changed = true;
      }
    }
  } else {
    config.customMenuItems = INITIAL_CMS_CONFIG.customMenuItems;
    changed = true;
  }

  if (!config.sectionTitles) {
    config.sectionTitles = INITIAL_CMS_CONFIG.sectionTitles;
    changed = true;
  }

  if (!config.customCategories || !Array.isArray(config.customCategories) || config.customCategories.length === 0) {
    config.customCategories = INITIAL_CMS_CONFIG.customCategories;
    changed = true;
  }

  if (!config.footerDescription) {
    config.footerDescription = INITIAL_CMS_CONFIG.footerDescription;
    changed = true;
  }

  if (!config.footerCopyright) {
    config.footerCopyright = INITIAL_CMS_CONFIG.footerCopyright;
    changed = true;
  }

  if (!config.qrisNmid || config.qrisNmid === 'ID102026198') {
    config.qrisNmid = INITIAL_CMS_CONFIG.qrisNmid;
    config.qrisMerchantName = INITIAL_CMS_CONFIG.qrisMerchantName;
    if (!config.qrisImageUrl) {
      config.qrisImageUrl = INITIAL_CMS_CONFIG.qrisImageUrl;
    }
    changed = true;
  }
  if (!config.qrisImageUrl) {
    config.qrisImageUrl = INITIAL_CMS_CONFIG.qrisImageUrl;
    changed = true;
  }

  return { config, changed };
}

// ---------------------------------------------------------------------
// Inisialisasi: ambil data asli dari Supabase begitu modul ini dimuat.
// Kalau database masih kosong (baru dibuat), isi otomatis dengan data
// bawaan aplikasi supaya website tidak tampil kosong.
// ---------------------------------------------------------------------
async function seedInitialData(): Promise<void> {
  await Promise.all([
    persistCmsConfig(INITIAL_CMS_CONFIG),
    replaceTable('services', INITIAL_SERVICES),
    replaceTable('campaigns', INITIAL_CAMPAIGNS),
    replaceTable('transactions', INITIAL_TRANSACTIONS),
    replaceTable('volunteers', INITIAL_VOLUNTEERS),
    replaceTable('reports', INITIAL_ACTIVITY_REPORTS),
    replaceTable('email_logs', INITIAL_EMAIL_LOGS),
    replaceTable('submissions', INITIAL_CAMPAIGN_SUBMISSIONS),
    replaceTable('legal_articles', LEGAL_ARTICLES)
  ]);
}

async function initDatabase(): Promise<void> {
  if (!isSupabaseConfigured) {
    isDatabaseReady = true;
    notifySubscribers();
    return;
  }

  try {
    const [cmsConfig, services, campaigns, transactions, volunteers, reports, emailLogs, submissions, legalArticles] =
      await Promise.all([
        fetchCmsConfig(),
        fetchList<ServiceItem>('services', 'asc'),
        fetchList<DonationCampaign>('campaigns', 'desc'),
        fetchList<DonationTransaction>('transactions', 'desc'),
        fetchList<VolunteerApplicant>('volunteers', 'desc'),
        fetchList<SocialActivityReport>('reports', 'desc'),
        fetchList<EmailNotificationLog>('email_logs', 'desc'),
        fetchList<CampaignSubmission>('submissions', 'desc'),
        fetchList<LegalArticle>('legal_articles', 'asc')
      ]);

    const looksEmpty = !cmsConfig && services.length === 0 && campaigns.length === 0;

    if (looksEmpty) {
      console.info('[Supabase] Database masih kosong, mengisi data awal bawaan aplikasi...');
      await seedInitialData();
      // cache sudah berisi nilai INITIAL_* dari awal, tidak perlu diubah lagi
    } else {
      cache.cmsConfig = cmsConfig ? applyCmsMigrations(cmsConfig).config : INITIAL_CMS_CONFIG;
      cache.services = (services.length ? services : INITIAL_SERVICES).map(s => {
        if (s.id === 'srv-4' || s.title.toLowerCase().includes('ambulan')) {
          return INITIAL_SERVICES.find(is => is.id === 'srv-4') || s;
        }
        return s;
      });
      cache.campaigns = (campaigns.length ? campaigns : INITIAL_CAMPAIGNS).map(c => {
        if (c.id === 'camp-3' || c.title.toLowerCase().includes('ambulans')) {
          return INITIAL_CAMPAIGNS.find(ic => ic.id === 'camp-3') || c;
        }
        return c;
      });
      cache.transactions = transactions;
      cache.volunteers = volunteers;
      cache.reports = reports;
      cache.emailLogs = emailLogs;
      cache.submissions = submissions;
      cache.legalArticles = legalArticles.length ? legalArticles : LEGAL_ARTICLES;
    }
  } catch (err) {
    console.error('[Supabase] Gagal memuat data dari database, memakai data sementara:', err);
  } finally {
    isDatabaseReady = true;
    notifySubscribers();
  }
}

// Jalankan sekali begitu modul ini pertama kali diimpor.
initDatabase();

// =====================================================================
// GETTERS (synchronous, baca dari cache)
// =====================================================================
export function getCmsConfig(): CmsConfig {
  const { config, changed } = applyCmsMigrations(cache.cmsConfig);
  if (changed) {
    cache.cmsConfig = config;
    persistCmsConfig(config);
  }
  return cache.cmsConfig;
}

export function getServices(): ServiceItem[] {
  return cache.services;
}

export function getCampaigns(): DonationCampaign[] {
  return cache.campaigns;
}

export function getTransactions(): DonationTransaction[] {
  return cache.transactions;
}

export function getVolunteers(): VolunteerApplicant[] {
  return cache.volunteers;
}

export function getActivityReports(): SocialActivityReport[] {
  return cache.reports;
}

export function getEmailLogs(): EmailNotificationLog[] {
  return cache.emailLogs;
}

export function getCampaignSubmissions(): CampaignSubmission[] {
  return cache.submissions;
}

export function getLegalArticles(): LegalArticle[] {
  return cache.legalArticles;
}

// =====================================================================
// MODIFIERS
// =====================================================================
export function updateCmsConfig(newConfig: Partial<CmsConfig>): CmsConfig {
  const updated = { ...cache.cmsConfig, ...newConfig };
  cache.cmsConfig = updated;
  notifySubscribers();
  persistCmsConfig(updated);
  return updated;
}

export function saveServices(services: ServiceItem[]): void {
  cache.services = services;
  notifySubscribers();
  replaceTable('services', services);
}

export function updateService(id: string, updated: Partial<ServiceItem>): void {
  const index = cache.services.findIndex(s => s.id === id);
  if (index !== -1) {
    const next = [...cache.services];
    next[index] = { ...next[index], ...updated };
    cache.services = next;
    notifySubscribers();
    upsertRow('services', id, next[index]);
  }
}

export function addService(serviceData: Omit<ServiceItem, 'id'>): ServiceItem {
  const newService: ServiceItem = { ...serviceData, id: `srv-${Date.now()}` };
  cache.services = [...cache.services, newService];
  notifySubscribers();
  upsertRow('services', newService.id, newService);
  return newService;
}

export function deleteService(id: string): void {
  cache.services = cache.services.filter(s => s.id !== id);
  notifySubscribers();
  deleteRow('services', id);
}

export function addReport(reportData: Omit<SocialActivityReport, 'id'>): SocialActivityReport {
  const newReport: SocialActivityReport = { ...reportData, id: `rep-${Date.now()}` };
  cache.reports = [newReport, ...cache.reports];
  notifySubscribers();
  upsertRow('reports', newReport.id, newReport);
  return newReport;
}

export function updateReport(id: string, data: Partial<SocialActivityReport>): void {
  const index = cache.reports.findIndex(r => r.id === id);
  if (index !== -1) {
    const next = [...cache.reports];
    next[index] = { ...next[index], ...data };
    cache.reports = next;
    notifySubscribers();
    upsertRow('reports', id, next[index]);
  }
}

export function deleteReport(id: string): void {
  cache.reports = cache.reports.filter(r => r.id !== id);
  notifySubscribers();
  deleteRow('reports', id);
}

export function addCampaign(
  campaignData: Omit<DonationCampaign, 'id' | 'collectedAmount' | 'donorCount' | 'updates' | 'transparencyReports'>
): DonationCampaign {
  const newCampaign: DonationCampaign = {
    ...campaignData,
    id: `camp-${Date.now()}`,
    collectedAmount: 0,
    donorCount: 0,
    updates: [],
    transparencyReports: [],
    active: true
  };
  cache.campaigns = [newCampaign, ...cache.campaigns];
  notifySubscribers();
  upsertRow('campaigns', newCampaign.id, newCampaign);
  return newCampaign;
}

export function updateCampaign(id: string, data: Partial<DonationCampaign>): void {
  const index = cache.campaigns.findIndex(c => c.id === id);
  if (index !== -1) {
    const next = [...cache.campaigns];
    next[index] = { ...next[index], ...data };
    cache.campaigns = next;
    notifySubscribers();
    upsertRow('campaigns', id, next[index]);
  }
}

export function deleteCampaign(id: string): void {
  cache.campaigns = cache.campaigns.filter(c => c.id !== id);
  notifySubscribers();
  deleteRow('campaigns', id);
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
  const campaign = cache.campaigns.find(c => c.id === input.campaignId);
  const campaignTitle = campaign ? campaign.title : 'Donasi Umum PARAMIS FOUNDATION';

  const uniqueCode = Math.floor(100 + Math.random() * 899);
  const totalAmount = input.amount + uniqueCode;
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const invoiceNumber = `INV/PRM/${dateStr}/${randomSuffix}`;
  const receiptNumber = `RCPT-${dateStr}-${randomSuffix}`;

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
    donorName: input.isAnonymous ? 'Hamba Allah' : input.donorName || 'Hamba Allah',
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

  cache.transactions = [transaction, ...cache.transactions];
  notifySubscribers();
  upsertRow('transactions', transaction.id, transaction);

  return {
    transaction,
    paymentDetails: { code: paymentCode, label: paymentChannelName }
  };
}

// Auto-verify transaction (instant payment gateway simulation)
export function verifyTransaction(transactionId: string): DonationTransaction | null {
  const txIndex = cache.transactions.findIndex(t => t.id === transactionId);
  if (txIndex === -1) return null;

  const nextTransactions = [...cache.transactions];
  const tx: DonationTransaction = {
    ...nextTransactions[txIndex],
    status: 'verified',
    verifiedAt: new Date().toISOString()
  };
  nextTransactions[txIndex] = tx;
  cache.transactions = nextTransactions;
  upsertRow('transactions', tx.id, tx);

  const campIndex = cache.campaigns.findIndex(c => c.id === tx.campaignId);
  if (campIndex !== -1) {
    const nextCampaigns = [...cache.campaigns];
    const campaign = {
      ...nextCampaigns[campIndex],
      collectedAmount: nextCampaigns[campIndex].collectedAmount + tx.amount,
      donorCount: nextCampaigns[campIndex].donorCount + 1
    };
    nextCampaigns[campIndex] = campaign;
    cache.campaigns = nextCampaigns;
    upsertRow('campaigns', campaign.id, campaign);
  }

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
  cache.emailLogs = [newEmail, ...cache.emailLogs];
  upsertRow('email_logs', newEmail.id, newEmail);

  notifySubscribers();
  return tx;
}

// Volunteer registration - Only Admin can ACC/approve the applicant
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
  avatarUrl?: string;
}): { volunteer: VolunteerApplicant; passedAutoVerification: boolean } {
  let score = 0;
  const notes: string[] = [];

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
    notes.push(`Usia produktif (${input.age} tahun)`);
  }

  if (input.motivation.trim().length >= 25) {
    score += 20;
    notes.push('Motivasi pengabdian jelas');
  } else {
    notes.push('Motivasi singkat, perlu tinjauan lanjutan');
  }

  if (input.skills.length > 0) {
    score += 15;
    notes.push(`Keahlian: ${input.skills.join(', ')}`);
  }

  const randomIdNumber = Math.floor(1000 + Math.random() * 9000);
  const idCardNumber = `REL-PRM-${new Date().getFullYear()}-${randomIdNumber}`;

  // Sesuai instruksi: HANYA ADMIN yang bisa ACC apakah relawan lolos atau tidak
  // Semua pendaftaran baru masuk status 'pending_review'
  const volunteer: VolunteerApplicant = {
    id: `vol-${Date.now()}`,
    ...input,
    status: 'pending_review',
    verificationScore: score,
    verificationNotes: notes,
    idCardNumber,
    registeredAt: new Date().toISOString()
  };

  cache.volunteers = [volunteer, ...cache.volunteers];
  upsertRow('volunteers', volunteer.id, volunteer);

  const newEmail: EmailNotificationLog = {
    id: `eml-${Date.now()}`,
    toEmail: volunteer.email,
    donorName: volunteer.fullName,
    subject: `Pendaftaran Relawan Diterima [No: ${idCardNumber}] - Menunggu Verifikasi Admin`,
    type: 'volunteer_welcome',
    sentAt: new Date().toISOString(),
    status: 'delivered',
    contentSnippet: `Halo ${volunteer.fullName}, pendaftaran relawan Anda telah kami terima. Berkas Anda sedang dalam proses peninjauan oleh Admin PARAMIS FOUNDATION untuk proses ACC & verifikasi resmi.`
  };
  cache.emailLogs = [newEmail, ...cache.emailLogs];
  upsertRow('email_logs', newEmail.id, newEmail);

  notifySubscribers();
  return { volunteer, passedAutoVerification: false };
}

export function updateVolunteerAvatar(id: string, avatarUrl: string): void {
  const index = cache.volunteers.findIndex(v => v.id === id);
  if (index !== -1) {
    const next = [...cache.volunteers];
    next[index] = { ...next[index], avatarUrl };
    cache.volunteers = next;
    notifySubscribers();
    upsertRow('volunteers', id, next[index]);
  }
}

export function updateVolunteer(id: string, updates: Partial<VolunteerApplicant>): void {
  const index = cache.volunteers.findIndex(v => v.id === id);
  if (index !== -1) {
    const next = [...cache.volunteers];
    next[index] = { ...next[index], ...updates };
    cache.volunteers = next;
    notifySubscribers();
    upsertRow('volunteers', id, next[index]);
  }
}

export function updateVolunteerStatus(id: string, status: VolunteerApplicant['status']): void {
  const index = cache.volunteers.findIndex(v => v.id === id);
  if (index !== -1) {
    const next = [...cache.volunteers];
    next[index] = { ...next[index], status };
    cache.volunteers = next;
    notifySubscribers();
    upsertRow('volunteers', id, next[index]);
  }
}

export function deleteVolunteer(id: string): void {
  cache.volunteers = cache.volunteers.filter(v => v.id !== id);
  notifySubscribers();
  deleteRow('volunteers', id);
}

export function batchApproveVolunteers(ids: string[]): void {
  const next = cache.volunteers.map(v => (ids.includes(v.id) ? { ...v, status: 'approved' as const } : v));
  const changedOnes = next.filter(v => ids.includes(v.id));
  if (changedOnes.length > 0) {
    cache.volunteers = next;
    notifySubscribers();
    changedOnes.forEach(v => upsertRow('volunteers', v.id, v));
  }
}

// Legal Articles Management
export function saveLegalArticles(articles: LegalArticle[]): void {
  cache.legalArticles = articles;
  notifySubscribers();
  replaceTable('legal_articles', articles);
}

export function updateLegalArticle(id: string, updated: Partial<LegalArticle>): void {
  const index = cache.legalArticles.findIndex(a => a.id === id);
  if (index !== -1) {
    const next = [...cache.legalArticles];
    next[index] = { ...next[index], ...updated };
    cache.legalArticles = next;
    notifySubscribers();
    upsertRow('legal_articles', id, next[index]);
  }
}

// Add Activity Report (variant used by admin publish flow)
export function addActivityReport(report: Omit<SocialActivityReport, 'id' | 'publishedAt'>): SocialActivityReport {
  const newReport: SocialActivityReport = {
    ...report,
    id: `rep-${Date.now()}`,
    publishedAt: new Date().toISOString()
  };
  cache.reports = [newReport, ...cache.reports];
  notifySubscribers();
  upsertRow('reports', newReport.id, newReport);
  return newReport;
}

// Send periodic report email to donors
export function sendPeriodicReportEmail(
  recipientEmail: string,
  recipientName: string,
  periodText: string,
  customMessage?: string
): EmailNotificationLog {
  const newEmail: EmailNotificationLog = {
    id: `eml-${Date.now()}`,
    toEmail: recipientEmail,
    donorName: recipientName || 'Donatur PARAMIS',
    subject: `Laporan Transparansi Penyaluran Donasi - Periode ${periodText} [PARAMIS FOUNDATION]`,
    type: 'monthly_report',
    sentAt: new Date().toISOString(),
    status: 'delivered',
    contentSnippet:
      customMessage ||
      `Laporan audit penyaluran donasi Yayasan Prakarsa Hadji Abdul Muis periode ${periodText}. 100% donasi disalurkan amanah dan terdokumentasi.`,
    period: periodText
  };
  cache.emailLogs = [newEmail, ...cache.emailLogs];
  notifySubscribers();
  upsertRow('email_logs', newEmail.id, newEmail);
  return newEmail;
}

// Campaign Submissions (Galang Dana dari Pengunjung - Tanpa Buat Akun)
export function addCampaignSubmission(data: Omit<CampaignSubmission, 'id' | 'status' | 'submittedAt'>): CampaignSubmission {
  const newSubmission: CampaignSubmission = {
    ...data,
    id: `sub-${Date.now()}`,
    status: 'pending',
    submittedAt: new Date().toISOString()
  };
  cache.submissions = [newSubmission, ...cache.submissions];
  notifySubscribers();
  upsertRow('submissions', newSubmission.id, newSubmission);
  return newSubmission;
}

export function approveCampaignSubmission(
  id: string,
  notes?: string
): { submission: CampaignSubmission; campaign?: DonationCampaign } {
  const subIndex = cache.submissions.findIndex(s => s.id === id);
  if (subIndex === -1) {
    throw new Error('Pengajuan donasi tidak ditemukan');
  }

  const sub = cache.submissions[subIndex];

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
        title: 'Program Galang Dana Resmi Disetujui',
        description: `Pengajuan galang dana telah diverifikasi dan disetujui oleh Tim Pengelola PARAMIS FOUNDATION. Amanah donatur siap disalurkan kepada ${sub.applicantName}.`
      }
    ],
    transparencyReports: [],
    active: true
  };

  cache.campaigns = [newCampaign, ...cache.campaigns];
  upsertRow('campaigns', newCampaign.id, newCampaign);

  const updatedSubmission: CampaignSubmission = {
    ...sub,
    status: 'approved',
    reviewedAt: new Date().toISOString(),
    adminNotes: notes || 'Telah diverifikasi dan disetujui oleh Admin PARAMIS',
    createdCampaignId: newCampaignId
  };
  const nextSubmissions = [...cache.submissions];
  nextSubmissions[subIndex] = updatedSubmission;
  cache.submissions = nextSubmissions;
  upsertRow('submissions', updatedSubmission.id, updatedSubmission);

  notifySubscribers();
  return { submission: updatedSubmission, campaign: newCampaign };
}

export function rejectCampaignSubmission(id: string, reason?: string): CampaignSubmission {
  const subIndex = cache.submissions.findIndex(s => s.id === id);
  if (subIndex === -1) {
    throw new Error('Pengajuan donasi tidak ditemukan');
  }

  const updated: CampaignSubmission = {
    ...cache.submissions[subIndex],
    status: 'rejected',
    reviewedAt: new Date().toISOString(),
    rejectionReason: reason || 'Dokumen belum lengkap atau tidak memenuhi kriteria verifikasi yayasan.'
  };

  const next = [...cache.submissions];
  next[subIndex] = updated;
  cache.submissions = next;
  notifySubscribers();
  upsertRow('submissions', updated.id, updated);
  return updated;
}

export function deleteCampaignSubmission(id: string): void {
  cache.submissions = cache.submissions.filter(s => s.id !== id);
  notifySubscribers();
  deleteRow('submissions', id);
}

export function saveCampaigns(campaigns: DonationCampaign[]): void {
  cache.campaigns = campaigns;
  notifySubscribers();
  replaceTable('campaigns', campaigns);
}

export function saveReports(reports: SocialActivityReport[]): void {
  cache.reports = reports;
  notifySubscribers();
  replaceTable('reports', reports);
}

export function exportAllWebsiteData(): string {
  const data = {
    exportDate: new Date().toISOString(),
    cmsConfig: getCmsConfig(),
    campaigns: getCampaigns(),
    services: getServices(),
    reports: getActivityReports(),
    volunteers: getVolunteers(),
    submissions: getCampaignSubmissions()
  };
  return JSON.stringify(data, null, 2);
}

// PENTING: fungsi ini sekarang mengembalikan Promise karena benar-benar
// menulis ke database Supabase (bukan localStorage lagi). Ini juga fungsi
// yang dipakai untuk MEMINDAHKAN data lama (hasil export dari versi
// localStorage) ke database yang baru — lihat README-SUPABASE.md.
export async function importAllWebsiteData(jsonString: string): Promise<{ success: boolean; message: string }> {
  try {
    const data = JSON.parse(jsonString);
    const tasks: Promise<void>[] = [];

    if (data.cmsConfig) {
      cache.cmsConfig = data.cmsConfig;
      tasks.push(persistCmsConfig(data.cmsConfig));
    }
    if (data.campaigns) {
      cache.campaigns = data.campaigns;
      tasks.push(replaceTable('campaigns', data.campaigns));
    }
    if (data.services) {
      cache.services = data.services;
      tasks.push(replaceTable('services', data.services));
    }
    if (data.reports) {
      cache.reports = data.reports;
      tasks.push(replaceTable('reports', data.reports));
    }
    if (data.volunteers) {
      cache.volunteers = data.volunteers;
      tasks.push(replaceTable('volunteers', data.volunteers));
    }
    if (data.submissions) {
      cache.submissions = data.submissions;
      tasks.push(replaceTable('submissions', data.submissions));
    }

    await Promise.all(tasks);
    notifySubscribers();
    return { success: true, message: 'Seluruh data dan file website berhasil dipindahkan ke database!' };
  } catch (err) {
    return { success: false, message: 'Format file JSON tidak valid: ' + (err as Error).message };
  }
}

// Reset data helper
export async function resetDatabase(): Promise<void> {
  cache.cmsConfig = INITIAL_CMS_CONFIG;
  cache.services = INITIAL_SERVICES;
  cache.campaigns = INITIAL_CAMPAIGNS;
  cache.transactions = INITIAL_TRANSACTIONS;
  cache.volunteers = INITIAL_VOLUNTEERS;
  cache.reports = INITIAL_ACTIVITY_REPORTS;
  cache.emailLogs = INITIAL_EMAIL_LOGS;
  cache.submissions = INITIAL_CAMPAIGN_SUBMISSIONS;
  notifySubscribers();
  await seedInitialData();
}
