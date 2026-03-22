const KEY = 'cxQBTDEaLJ2GSYzNjIO3AETWQyxQc3UzduMbtzvujl5oBNBELkgo3tzV6MfVYgFEq5Z5XOmGO8MVH0uI58wLkz4yN1oaeImDUt7L';
const BASE = 'https://atlantich2h.com';
const EP = { create:'/deposit/create', status:'/deposit/status', cancel:'/deposit/cancel', methods:'/deposit/metode' };

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const action = req.query.action;
  if (!action || !EP[action]) return res.status(400).json({ status: false, message: 'Invalid action' });

  // Parse body manually from stream
  const rawBody = await new Promise((resolve) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => resolve(data));
  });

  const params = new URLSearchParams(rawBody);
  // Also merge query params (except action)
  Object.entries(req.query).forEach(([k, v]) => { if (k !== 'action') params.set(k, v); });
  params.set('api_key', KEY);

  try {
    const r = await fetch(BASE + EP[action], {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString()
    });
    const text = await r.text();
    try {
      return res.status(200).json(JSON.parse(text));
    } catch {
      return res.status(200).send(text);
    }
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};