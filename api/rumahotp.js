// Vercel Edge Function — proxy RumahOTP API
// Harus ada di folder /api/ di root repo

const API_KEY = 'otp_jGUtSJRtECCcPqsr';
const BASE = 'https://www.rumahotp.com/api';

const ENDPOINTS = {
  services:  '/v2/services',
  countries: '/v2/countries',
  operators: '/v2/operators',
  order:     '/v2/orders',
  status:    '/v1/orders/get_status',
  balance:   '/balance',
};

export default async function handler(req) {
  const url = new URL(req.url);
  const action = url.searchParams.get('action');

  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  if (!action || !ENDPOINTS[action]) {
    return new Response(JSON.stringify({ success: false, message: 'Invalid action' }), { status: 400, headers });
  }

  // Build query string tanpa action param
  url.searchParams.delete('action');
  const qs = url.searchParams.toString();
  const targetUrl = `${BASE}${ENDPOINTS[action]}${qs ? '?' + qs : ''}`;

  try {
    const r = await fetch(targetUrl, {
      headers: {
        'x-apikey': API_KEY,
        'Accept': 'application/json',
      }
    });
    const data = await r.json();
    return new Response(JSON.stringify(data), { status: 200, headers });
  } catch (e) {
    return new Response(JSON.stringify({ success: false, message: e.message }), { status: 500, headers });
  }
}

export const config = { runtime: 'edge' };
