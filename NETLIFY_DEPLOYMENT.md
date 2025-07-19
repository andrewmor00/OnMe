# Netlify Deployment Guide

## 🚀 Deployment Steps

### 1. Connect to GitHub
1. Go to [Netlify](https://netlify.com)
2. Click "New site from Git"
3. Choose GitHub and authorize Netlify
4. Select your repository: `andrewmor00/OnMe`

### 2. Configure Build Settings
Netlify will automatically detect the build settings from your `netlify.toml` file:
- **Build command**: `npm run build`
- **Publish directory**: `build`
- **Node version**: 18.17.0

### 3. Set Environment Variables
In your Netlify dashboard, go to **Site settings > Environment variables** and add:

```
REACT_APP_TELEGRAM_BOT_TOKEN=your_bot_token_here
REACT_APP_TELEGRAM_BOT_USERNAME=on_me_bot
```

**To get your bot token:**
1. Open Telegram and search for `@BotFather`
2. Send `/newbot` to create a new bot
3. Follow the instructions to set up your bot
4. Copy the token provided by BotFather

### 4. Deploy
1. Click "Deploy site"
2. Netlify will automatically build and deploy your site
3. Your site will be available at a Netlify subdomain (e.g., `https://your-site-name.netlify.app`)

## 🔧 Environment Variables

### Required Variables
- `REACT_APP_TELEGRAM_BOT_TOKEN`: Your Telegram bot token from @BotFather
- `REACT_APP_TELEGRAM_BOT_USERNAME`: Your bot username (without @)

### Optional Variables
- `REACT_APP_HOMEPAGE`: Your site's homepage URL (for production builds)

## 📱 Telegram Bot Setup

### 1. Create Bot
1. Message `@BotFather` on Telegram
2. Send `/newbot`
3. Choose a name for your bot
4. Choose a username (must end in 'bot')
5. Save the token provided

### 2. Configure Bot
1. Send `/setcommands` to @BotFather
2. Add these commands:
```
start - Start the bot
help - Get help
```

### 3. Test Bot
1. Search for your bot username on Telegram
2. Send `/start`
3. The bot should respond

## 🔍 Troubleshooting

### Build Issues
- Check that all environment variables are set correctly
- Ensure Node.js version is 18.17.0 or higher
- Check the build logs in Netlify dashboard

### Telegram Bot Issues
- Verify the bot token is correct
- Make sure the bot username matches exactly
- Test the bot manually on Telegram first

### Runtime Issues
- Check browser console for errors
- Verify environment variables are accessible in the browser
- Test the Telegram integration using the test component

## 📊 Monitoring

### Netlify Analytics
- Enable analytics in your Netlify dashboard
- Monitor site performance and user behavior

### Error Tracking
- Check Netlify function logs for server-side errors
- Monitor browser console for client-side errors

## 🔄 Continuous Deployment

Your site will automatically redeploy when you push changes to the `main` branch of your GitHub repository.

### Manual Deploy
To trigger a manual deploy:
1. Go to your Netlify dashboard
2. Click "Deploys"
3. Click "Trigger deploy"

## 🌐 Custom Domain

To use a custom domain:
1. Go to **Domain settings** in your Netlify dashboard
2. Click "Add custom domain"
3. Follow the DNS configuration instructions

## 📝 Notes

- The build process creates optimized production files
- All Telegram bot functionality is client-side
- Environment variables are embedded in the build
- The site is fully static and can be served from any CDN 