// Template configuration file for Telegram bot
// Uses environment variables for production, fallback to placeholder for builds

export const TELEGRAM_CONFIG = {
  BOT_TOKEN: process.env.REACT_APP_TELEGRAM_BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE',
  BOT_USERNAME: process.env.REACT_APP_TELEGRAM_BOT_USERNAME || 'on_me_bot',
  API_BASE: 'https://api.telegram.org/bot'
}; 