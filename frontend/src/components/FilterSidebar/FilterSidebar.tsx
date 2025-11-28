import { useState } from 'react';
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
  const [range, setRange] = useState({ min: minPrice, max: maxPrice });
  const [sortOpen, setSortOpen] = useState(false);

  const sortOptions = [
    { value: 'newest', label: t('filters.newest') },
    { value: 'oldest', label: t('filters.oldest') },
    { value: 'price-asc', label: t('filters.priceAsc') },
    { value: 'price-desc', label: t('filters.priceDesc') },
    { value: 'rating', label: t('filters.rating') },
  ];

  const handleMinChange = (value: number) => {
    const newMin = Math.min(value, range.max);
    setRange({ ...range, min: newMin });
    onPriceChange(newMin, range.max);
  };

  const handleMaxChange = (value: number) => {
    const newMax = Math.max(value, range.min);
    setRange({ ...range, max: newMax });
    onPriceChange(range.min, newMax);
  };

  return (
    <div className="filter-sidebar">
      <div className="filter-section">
        <h3 className="filter-title">{t('filters.sortBy')}</h3>
        <div className="custom-dropdown">
          <button
            className={`dropdown-toggle ${sortOpen ? 'open' : ''}`}
            onClick={() => setSortOpen(!sortOpen)}
          >
            {sortOptions.find((o) => o.value === sortBy)?.label || t('filters.newest')}
            <span className="arrow" />
          </button>
          {sortOpen && (
            <ul className="dropdown-menu">
              {sortOptions.map((option) => (
                <li
                  key={option.value}
                  className={`dropdown-item ${sortBy === option.value ? 'active' : ''}`}
                  onClick={() => {
                    onSortChange(option.value);
                    setSortOpen(false);
                  }}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          )}
        </div>
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
        <div className="range-slider-container">
          <div className="slider">
            <input
              type="range"
              min={0}
              max={10000}
              value={range.min}
              onChange={(e) => handleMinChange(Number(e.target.value))}
              className="thumb thumb-left"
            />
            <input
              type="range"
              min={0}
              max={10000}
              value={range.max}
              onChange={(e) => handleMaxChange(Number(e.target.value))}
              className="thumb thumb-right"
            />
            <div
              className="slider-track"
              style={{
                left: `${(range.min / 10000) * 100}%`,
                right: `${100 - (range.max / 10000) * 100}%`,
              }}
            />
          </div>

          <div className="manual-price-inputs">
            <input
              type="number"
              value={range.min}
              min={0}
              max={range.max}
              onChange={(e) => handleMinChange(Number(e.target.value))}
              className="manual-price-input"
              placeholder="Min"
            />
            <span className="manual-price-separator">-</span>
            <input
              type="number"
              value={range.max}
              min={range.min}
              max={10000}
              onChange={(e) => handleMaxChange(Number(e.target.value))}
              className="manual-price-input"
              placeholder="Max"
            />
          </div>
        </div>
      </div>
    </div>
  );
};