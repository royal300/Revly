import QRCode from 'qrcode';

/**
 * QR Code Helper
 * Generates high-definition QR codes for desktop display and printable table tent cards.
 */

export async function renderQrToCanvas(canvasElement, text, options = {}) {
  if (!canvasElement) return;
  const defaultOpts = {
    width: options.width || 220,
    margin: options.margin || 2,
    color: {
      dark: options.darkColor || '#0f172a',
      light: '#ffffff'
    },
    errorCorrectionLevel: 'H'
  };

  try {
    await QRCode.toCanvas(canvasElement, text, defaultOpts);
  } catch (err) {
    console.error("QR Code generation error:", err);
  }
}

export async function getQrDataUrl(text, options = {}) {
  try {
    return await QRCode.toDataURL(text, {
      width: options.width || 600,
      margin: 2,
      color: {
        dark: options.darkColor || '#0f172a',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    });
  } catch (err) {
    console.error("QR Code DataURL error:", err);
    return "";
  }
}

export async function downloadQrImage(text, businessName) {
  const dataUrl = await getQrDataUrl(text, { width: 1000 });
  const cleanName = (businessName || "reviopulse").toLowerCase().replace(/[^a-z0-9]/g, '_');
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = `${cleanName}_qr_code.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
