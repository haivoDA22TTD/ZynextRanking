import type { Game } from '../types/game';

const API_BASE_URL = '/api';

export const gameApi = {
  getAllGames: async (): Promise<Game[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/games`, {
        headers: {
          'Accept': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch games');
      return response.json();
    } catch (error) {
      console.error('Error fetching games:', error);
      throw error;
    }
  },

  getGamesByPlatform: async (platform: string): Promise<Game[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/games?platform=${platform}`, {
        headers: {
          'Accept': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch games');
      return response.json();
    } catch (error) {
      console.error('Error fetching games by platform:', error);
      throw error;
    }
  },

  getGamesByCategory: async (category: string): Promise<Game[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/games?category=${category}`, {
        headers: {
          'Accept': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch games');
      return response.json();
    } catch (error) {
      console.error('Error fetching games by category:', error);
      throw error;
    }
  },
};
