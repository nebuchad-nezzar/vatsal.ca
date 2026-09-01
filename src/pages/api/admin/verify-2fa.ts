import type { APIRoute } from 'astro';
import { verifyTOTP, createSessionSignature } from '@/lib/totp';

export const prerender = false;

export const POST: APIRoute = async (context) => {
  const { request, locals } = context;
  const runtimeEnv = (locals as any).runtime?.env || (locals as any).env || {};
  const secretBase32 = runtimeEnv.ADMIN_2FA_SECRET || import.meta.env.ADMIN_2FA_SECRET || 'H7K2MAN4PAREWVYT';

  try {
    const body = await request.json();
    const { code } = body;

    if (!code) {
      return new Response(JSON.stringify({ error: 'Verification code is required' }), { status: 400 });
    }

    const isValid = await verifyTOTP(code, secretBase32);

    if (!isValid) {
      return new Response(JSON.stringify({ error: 'Invalid 6-digit Duo code' }), { status: 401 });
    }

    // Generate HMAC-signed session cookie valid for 24 hours
    const timestamp = Date.now();
    const sig = await createSessionSignature(secretBase32, timestamp);
    const sessionToken = `${timestamp}.${sig}`;

    const headers = new Headers({
      'Content-Type': 'application/json',
      'Set-Cookie': `admin_session=${sessionToken}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400; Secure`
    });

    return new Response(JSON.stringify({ success: true, message: 'Authentication successful' }), {
      status: 200,
      headers
    });
  } catch (err: any) {
    console.error('2FA Verification Error:', err);
    return new Response(JSON.stringify({ error: 'Server authentication error' }), { status: 500 });
  }
};

export const DELETE: APIRoute = async () => {
  // Logout / clear session cookie
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Set-Cookie': `admin_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0; Secure`
  });
  return new Response(JSON.stringify({ success: true, message: 'Logged out' }), { status: 200, headers });
};
