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

  const [games, setGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);

  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<number | null>(null);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterAndSortGames();
  }, [games, selectedGenre, selectedPlatform, minPrice, maxPrice, sortBy, searchQuery]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [gamesData, genresData, platformsData] = await Promise.all([
        api.getGames(),
        api.getGenres(),
        api.getPlatforms(),
      ]);
      setGames(gamesData);
      setGenres(genresData);
      setPlatforms(platformsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortGames = () => {
    let filtered = [...games];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (game) =>
          game.title.toLowerCase().includes(query) ||
          game.description.toLowerCase().includes(query) ||
          game.developer.toLowerCase().includes(query)
      );
    }

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
        filtered.sort(
          (a, b) =>
            new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
        );
        break;
      case 'oldest':
        filtered.sort(
          (a, b) =>
            new Date(a.release_date).getTime() - new Date(b.release_date).getTime()
        );
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

    setFilteredGames(filtered);
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
        <button onClick={loadData} className="btn btn-primary">
          {t('common.retry')}
        </button>
      </div>
    );
  }

  return (
    <div className="catalog">
      <div className="container">
        <div className="catalog-header">
          <h1>{t('nav.catalog')}</h1>
          <SearchBar onSearch={handleSearch} />
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
            <div className="catalog-results">
              <p className="results-count">
                {filteredGames.length} {filteredGames.length === 1 ? 'game' : 'games'} found
              </p>
            </div>
            <GameList games={filteredGames} />
          </main>
        </div>
      </div>
    </div>
  );
};
