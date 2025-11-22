import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useCartStore } from '@/stores/useCartStore';
import { GameList } from '@/components/GameList/GameList';
import { api } from '@/services/api';
import type { Game, Genre, Platform, Review } from '@/types/api';
import './GameDetail.css';

export const GameDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();

  const [game, setGame] = useState<Game | null>(null);
  const [genre, setGenre] = useState<Genre | null>(null);
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [similarGames, setSimilarGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { items, addToCart } = useCartStore();
  const isInCart = items.some((item) => item.game.id === Number(id));

  useEffect(() => {
    if (id) {
      loadGameDetails(Number(id));
    }
  }, [id]);

  const loadGameDetails = async (gameId: number) => {
    try {
      setLoading(true);
      const [gameData, allGames, allGenres, allPlatforms, reviewsData] = await Promise.all([
        api.getGameById(gameId),
        api.getGames(),
        api.getGenres(),
        api.getPlatforms(),
        api.getGameReviews(gameId),
      ]);

      setGame(gameData);
      setReviews(reviewsData);

      const gameGenre = allGenres.find((g) => g.id === gameData.genre_id);
      const gamePlatform = allPlatforms.find((p) => p.id === gameData.platform_id);
      setGenre(gameGenre || null);
      setPlatform(gamePlatform || null);

      const similar = allGames
        .filter(
          (g) =>
            g.id !== gameId &&
            (g.genre_id === gameData.genre_id || g.platform_id === gameData.platform_id)
        )
        .slice(0, 4);
      setSimilarGames(similar);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load game');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (game) {
      addToCart(game);
    }
  };

  if (loading) {
    return <div className="loading">{t('common.loading')}</div>;
  }

  if (error || !game) {
    return (
      <div className="error">
        <p>{error || 'Game not found'}</p>
        <Link to="/catalog" className="btn btn-primary">
          Back to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="game-detail">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="game-hero">
            <div className="game-image">
              <img
                src={`https://via.placeholder.com/800x450/1a1f26/3b82f6?text=${encodeURIComponent(game.title)}`}
                alt={game.title}
              />
            </div>

            <div className="game-info">
              <h1 className="game-title">{game.title}</h1>

              <div className="game-meta">
                <div className="meta-item">
                  <span className="meta-label">{t('game.rating')}</span>
                  <div className="rating">
                    <span>⭐</span>
                    <span className="rating-value">{game.rating.toFixed(1)}</span>
                  </div>
                </div>

                <div className="meta-item">
                  <span className="meta-label">{t('game.genre')}</span>
                  <span className="meta-value">{genre?.name || 'N/A'}</span>
                </div>

                <div className="meta-item">
                  <span className="meta-label">{t('game.platform')}</span>
                  <span className="meta-value">{platform?.name || 'N/A'}</span>
                </div>

                <div className="meta-item">
                  <span className="meta-label">{t('game.developer')}</span>
                  <span className="meta-value">{game.developer}</span>
                </div>

                <div className="meta-item">
                  <span className="meta-label">{t('game.releaseDate')}</span>
                  <span className="meta-value">{game.release_date}</span>
                </div>
              </div>

              <div className="game-price-section">
                <span className="game-price">₽{game.price.toFixed(2)}</span>
                <button
                  onClick={handleAddToCart}
                  className={`btn btn-large ${isInCart ? 'btn-secondary' : 'btn-primary'}`}
                  disabled={isInCart}
                >
                  {isInCart ? t('game.inCart') : t('game.addToCart')}
                </button>
              </div>
            </div>
          </div>

          <div className="game-content">
            <section className="content-section">
              <h2>{t('game.description')}</h2>
              <p className="game-description">{game.description}</p>
            </section>

            {reviews.length > 0 && (
              <section className="content-section">
                <h2>{t('game.reviews')} ({reviews.length})</h2>
                <div className="reviews-list">
                  {reviews.map((review, index) => (
                    <div key={index} className="review-card">
                      <div className="review-header">
                        <div className="review-rating">
                          {'⭐'.repeat(review.rating)}
                        </div>
                      </div>
                      <p className="review-comment">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {similarGames.length > 0 && (
              <section className="content-section">
                <GameList games={similarGames} title={t('game.similarGames')} />
              </section>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
