export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Proxy-only: always use server-configured URL (do not trust client input)
  const targetUrl = process.env.SHEETS_WEBHOOK_URL || '';

  if (!targetUrl) {
    return res.status(500).json({
      error: 'Webhook URL not configured',
      hint: 'Set SHEETS_WEBHOOK_URL in Vercel environment variables',
    });
  }

  // Whitelist allowed hostnames for security
  try {
    const u = new URL(targetUrl);
    const host = u.hostname;
    const allowed = [
      'script.google.com',
      'script.googleusercontent.com',
    ];
    const isAllowed = allowed.some((h) => host === h || host.endsWith(`.${h}`));
    if (!isAllowed) {
      return res.status(403).json({ error: 'Target host not allowed' });
    }
  } catch {
    return res.status(400).json({ error: 'Invalid SHEETS_WEBHOOK_URL' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch { body = {}; }
    }

    // Add idempotency key to prevent duplicate rows
    const idempotencyKey = `${body?.station || 'unknown'}-${body?.timestamp || Date.now()}`;

    const payload = {
      ...body,
      _idempotencyKey: idempotencyKey,
      _serverTimestamp: new Date().toISOString(),
    };

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
