# 🚀 Netlify Deployment Guide

This guide will help you deploy your OnMyFeed project to Netlify successfully.

## 🔧 **Current Issue**

Your Netlify deployment is failing with "Build script returned non-zero exit code: 2". This is usually caused by incorrect build settings.

## 📋 **Step-by-Step Fix**

### **Step 1: Update Netlify Build Settings**

1. **Go to your Netlify project**: https://app.netlify.com/sites/onmeproject
2. **Click "Project configuration"** (gear icon)
3. **Go to "Build & deploy"** → **"Build settings"**
4. **Update these settings**:
   - **Build command**: `npm run build`
   - **Publish directory**: `build`
   - **Node version**: `18`

### **Step 2: Add Environment Variables**

If your app uses environment variables, add them in:
**Build & deploy** → **Environment variables**

For this project, you might need:
- `REACT_APP_TELEGRAM_BOT_TOKEN` (if using Telegram features)

### **Step 3: Trigger New Deploy**

1. **Go to "Deploys"** tab
2. **Click "Trigger deploy"** → **"Deploy site"**

## 🎯 **Alternative: Fresh Deployment**

If the above doesn't work, try a fresh deployment:

### **Method 1: GitHub Integration**
1. **Delete current site** in Netlify
2. **Create new site**: "Add new site" → "Import an existing project"
3. **Connect GitHub** and select your `OnMe` repository
4. **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `build`
5. **Deploy site**

### **Method 2: Manual Deploy**
1. **Build locally**:
   ```bash
   npm install
   npm run build
   ```
2. **Drag and drop** the `build` folder to Netlify

## 🔍 **Troubleshooting**

### **Common Issues:**

1. **Node version mismatch**
   - Set Node version to 18 in build settings
   - Or use the `netlify.toml` file (already created)

2. **Missing dependencies**
   - Make sure `package.json` has all dependencies
   - Run `npm install` locally to test

3. **Build script errors**
   - Check if `npm run build` works locally
   - Look at build logs for specific errors

4. **Environment variables**
   - Add any required environment variables in Netlify
   - Make sure they're prefixed with `REACT_APP_` for Create React App

### **Check Build Logs:**

1. **Go to "Deploys"** in Netlify
2. **Click on the failed deploy**
3. **Check the build logs** for specific error messages

## 📱 **After Successful Deployment**

1. **Your site will be live** at: `https://onmeproject.netlify.app`
2. **Test all features**:
   - CSV upload functionality
   - Telegram linking (if configured)
   - All pages and navigation

3. **Set up custom domain** (optional):
   - Go to "Domain settings"
   - Add your custom domain

## 🔐 **Security Notes**

- **Telegram bot token**: Make sure it's not exposed in the build
- **Environment variables**: Use Netlify's environment variable system
- **API keys**: Keep sensitive data in environment variables

## 🆘 **Still Having Issues?**

1. **Check build logs** for specific error messages
2. **Test locally**: Run `npm run build` on your computer
3. **Contact Netlify support** if the issue persists

---

**The `netlify.toml` file has been created to help with the deployment configuration.** 