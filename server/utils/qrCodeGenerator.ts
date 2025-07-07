import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';

export interface QRCodeData {
  type: 'asset' | 'inventory' | 'location' | 'unit';
  id: string | number;
  code: string;
  metadata?: Record<string, any>;
}

export class QRCodeGenerator {
  /**
   * Generate a unique QR code for assets (KEW.PA compliance)
   */
  static async generateAssetQRCode(assetId: number, assetTag: string, registrationNumber: string): Promise<string> {
    const qrData: QRCodeData = {
      type: 'asset',
      id: assetId,
      code: assetTag,
      metadata: {
        registrationNumber,
        generatedAt: new Date().toISOString(),
        system: 'KEW.PA'
      }
    };

    const qrString = JSON.stringify(qrData);
    return await QRCode.toDataURL(qrString, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
  }

  /**
   * Generate a unique QR code for inventory items (KEW.PS compliance)
   */
  static async generateInventoryQRCode(itemId: number, sku: string): Promise<string> {
    const qrData: QRCodeData = {
      type: 'inventory',
      id: itemId,
      code: sku,
      metadata: {
        generatedAt: new Date().toISOString(),
        system: 'KEW.PS'
      }
    };

    const qrString = JSON.stringify(qrData);
    return await QRCode.toDataURL(qrString, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
  }

  /**
   * Generate QR code for locations (enhanced location tracking)
   */
  static async generateLocationQRCode(locationId: number, locationCode: string): Promise<string> {
    const qrData: QRCodeData = {
      type: 'location',
      id: locationId,
      code: locationCode,
      metadata: {
        generatedAt: new Date().toISOString(),
        system: 'KEW-LOCATION'
      }
    };

    const qrString = JSON.stringify(qrData);
    return await QRCode.toDataURL(qrString, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 1
    });
  }

  /**
   * Generate QR code for units (multi-unit support)
   */
  static async generateUnitQRCode(unitId: number, unitCode: string): Promise<string> {
    const qrData: QRCodeData = {
      type: 'unit',
      id: unitId,
      code: unitCode,
      metadata: {
        generatedAt: new Date().toISOString(),
        system: 'KEW-UNIT'
      }
    };

    const qrString = JSON.stringify(qrData);
    return await QRCode.toDataURL(qrString, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 1
    });
  }

  /**
   * Generate a unique identifier for QR codes
   */
  static generateUniqueCode(prefix: string = 'KEW'): string {
    const timestamp = Date.now().toString(36);
    const randomStr = uuidv4().substring(0, 8);
    return `${prefix}-${timestamp}-${randomStr}`.toUpperCase();
  }

  /**
   * Parse QR code data
   */
  static parseQRCodeData(qrString: string): QRCodeData | null {
    try {
      const data = JSON.parse(qrString);
      if (data.type && data.id && data.code) {
        return data as QRCodeData;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Generate printable QR code for forms (KEW.PA/KEW.PS form integration)
   */
  static async generatePrintableQRCode(data: QRCodeData): Promise<string> {
    const qrString = JSON.stringify(data);
    return await QRCode.toDataURL(qrString, {
      errorCorrectionLevel: 'H', // High error correction for print
      type: 'image/png',
      quality: 1.0,
      margin: 2,
      width: 256,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
  }
}