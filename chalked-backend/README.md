# Chalked Backend - Professor Stock Market API

A real-time professor rating system with WebSocket-based stock market mechanics.

## Features

- 🔄 **Real-time WebSocket Updates**: Live stock price changes
- 📊 **Professor Stock System**: Upvote/downvote affects stock prices
- ⏰ **Market Hours**: Trading between 8 AM - 9 PM
- 📰 **Auto News Generation**: Events for significant stock movements
- 🏆 **Live Leaderboards**: Real-time professor rankings
- 💰 **Betting System**: Call/Put betting on professor performance

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js with TypeScript
- **Real-time**: Socket.io
- **CORS**: Configurable origins for mobile app

## Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```env
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://your-mobile-app-domain.com
```

## API Endpoints

### Core Routes
- `GET /health` - Server health check
- `GET /api/market/status` - Current market hours
- `GET /api/professors` - List all professors with stock data
- `GET /api/professors/:id` - Individual professor details
- `POST /api/professors/:id/vote` - Vote on professor (upvote/downvote)

### WebSocket Events
- `professors_data` - Initial professor data
- `stock_update` - Real-time stock price changes
- `news_event` - Market news and announcements
- `market_status` - Market open/close status

## Deployment

### Railway (Recommended)

1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on git push

### Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login and create app
heroku login
heroku create chalked-backend

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set CORS_ORIGIN=https://your-app-domain.com

# Deploy
git push heroku main
```

### Docker

```bash
# Build image
docker build -t chalked-backend .

# Run container
docker run -p 3000:3000 -e NODE_ENV=production chalked-backend
```

## Architecture

```
Mobile Apps (React Native)
    ↕️ WebSocket Connection
Express.js API Server
    ↕️ Real-time Events
Professor Stock System
    📊 Vote Processing
    📈 Stock Calculations
    📰 News Generation
```

## Market Mechanics

- **Starting Stock**: Each professor starts at $100
- **Vote Impact**: Upvote = +$1, Downvote = -$1
- **Daily Reset**: Stocks reset each trading day
- **Market Hours**: 8:00 AM - 9:00 PM (configurable timezone)
- **News Events**: Auto-generated for 10%+ stock changes

## Production Considerations

- Set `CORS_ORIGIN` to your mobile app's domain
- Use environment variables for all configuration
- Enable health checks on `/health` endpoint
- Monitor WebSocket connections for scaling
- Consider Redis for session storage (future enhancement)

## License

MIT License - Built for educational purposes