// Core Types for Chalked App

export interface User {
  id: string;
  email: string;
  schoolDomain: string;
  isVerified: boolean;
  createdAt: string;
  selectedProfessors: string[]; // Array of professor IDs (max 7)
}

export interface Professor {
  id: string;
  name: string;
  department: string;
  classes: string[];
  currentStock: number;
  startingStock: number;
  dailyChange: number;
  dailyChangePercent: number;
  totalVotes: number;
  upvotes: number;
  downvotes: number;
  lastUpdated: string;
}

export interface Vote {
  id: string;
  studentId: string;
  professorId: string;
  voteType: 'upvote' | 'downvote';
  createdAt: string;
  date: string;
}

export interface StockData {
  timestamp: string;
  price: number;
  volume: number;
}

export interface NewsEvent {
  id: string;
  title: string;
  description: string;
  professorId?: string;
  eventType: 'stock_rise' | 'stock_drop' | 'market_open' | 'market_close' | 'announcement';
  createdAt: string;
}

export interface Bet {
  id: string;
  studentId: string;
  professorId: string;
  betType: 'call' | 'put';
  amount: number;
  targetPrice: number;
  currentPrice: number;
  expiresAt: string;
  status: 'active' | 'won' | 'lost' | 'expired';
  potentialReturn: number;
}

export interface MarketHours {
  isOpen: boolean;
  openTime: string; // "08:00"
  closeTime: string; // "21:00"
  nextOpenTime?: string;
}

// Navigation Types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  EmailVerification: { email: string };
  ClassSelection: undefined;
};

export type MainTabParamList = {
  Portfolio: undefined;
  Leaderboard: undefined;
  News: undefined;
  Betting: undefined;
  Profile: undefined;
};

export type PortfolioStackParamList = {
  ProfessorList: undefined;
  ProfessorDetail: { professorId: string };
};