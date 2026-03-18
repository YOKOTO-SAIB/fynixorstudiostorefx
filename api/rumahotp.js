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

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const action = req.query.action;
  if (!action || !ENDPOINTS[action]) {
    return res.status(400).json({ success: false, message: 'Invalid action' });
  }

  const params = { ...req.query };
  delete params.action;
  const qs = new URLSearchParams(params).toString();
  const target = `${BASE}${ENDPOINTS[action]}${qs ? '?' + qs : ''}`;

  try {
    const r = await fetch(target, {
      headers: { 'x-apikey': API_KEY, 'Accept': 'application/json' }
    });
    const data = await r.json();
    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};
