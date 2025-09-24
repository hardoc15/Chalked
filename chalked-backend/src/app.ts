import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { MarketHours, StockUpdateMessage, NewsEventMessage } from './types';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";
const httpServer = createServer(app);

// Initialize Socket.IO with CORS
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Market hours configuration
const MARKET_HOURS: MarketHours = {
  isOpen: false,
  openTime: '08:00',
  closeTime: '21:00',
  timezone: 'America/New_York', // Can be configured per school
};

// Check if market is open
function updateMarketStatus(): void {
  const now = new Date();
  const currentHour = now.getHours();
  const currentTime = `${currentHour.toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  const openHour = parseInt(MARKET_HOURS.openTime.split(':')[0]);
  const closeHour = parseInt(MARKET_HOURS.closeTime.split(':')[0]);

  MARKET_HOURS.isOpen = currentHour >= openHour && currentHour < closeHour;

  if (!MARKET_HOURS.isOpen && currentHour < openHour) {
    // Market opens today
    const nextOpen = new Date();
    nextOpen.setHours(openHour, 0, 0, 0);
    MARKET_HOURS.nextOpenTime = nextOpen;
  } else if (!MARKET_HOURS.isOpen) {
    // Market opens tomorrow
    const nextOpen = new Date();
    nextOpen.setDate(nextOpen.getDate() + 1);
    nextOpen.setHours(openHour, 0, 0, 0);
    MARKET_HOURS.nextOpenTime = nextOpen;
  }
}

// Update market status every minute
updateMarketStatus();
setInterval(updateMarketStatus, 60000);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`📱 Client connected: ${socket.id}`);

  // Send current market status to new client
  socket.emit('market_status', MARKET_HOURS);

  // Send current professor data
  socket.emit('professors_data', MOCK_PROFESSORS);

  socket.on('disconnect', () => {
    console.log(`📱 Client disconnected: ${socket.id}`);
  });

  // Handle client requesting professor data
  socket.on('get_professors', () => {
    socket.emit('professors_data', MOCK_PROFESSORS);
  });

  // Handle client subscribing to specific professor updates
  socket.on('subscribe_professor', (professorId: string) => {
    socket.join(`professor_${professorId}`);
    console.log(`📊 Client ${socket.id} subscribed to professor ${professorId}`);
  });

  socket.on('unsubscribe_professor', (professorId: string) => {
    socket.leave(`professor_${professorId}`);
  });
});

// Broadcast stock update to all connected clients
function broadcastStockUpdate(professorId: string, professor: any) {
  const updateMessage: StockUpdateMessage = {
    type: 'stock_update',
    data: {
      professorId,
      newPrice: professor.currentStock,
      change: professor.dailyChange,
      changePercent: professor.dailyChangePercent,
      volume: professor.totalVotes
    },
    timestamp: new Date()
  };

  // Broadcast to all clients
  io.emit('stock_update', updateMessage);

  // Also send to specific professor room
  io.to(`professor_${professorId}`).emit('professor_update', professor);
}

// Broadcast news event
function broadcastNewsEvent(title: string, description: string, professorId?: string) {
  const newsMessage: NewsEventMessage = {
    type: 'news_event',
    data: {
      id: `news_${Date.now()}`,
      title,
      description,
      professorId,
      eventType: 'announcement',
      createdAt: new Date()
    },
    timestamp: new Date()
  };

  io.emit('news_event', newsMessage);
}

// Basic routes
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    market: MARKET_HOURS
  });
});

app.get('/api/market/status', (req, res) => {
  res.json({
    success: true,
    data: MARKET_HOURS
  });
});

// Mock professors data - in real app this would come from database
const MOCK_PROFESSORS = [
  {
    id: 'prof-1',
    name: 'Dr. Sarah Smith',
    department: 'Computer Science',
    courses: ['CS 101', 'CS 201'],
    currentStock: 95,
    startingStock: 100,
    dailyChange: -5,
    dailyChangePercent: -5.0,
    totalVotes: 23,
    upvotes: 9,
    downvotes: 14,
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01')
  },
  {
    id: 'prof-2',
    name: 'Prof. Michael Johnson',
    department: 'Mathematics',
    courses: ['MATH 201', 'MATH 301'],
    currentStock: 108,
    startingStock: 100,
    dailyChange: 8,
    dailyChangePercent: 8.0,
    totalVotes: 31,
    upvotes: 22,
    downvotes: 9,
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01')
  },
  {
    id: 'prof-3',
    name: 'Dr. Emily Williams',
    department: 'English',
    courses: ['ENG 102', 'ENG 205'],
    currentStock: 102,
    startingStock: 100,
    dailyChange: 2,
    dailyChangePercent: 2.0,
    totalVotes: 18,
    upvotes: 11,
    downvotes: 7,
    lastUpdated: new Date(),
    createdAt: new Date('2024-01-01')
  }
];

// API Routes
app.get('/api/professors', (req, res) => {
  res.json({
    success: true,
    data: MOCK_PROFESSORS
  });
});

app.get('/api/professors/:id', (req, res) => {
  const professor = MOCK_PROFESSORS.find(p => p.id === req.params.id);
  if (!professor) {
    return res.status(404).json({
      success: false,
      error: 'Professor not found'
    });
  }

  res.json({
    success: true,
    data: {
      professor,
      canVote: MARKET_HOURS.isOpen, // In real app, check if user already voted today
      userVoteToday: null // Would check database for user's vote today
    }
  });
});

// Mock voting endpoint
app.post('/api/professors/:id/vote', (req, res) => {
  if (!MARKET_HOURS.isOpen) {
    return res.status(400).json({
      success: false,
      error: 'Market is closed. Voting hours are 8 AM - 9 PM.'
    });
  }

  const { voteType } = req.body;
  if (!voteType || !['upvote', 'downvote'].includes(voteType)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid vote type. Must be "upvote" or "downvote".'
    });
  }

  const professor = MOCK_PROFESSORS.find(p => p.id === req.params.id);
  if (!professor) {
    return res.status(404).json({
      success: false,
      error: 'Professor not found'
    });
  }

  // In real app:
  // 1. Check if user already voted today
  // 2. Store vote in database
  // 3. Update professor stock
  // 4. Broadcast update via WebSocket

  // Mock update for demo
  if (voteType === 'upvote') {
    professor.currentStock += 1;
    professor.upvotes += 1;
    professor.dailyChange += 1;
  } else {
    professor.currentStock -= 1;
    professor.downvotes += 1;
    professor.dailyChange -= 1;
  }

  professor.totalVotes += 1;
  professor.dailyChangePercent = ((professor.currentStock - professor.startingStock) / professor.startingStock) * 100;
  professor.lastUpdated = new Date();

  // Broadcast the stock update to all connected clients
  broadcastStockUpdate(professor.id, professor);

  // Generate news event for significant changes
  const changePercent = Math.abs(professor.dailyChangePercent);
  if (changePercent >= 10) {
    const direction = professor.dailyChangePercent > 0 ? 'up' : 'down';
    const emoji = direction === 'up' ? '📈' : '📉';
    broadcastNewsEvent(
      `${emoji} ${professor.name}'s stock ${direction === 'up' ? 'surges' : 'drops'} ${changePercent.toFixed(1)}%!`,
      `Professor ${professor.name}'s stock has moved ${professor.dailyChangePercent > 0 ? '+' : ''}${professor.dailyChangePercent.toFixed(1)}% today to $${professor.currentStock}`,
      professor.id
    );
  }

  res.json({
    success: true,
    data: {
      vote: {
        id: `vote-${Date.now()}`,
        professorId: professor.id,
        voteType,
        createdAt: new Date()
      },
      professor
    },
    message: `${voteType === 'upvote' ? '👍' : '👎'} Vote recorded! Professor ${professor.name}'s stock is now $${professor.currentStock}`
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

export { app, httpServer, io, PORT };