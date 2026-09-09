/**
 * QRIS EMVCo MPM (Merchant-Presented Mode) Payload Generator & Constants
 * Standar Nasional Bank Indonesia (QRIS) & ASPI
 * Merchant: PRCRSA HADJI ABDUL MUIS (NMID: ID1026589758873, NSS: 93600815)
 */

export const OFFICIAL_QRIS_CONFIG = {
  merchantName: 'PRCRSA HADJI ABDUL MUIS',
  nmid: 'ID1026589758873',
  acquirerNss: '93600815', // PT Bimasakti Multi Sinergi (SpeedCash / FastPay)
  acquirerName: 'SpeedCash / FastPay (PT Bimasakti Multi Sinergi)',
  city: 'JAKARTA',
  postalCode: '10110',
  defaultImageUrl: '/qris-prcrsa-hadji-abdul-muis.svg',
  defaultPngUrl: '/qris-prcrsa-hadji-abdul-muis.png',
};

/**
 * Hitung CRC16-CCITT (polynomial 0x1021, init 0xFFFF) standar EMVCo
 */
export function calculateCrc16(str: string): string {
  let crc = 0xffff;
  for (let c = 0; c < str.length; c++) {
    crc ^= str.charCodeAt(c) << 8;
    for (let i = 0; i < 8; i++) {
      if (crc & 0x8000) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

/**
 * Format Tag-Length-Value (TLV)
 */
function tlv(tag: string, value: string): string {
  const len = String(value.length).padStart(2, '0');
  return `${tag}${len}${value}`;
}

export interface QrisPayloadOptions {
  merchantName?: string;
  nmid?: string;
  acquirerNss?: string;
  amount?: number;
  invoiceNumber?: string;
  city?: string;
  postalCode?: string;
}

/**
 * Hasilkan string payload resmi QRIS EMVCo
 */
export function buildQrisPayload(options: QrisPayloadOptions = {}): string {
  const merchantName = (options.merchantName || OFFICIAL_QRIS_CONFIG.merchantName).trim();
  const nmid = (options.nmid || OFFICIAL_QRIS_CONFIG.nmid).trim();
  const acquirerNss = (options.acquirerNss || OFFICIAL_QRIS_CONFIG.acquirerNss).trim();
  const city = (options.city || OFFICIAL_QRIS_CONFIG.city).trim().toUpperCase();
  const postal = (options.postalCode || OFFICIAL_QRIS_CONFIG.postalCode).trim();
  const isDynamic = !!options.amount && options.amount > 0;

  // Tag 00: Format Indicator ('01')
  const tag00 = tlv('00', '01');

  // Tag 01: Point of Initiation Method ('11' Static, '12' Dynamic)
  const tag01 = tlv('01', isDynamic ? '12' : '11');

  // Tag 26: Domestic Merchant Info (Acquirer / SpeedCash)
  const sub26_00 = tlv('00', 'ID.CO.QRIS.WWW');
  const sub26_01 = tlv('01', `${acquirerNss}0000000000`.slice(0, 18));
  const sub26_02 = tlv('02', nmid);
  const sub26_03 = tlv('03', 'UMI'); // Usaha Mikro
  const tag26 = tlv('26', `${sub26_00}${sub26_01}${sub26_02}${sub26_03}`);

  // Tag 51: National GPN / QRIS Repository
  const sub51_00 = tlv('00', 'ID.OR.GPN.WWW');
  const sub51_01 = tlv('01', nmid);
  const sub51_02 = tlv('02', nmid);
  const sub51_03 = tlv('03', 'UMI');
  const tag51 = tlv('51', `${sub51_00}${sub51_01}${sub51_02}${sub51_03}`);

  // Tag 52: Merchant Category Code (8398 = Charitable and Social Service Organizations)
  const tag52 = tlv('52', '8398');

  // Tag 53: Transaction Currency (360 = IDR)
  const tag53 = tlv('53', '360');

  // Tag 54: Transaction Amount (hanya ada jika dinamis)
  let tag54 = '';
  if (isDynamic && options.amount) {
    tag54 = tlv('54', Math.round(options.amount).toString());
  }

  // Tag 58: Country Code ('ID')
  const tag58 = tlv('58', 'ID');

  // Tag 59: Merchant Name
  const tag59 = tlv('59', merchantName);

  // Tag 60: Merchant City
  const tag60 = tlv('60', city);

  // Tag 61: Postal Code
  const tag61 = tlv('61', postal);

  // Tag 62: Additional Data (Dicetak oleh / Terminal)
  let tag62Sub = tlv('07', acquirerNss);
  if (options.invoiceNumber) {
    tag62Sub += tlv('01', options.invoiceNumber.slice(0, 25));
  }
  const tag62 = tlv('62', tag62Sub);

  // Tag 63: CRC Checksum
  const rawWithoutCrc = `${tag00}${tag01}${tag26}${tag51}${tag52}${tag53}${tag54}${tag58}${tag59}${tag60}${tag61}${tag62}6304`;
  const checksum = calculateCrc16(rawWithoutCrc);

  return `${rawWithoutCrc}${checksum}`;
}
