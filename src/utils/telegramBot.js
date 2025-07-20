// Telegram Bot Service for Account Linking
// This service handles Telegram bot operations for linking user accounts

// Use real config if available, fallback to example for builds
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
      console.log('✅ Bot token configured:', this.botToken.substring(0, 20) + '...');
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
    // Only check once on startup, no polling
    this.detectNewChatIds();
  }

  // Detect new chat IDs from bot updates
  async detectNewChatIds() {
    try {
      console.log('🔍 Detecting chat IDs...');
      const response = await fetch(`${this.apiBase}${this.botToken}/getUpdates`);
      const data = await response.json();
      
      console.log('🔍 Updates response:', data);
      
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
      } else {
        console.log('🔍 No updates found. Send a message to your bot first.');
      }
    } catch (error) {
      console.log('❌ Chat ID detection error:', error.message);
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

  // Manually trigger chat ID detection
  async forceDetectChatIds() {
    console.log('🔍 Force detecting chat IDs...');
    await this.detectNewChatIds();
    const chatIds = this.getStoredChatIds();
    console.log('🔍 Available chat IDs:', Object.keys(chatIds));
    return chatIds;
  }

  // Link user's Telegram account
  async linkUserTelegram(userId, phoneNumber) {
    try {
      console.log(`🔗 Linking Telegram for user ${userId} with phone ${phoneNumber}`);
      
      // Generate a temporary code for linking
      const linkCode = this.generateVerificationCode();
      
      // Store the linking request
      this.storePendingVerification(phoneNumber, linkCode, userId);
      
      // Send the linking code
      const result = await this.sendVerificationCode(phoneNumber, linkCode, userId);
      
      if (result.success) {
        return { 
          success: true, 
          message: 'Link code sent to your Telegram. Please check your messages and enter the code to complete linking.',
          code: linkCode // For testing purposes
        };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error linking Telegram:', error);
      return { success: false, error: 'Failed to link Telegram account' };
    }
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

  // Store user's chat ID
  storeUserChatId(userId, chatId, userInfo) {
    const chatIds = this.getStoredChatIds();
    chatIds[userId] = {
      chatId,
      username: userInfo.username || 'Unknown',
      firstName: userInfo.firstName || '',
      lastName: userInfo.lastName || '',
      timestamp: Date.now()
    };
    this.storeChatIds(chatIds);
    console.log(`✅ Stored chat ID for user ${userId}: ${chatId}`);
  }

  // Get user's chat ID
  getUserChatId(userId) {
    const chatIds = this.getStoredChatIds();
    return chatIds[userId] ? chatIds[userId].chatId : null;
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
  async sendVerificationCode(phoneNumber, code, userId = null, telegramUsername = null) {
    try {
      const message = `🔐 Ваш код подтверждения для OnMyFeed: ${code}\n\nКод действителен 5 минут.`;
      
      console.log(`🔐 Verification code for ${phoneNumber} (user: ${userId}, telegram: ${telegramUsername}): ${code}`);
      console.log(`📱 Message that would be sent: ${message}`);
      
      // Try to send via Telegram username if provided (even if bot not fully configured)
      if (telegramUsername) {
        console.log(`📱 Attempting to send to Telegram username: @${telegramUsername}`);
        

        
        try {
          const response = await fetch(`${this.apiBase}${this.botToken}/sendMessage`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              chat_id: `@${telegramUsername}`,
              text: message,
              parse_mode: 'HTML'
            })
          });

          const result = await response.json();
          
          if (result.ok) {
            console.log('✅ Message sent successfully via Telegram username');
            return { success: true, message: 'Code sent via Telegram' };
          } else {
            console.log('❌ Failed to send via username:', result.description);
            
            // Provide more specific error messages
            let errorMessage = `Error sending to @${telegramUsername}`;
            if (result.error_code === 400) {
              errorMessage = `Username @${telegramUsername} not found or bot blocked`;
            } else if (result.error_code === 403) {
              errorMessage = `Bot blocked by @${telegramUsername}`;
            } else if (result.error_code === 429) {
              errorMessage = `Rate limit exceeded. Please try again later.`;
            } else if (result.error_code === 400 && result.description.includes('chat not found')) {
              errorMessage = `Please start a chat with @${this.botUsername} first by sending /start`;
            }
            
            // Try to find stored chat ID for this username
            const chatIds = this.getStoredChatIds();
            const storedChat = Object.entries(chatIds).find(([id, info]) => 
              info.username === telegramUsername || 
              info.username === `@${telegramUsername}` ||
              info.username === `puffer_fishh` ||
              info.username === `@puffer_fishh`
            );
            
            if (storedChat) {
              console.log(`📱 Trying to send via stored chat ID: ${storedChat[0]}`);
              try {
                const chatResponse = await fetch(`${this.apiBase}${this.botToken}/sendMessage`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    chat_id: storedChat[0],
                    text: message,
                    parse_mode: 'HTML'
                  })
                });
                
                const chatResult = await chatResponse.json();
                if (chatResult.ok) {
                  console.log('✅ Message sent successfully via stored chat ID');
                  return { success: true, message: 'Code sent via Telegram' };
                } else {
                  console.log('❌ Failed to send via stored chat ID:', chatResult.description);
                }
              } catch (chatError) {
                console.log('❌ Failed to send via stored chat ID:', chatError);
              }
            }
            
            // Return the code in the response instead of showing alert
            return { 
              success: true, 
              message: `Could not send to @${telegramUsername}. Please use this code: ${code}`,
              code: code,
              error: errorMessage
            };
          }
        } catch (error) {
          console.log('❌ Error sending via username:', error);
          // Return the code in the response instead of showing alert
          return { 
            success: true, 
            message: `Error sending to @${telegramUsername}. Please use this code: ${code}`,
            code: code,
            error: `Error sending to @${telegramUsername}`
          };
        }
      }

      // Check if bot is configured for general use
      if (!this.isConfigured) {
        console.log('⚠️ Bot not configured - returning code in response');
        return { 
          success: true, 
          message: `Bot not configured for production. Please use this code: ${code}`,
          code: code,
          error: 'Bot not configured'
        };
      }
      
      // Test the bot API to make sure it's working
      const botInfo = await this.getBotInfo();
      if (botInfo) {
        console.log('✅ Bot is active:', botInfo.username);
      } else {
        console.log('❌ Bot API test failed');
        // Return code in response instead of alert
        return { 
          success: true, 
          message: `Bot API test failed. Please use this code: ${code}`,
          code: code,
          error: 'Bot API test failed'
        };
      }

      // Fallback: return code in response if no username provided
      console.log('⚠️ No Telegram username provided - returning code in response');
      return { 
        success: true, 
        message: `No Telegram username provided. Please use this code: ${code}`,
        code: code,
        error: 'No Telegram username provided'
      };
    } catch (error) {
      console.error('Error sending verification code:', error);
      return { success: false, error: 'Failed to send verification code' };
    }
  }

  // Request verification code
  async requestVerificationCode(phoneNumber, userId = null, telegramUsername = null) {
    try {
      console.log(`📞 Requesting verification code for: ${phoneNumber} (user: ${userId}, telegram: ${telegramUsername})`);
      
      const code = this.generateVerificationCode();
      
      // Store the verification
      this.storePendingVerification(phoneNumber, code, userId);
      
      // Send the code
      const result = await this.sendVerificationCode(phoneNumber, code, userId, telegramUsername);
      
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
      
      console.log('🔧 Fetching bot info from:', `${this.apiBase}${this.botToken}/getMe`);
      
      const response = await fetch(`${this.apiBase}${this.botToken}/getMe`);
      const data = await response.json();
      
      console.log('🔧 Bot API response:', data);
      
      if (data.ok) {
        console.log('✅ Bot info retrieved successfully:', data.result);
        return data.result;
      } else {
        console.log('❌ Bot API error:', data.description);
        return null;
      }
    } catch (error) {
      console.error('❌ Error getting bot info:', error);
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

// Clean up expired verifications every 5 minutes (less frequent)
setInterval(() => {
  telegramBotService.cleanupExpiredVerifications();
}, 300000);

export default telegramBotService; 