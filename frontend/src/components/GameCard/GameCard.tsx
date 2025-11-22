import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTranslation } from 'react-i18next';
import { useCartStore } from '@/stores/useCartStore';
import type { Game } from '@/types/api';
import './GameCard.css';

interface GameCardProps {
  game: Game;
}

export const GameCard = ({ game }: GameCardProps) => {
  const { t } = useTranslation();
  const { items, addToCart } = useCartStore();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const isInCart = items.some((item) => item.game.id === game.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(game);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
    >
      <Link to={`/game/${game.id}`} className="game-card">
        <div className="game-card-image">
          <img
            src={`https://via.placeholder.com/400x225/1a1f26/3b82f6?text=${encodeURIComponent(game.title)}`}
            alt={game.title}
            loading="lazy"
          />
          <div className="game-card-overlay">
            <button
              onClick={handleAddToCart}
              className={`btn ${isInCart ? 'btn-secondary' : 'btn-primary'}`}
              disabled={isInCart}
            >
              {isInCart ? t('game.inCart') : t('game.addToCart')}
            </button>
          </div>
        </div>

        <div className="game-card-content">
          <div className="game-card-header">
            <h3 className="game-card-title">{game.title}</h3>
            <div className="game-card-rating">
              <span className="rating-icon">⭐</span>
              <span className="rating-value">{game.rating.toFixed(1)}</span>
            </div>
          </div>

          <p className="game-card-description">
            {game.description.length > 100
              ? `${game.description.substring(0, 100)}...`
              : game.description}
          </p>

          <div className="game-card-footer">
            <span className="game-card-price">₽{game.price.toFixed(2)}</span>
            <span className="game-card-date">{game.release_date}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
