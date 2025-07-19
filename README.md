<<<<<<< HEAD
# OnMyFeed - Social Media Analytics Platform

A comprehensive React-based web application for social media analytics, blogger management, and account linking with Telegram integration.

## 🚀 Features

### 📊 Analytics Dashboard
- **CSV Data Integration**: Import and manage blogger data from CSV files
- **Real-time Statistics**: View total bloggers, subscribers, and posts
- **Filtering & Sorting**: Advanced search and filter capabilities for blogger data
- **Data Visualization**: Interactive charts and graphs

### 🔗 Social Media Integration
- **Multi-Platform Support**: VK, Telegram, Rutube, Dzen, YouTube
- **Account Linking**: Secure OAuth-style linking with verification codes
- **Telegram Bot Integration**: Real-time verification codes via Telegram bot
- **Profile Management**: Connect and disconnect social accounts

### 👤 User Management
- **Profile System**: User profiles with activity tracking
- **Settings Management**: User preferences and account settings
- **Activity Logging**: Track user actions and connections

### 🎨 Modern UI/UX
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern Interface**: Clean, intuitive user interface
- **Dark/Light Themes**: Customizable appearance
- **Accessibility**: WCAG compliant design

## 🛠️ Technology Stack

- **Frontend**: React 18, React Router, CSS3
- **State Management**: React Context API
- **Data Storage**: LocalStorage, CSV parsing
- **External APIs**: Telegram Bot API
- **Build Tool**: Create React App

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Git

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/onmyfeed.git
   cd onmyfeed
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Telegram Bot** (Optional)
   - Create a Telegram bot via @BotFather
   - Copy your bot token
   - Create `src/config/telegram.js`:
   ```javascript
   export const TELEGRAM_CONFIG = {
     BOT_TOKEN: 'your_bot_token_here',
     BOT_USERNAME: 'your_bot_username',
     API_BASE: 'https://api.telegram.org/bot'
   };
   ```

4. **Start development server**
   ```bash
   npm start
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## 🔧 Configuration

### Telegram Bot Setup
1. Message @BotFather on Telegram
2. Create a new bot with `/newbot`
3. Get your bot token
4. Update `src/config/telegram.js` with your token
5. Start a chat with your bot in Telegram

### CSV Data Import
1. Go to `/csv-manager` in the app
2. Upload your CSV file with blogger data
3. Data will be automatically parsed and stored
4. View analytics in the main dashboard

## 📱 Usage

### Main Dashboard
- View overall statistics and analytics
- Access quick actions and shortcuts
- Monitor connected accounts

### Blogger Management
- Import CSV data with blogger information
- Filter and search through blogger database
- View detailed statistics and metrics

### Account Linking
- Connect social media accounts
- Use Telegram verification for secure linking
- Manage connected accounts and permissions

### Profile Settings
- Update user profile information
- Manage account preferences
- View activity history

## 🔐 Security Features

- **Telegram Verification**: Secure 2FA-style account linking
- **Token Protection**: Bot tokens stored in separate config files
- **Data Privacy**: Local storage with user consent
- **Input Validation**: Comprehensive form validation

## 📊 Data Structure

### CSV Format
```csv
username,platform,subscribers,posts,engagement_rate
john_doe,instagram,50000,150,4.2
jane_smith,youtube,120000,89,3.8
```

### Local Storage
- User preferences and settings
- Connected account tokens
- Analytics data and statistics
- Telegram chat IDs for verification

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to GitHub Pages
1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json:
   ```json
   "homepage": "https://yourusername.github.io/onmyfeed",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build"
   }
   ```
3. Deploy: `npm run deploy`

### Deploy to Netlify/Vercel
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Deploy automatically on push

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: Report bugs via GitHub Issues
- **Documentation**: Check the `/docs` folder for detailed guides
- **Telegram**: Contact @your_bot_username for support

## 🔄 Changelog

### v1.0.0 (Current)
- Initial release
- Core analytics functionality
- Telegram bot integration
- CSV data management
- Social media account linking

## 📞 Contact

- **Developer**: Your Name
- **Email**: your.email@example.com
- **Telegram**: @your_username
- **Website**: https://yourwebsite.com

---

Made with ❤️ using React and modern web technologies.
=======
# OnMe
>>>>>>> 41e453297dd69b2658a8aa6658a79eef7a898087
