// src/lib/totp.ts
// Pure Web Crypto TOTP & Session Security Module for Cloudflare Workers / Astro

function base32Decode(base32: string): Uint8Array {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const clean = base32.toUpperCase().replace(/[^A-Z2-7]/g, '');
  let bits = 0;
  let value = 0;
  const output = new Uint8Array(Math.floor((clean.length * 5) / 8));
  let index = 0;

  for (let i = 0; i < clean.length; i++) {
    const charIndex = alphabet.indexOf(clean[i]);
    if (charIndex === -1) continue;
    value = (value << 5) | charIndex;
    bits += 5;
    if (bits >= 8) {
      output[index++] = (value >>> (bits - 8)) & 255;
      bits -= 8;
    }
  }
  return output;
}

export async function generateTOTP(secretBase32: string, timeStepWindow = 0): Promise<string> {
  const keyBytes = base32Decode(secretBase32);
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign']
  );

  const currentStep = Math.floor(Date.now() / 1000 / 30) + timeStepWindow;
  const msg = new Uint8Array(8);
  let temp = currentStep;
  for (let i = 7; i >= 0; i--) {
    msg[i] = temp & 0xff;
    temp = Math.floor(temp / 256);
  }

  const hmac = await crypto.subtle.sign('HMAC', cryptoKey, msg);
  const hmacBytes = new Uint8Array(hmac);
  const offset = hmacBytes[hmacBytes.length - 1] & 0xf;

  const codeVal =
    ((hmacBytes[offset] & 0x7f) << 24) |
    ((hmacBytes[offset + 1] & 0xff) << 16) |
    ((hmacBytes[offset + 2] & 0xff) << 8) |
    (hmacBytes[offset + 3] & 0xff);

  return (codeVal % 1000000).toString().padStart(6, '0');
}

export async function verifyTOTP(token: string, secretBase32: string): Promise<boolean> {
  const cleanToken = token.replace(/\s+/g, '').trim();
  if (cleanToken.length !== 6 || !/^\d{6}$/.test(cleanToken)) return false;

  // Check current window (0), previous (-1), and next (+1) for clock drift allowance
  for (const windowOffset of [0, -1, 1]) {
    const expected = await generateTOTP(secretBase32, windowOffset);
    if (expected === cleanToken) {
      return true;
    }
  }
  return false;
}

// Session Cookie Token Signature & Verification
export async function createSessionSignature(secretBase32: string, timestamp: number): Promise<string> {
  const enc = new TextEncoder();
  const keyData = enc.encode(secretBase32);
  const key = await crypto.subtle.importKey('raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(`admin_session:${timestamp}`));
  return Array.from(new Uint8Array(signature)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function verifySessionCookie(cookieHeader: string | null, secretBase32: string): Promise<boolean> {
  if (!cookieHeader) return false;
  const match = cookieHeader.match(/admin_session=([^;]+)/);
  if (!match) return false;

  const token = match[1];
  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [timestampStr, sig] = parts;
  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) return false;

  // Check if session has expired (24 hours max)
  const now = Date.now();
  if (now - timestamp > 24 * 60 * 60 * 1000) return false;

  const expectedSig = await createSessionSignature(secretBase32, timestamp);
  return expectedSig === sig;
}
