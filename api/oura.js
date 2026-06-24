export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const token = process.env.OURA_TOKEN;
  if (!token) return res.status(500).json({ error: 'OURA_TOKEN not configured on server' });

  const { endpoint, start_date, end_date } = req.query;
  if (!endpoint) return res.status(400).json({ error: 'Missing endpoint' });

  const allowed = ['daily_cycle_phases', 'daily_readiness', 'daily_sleep'];
  if (!allowed.includes(endpoint)) {
    return res.status(400).json({ error: 'Endpoint not allowed' });
  }

  const params = new URLSearchParams({ start_date, end_date });
  const ouraUrl = `https://api.ouraring.com/v2/usercollection/${endpoint}?${params}`;

  try {
    const ouraRes = await fetch(ouraUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await ouraRes.json();
    return res.status(ouraRes.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Proxy fetch failed', detail: err.message });
  }
}
