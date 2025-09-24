import { create } from 'zustand';
import { User, Professor, MarketHours, NewsEvent, Bet } from '../types';
import { apiService } from '../services/api';

interface AppState {
  // Authentication
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Professors & Voting
  professors: Professor[];
  myProfessors: Professor[];
  topProfessors: Professor[];

  // Market
  marketHours: MarketHours;

  // News & Events
  newsEvents: NewsEvent[];

  // Betting
  studentBalance: number;
  activeBets: Bet[];

  // Actions
  setUser: (user: User | null) => void;
  setAuthenticated: (isAuth: boolean) => void;
  setLoading: (loading: boolean) => void;
  setProfessors: (professors: Professor[]) => void;
  updateProfessorStock: (professorId: string, newStock: number, change: number) => void;
  addNewsEvent: (event: NewsEvent) => void;
  setMarketHours: (marketHours: MarketHours) => void;
  placeBet: (bet: Bet) => void;
  updateBalance: (amount: number) => void;

  // API integration actions
  connectToAPI: () => void;
  disconnectFromAPI: () => void;
  fetchProfessors: () => Promise<void>;
  voteProfessor: (professorId: string, voteType: 'upvote' | 'downvote') => Promise<boolean>;
  fetchMarketStatus: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  isLoading: false,
  professors: [],
  myProfessors: [],
  topProfessors: [],
  marketHours: {
    isOpen: false,
    openTime: '08:00',
    closeTime: '21:00',
  },
  newsEvents: [],
  studentBalance: 1000, // Starting balance
  activeBets: [],

  // Actions
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setLoading: (isLoading) => set({ isLoading }),

  setProfessors: (professors) => {
    const { user } = get();
    const myProfessors = user?.selectedProfessors
      ? professors.filter(prof => user.selectedProfessors.includes(prof.id))
      : [];

    const topProfessors = [...professors]
      .sort((a, b) => b.currentStock - a.currentStock)
      .slice(0, 5);

    set({ professors, myProfessors, topProfessors });
  },

  updateProfessorStock: (professorId, newStock, change) =>
    set((state) => ({
      professors: state.professors.map(prof =>
        prof.id === professorId
          ? {
              ...prof,
              currentStock: newStock,
              dailyChange: change,
              dailyChangePercent: ((change / prof.startingStock) * 100),
              lastUpdated: new Date().toISOString()
            }
          : prof
      ),
    })),

  addNewsEvent: (event) =>
    set((state) => ({
      newsEvents: [event, ...state.newsEvents].slice(0, 50) // Keep last 50 events
    })),

  setMarketHours: (marketHours) => set({ marketHours }),

  placeBet: (bet) =>
    set((state) => ({
      activeBets: [...state.activeBets, bet],
      studentBalance: state.studentBalance - bet.amount
    })),

  updateBalance: (amount) =>
    set((state) => ({
      studentBalance: state.studentBalance + amount
    })),

  // API integration actions
  connectToAPI: () => {
    const socket = apiService.connect();

    // Set up WebSocket event listeners
    apiService.onProfessorsData((professors) => {
      console.log('📊 Received professors data:', professors.length);
      get().setProfessors(professors);
    });

    apiService.onStockUpdate((update) => {
      console.log('📈 Stock update:', update.data);
      get().updateProfessorStock(
        update.data.professorId,
        update.data.newPrice,
        update.data.change
      );
    });

    apiService.onNewsEvent((news) => {
      console.log('📰 News event:', news.data.title);
      get().addNewsEvent(news.data);
    });

    apiService.onMarketStatus((status) => {
      console.log('🏪 Market status:', status.isOpen ? 'OPEN' : 'CLOSED');
      get().setMarketHours(status);
    });

    // Initial data fetch
    get().fetchProfessors();
    get().fetchMarketStatus();
  },

  disconnectFromAPI: () => {
    apiService.disconnect();
  },

  fetchProfessors: async () => {
    try {
      set({ isLoading: true });
      const response = await apiService.getProfessors();
      if (response.success) {
        get().setProfessors(response.data);
      }
    } catch (error) {
      console.error('❌ Failed to fetch professors:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  voteProfessor: async (professorId: string, voteType: 'upvote' | 'downvote') => {
    try {
      const response = await apiService.voteProfessor(professorId, voteType);
      if (response.success) {
        console.log('✅ Vote successful:', response.message);
        // The WebSocket will handle the live update
        return true;
      } else {
        console.error('❌ Vote failed:', response.error);
        return false;
      }
    } catch (error) {
      console.error('❌ Vote error:', error);
      return false;
    }
  },

  fetchMarketStatus: async () => {
    try {
      const response = await apiService.getMarketStatus();
      if (response.success) {
        get().setMarketHours(response.data);
      }
    } catch (error) {
      console.error('❌ Failed to fetch market status:', error);
    }
  },
}));