// Shared types for Chalked Backend

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  schoolDomain: string;
  isVerified: boolean;
  verificationToken?: string;
  createdAt: Date;
  updatedAt: Date;
  selectedProfessors: string[]; // Array of professor IDs (max 7)
}

export interface Professor {
  id: string;
  name: string;
  department: string;
  courses: string[];
  currentStock: number;
  startingStock: number;
  dailyChange: number;
  dailyChangePercent: number;
  totalVotes: number;
  upvotes: number;
  downvotes: number;
  lastUpdated: Date;
  createdAt: Date;
}

export interface Vote {
  id: string;
  studentId: string;
  professorId: string;
  voteType: 'upvote' | 'downvote';
  createdAt: Date;
  date: string; // YYYY-MM-DD format for daily tracking
  ipAddress: string;
}

export interface StockHistory {
  id: string;
  professorId: string;
  stockPrice: number;
  timestamp: Date;
  dailyVolume: number;
  changeFromPrevious: number;
}

export interface NewsEvent {
  id: string;
  title: string;
  description: string;
  professorId?: string;
  eventType: 'stock_rise' | 'stock_drop' | 'market_open' | 'market_close' | 'announcement';
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface Bet {
  id: string;
  studentId: string;
  professorId: string;
  betType: 'call' | 'put';
  amount: number;
  targetPrice: number;
  currentPrice: number;
  expiresAt: Date;
  status: 'active' | 'won' | 'lost' | 'expired';
  potentialReturn: number;
  createdAt: Date;
  settledAt?: Date;
}

export interface StudentCurrency {
  studentId: string;
  balance: number;
  totalEarned: number;
  totalSpent: number;
  lastUpdated: Date;
}

export interface MarketHours {
  isOpen: boolean;
  openTime: string; // "08:00"
  closeTime: string; // "21:00"
  timezone: string;
  nextOpenTime?: Date;
}

// API Request/Response types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface VoteRequest {
  professorId: string;
  voteType: 'upvote' | 'downvote';
}

export interface ProfessorSelectionRequest {
  professorIds: string[]; // max 7
}

export interface BetRequest {
  professorId: string;
  betType: 'call' | 'put';
  amount: number;
  targetPrice: number;
  duration: 'daily' | 'weekly'; // for now just daily
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface AuthResponse {
  user: Omit<User, 'passwordHash'>;
  token: string;
}

export interface ProfessorStatsResponse {
  professor: Professor;
  recentHistory: StockHistory[];
  canVote: boolean;
  userVoteToday?: Vote;
}

// WebSocket message types
export interface WSMessage {
  type: 'stock_update' | 'news_event' | 'market_status' | 'bet_result';
  data: any;
  timestamp: Date;
}

export interface StockUpdateMessage extends WSMessage {
  type: 'stock_update';
  data: {
    professorId: string;
    newPrice: number;
    change: number;
    changePercent: number;
    volume: number;
  };
}

export interface NewsEventMessage extends WSMessage {
  type: 'news_event';
  data: NewsEvent;
}