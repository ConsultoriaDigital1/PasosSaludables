export interface ParsedUserAgent {
  deviceType: string;
  browser: string;
  os: string;
  isBot: boolean;
}

const BOT_PATTERN =
  /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|headless|lighthouse|pingdom|uptime|monitor|scraper|curl\/|wget\/|python-requests|axios\/|node-fetch|^whatsapp\//i;

export function parseUserAgent(userAgent: string): ParsedUserAgent {
  const ua = userAgent || '';

  if (!ua || BOT_PATTERN.test(ua)) {
    return { deviceType: 'Desconocido', browser: 'Desconocido', os: 'Desconocido', isBot: true };
  }

  let deviceType = 'Computadora';
  if (/ipad|tablet|(android(?!.*mobile))/i.test(ua)) {
    deviceType = 'Tablet';
  } else if (/mobi|iphone|ipod|android/i.test(ua)) {
    deviceType = 'Celular';
  }

  let os = 'Otro';
  if (/windows nt/i.test(ua)) os = 'Windows';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS';
  else if (/mac os x|macintosh/i.test(ua)) os = 'macOS';
  else if (/cros/i.test(ua)) os = 'ChromeOS';
  else if (/linux/i.test(ua)) os = 'Linux';

  let browser = 'Otro';
  if (/edg\//i.test(ua)) browser = 'Edge';
  else if (/opr\/|opera/i.test(ua)) browser = 'Opera';
  else if (/samsungbrowser/i.test(ua)) browser = 'Samsung Internet';
  else if (/instagram/i.test(ua)) browser = 'Instagram';
  else if (/fban|fbav/i.test(ua)) browser = 'Facebook';
  else if (/firefox|fxios/i.test(ua)) browser = 'Firefox';
  else if (/chrome|crios/i.test(ua)) browser = 'Chrome';
  else if (/safari/i.test(ua)) browser = 'Safari';

  return { deviceType, browser, os, isBot: false };
}
