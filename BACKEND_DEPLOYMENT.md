# 🚀 Backend Deployment to Railway

## Quick Start

Your backend is already configured for Railway deployment! Follow these steps:

### 1. Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub account
3. Connect your GitHub account

### 2. Deploy from GitHub

#### Option A: One-Click Deploy
1. Go to https://railway.app/new
2. Click "Deploy from GitHub repo"
3. Select the repository: `hardoc15/Chalked`
4. Railway will auto-detect the Node.js backend in the `chalked-backend` folder

#### Option B: Railway CLI (Alternative)
```bash
npm install -g @railway/cli
railway login
railway link
railway up
```

### 3. Set Environment Variables

In your Railway dashboard, go to your project → Variables tab and add:

```
NODE_ENV=production
PORT=3000
CORS_ORIGIN=*
```

*Note: In production, replace `CORS_ORIGIN=*` with your mobile app's domain for better security.*

### 4. Configure Domain

Railway will automatically assign a domain like:
`https://chalked-backend-production-abc123.up.railway.app`

Copy this URL - you'll need it for the mobile app configuration.

## Backend Features Ready for Production

✅ **Express.js API** with TypeScript
✅ **Socket.io WebSocket Server** for real-time updates
✅ **Health Check Endpoint** at `/health`
✅ **Market Hours Validation** (8 AM - 9 PM)
✅ **Professor Stock System** (+$1/-$1 per vote)
✅ **Automatic News Generation** for significant stock changes
✅ **CORS Configuration** for cross-origin requests
✅ **Railway Configuration** with `railway.json`
✅ **Docker Support** with included Dockerfile

## API Endpoints

### Health Check
```bash
GET /health
# Returns market status and server health
```

### Professor Management
```bash
GET /api/professors
# Get all professors with current stock prices

POST /api/professors/:id/vote
Content-Type: application/json
{
  "voteType": "upvote" | "downvote"
}
# Vote on a professor (market hours only)
```

### Market Status
```bash
GET /api/market/status
# Check if market is currently open
```

### WebSocket Events

The backend broadcasts these real-time events:

- `professors_data` - Initial professor data on connection
- `stock_update` - Live price changes
- `news_event` - Breaking news for significant moves
- `market_status` - Market open/close updates

## Testing Your Deployment

### 1. Health Check
```bash
curl https://your-railway-url.up.railway.app/health
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

### 2. API Test
```bash
# Get professors
curl https://your-railway-url.up.railway.app/api/professors

# Test voting (during market hours)
curl -X POST https://your-railway-url.up.railway.app/api/professors/prof-1/vote \
  -H "Content-Type: application/json" \
  -d '{"voteType":"upvote"}'
```

### 3. WebSocket Test
Use a WebSocket testing tool to connect to:
`wss://your-railway-url.up.railway.app`

You should receive real-time events for stock updates and news.

## Next Steps After Deployment

1. **Copy Railway URL**: Get your deployment URL from Railway dashboard
2. **Update Mobile App**: Replace API URLs in `chalked-mobile/src/services/api.ts`
3. **Test Integration**: Verify mobile app connects to production backend
4. **Monitor Performance**: Use Railway's built-in monitoring

## Production Configuration

The backend includes these production-ready features:

### Security
- CORS protection
- Input validation
- Rate limiting ready (implement as needed)

### Performance
- WebSocket connection management
- Efficient stock calculation
- Auto-scaling ready

### Monitoring
- Health check endpoint
- Error handling
- Logging system

## Troubleshooting

### Common Issues

**"Cannot connect to backend"**
- Verify Railway URL is correct
- Check environment variables are set
- Ensure Railway service is running

**"WebSocket connection failed"**
- Confirm URL uses `wss://` in production
- Check CORS settings
- Verify Socket.io version compatibility

**"Railway build failed"**
- Check build logs in Railway dashboard
- Verify all dependencies are in package.json
- Ensure TypeScript compiles successfully

## Your Backend is Production-Ready! 🎉

Features deployed:
- Real-time professor stock market
- WebSocket broadcasting
- Market hours enforcement
- Automatic news generation
- Production monitoring
- Scalable architecture

Once deployed, update your mobile app's API URLs and you'll have a fully functional Chalked system!