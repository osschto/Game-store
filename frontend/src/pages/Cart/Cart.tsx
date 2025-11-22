import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/stores/useCartStore';
import { useUserStore } from '@/stores/useUserStore';
import './Cart.css';

export const Cart = () => {
  const { t } = useTranslation();
  const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCartStore();
  const currentUser = useUserStore((state) => state.currentUser);

  const handleCheckout = () => {
    if (!currentUser) {
      alert('Please login to checkout');
      return;
    }
    alert('Checkout functionality coming soon!');
  };

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <div className="container">
          <div className="empty-content">
            <span className="empty-icon">🛒</span>
            <h2>{t('cart.empty')}</h2>
            <Link to="/catalog" className="btn btn-primary">
              Browse Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart">
      <div className="container">
        <h1 className="cart-title">{t('cart.title')}</h1>

        <div className="cart-content">
          <div className="cart-items">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.game.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="cart-item"
                >
                  <Link to={`/game/${item.game.id}`} className="cart-item-image">
                    <img
                      src={`https://via.placeholder.com/200x112/1a1f26/3b82f6?text=${encodeURIComponent(item.game.title)}`}
                      alt={item.game.title}
                    />
                  </Link>

                  <div className="cart-item-info">
                    <Link to={`/game/${item.game.id}`} className="cart-item-title">
                      {item.game.title}
                    </Link>
                    <p className="cart-item-description">
                      {item.game.description.substring(0, 100)}...
                    </p>
                  </div>

                  <div className="cart-item-actions">
                    <div className="quantity-control">
                      <button
                        onClick={() => updateQuantity(item.game.id, item.quantity - 1)}
                        className="quantity-btn"
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>
                      <span className="quantity-value">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.game.id, item.quantity + 1)}
                        className="quantity-btn"
                      >
                        +
                      </button>
                    </div>

                    <div className="cart-item-price">
                      ₽{(item.game.price * item.quantity).toFixed(2)}
                    </div>

                    <button
                      onClick={() => removeFromCart(item.game.id)}
                      className="remove-btn"
                      aria-label={t('cart.remove')}
                    >
                      🗑️
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="cart-summary">
            <h3 className="summary-title">{t('cart.summary')}</h3>

            <div className="summary-details">
              <div className="summary-row">
                <span>{t('cart.subtotal')}</span>
                <span>₽{getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>{t('cart.tax')}</span>
                <span>₽0.00</span>
              </div>
              <div className="summary-divider" />
              <div className="summary-row summary-total">
                <span>{t('cart.total')}</span>
                <span>₽{getTotalPrice().toFixed(2)}</span>
              </div>
            </div>

            <button onClick={handleCheckout} className="btn btn-primary btn-full">
              {t('cart.checkout')}
            </button>

            <button onClick={clearCart} className="btn btn-secondary btn-full">
              {t('cart.clear')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
