export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }

  const targetUrl = body?.targetUrl || process.env.SHEETS_WEBHOOK_URL || process.env.ANYTYPE_WEBHOOK_URL || '';

  if (!targetUrl) {
    return res.status(500).json({
      error: 'Webhook URL not configured',
      hint: 'Set SHEETS_WEBHOOK_URL or pass targetUrl in body',
    });
  }

  try {
    const { targetUrl: _omit, ...payload } = body || {};

    const forwardResp = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const ok = forwardResp.ok;
    let text = '';
    try {
      text = await forwardResp.text();
    } catch {
    }

    return res.status(200).json({
      success: ok,
      status: forwardResp.status,
      body: text?.slice(0, 500),
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to forward webhook',
      message: error?.message || 'Unknown error',
    });
  }
}
