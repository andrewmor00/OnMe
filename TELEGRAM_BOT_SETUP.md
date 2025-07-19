# Telegram Bot Setup Guide

This guide will help you set up a Telegram bot for account linking in your OnMyFeed application.

## Step 1: Create a Telegram Bot

1. **Open Telegram** and search for `@BotFather`
2. **Start a chat** with BotFather
3. **Send the command**: `/newbot`
4. **Follow the prompts**:
   - Enter a display name for your bot (e.g., "OnMyFeed Linker")
   - Enter a username for your bot (must end with 'bot', e.g., "onmyfeed_linker_bot")
5. **Save the bot token** that BotFather gives you

## Step 2: Configure Environment Variables

Create a `.env` file in your project root and add:

```env
REACT_APP_TELEGRAM_BOT_TOKEN=your_bot_token_here
REACT_APP_TELEGRAM_BOT_USERNAME=your_bot_username_here
```

Replace:
- `your_bot_token_here` with the token from BotFather
- `your_bot_username_here` with your bot's username (without @)

## Step 3: Update Bot Configuration

1. **Set bot commands** (optional):
   ```
   /setcommands
   start - Start the bot
   help - Get help
   link - Link your account
   ```

2. **Set bot description** (optional):
   ```
   /setdescription
   OnMyFeed account linking bot. Use this bot to link your Telegram account to OnMyFeed.
   ```

## Step 4: Test Your Bot

1. **Start your React app**: `npm start`
2. **Go to your profile page**
3. **Click "Link" on Telegram**
4. **Enter your phone number**
5. **Check your Telegram** for the verification code

## Step 5: Production Setup

For production, you'll need to:

1. **Set up a webhook** or polling mechanism to receive messages
2. **Store user chat IDs** in a database
3. **Implement proper error handling**
4. **Add rate limiting**
5. **Set up SSL for webhooks**

## Current Implementation

The current implementation includes:

### Features:
- ✅ Phone number validation
- ✅ 6-digit verification codes
- ✅ 5-minute code expiration
- ✅ 3 attempts limit
- ✅ Resend functionality
- ✅ Modern UI with animations
- ✅ Mobile responsive design

### Security:
- ✅ Code expiration
- ✅ Attempt limiting
- ✅ Secure token storage
- ✅ Input validation

### User Experience:
- ✅ Step-by-step process
- ✅ Clear error messages
- ✅ Loading states
- ✅ Success feedback
- ✅ Countdown timer

## File Structure

```
src/
├── utils/
│   └── telegramBot.js          # Bot service logic
├── components/
│   ├── TelegramLinkModal.jsx   # Modal component
│   └── TelegramLinkModal.css   # Modal styles
└── pages/
    └── Profile.jsx             # Updated with modal integration
```

## API Endpoints Used

- `getMe` - Get bot information
- `sendMessage` - Send verification codes (implemented in production)

## Testing

To test without a real bot:

1. The current implementation logs codes to console
2. Check browser console for verification codes
3. Use any 6-digit code for testing

## Next Steps

1. **Create your bot** using BotFather
2. **Add environment variables**
3. **Test the integration**
4. **Deploy to production**

## Troubleshooting

### Common Issues:

1. **Bot not responding**: Check if bot token is correct
2. **Codes not received**: Ensure bot is started in Telegram
3. **Modal not opening**: Check console for errors
4. **Environment variables not loading**: Restart development server

### Debug Mode:

Check browser console for:
- Bot token validation
- Code generation
- Verification attempts
- Error messages

## Security Notes

- Never commit bot tokens to version control
- Use environment variables for sensitive data
- Implement rate limiting in production
- Add proper logging and monitoring
- Consider using webhooks for better security

## Support

If you need help:
1. Check the console for error messages
2. Verify your bot token is correct
3. Ensure your bot is active in Telegram
4. Test with the sample data first 