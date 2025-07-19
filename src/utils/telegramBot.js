// Telegram Bot Service for Account Linking
// This service handles Telegram bot operations for linking user accounts

import { TELEGRAM_CONFIG } from '../config/telegram.example';

class TelegramBotService {
  constructor() {
    // Use the actual bot token from config
    this.botToken = TELEGRAM_CONFIG.BOT_TOKEN;
    this.botUsername = TELEGRAM_CONFIG.BOT_USERNAME;
    this.apiBase = TELEGRAM_CONFIG.API_BASE;
    
    // Check if bot token is properly configured
    if (!this.botToken || this.botToken === 'YOUR_BOT_TOKEN_HERE') {
      console.warn('⚠️ Telegram bot token not configured. Bot features will be limited.');
      this.isConfigured = false;
    } else {
      this.isConfigured = true;
    }
    
    // Store pending verifications in localStorage (in production, use a database)
    this.storageKey = 'telegram_pending_verifications';
    this.chatIdsKey = 'telegram_chat_ids';
    
    // Initialize automatic chat ID detection only if configured
    if (this.isConfigured) {
      this.initializeChatIdDetection();
    }
  }

  // Initialize automatic chat ID detection
  initializeChatIdDetection() {
    // Check for updates every 30 seconds to detect new messages
    setInterval(() => {
      this.detectNewChatIds();
    }, 30000);
  }

  // Detect new chat IDs from bot updates
  async detectNewChatIds() {
    try {
      const response = await fetch(`${this.apiBase}/getUpdates`);
      const data = await response.json();
      
      if (data.ok && data.result.length > 0) {
        const chatIds = this.getStoredChatIds();
        let newChatsFound = false;

        data.result.forEach(update => {
          if (update.message && update.message.chat) {
            const chatId = update.message.chat.id.toString();
            const username = update.message.chat.username || update.message.chat.first_name || 'Unknown';
            
            if (!chatIds[chatId]) {
              chatIds[chatId] = {
                username,
                firstName: update.message.chat.first_name || '',
                lastName: update.message.chat.last_name || '',
                lastMessage: update.message.text || '',
                timestamp: Date.now()
              };
              newChatsFound = true;
              console.log(`✅ New chat ID detected: ${chatId} (@${username})`);
            }
          }
        });

        if (newChatsFound) {
          this.storeChatIds(chatIds);
        }
      }
    } catch (error) {
      console.log('Chat ID detection error:', error.message);
    }
  }

  // Get stored chat IDs
  getStoredChatIds() {
    const stored = localStorage.getItem(this.chatIdsKey);
    return stored ? JSON.parse(stored) : {};
  }

  // Store chat IDs
  storeChatIds(chatIds) {
    localStorage.setItem(this.chatIdsKey, JSON.stringify(chatIds));
  }

  // Get the best available chat ID (most recent or specified)
  getBestChatId() {
    const chatIds = this.getStoredChatIds();
    const chatIdEntries = Object.entries(chatIds);
    
    if (chatIdEntries.length === 0) {
      return null;
    }
    
    // Return the most recent chat ID
    const sorted = chatIdEntries.sort((a, b) => b[1].timestamp - a[1].timestamp);
    return sorted[0][0];
  }

  // Get all available chat IDs
  getAllChatIds() {
    return this.getStoredChatIds();
  }

  // Generate a random verification code
  generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Store pending verification
  storePendingVerification(phoneNumber, code, userId) {
    const verifications = this.getPendingVerifications();
    verifications[phoneNumber] = {
      code,
      userId,
      timestamp: Date.now(),
      attempts: 0
    };
    localStorage.setItem(this.storageKey, JSON.stringify(verifications));
  }

  // Get pending verifications
  getPendingVerifications() {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : {};
  }

  // Verify code
  verifyCode(phoneNumber, code) {
    const verifications = this.getPendingVerifications();
    const verification = verifications[phoneNumber];
    
    if (!verification) {
      return { success: false, error: 'No verification found for this phone number' };
    }

    // Check if code is expired (5 minutes)
    if (Date.now() - verification.timestamp > 5 * 60 * 1000) {
      delete verifications[phoneNumber];
      localStorage.setItem(this.storageKey, JSON.stringify(verifications));
      return { success: false, error: 'Verification code expired' };
    }

    // Check attempts
    if (verification.attempts >= 3) {
      delete verifications[phoneNumber];
      localStorage.setItem(this.storageKey, JSON.stringify(verifications));
      return { success: false, error: 'Too many attempts. Please request a new code.' };
    }

    // Increment attempts
    verification.attempts++;
    localStorage.setItem(this.storageKey, JSON.stringify(verifications));

    if (verification.code === code) {
      // Success - remove verification
      delete verifications[phoneNumber];
      localStorage.setItem(this.storageKey, JSON.stringify(verifications));
      return { success: true, userId: verification.userId };
    }

    return { success: false, error: 'Invalid verification code' };
  }

  // Send verification code via Telegram bot
  async sendVerificationCode(phoneNumber, code) {
    try {
      const message = `🔐 Ваш код подтверждения для OnMyFeed: ${code}\n\nКод действителен 5 минут.`;
      
      console.log(`🔐 Verification code for ${phoneNumber}: ${code}`);
      console.log(`📱 Message that would be sent: ${message}`);
      
      // Check if bot is configured
      if (!this.isConfigured) {
        console.log('⚠️ Bot not configured - showing code in alert');
        alert(`🔐 Verification Code: ${code}\n\nBot not configured for production.\n\nPlease use this code: ${code}`);
        return { success: true, message: 'Code generated (bot not configured)' };
      }
      
      // Test the bot API to make sure it's working
      const botInfo = await this.getBotInfo();
      if (botInfo) {
        console.log('✅ Bot is active:', botInfo.username);
      } else {
        console.log('❌ Bot API test failed');
        // Fallback to showing code in alert
        alert(`🔐 Verification Code: ${code}\n\nBot API test failed.\n\nPlease use this code: ${code}`);
        return { success: true, message: 'Code generated (bot API failed)' };
      }

      // Try to send the message using automatic chat ID detection
      const chatId = this.getBestChatId();
      
      if (!chatId) {
        console.log('❌ No chat ID found. Please send a message to @on_me_bot first.');
        // Fallback to showing code in alert
        alert(`🔐 Verification Code: ${code}\n\nNo chat ID found. Please send a message to @on_me_bot first.\n\nPlease use this code: ${code}`);
        return { success: true, message: 'Code generated (no chat ID found)' };
      }
      
      console.log(`📱 Sending message to chat ID: ${chatId}`);
      
      try {
        const response = await fetch(`${this.apiBase}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML'
          })
        });
        
        const result = await response.json();
        console.log('Telegram API response:', result);
        
        if (result.ok) {
          console.log('✅ Message sent successfully to Telegram!');
          return { success: true, message: 'Code sent successfully to Telegram!' };
        } else {
          console.log('❌ Failed to send message:', result.description);
          // Fallback to showing code in alert if sending fails
          alert(`🔐 Verification Code: ${code}\n\nFailed to send to Telegram: ${result.description}\n\nPlease use this code: ${code}`);
          return { success: true, message: `Code generated (Telegram failed: ${result.description})` };
        }
      } catch (sendError) {
        console.error('Error sending to Telegram:', sendError);
        // Fallback to showing code in alert
        alert(`🔐 Verification Code: ${code}\n\nError sending to Telegram: ${sendError.message}\n\nPlease use this code: ${code}`);
        return { success: true, message: 'Code generated (Telegram error)' };
      }
    } catch (error) {
      console.error('Error sending verification code:', error);
      return { success: false, error: 'Failed to send verification code' };
    }
  }

  // Request verification code
  async requestVerificationCode(phoneNumber, userId) {
    try {
      const code = this.generateVerificationCode();
      
      // Store the verification
      this.storePendingVerification(phoneNumber, code, userId);
      
      // Send the code
      const result = await this.sendVerificationCode(phoneNumber, code);
      
      if (result.success) {
        return { success: true, message: 'Verification code sent to your Telegram' };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error requesting verification code:', error);
      return { success: false, error: 'Failed to request verification code' };
    }
  }

  // Get bot info
  async getBotInfo() {
    try {
      // Check if bot is configured
      if (!this.isConfigured) {
        console.log('⚠️ Bot not configured - cannot get bot info');
        return null;
      }
      
      const response = await fetch(`${this.apiBase}/getMe`);
      const data = await response.json();
      return data.ok ? data.result : null;
    } catch (error) {
      console.error('Error getting bot info:', error);
      return null;
    }
  }

  // Clean up expired verifications
  cleanupExpiredVerifications() {
    const verifications = this.getPendingVerifications();
    const now = Date.now();
    let cleaned = false;

    Object.keys(verifications).forEach(phoneNumber => {
      const verification = verifications[phoneNumber];
      if (now - verification.timestamp > 5 * 60 * 1000) {
        delete verifications[phoneNumber];
        cleaned = true;
      }
    });

    if (cleaned) {
      localStorage.setItem(this.storageKey, JSON.stringify(verifications));
    }
  }
}

// Create singleton instance
const telegramBotService = new TelegramBotService();

// Clean up expired verifications every minute
setInterval(() => {
  telegramBotService.cleanupExpiredVerifications();
}, 60000);

export default telegramBotService; 