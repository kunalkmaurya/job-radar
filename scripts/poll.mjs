const botToken = process.env.TELEGRAM_BOT_TOKEN;
const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET || '';
const localWebhookUrl = 'http://localhost:3000/api/telegram-webhook';

if (!botToken) {
  console.error('[Error] TELEGRAM_BOT_TOKEN is not set in .env');
  process.exit(1);
}

console.log('[Poller] Initializing Local Telegram Poller...');

async function init() {
  try {
    const delRes = await fetch(`https://api.telegram.org/bot${botToken}/deleteWebhook`);
    const delData = await delRes.json();
    if (delData.ok) {
      console.log('[Poller] Cleared active webhook to enable local getUpdates polling.');
    }
  } catch (e) {
    console.warn('[Poller] Could not clear webhook:', e.message);
  }
  console.log(`[Poller] Forwarding updates to: ${localWebhookUrl}`);
  loop();
}

let lastUpdateId = 0;

async function pollUpdates() {
  try {
    const url = `https://api.telegram.org/bot${botToken}/getUpdates?offset=${lastUpdateId + 1}&timeout=15`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.ok) {
      console.error('Telegram API error:', data.description);
      return;
    }

    const updates = data.result || [];
    for (const update of updates) {
      lastUpdateId = update.update_id;

      const message = update.channel_post || update.message || update.edited_channel_post;
      if (message && message.text) {
        console.log(
          `\n[Telegram] New message detected [${message.chat.title || message.chat.type}]: "${message.text}"`
        );

        try {
          const webhookRes = await fetch(localWebhookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-telegram-bot-api-secret-token': webhookSecret,
            },
            body: JSON.stringify(update),
          });

          const result = await webhookRes.json();
          console.log('[Webhook] Processed update:', result);
        } catch (forwardErr) {
          console.error('[Error] Failed to forward update to local server:', forwardErr.message);
          console.warn('Is your Next.js server running on http://localhost:3000?');
        }
      }
    }
  } catch (err) {
    console.error('Polling error:', err.message);
  }
}

async function loop() {
  while (true) {
    await pollUpdates();
    await new Promise((r) => setTimeout(r, 1000));
  }
}

init();
