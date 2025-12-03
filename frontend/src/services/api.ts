import type { Game, Genre, Platform, User, Order, Review, UserAdd, OrderAdd, ReviewAdd } from '@/types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
        throw new Error(error.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async getGames(): Promise<Game[]> {
    return this.request<Game[]>('/games/');
  }

  async getGameById(id: number): Promise<Game> {
    return this.request<Game>(`/games/${id}`);
  }

  async searchGames(keyword: string): Promise<Game[]> {
    return this.request<Game[]>(`/games/search/${keyword}`);
  }

  async getGenres(): Promise<Genre[]> {
    return this.request<Genre[]>('/genres/');
  }

  async getPlatforms(): Promise<Platform[]> {
    return this.request<Platform[]>('/platforms/');
  }

  async getUsers(): Promise<User[]> {
    return this.request<User[]>('/users/');
  }

  async getUserById(id: number): Promise<User> {
    return this.request<User>(`/users/${id}`);
  }

  async register(data: { name: string; email: string; password: string }): Promise<{ access_token: string; token_type: string }> {
    return this.request('/users/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: { name: string; password: string }): Promise<{ access_token: string; token_type: string }> {
    return this.request('/users/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async createUser(user: UserAdd): Promise<{ message: string }> {
    return this.request<{ message: string }>('/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  }

  async getUserLibrary(userId: number): Promise<any[]> {
    return this.request<any[]>(`/users/${userId}/library`);
  }

  async updateUser(userId: number, data: { email: string }): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async createOrder(order: OrderAdd): Promise<{ message: string; game_title: string; game_price: number }> {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    });
  }

  async getAllOrders(): Promise<Order[]> {
    return this.request<Order[]>('/orders/');
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    return this.request<Order[]>(`/orders/${userId}`);
  }

  async deleteOrder(userId: number, gameId: number): Promise<{ message: string }> {
    return this.request(`/orders/${userId}/${gameId}`, {
      method: 'DELETE',
    });
  }

  async createReview(review: ReviewAdd): Promise<{ message: string }> {
    return this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify(review),
    });
  }

  async getGameReviews(gameId: number): Promise<Review[]> {
    return this.request<Review[]>(`/reviews/game/${gameId}`);
  }

  async getAllReviews(): Promise<Review[]> {
    return this.request<Review[]>('/reviews/');
  }
}

export const api = new ApiService();
