// Server-side proxy to forward identification payloads to Google Apps Script (or any webhook)
// Avoids browser CORS restrictions and lets us observe real responses
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const targetUrl =
    process.env.SHEETS_WEBHOOK_URL ||
    process.env.ANYTYPE_WEBHOOK_URL || // optional fallback
    '';

  if (!targetUrl) {
    return res.status(500).json({
      error: 'Webhook URL not configured',
      hint: 'Set SHEETS_WEBHOOK_URL in Vercel environment variables',
    });
  }

  try {
    const payload = req.body;

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
      // ignore body read errors
    }

    return res.status(200).json({
      success: ok,
      status: forwardResp.status,
      body: text?.slice(0, 500),
    });
  } catch (error) {
    console.error('forward-webhook error:', error);
    return res.status(500).json({
      error: 'Failed to forward webhook',
      message: error?.message || 'Unknown error',
    });
  }
}

