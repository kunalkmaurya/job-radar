/**
 * Local Telegram Poller for Development
 * 
 * Fetches updates from Telegram long-polling and forwards them
 * directly to http://localhost:3000/api/telegram-webhook
 * 
 * Usage: node --env-file=.env scripts/poll.mjs
 */

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET || '';
const localWebhookUrl = 'http://localhost:3000/api/telegram-webhook';

if (!botToken) {
  console.error('❌ TELEGRAM_BOT_TOKEN is not set in .env');
  process.exit(1);
}

console.log('🤖 Starting Local Telegram Poller...');
console.log(`Forwarding updates to: ${localWebhookUrl}`);

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
        console.log(`\n📩 New message detected in Telegram [${message.chat.title || message.chat.type}]: "${message.text}"`);

        // Forward update payload to local webhook endpoint
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
          console.log('⚡ Webhook processed update:', result);
        } catch (forwardErr) {
          console.error('❌ Failed to forward update to local Next.js server:', forwardErr.message);
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
    // Short breather between polls
    await new Promise((r) => setTimeout(r, 1000));
  }
}

loop();
