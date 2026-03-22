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
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const action = req.query && req.query.action;
  
  if (!action || !EP[action]) {
    return res.status(400).json({ status: false, message: 'Invalid action: ' + action });
  }

  let bodyParams = {};
  if (req.body) {
    if (typeof req.body === 'string') {
      bodyParams = Object.fromEntries(new URLSearchParams(req.body));
    } else if (typeof req.body === 'object') {
      bodyParams = req.body;
    }
  }
  // Also check query params
  if (req.query) {
    Object.keys(req.query).forEach(k => {
      if (k !== 'action') bodyParams[k] = req.query[k];
    });
  }
  
  bodyParams.api_key = KEY;
  
  const body = new URLSearchParams(bodyParams).toString();

  try {
    const response = await fetch(BASE + EP[action], {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body
    });
    const text = await response.text();
    try {
      const data = JSON.parse(text);
      return res.status(200).json(data);
    } catch (e) {
      return res.status(200).send(text);
    }
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};
