import { useTranslation } from 'react-i18next';
import type { Genre, Platform } from '@/types/api';
import './FilterSidebar.css';

interface FilterSidebarProps {
  genres: Genre[];
  platforms: Platform[];
  selectedGenre: number | null;
  selectedPlatform: number | null;
  minPrice: number;
  maxPrice: number;
  sortBy: string;
  onGenreChange: (genreId: number | null) => void;
  onPlatformChange: (platformId: number | null) => void;
  onPriceChange: (min: number, max: number) => void;
  onSortChange: (sortBy: string) => void;
}

export const FilterSidebar = ({
  genres,
  platforms,
  selectedGenre,
  selectedPlatform,
  minPrice,
  maxPrice,
  sortBy,
  onGenreChange,
  onPlatformChange,
  onPriceChange,
  onSortChange,
}: FilterSidebarProps) => {
  const { t } = useTranslation();

  return (
    <div className="filter-sidebar">
      <div className="filter-section">
        <h3 className="filter-title">{t('filters.sortBy')}</h3>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="filter-select"
        >
          <option value="newest">{t('filters.newest')}</option>
          <option value="oldest">{t('filters.oldest')}</option>
          <option value="price-asc">{t('filters.priceAsc')}</option>
          <option value="price-desc">{t('filters.priceDesc')}</option>
          <option value="rating">{t('filters.rating')}</option>
        </select>
      </div>

      <div className="filter-section">
        <h3 className="filter-title">{t('game.genre')}</h3>
        <div className="filter-list">
          <button
            className={`filter-option ${selectedGenre === null ? 'active' : ''}`}
            onClick={() => onGenreChange(null)}
          >
            {t('filters.allGenres')}
          </button>
          {genres.map((genre) => (
            <button
              key={genre.id}
              className={`filter-option ${selectedGenre === genre.id ? 'active' : ''}`}
              onClick={() => onGenreChange(genre.id)}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h3 className="filter-title">{t('game.platform')}</h3>
        <div className="filter-list">
          <button
            className={`filter-option ${selectedPlatform === null ? 'active' : ''}`}
            onClick={() => onPlatformChange(null)}
          >
            {t('filters.allPlatforms')}
          </button>
          {platforms.map((platform) => (
            <button
              key={platform.id}
              className={`filter-option ${selectedPlatform === platform.id ? 'active' : ''}`}
              onClick={() => onPlatformChange(platform.id)}
            >
              {platform.name}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <h3 className="filter-title">{t('filters.priceRange')}</h3>
        <div className="price-inputs">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => onPriceChange(Number(e.target.value), maxPrice)}
            placeholder="Min"
            className="price-input"
            min="0"
          />
          <span className="price-separator">-</span>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => onPriceChange(minPrice, Number(e.target.value))}
            placeholder="Max"
            className="price-input"
            min="0"
          />
        </div>
      </div>
    </div>
  );
};
