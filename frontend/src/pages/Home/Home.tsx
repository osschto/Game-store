import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchBar } from '@/components/SearchBar/SearchBar';
import { api } from '@/services/api';
import type { Game, Genre } from '@/types/api';
import './Home.css';

export const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [games, setGames] = useState<Game[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const genreScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [gamesData, genresData] = await Promise.all([
        api.getGames(),
        api.getGenres(),
      ]);
      setGames(gamesData);

      const genresWithCount = genresData.map(genre => ({
        ...genre,
        gameCount: gamesData.filter(g => g.genre_id === genre.id).length
      }));
      const sortedGenres = genresWithCount.sort((a, b) => b.gameCount - a.gameCount);
      setGenres(sortedGenres);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(query)}`);
    }
  };

  const handleGenreClick = (genreId: number) => {
    navigate(`/catalog?genre=${genreId}`);
  };

  const scrollGenres = (direction: 1 | -1) => {
    if (genreScrollRef.current) {
      const scrollAmount = genreScrollRef.current.offsetWidth * 0.8;
      genreScrollRef.current.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const getMostPurchasedGames = async (): Promise<Game[]> => {
    try {
      const orders = await api.getAllOrders();

      const purchaseCount: Record<number, number> = {};
      orders.forEach(order => {
        purchaseCount[order.game_id] = (purchaseCount[order.game_id] || 0) + 1;
      });

      const sortedGameIds = Object.entries(purchaseCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([id]) => Number(id));

      const featuredGames = sortedGameIds
        .map(id => games.find(g => g.id === id))
        .filter((game): game is Game => game !== undefined);

      if (featuredGames.length < 3) {
        const remainingGames = games
          .filter(g => !featuredGames.find(fg => fg.id === g.id))
          .slice(0, 3 - featuredGames.length);
        return [...featuredGames, ...remainingGames];
      }

      return featuredGames;
    } catch {
      return games.slice(0, 3);
    }
  };

  const [featuredGames, setFeaturedGames] = useState<Game[]>([]);

  useEffect(() => {
    if (games.length > 0) {
      getMostPurchasedGames().then(setFeaturedGames);
    }
  }, [games]);

  const topRatedGames = [...games]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3)
    .filter((game) => game.rating > 0);

  if (loading) {
    return <div className="loading">{t('common.loading')}</div>;
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={loadData} className="btn btn-primary">
          {t('common.retry')}
        </button>
      </div>
    );
  }

  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="hero-content"
          >
            <h1 className="hero-title">{t('home.hero')}</h1>
            <p className="hero-subtitle">{t('home.heroSubtitle')}</p>
            <SearchBar onSearch={handleSearch} />
          </motion.div>
        </div>
      </section>

      {featuredGames.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="section-title">{t('home.featured')}</h2>
            <div className="carousel-container">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="carousel-slide"
                >
                  <Link to={`/game/${featuredGames[currentSlide].id}`} className="featured-card-large">
                    <img
                      src={`/images/games/large/${featuredGames[currentSlide].id}.jpg`}
                      alt={featuredGames[currentSlide].title}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = `https://via.placeholder.com/1200x600/1a1f26/3b82f6?text=${encodeURIComponent(featuredGames[currentSlide].title)}`;
                      }}
                    />
                    <div className="featured-info">
                      <h3>{featuredGames[currentSlide].title}</h3>
                    </div>
                  </Link>
                </motion.div>
              </AnimatePresence>
              <div className="carousel-indicators">
                {featuredGames.slice(0, 3).map((_, index) => (
                  <button
                    key={index}
                    className={`indicator ${currentSlide === index ? 'active' : ''}`}
                    onClick={() => setCurrentSlide(index)}
                    aria-label={`Slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {genres.length > 0 && (
        <section className="section section-genres">
          <div className="container">
            <h2 className="section-title">{t('home.browseByGenre')}</h2>
            <div className="genre-scroll-wrapper">
              <button className="scroll-btn left" onClick={() => scrollGenres(-1)}>
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              <motion.div className="genre-scroll" ref={genreScrollRef}>
                {genres.map((genre) => (
                  <motion.button
                    key={genre.id}
                    className="genre-card-horizontal"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleGenreClick(genre.id)}
                  >
                    <div className="genre-icon">{getGenreIcon(genre.name)}</div>
                    <h3 className="genre-name">{genre.name}</h3>
                    <div className="genre-count">
                      {games.filter((g) => g.genre_id === genre.id).length} {t('home.games')}
                    </div>
                  </motion.button>
                ))}
              </motion.div>

              <button className="scroll-btn right" onClick={() => scrollGenres(1)}>
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </section>
      )}

      {topRatedGames.length > 0 && (
        <section className="section section-top-rated">
          <div className="container">
            <h2 className="section-title">{t('home.topRated')}</h2>
            <div className="top-rated-grid">
              {topRatedGames.map((game) => (
                <Link key={game.id} to={`/game/${game.id}`} className="release-card">
                  <div className="release-image">
                    <img
                      src={`/images/games/small/${game.id}.jpg`}
                      alt={game.title}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = `https://via.placeholder.com/400x225/1a1f26/3b82f6?text=${encodeURIComponent(game.title)}`;
                      }}
                    />
                    <span className="top-rated-badge">{t('home.topRatedBadge')}</span>
                  </div>
                  <div className="release-info">
                    <div className="release-title-rating">
                      <h3 className="release-title">{game.title}</h3>
                      <span className="release-rating">{game.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

function getGenreIcon(genreName: string): string {
  const icons: Record<string, string> = {
    Action: '🎯', Экшен: '🎯',
    Adventure: '🗺️', Приключение: '🗺️',
    RPG: '🏹', РПГ: '🏹',
    Strategy: '🧠', Стратегия: '🧠',
    Simulation: '🎮', Симулятор: '🎮',
    Sports: '⚽', Спорт: '⚽',
    Racing: '🏎️', Гонки: '🏎️',
    Shooter: '🔫', Шутер: '🔫',
    Puzzle: '🧩', Головоломка: '🧩',
    Horror: '👻', Хоррор: '👻',
    Fighting: '🥊', Файтинг: '🥊',
    Platformer: '👾', Платформер: '👾',
    MOBA: '⚔️', МОБА: '⚔️',
    Sandbox: '🧱', Песочница: '🧱',
    Roguelike: '♾️', Рогалик: '♾️',
    ActionRPG: '🎭', 'Ролевой экшен': '🎭'
  };

  for (const [key, icon] of Object.entries(icons)) {
    if (genreName.toLowerCase().includes(key.toLowerCase())) {
      return icon;
    }
  }
  return '🎮';
}