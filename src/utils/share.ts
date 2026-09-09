import { DonationCampaign } from '../types';

/**
 * Menghasilkan tautan unik langsung untuk setiap kampanye donasi
 */
export function getCampaignShareUrl(campaignId: string): string {
  if (typeof window === 'undefined') return '';
  const origin = window.location.origin || '';
  const pathname = window.location.pathname || '/';
  return `${origin}${pathname}?donasi=${encodeURIComponent(campaignId)}`;
}

/**
 * Menghasilkan teks pesan ajakan donasi untuk WhatsApp, medsos, dsb.
 */
export function getCampaignShareText(campaign: DonationCampaign, url: string): string {
  return `Mari bantu donasi: "${campaign.title}"\n\n` +
    `Disalurkan resmi melalui Yayasan Prakarsa Hadji Abdul Muis (PARAMIS FOUNDATION).\n` +
    `Kategori: ${campaign.categoryLabel} • Lokasi: ${campaign.location.city}, ${campaign.location.province}\n` +
    `Bebas berdonasi berapa rupiahpun tanpa batas minimum.\n\n` +
    `Salurkan kepedulian Anda melalui tautan resmi donasi ini:\n${url}`;
}

/**
 * Fungsi salin ke clipboard yang andal di semua browser & iframe
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fallback below
  }
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    textArea.remove();
    return successful;
  } catch {
    return false;
  }
}
