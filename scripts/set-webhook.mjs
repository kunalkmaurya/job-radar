const botToken = process.env.TELEGRAM_BOT_TOKEN;
const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET || '';
const baseUrl = (
  process.argv[2] ||
  process.env.NEXT_PUBLIC_APP_URL ||
  'https://jobradar.kunalmaurya.com'
).replace(/\/$/, '');
const webhookUrl = `${baseUrl}/api/telegram-webhook`;

if (!botToken) {
  console.error('[Error] TELEGRAM_BOT_TOKEN is not set in .env');
  process.exit(1);
}

async function setWebhook() {
  const url = `https://api.telegram.org/bot${botToken}/setWebhook?url=${encodeURIComponent(webhookUrl)}&secret_token=${encodeURIComponent(webhookSecret)}`;
  console.log(`[Webhook] Registering webhook to: ${webhookUrl}`);
  const res = await fetch(url);
  const data = await res.json();
  console.log('[Webhook] Response:', data);
}

setWebhook();
