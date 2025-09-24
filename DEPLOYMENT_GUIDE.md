# 🚀 Chalked Deployment Guide

Complete step-by-step guide to deploy your professor stock market app to production!

## 📋 Overview

Chalked consists of two main components:
1. **Backend API** (Node.js + Express + Socket.io)
2. **Mobile App** (React Native + Expo)

## 🔧 Prerequisites

Before deploying, ensure you have:
- [ ] Node.js 18+ installed
- [ ] Git repository set up
- [ ] Expo CLI installed (`npm install -g @expo/eas-cli`)
- [ ] Railway account (or Heroku/Render)
- [ ] Expo account for mobile app builds

---

## 🖥️ Backend Deployment

### Option 1: Railway (Recommended)

Railway provides the easiest deployment with automatic builds from Git.

#### Step 1: Prepare Repository
```bash
cd chalked-backend
git init
git add .
git commit -m "Initial Chalked backend commit"

# Push to GitHub/GitLab
git remote add origin YOUR_REPO_URL
git push -u origin main
```

#### Step 2: Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Sign up/login with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your `chalked-backend` repository
5. Railway will auto-detect Node.js and deploy!

#### Step 3: Configure Environment Variables
In Railway dashboard, go to Variables tab and set:
```
NODE_ENV=production
PORT=3000
CORS_ORIGIN=*
```

#### Step 4: Get Your URL
- Railway will provide a URL like: `https://chalked-backend-production.up.railway.app`
- Save this URL for mobile app configuration

### Option 2: Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login and create app
heroku login
heroku create chalked-backend-prod

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set CORS_ORIGIN=*

# Deploy
git push heroku main

# Your URL: https://chalked-backend-prod.herokuapp.com
```

---

## 📱 Mobile App Deployment

### Step 1: Update API URLs

Edit `src/services/api.ts` with your backend URL:
```typescript
const API_BASE_URL = __DEV__
  ? 'http://localhost:3000'
  : 'https://your-backend-url.up.railway.app'; // Replace with actual URL

const SOCKET_URL = __DEV__
  ? 'http://localhost:3000'
  : 'https://your-backend-url.up.railway.app'; // Replace with actual URL
```

### Step 2: Install EAS CLI

```bash
npm install -g @expo/eas-cli
eas login
```

### Step 3: Configure EAS Build

```bash
cd chalked-mobile
eas build:configure
```

This creates `eas.json` with build configurations.

### Step 4: Build for App Stores

#### iOS Build
```bash
eas build --platform ios --profile production
```

#### Android Build
```bash
eas build --platform android --profile production
```

#### Preview Builds (for testing)
```bash
# iOS TestFlight build
eas build --platform ios --profile preview

# Android APK for internal testing
eas build --platform android --profile preview
```

### Step 5: Submit to App Stores

#### App Store (iOS)
```bash
eas submit --platform ios
```

#### Google Play (Android)
```bash
eas submit --platform android
```

---

## 🔒 Production Checklist

### Backend Security
- [ ] Set `CORS_ORIGIN` to your app's domain
- [ ] Enable rate limiting for API endpoints
- [ ] Set up health check monitoring
- [ ] Configure logging and error tracking
- [ ] Set up SSL/HTTPS (Railway handles this)

### Mobile App
- [ ] Test with production API URLs
- [ ] Verify WebSocket connections work
- [ ] Test on real devices (iOS and Android)
- [ ] Configure app store metadata
- [ ] Set up crash reporting

---

## 🚦 Testing Production

### 1. Backend Health Check
```bash
curl https://your-backend-url.up.railway.app/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "market": {
    "isOpen": true,
    "openTime": "08:00",
    "closeTime": "21:00"
  }
}
```

### 2. API Endpoints Test
```bash
# Get professors
curl https://your-backend-url.up.railway.app/api/professors

# Test voting (during market hours)
curl -X POST https://your-backend-url.up.railway.app/api/professors/prof-1/vote \
  -H "Content-Type: application/json" \
  -d '{"voteType":"upvote"}'
```

### 3. WebSocket Connection
Use a WebSocket testing tool to connect to:
`wss://your-backend-url.up.railway.app`

Expected events:
- `professors_data`
- `stock_update`
- `news_event`
- `market_status`

---

## 📊 Monitoring & Analytics

### Backend Monitoring
- **Railway**: Built-in metrics and logging
- **Heroku**: Heroku Metrics or external tools
- **Health checks**: Monitor `/health` endpoint

### Mobile App Analytics
- **Expo Analytics**: Built-in crash reporting
- **Custom events**: Track voting, betting activity
- **Performance**: Monitor WebSocket connection stability

---

## 🔄 Over-the-Air Updates

For quick updates without app store approval:

```bash
# Install EAS Update
npm install -g @expo/eas-cli

# Publish update
eas update --branch production --message "Fix professor stock calculations"
```

Users will get updates automatically on next app launch.

---

## 🚨 Troubleshooting

### Common Backend Issues

**"Cannot connect to backend"**
- Check backend URL is correct
- Verify CORS settings
- Ensure backend is running

**"WebSocket connection failed"**
- Confirm WebSocket URL matches API URL
- Check for SSL/WSS in production
- Verify Socket.io version compatibility

### Common Mobile App Issues

**"Metro bundler failed"**
```bash
npx expo start --clear
```

**"EAS build failed"**
- Check `app.json` configuration
- Verify all dependencies are installed
- Review build logs for specific errors

**"App crashes on startup"**
- Check API URLs are reachable
- Verify environment configuration
- Review crash logs in Expo dashboard

---

## 🎯 Performance Optimization

### Backend
- Enable gzip compression
- Implement caching for professor data
- Use connection pooling for database (future)
- Monitor WebSocket connection limits

### Mobile App
- Implement lazy loading for screens
- Optimize image assets
- Cache API responses
- Minimize WebSocket message frequency

---

## 🔮 Future Enhancements

Ready for production deployment? Consider these next steps:

- **Database**: Add PostgreSQL for persistent data
- **Authentication**: Implement JWT with proper user sessions
- **Push Notifications**: Market alerts and stock updates
- **Admin Panel**: Manage professors and monitor activity
- **Advanced Analytics**: User behavior tracking
- **Load Balancing**: Handle multiple concurrent users

---

## ✅ Production Deployment Complete!

Your Chalked app is now live! Here's what you've deployed:

🎯 **Backend Features**
- Real-time WebSocket server
- Professor stock market API
- Market hours validation (8 AM - 9 PM)
- Automatic news generation
- Vote processing with live updates

📱 **Mobile App Features**
- Cross-platform iOS/Android app
- Real-time professor stock tracking
- Live leaderboard with rankings
- News feed with market updates
- Betting system interface
- Beautiful dark theme UI

**Your app is ready for real students to start rating professors!** 🎓📈

---

## 📞 Support

Need help with deployment? Check:
- Railway documentation
- Expo EAS documentation
- GitHub issues
- Community forums

**Happy deploying!** 🚀