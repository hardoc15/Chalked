# 🎓 Chalked - Professor Stock Market

> **Rate your professors and watch their stocks rise and fall in real-time!**

A gamified professor rating system where students vote on their professors, affecting their "stock" prices in a live market environment. Built with React Native and Node.js.

## 📱 What is Chalked?

Chalked transforms the boring professor rating experience into an engaging stock market game:

- 🏫 **Select Professors**: Choose up to 7 professors you're currently taking
- 📊 **Vote Daily**: Upvote or downvote professors during market hours (8 AM - 9 PM)
- 📈 **Watch Live**: See professor "stock" prices change in real-time
- 🏆 **Leaderboards**: Follow the top 5 professors of the day
- 📰 **Breaking News**: Get alerts when stocks make big moves
- 💰 **Betting System**: Place Call/Put bets on professor performance
- 🎯 **Gamified Experience**: Earn Chalk Coins and climb rankings

## 🏗️ Project Structure

```
Chalked/
├── chalked-mobile/          # React Native mobile app
│   ├── src/
│   │   ├── screens/         # App screens
│   │   ├── navigation/      # Navigation setup
│   │   ├── services/        # API & WebSocket services
│   │   └── stores/          # State management
│   ├── app.json            # Expo configuration
│   └── eas.json            # EAS Build configuration
├── chalked-backend/         # Node.js API server
│   ├── src/
│   │   ├── app.ts           # Express server with Socket.io
│   │   ├── types/           # TypeScript definitions
│   │   └── services/        # Business logic
│   ├── Dockerfile          # Docker configuration
│   └── railway.json        # Railway deployment config
└── DEPLOYMENT_GUIDE.md     # Complete deployment instructions
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Expo CLI: `npm install -g @expo/eas-cli`
- iOS Simulator or Android Emulator

### 1. Clone and Setup
```bash
git clone https://github.com/hardoc15/Chalked.git
cd Chalked
```

### 2. Backend Setup
```bash
cd chalked-backend
npm install
npm run dev
```
Backend runs on `http://localhost:3000`

### 3. Mobile App Setup
```bash
cd chalked-mobile
npm install
npm start
```
Choose your platform: iOS, Android, or Web

## 📊 Features

### 🎯 Core Features
- [x] **Professor Selection**: Choose up to 7 professors
- [x] **Real-time Voting**: Upvote/downvote during market hours
- [x] **Live Stock Updates**: WebSocket-powered real-time prices
- [x] **Market Hours**: 8 AM - 9 PM trading window
- [x] **Top 5 Leaderboard**: Live rankings with medals
- [x] **News Feed**: Auto-generated market news
- [x] **Betting System**: Call/Put betting with Chalk Coins

### 🔧 Technical Features
- [x] **Cross-platform**: iOS, Android, Web
- [x] **Real-time**: WebSocket connections
- [x] **TypeScript**: Full type safety
- [x] **Dark Theme**: Beautiful modern UI
- [x] **State Management**: Zustand for predictable state
- [x] **Navigation**: Smooth tab-based navigation

## 🎮 How It Works

### For Students:
1. **Sign up** with your school email (.edu required)
2. **Select professors** you're currently taking (max 7)
3. **Vote daily** between 8 AM - 9 PM
4. **Watch stocks** rise and fall based on votes
5. **See rankings** and follow top professors
6. **Place bets** on professor performance
7. **Get news alerts** for big stock movements

### Market Mechanics:
- Each professor starts at **$100**
- **Upvote** = Stock goes up $1
- **Downvote** = Stock goes down $1
- **Daily reset** each trading day
- **News events** for 10%+ stock changes
- **Betting payouts** based on accuracy

## 🛠️ Tech Stack

### Mobile App (React Native + Expo)
- **React Native**: Cross-platform mobile development
- **Expo**: Development and deployment platform
- **TypeScript**: Type-safe JavaScript
- **Zustand**: Lightweight state management
- **React Navigation**: Native navigation
- **Socket.io Client**: Real-time connections

### Backend (Node.js)
- **Express.js**: Web framework
- **Socket.io**: WebSocket server
- **TypeScript**: Server-side type safety
- **CORS**: Cross-origin resource sharing
- **Nodemon**: Development auto-restart

### Deployment
- **Railway**: Backend hosting
- **EAS Build**: Mobile app builds
- **App Store**: iOS distribution
- **Google Play**: Android distribution

## 🚀 Deployment

### Backend (Railway)
```bash
cd chalked-backend
# Push to GitHub
git add . && git commit -m "Deploy backend"
git push origin main

# Deploy on Railway
# 1. Connect GitHub repo at railway.app
# 2. Auto-deploys with included railway.json
# 3. Set environment variables
```

### Mobile App (EAS Build)
```bash
cd chalked-mobile
# Install EAS CLI
npm install -g @expo/eas-cli

# Login to Expo
eas login

# Build for production
eas build --platform all --profile production

# Submit to app stores
eas submit --platform all
```

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for complete instructions.

## 📱 Screenshots

*Coming soon - screenshots of the beautiful Chalked interface!*

## 🎯 Roadmap

### Phase 1 (Current)
- [x] Core voting system
- [x] Real-time updates
- [x] Professor leaderboards
- [x] Basic betting system

### Phase 2 (Next)
- [ ] Push notifications
- [ ] Historical stock charts
- [ ] Advanced betting options
- [ ] User achievements

### Phase 3 (Future)
- [ ] Multi-university support
- [ ] Professor response system
- [ ] Advanced analytics
- [ ] Social features

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with ❤️ for students everywhere
- Inspired by the need for better professor feedback
- Thanks to the React Native and Expo communities

---

**Ready to revolutionize professor ratings? Let's get Chalked! 🚀📈**

![Made with TypeScript](https://img.shields.io/badge/Made%20with-TypeScript-blue)
![React Native](https://img.shields.io/badge/React%20Native-20232A?logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-black?logo=socket.io&badgeColor=010101)