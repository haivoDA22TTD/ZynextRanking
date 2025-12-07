const GAMES_API_URL = import.meta.env.DEV
  ? "https://www.freetogame.com/api/games"
  : "/api/games";

// Kiểu dữ liệu cho game
export interface Game {
  id: number;
  title: string;
  thumbnail: string;
  short_description: string;
  game_url: string;
  genre: string;
  platform: string;
  publisher: string;
  developer: string;
  release_date: string;
  freetogame_profile_url: string;
}

// Lấy toàn bộ games
export const getAllGames = async (): Promise<Game[]> => {
  try {
    const res = await fetch(GAMES_API_URL);
    if (!res.ok) throw new Error(`Failed to fetch games: ${res.status} - ${res.statusText}`);
    const data: Game[] = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error; // Giữ lại lỗi để có thể xử lý ở nơi khác
  }
};

// Lấy games theo thể loại
export const getGamesByCategory = async (category: string): Promise<Game[]> => {
  const url = import.meta.env.DEV
    ? `https://www.freetogame.com/api/games?category=${category}`
    : `/api/games?category=${category}`;
  
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch games by category: ${res.status} - ${res.statusText}`);
    const data: Game[] = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error; // Giữ lại lỗi để có thể xử lý ở nơi khác
  }
};

// Lấy games theo nền tảng
export const getGamesByPlatform = async (platform: string): Promise<Game[]> => {
  const url = import.meta.env.DEV
    ? `https://www.freetogame.com/api/games?platform=${platform}`
    : `/api/games?platform=${platform}`;
  
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch games by platform: ${res.status} - ${res.statusText}`);
    const data: Game[] = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error; // Giữ lại lỗi để có thể xử lý ở nơi khác
  }
};
