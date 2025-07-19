# 🚀 GitHub Setup Guide

This guide will help you push your OnMyFeed project to GitHub.

## 📋 Prerequisites

1. **Install Git** (if not already installed)
   - Download from: https://git-scm.com/download/win
   - Install with default settings

2. **Create GitHub Account** (if you don't have one)
   - Go to: https://github.com
   - Sign up for a free account

## 🔧 Step-by-Step Setup

### Step 1: Install Git
1. Download Git for Windows from https://git-scm.com/download/win
2. Run the installer with default settings
3. Restart your terminal/command prompt

### Step 2: Configure Git
Open your terminal and run:
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Step 3: Initialize Git Repository
In your project folder, run:
```bash
git init
git add .
git commit -m "Initial commit: OnMyFeed social media analytics platform"
```

### Step 4: Create GitHub Repository
1. Go to https://github.com
2. Click the "+" icon → "New repository"
3. Repository name: `onmyfeed`
4. Description: `Social Media Analytics Platform with Telegram Integration`
5. Make it **Public** (or Private if you prefer)
6. **Don't** initialize with README (we already have one)
7. Click "Create repository"

### Step 5: Connect and Push
After creating the repository, GitHub will show you commands. Run these:

```bash
git remote add origin https://github.com/YOUR_USERNAME/onmyfeed.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## 🔐 Security Note

**Important**: The `src/config/telegram.js` file contains your bot token and is excluded from Git (in `.gitignore`). 

If you want to share the project, create a template file:
```bash
cp src/config/telegram.js src/config/telegram.example.js
```

Then edit `telegram.example.js` and remove the real token:
```javascript
export const TELEGRAM_CONFIG = {
  BOT_TOKEN: 'YOUR_BOT_TOKEN_HERE',
  BOT_USERNAME: 'your_bot_username',
  API_BASE: 'https://api.telegram.org/bot'
};
```

## 📱 After Setup

### Update README
1. Edit `README.md`
2. Replace `yourusername` with your actual GitHub username
3. Update contact information
4. Commit and push:
```bash
git add README.md
git commit -m "Update README with project information"
git push
```

### Enable GitHub Pages (Optional)
1. Go to your repository on GitHub
2. Settings → Pages
3. Source: Deploy from a branch
4. Branch: main, folder: / (root)
5. Save

## 🎯 Quick Commands Reference

```bash
# Check Git status
git status

# Add all files
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push

# Pull latest changes
git pull

# View commit history
git log --oneline
```

## 🆘 Troubleshooting

### Git not found
- Make sure Git is installed and in your PATH
- Try using Git Bash instead of regular terminal

### Authentication issues
- Use GitHub CLI: `gh auth login`
- Or create a Personal Access Token in GitHub Settings

### Push rejected
- Pull first: `git pull origin main`
- Resolve conflicts if any
- Then push: `git push origin main`

## 🎉 Success!

Once you've completed these steps, your project will be live on GitHub at:
`https://github.com/YOUR_USERNAME/onmyfeed`

You can then:
- Share the repository with others
- Enable GitHub Pages for live demo
- Set up automatic deployment
- Collaborate with other developers

---

**Need help?** Check GitHub's documentation or ask in the issues section of your repository. 