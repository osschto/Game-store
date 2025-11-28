import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GameList } from '@/components/GameList/GameList';
import { FilterSidebar } from '@/components/FilterSidebar/FilterSidebar';
import { SearchBar } from '@/components/SearchBar/SearchBar';
import { api } from '@/services/api';
import type { Game, Genre, Platform } from '@/types/api';
import './Catalog.css';

export const Catalog = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [allGames, setAllGames] = useState<Game[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);

  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<number | null>(null);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    const genreParam = searchParams.get('genre');
    if (genreParam) {
      setSelectedGenre(Number(genreParam));
    }
  }, [searchParams]);

  useEffect(() => {
    fetchGames();
  }, [searchQuery]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [genresData, platformsData] = await Promise.all([
        api.getGenres(),
        api.getPlatforms(),
      ]);
      setGenres(genresData);
      setPlatforms(platformsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchGames = async () => {
    try {
      setLoading(true);
      let fetchedGames: Game[] = [];

      if (searchQuery) {
        fetchedGames = await api.searchGames(searchQuery);
      } else {
        fetchedGames = await api.getGames();
      }

      setAllGames(fetchedGames);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch games');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredGames = (): Game[] => {
    let filtered = [...allGames];

    if (selectedGenre !== null) {
      filtered = filtered.filter((game) => game.genre_id === selectedGenre);
    }

    if (selectedPlatform !== null) {
      filtered = filtered.filter((game) => game.platform_id === selectedPlatform);
    }

    filtered = filtered.filter(
      (game) => game.price >= minPrice && game.price <= maxPrice
    );

    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.release_date).getTime() - new Date(b.release_date).getTime());
        break;
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
    }

    return filtered;
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      setSearchParams({ search: query });
    } else {
      setSearchParams({});
    }
  };

  const handlePriceChange = (min: number, max: number) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  if (loading) {
    return <div className="loading">{t('common.loading')}</div>;
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={fetchGames} className="btn btn-primary">
          {t('common.retry')}
        </button>
      </div>
    );
  }

  const games = getFilteredGames();

  return (
    <div className="catalog">
      <div className="container">
        <div className="catalog-header">
          <h1>{t('nav.catalog')}</h1>
          <SearchBar onSearch={handleSearch} value={searchQuery} />
        </div>

        <div className="catalog-content">
          <aside className="catalog-sidebar">
            <FilterSidebar
              genres={genres}
              platforms={platforms}
              selectedGenre={selectedGenre}
              selectedPlatform={selectedPlatform}
              minPrice={minPrice}
              maxPrice={maxPrice}
              sortBy={sortBy}
              onGenreChange={setSelectedGenre}
              onPlatformChange={setSelectedPlatform}
              onPriceChange={handlePriceChange}
              onSortChange={setSortBy}
            />
          </aside>

          <main className="catalog-main">
            {games.length > 0 && (
              <div className="catalog-results">
                <p className="results-count">
                  {games.length} {games.length === 1 ? t('common.gameFound') : t('common.gamesFound')}
                </p>
              </div>
            )}
            <GameList games={games} />
          </main>
        </div>
      </div>
    </div>
  );
};