export type CampaignCategory = 
  | 'semua'
  | 'pendidikan'
  | 'yatim'
  | 'bencana'
  | 'kesehatan'
  | 'dakwah'
  | 'ekonomi';

export interface CampaignUpdate {
  id: string;
  date: string;
  title: string;
  description: string;
  imageUrl?: string;
  fundSpent?: number;
}

export interface TransparencyReport {
  id: string;
  date: string;
  title: string;
  category: 'penyaluran_langsung' | 'logistik' | 'operasional' | 'fasilitas';
  amount: number;
  recipientCount: number;
  description: string;
  proofDocumentUrl?: string;
  proofPhotoUrl?: string;
  verifiedBy: string;
}

export interface DonationCampaign {
  id: string;
  title: string;
  slug: string;
  category: CampaignCategory;
  categoryLabel: string;
  shortDescription: string;
  fullDescription: string;
  targetAmount: number;
  collectedAmount: number;
  donorCount: number;
  coverImage: string;
  location: {
    city: string;
    province: string;
    distanceKm: number;
    address: string;
    latitude: number;
    longitude: number;
  };
  daysLeft: number;
  isUrgent?: boolean;
  isFeatured?: boolean;
  organizer: string;
  startDate: string;
  endDate: string;
  updates: CampaignUpdate[];
  transparencyReports: TransparencyReport[];
  active: boolean;
}

export type PaymentMethodType = 
  | 'qris'
  | 'va_bca'
  | 'va_mandiri'
  | 'va_bri'
  | 'va_bni'
  | 'gopay'
  | 'ovo'
  | 'dana'
  | 'shopeepay'
  | 'bank_transfer';

export interface DonationTransaction {
  id: string;
  invoiceNumber: string;
  campaignId: string;
  campaignTitle: string;
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  amount: number;
  uniqueCode: number;
  totalAmount: number;
  paymentMethod: PaymentMethodType;
  paymentChannelName: string;
  paymentCode: string;
  status: 'pending' | 'verified' | 'failed';
  isAnonymous: boolean;
  prayerMessage: string;
  createdAt: string;
  verifiedAt?: string;
  receiptNumber: string;
}

export interface VolunteerApplicant {
  id: string;
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
  status: 'verified_auto' | 'pending_review' | 'approved' | 'rejected';
  verificationScore: number;
  verificationNotes: string[];
  idCardNumber: string;
  registeredAt: string;
  avatarUrl?: string;
}

export interface SocialActivityReport {
  id: string;
  title: string;
  date: string;
  category: CampaignCategory;
  location: string;
  beneficiariesCount: number;
  totalBudget: number;
  documentationImages: string[];
  description: string;
  impactHighlights: string[];
  publishedAt: string;
}

export interface EmailNotificationLog {
  id: string;
  toEmail: string;
  donorName: string;
  subject: string;
  type: 'donation_receipt' | 'monthly_report' | 'volunteer_welcome' | 'program_update';
  sentAt: string;
  status: 'delivered' | 'pending';
  contentSnippet: string;
  period?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category: CampaignCategory | string;
  badge: string;
  beneficiaries: string;
  isFeatured?: boolean;
}

export interface CustomMenuItem {
  id: string;
  title: string;
  pathOrTab: string;
  iconName?: string;
  isExternal?: boolean;
  externalUrl?: string;
  isActive: boolean;
}

export interface CustomCategoryItem {
  id: string;
  name: string;
  iconName?: string;
  description?: string;
}

export interface CmsConfig {
  yayasanName: string;
  brandName: string;
  tagline: string;
  aboutStory: string;
  vision?: string;
  missions?: string[];
  skKemenkumham: string;
  npwp: string;
  izinOperasional: string;
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  website: string;
  instagram: string;
  footerDescription?: string;
  footerCopyright?: string;
  sectionTitles?: {
    urgentProgramsTitle?: string;
    urgentProgramsSubtitle?: string;
    catalogTitle?: string;
    catalogSubtitle?: string;
    servicesTitle?: string;
    servicesSubtitle?: string;
    transparencyTitle?: string;
    transparencySubtitle?: string;
    volunteersTitle?: string;
    volunteersSubtitle?: string;
  };
  customCategories?: CustomCategoryItem[];
  navigationTitles: {
    home: string;
    donations: string;
    volunteers: string;
    transparency: string;
    fundraiser?: string;
    admin: string;
  };
  customMenuItems?: CustomMenuItem[];
  heroBannerTitle: string;
  heroBannerSubtitle: string;
  customHeaderLogo?: string;
  customSplashLogo?: string;
  customFooterLogo?: string;
  qrisImageUrl?: string;
  qrisMerchantName?: string;
  qrisNmid?: string;
  qrisGatewayProvider?: 'manual' | 'midtrans' | 'xendit' | 'tripay' | 'duitku';
  qrisGatewayApiKey?: string;
  qrisGatewayMode?: 'sandbox' | 'production';
  qrisGatewayEndpoint?: string;
  bankAccounts: Array<{
    bank: string;
    accountNumber: string;
    accountName: string;
    notes?: string;
    isActive?: boolean;
  }>;
}

export interface CampaignSubmission {
  id: string;
  title: string;
  category: CampaignCategory;
  categoryLabel: string;
  targetAmount: number;
  durationDays: number;
  endDate: string;
  coverImage: string;
  description: string;
  // Applicant details (pengunjung tidak perlu buat akun)
  applicantName: string;
  applicantWhatsapp: string;
  applicantEmail?: string;
  organizationName?: string;
  location: {
    province: string;
    city: string;
    address?: string;
  };
  bankAccount?: {
    bank: string;
    accountNumber: string;
    accountHolder: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  adminNotes?: string;
  submittedAt: string;
  reviewedAt?: string;
  createdCampaignId?: string;
}

