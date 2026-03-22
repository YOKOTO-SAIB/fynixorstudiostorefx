const KEY = 'cxQBTDEaLJ2GSYzNjIO3AETWQyxQc3UzduMbtzvujl5oBNBELkgo3tzV6MfVYgFEq5Z5XOmGO8MVH0uI58wLkz4yN1oaeImDUt7L';
const BASE = 'https://atlantich2h.com';
const EP = {
  create: '/deposit/create',
  status: '/deposit/status',
  cancel: '/deposit/cancel',
  methods: '/deposit/metode'
};

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { action, ...rest } = req.query;
  if (!action || !EP[action]) {
    return res.status(400).json({ status: false, message: 'Invalid action' });
  }

  // Semua params dari query string + api_key
  const params = new URLSearchParams({ api_key: KEY, ...rest });

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
