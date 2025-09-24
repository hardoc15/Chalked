# Chalked Mobile - Professor Stock Market App

A React Native mobile app where students rate professors and watch their "stocks" rise and fall in real-time!

## 📱 Features

- **🏫 Professor Selection**: Choose up to 7 professors from your school
- **📊 Real-time Stock Market**: Vote to affect professor stock prices
- **⏰ Market Hours**: Trade between 8 AM - 9 PM
- **🏆 Live Leaderboard**: See top 5 professors updated in real-time
- **📰 News Feed**: Get alerts on big stock movements
- **💰 Betting System**: Place Call/Put bets on professor performance
- **🔄 WebSocket Updates**: Live price updates across all users

## 🛠️ Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **Socket.io** for real-time updates
- **Zustand** for state management
- **React Navigation** for navigation

## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web
npm run web
```

### Building for Production

```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Login to Expo
eas login

# Configure project
eas build:configure

# Build for iOS
eas build --platform ios --profile production

# Build for Android
eas build --platform android --profile production

# Submit to App Store
eas submit --platform ios

# Submit to Google Play
eas submit --platform android
```

## 🎯 App Structure

```
src/
├── components/          # Reusable UI components
├── navigation/          # React Navigation setup
│   ├── AppNavigator.tsx
│   ├── AuthNavigator.tsx
│   └── MainTabNavigator.tsx
├── screens/            # Screen components
│   ├── auth/           # Login, Register, ClassSelection
│   └── main/           # Portfolio, Leaderboard, News, Betting, Profile
├── services/           # API and WebSocket services
│   └── api.ts
├── stores/             # Zustand state management
│   └── appStore.ts
└── types/              # TypeScript type definitions
    └── index.ts
```

## 📱 Screens

### Authentication Flow
1. **Login**: Student email authentication
2. **Register**: Account creation with .edu email
3. **Email Verification**: Verify student email
4. **Professor Selection**: Choose up to 7 professors

### Main App
1. **Portfolio**: Your professors' stocks with voting
2. **Leaderboard**: Top 5 professors ranked by stock price
3. **News**: Live feed of stock movements and market events
4. **Betting**: Place Call/Put bets on professor performance
5. **Profile**: Account settings and stats

## 🔗 API Integration

The app connects to the Chalked backend API:

- **Development**: `http://localhost:3000`
- **Production**: `https://your-backend-url.com`

### Key API Endpoints
- `GET /api/professors` - Get all professors
- `POST /api/professors/:id/vote` - Vote on professor
- `GET /api/market/status` - Market open/close status
- **WebSocket**: Real-time stock updates

## 🎨 Design System

### Colors
- **Primary**: `#00d4aa` (Chalked Green)
- **Background**: `#0f172a` (Dark Blue)
- **Cards**: `#1e293b` (Slate)
- **Text**: `#e2e8f0` (Light Gray)
- **Success**: `#00d4aa` (Green)
- **Error**: `#ef4444` (Red)

### Typography
- **Headings**: Bold, 28px-32px
- **Body**: Regular, 14px-16px
- **Captions**: 12px-14px

## 🚢 Deployment

### Expo Application Services (EAS)

1. **Setup EAS**:
```bash
npm install -g @expo/eas-cli
eas login
```

2. **Configure Build**:
```bash
eas build:configure
```

3. **Build App**:
```bash
# iOS
eas build --platform ios --profile production

# Android
eas build --platform android --profile production
```

4. **Submit to Stores**:
```bash
# App Store
eas submit --platform ios

# Google Play
eas submit --platform android
```

### Over-the-Air Updates

```bash
# Publish update
eas update --branch production --message "Professor stock improvements"
```

## 📊 Analytics & Monitoring

- **Expo Analytics**: Built-in crash reporting
- **Performance**: Monitor WebSocket connections
- **User Engagement**: Track voting and betting activity

## 🔒 Security

- **Email Validation**: Only .edu emails allowed
- **Market Hours**: Server-side voting validation
- **Rate Limiting**: Prevent vote spam
- **WebSocket Security**: Connection authentication

## 🏗️ Future Enhancements

- **Push Notifications**: Market open/close alerts
- **Offline Mode**: Cache data for offline viewing
- **Charts**: Historical stock price graphs
- **Social Features**: Follow other students
- **Advanced Betting**: More complex betting options

## 📄 License

MIT License - Built for educational purposes

---

**Happy Trading! 📈📉**