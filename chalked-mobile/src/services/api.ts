import { io, Socket } from 'socket.io-client';

// Use environment-specific URLs
const API_BASE_URL = __DEV__
  ? 'http://localhost:3000'
  : 'https://chalked-backend-production.up.railway.app'; // Will be updated with actual URL

const SOCKET_URL = __DEV__
  ? 'http://localhost:3000'
  : 'https://chalked-backend-production.up.railway.app'; // Will be updated with actual URL

class ApiService {
  private socket: Socket | null = null;

  // REST API methods
  async get(endpoint: string) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API GET error:', error);
      throw error;
    }
  }

  async post(endpoint: string, body: any) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API POST error:', error);
      throw error;
    }
  }

  // Professor-related API calls
  async getProfessors() {
    return this.get('/api/professors');
  }

  async getProfessor(id: string) {
    return this.get(`/api/professors/${id}`);
  }

  async voteProfessor(id: string, voteType: 'upvote' | 'downvote') {
    return this.post(`/api/professors/${id}/vote`, { voteType });
  }

  async getMarketStatus() {
    return this.get('/api/market/status');
  }

  // WebSocket connection methods
  connect() {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      console.log('🔌 Connected to Chalked backend');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('🔌 Disconnected from backend:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('🔌 Connection error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log('🔌 Disconnected from backend');
    }
  }

  // WebSocket event listeners
  onProfessorsData(callback: (professors: any[]) => void) {
    if (this.socket) {
      this.socket.on('professors_data', callback);
    }
  }

  onStockUpdate(callback: (update: any) => void) {
    if (this.socket) {
      this.socket.on('stock_update', callback);
    }
  }

  onNewsEvent(callback: (news: any) => void) {
    if (this.socket) {
      this.socket.on('news_event', callback);
    }
  }

  onMarketStatus(callback: (status: any) => void) {
    if (this.socket) {
      this.socket.on('market_status', callback);
    }
  }

  // WebSocket event emitters
  subscribeToProfessor(professorId: string) {
    if (this.socket) {
      this.socket.emit('subscribe_professor', professorId);
    }
  }

  unsubscribeFromProfessor(professorId: string) {
    if (this.socket) {
      this.socket.emit('unsubscribe_professor', professorId);
    }
  }

  requestProfessors() {
    if (this.socket) {
      this.socket.emit('get_professors');
    }
  }

  // Remove specific event listeners
  offProfessorsData() {
    if (this.socket) {
      this.socket.off('professors_data');
    }
  }

  offStockUpdate() {
    if (this.socket) {
      this.socket.off('stock_update');
    }
  }

  offNewsEvent() {
    if (this.socket) {
      this.socket.off('news_event');
    }
  }

  offMarketStatus() {
    if (this.socket) {
      this.socket.off('market_status');
    }
  }

  // Check connection status
  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

// Create and export a singleton instance
export const apiService = new ApiService();