// Vercel Serverless Function — proxy RumahOTP API
// Simpan di folder /api/rumahotp.js di root project

const API_KEY = process.env.RUMAHOTP_API_KEY || 'otp_jGUtSJRtECCcPqsr';
const BASE = 'https://www.rumahotp.com/api';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { action, ...params } = req.query;

  const ENDPOINTS = {
    services:  '/v2/services',
    countries: '/v2/countries',
    operators: '/v2/operators',
    order:     '/v2/orders',
    status:    '/v1/orders/get_status',
    balance:   '/balance',
  };

  if (!action || !ENDPOINTS[action]) {
    return res.status(400).json({ success: false, message: 'Invalid action' });
  }

  const qs = new URLSearchParams(params).toString();
  const url = `${BASE}${ENDPOINTS[action]}${qs ? '?' + qs : ''}`;

  try {
    const r = await fetch(url, {
      headers: { 'x-apikey': API_KEY, 'Accept': 'application/json' }
    });
    const data = await r.json();
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
}