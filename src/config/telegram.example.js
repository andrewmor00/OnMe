// Template configuration file for Telegram bot
// Uses environment variables for production, fallback to placeholder for builds

console.log('🔧 Telegram config loading...');
console.log('🔧 Environment token:', process.env.REACT_APP_TELEGRAM_BOT_TOKEN ? 'Present' : 'Missing');
console.log('🔧 Environment username:', process.env.REACT_APP_TELEGRAM_BOT_USERNAME ? 'Present' : 'Missing');

export const TELEGRAM_CONFIG = {
  BOT_TOKEN: '7982470197:AAFwBRp5pncR1t7yKKm942hhI6LBDFtyU78',
  BOT_USERNAME: 'on_me_bot',
  API_BASE: 'https://api.telegram.org/bot'
}; 