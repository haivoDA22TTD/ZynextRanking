import { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Banner from './components/Banner';
import FilterBar from './components/FilterBar';
import GameCard from './components/GameCard';
import GameModal from './components/GameModal';
import Footer from './components/Footer';
import Loading from './components/Loading';
import { gameApi } from './services/api';
import { addRankingToGames } from './utils/ranking';
import type { Game, GameWithRanking } from './types/game';

function App() {
  const [games, setGames] = useState<GameWithRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : true;
  });
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState<GameWithRanking | null>(null);
  const [selectedGameRank, setSelectedGameRank] = useState<number>(0);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      setLoading(true);
      setError(null);
      const data: Game[] = await gameApi.getAllGames();
      // Thêm ranking score và player stats
      const rankedGames = addRankingToGames(data);
      setGames(rankedGames);
    } catch (err) {
      setError('Không thể tải dữ liệu game. Vui lòng thử lại sau.');
      console.error('Error fetching games:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      const matchesPlatform =
        selectedPlatform === 'all' ||
        game.platform.toLowerCase() === selectedPlatform.toLowerCase() ||
        game.platform.toLowerCase().includes(selectedPlatform.toLowerCase());

      const matchesGenre =
        selectedGenre === 'all' ||
        game.genre.toLowerCase() === selectedGenre.toLowerCase() ||
        game.genre.toLowerCase().includes(selectedGenre.toLowerCase());

      const matchesSearch =
        searchQuery === '' ||
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.short_description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesPlatform && matchesGenre && matchesSearch;
    });
  }, [games, selectedPlatform, selectedGenre, searchQuery]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleGameClick = (game: GameWithRanking, rank: number) => {
    setSelectedGame(game);
    setSelectedGameRank(rank);
  };

  const handleCloseModal = () => {
    setSelectedGame(null);
    setSelectedGameRank(0);
  };

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 text-xl mb-4">{error}</p>
          <button
            onClick={fetchGames}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <main className="container mx-auto px-4 pb-8">
        <Banner games={games} />

        <div className="mt-8">
          <FilterBar
            selectedPlatform={selectedPlatform}
            selectedGenre={selectedGenre}
            onPlatformChange={setSelectedPlatform}
            onGenreChange={setSelectedGenre}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              🏆 Bảng xếp hạng{' '}
              <span className="text-purple-600">
                ({filteredGames.length} games)
              </span>
            </h2>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              💡 Click vào game để xem biểu đồ thống kê
            </div>
          </div>

          {filteredGames.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600 dark:text-gray-400 text-xl">
                Không tìm thấy game nào phù hợp
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredGames.map((game, index) => (
                <GameCard
                  key={game.id}
                  game={game}
                  rank={index + 1}
                  onClick={() => handleGameClick(game, index + 1)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {selectedGame && (
        <GameModal
          game={selectedGame}
          rank={selectedGameRank}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default App;
