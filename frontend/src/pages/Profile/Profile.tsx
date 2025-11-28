import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useUserStore } from '@/stores/useUserStore';
import { useToastStore } from '@/stores/useToastStore';
import { api } from '@/services/api';
import type { Order, Game, Review } from '@/types/api';
import './Profile.css';

export const Profile = () => {
  const { t } = useTranslation();
  const { currentUser, logout, setUser } = useUserStore();
  const { success, error: showError } = useToastStore();

  const [orders, setOrders] = useState<(Order & { gameTitle: string })[]>([]);
  const [libraryGames, setLibraryGames] = useState<Game[]>([]);
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [allGames, setAllGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'library' | 'orders' | 'reviews' | 'settings'>('library');

  const [showEmailEdit, setShowEmailEdit] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser]);

  const loadData = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);

      const games = await api.getGames();
      setAllGames(games);

      await Promise.all([
        loadOrders(games),
        loadLibrary(games),
        loadUserReviews()
      ]);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async (games: Game[]) => {
    if (!currentUser) return;

    try {
      const data = await api.getUserOrders(currentUser.id);

      const ordersWithGames = data.map(order => {
        const game = games.find(g => g.id === order.game_id);
        return {
          ...order,
          gameTitle: game?.title ?? `#${order.game_id}`
        };
      });

      setOrders(ordersWithGames);
    } catch (error) {
      console.error('Failed to load orders:', error);
    }
  };

  const loadLibrary = async (games: Game[]) => {
    if (!currentUser) return;

    try {
      const library = await api.getUserLibrary(currentUser.id);

      const userGames = library
        .map((lib: any) => games.find((game) => game.id === lib.game_id))
        .filter((game): game is Game => game !== undefined);

      setLibraryGames(userGames);
    } catch (error) {
      console.error('Failed to load library:', error);
    }
  };

  const loadUserReviews = async () => {
    if (!currentUser) return;

    try {
      const allReviews = await api.getAllReviews();
      const filtered = allReviews.filter((review) => review.user_id === currentUser.id);
      setUserReviews(filtered);
    } catch (error) {
      console.error('Failed to load reviews:', error);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const handleEmailChange = async () => {
    if (!currentUser || !newEmail) return;

    try {
      await api.updateUser(currentUser.id, { email: newEmail });
      setUser({ ...currentUser, email: newEmail });
      success(t('profile.emailUpdated'));
      setShowEmailEdit(false);
      setNewEmail('');
    } catch (error) {
      showError('Failed to update email');
    }
  };

  if (!currentUser) {
    return (
      <div className="profile-empty">
        <div className="container">
          <div className="empty-content">
            <h2>{t('profile.loginToView')}</h2>
            <Link to="/login" className="btn btn-primary">
              {t('profile.login')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ----------------- JSX ----------------- //
  return (
    <div className="profile">
      <div className="container">
        <div className="profile-header">
          <div className="profile-avatar">
            <span className="avatar-icon">👤</span>
          </div>
          <div className="profile-info">
            <h1>{currentUser.name}</h1>
            <p>{currentUser.email}</p>
          </div>
          <button onClick={handleLogout} className="btn btn-secondary">
            {t('profile.logout')}
          </button>
        </div>

        <div className="profile-content">
          <div className="profile-tabs">
            <button className={`tab ${activeTab === 'library' ? 'active' : ''}`} onClick={() => setActiveTab('library')}>
              {t('profile.library')}
            </button>
            <button className={`tab ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
              {t('profile.orders')}
            </button>
            <button className={`tab ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>
              {t('profile.reviews')}
            </button>
            <button className={`tab ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
              {t('profile.settings')}
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'library' && (
              <div className="library-section">
                <h2>{t('profile.library')}</h2>
                {libraryGames.length === 0 ? (
                  <p className="placeholder-text">{t('profile.libraryEmpty')}</p>
                ) : (
                  <div className="library-grid">
                    {libraryGames.map((game) => (
                      <Link key={game.id} to={`/game/${game.id}`} className="library-game-card">
                        <div className="library-game-image">
                          <img
                            src={`/images/games/small/${game.id}.jpg`}
                            alt={game.title}
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = `https://via.placeholder.com/800x450/1a1f26/3b82f6?text=${encodeURIComponent(game.title)}`;
                            }}
                          />
                        </div>
                        <div className="library-game-info">
                          <h3 className="library-game-title">{game.title}</h3>
                          <div className="library-game-rating">
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="orders-section">
                <h2>{t('profile.orders')}</h2>
                {loading ? (
                  <div className="loading">{t('common.loading')}</div>
                ) : orders.length === 0 ? (
                  <p className="placeholder-text">{t('profile.ordersEmpty')}</p>
                ) : (
                  <div className="orders-list">
                    {orders.map((order) => (
                      <div key={order.id} className="order-card">
                        <div className="order-info">
                          <Link to={`/game/${order.game_id}`} className="order-game">
                            {order.gameTitle}
                          </Link>
                          <span className="order-date">{order.purchase_date}</span>
                        </div>
                        <div className="order-price">₽{order.game_price.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="reviews-section">
                <h2>{t('profile.reviews')}</h2>
                {loading ? (
                  <div className="loading">{t('common.loading')}</div>
                ) : userReviews.length === 0 ? (
                  <p className="placeholder-text">{t('profile.reviewsEmpty')}</p>
                ) : (
                  <div className="reviews-list">
                    {userReviews.map((review) => {
                      const game = allGames.find(g => g.id === review.game_id);
                      return (
                        <div key={review.id} className="review-card">
                          <div className="review-header">
                            <span className="review-game-id">
                              {t('profile.game')}: {game?.title ?? `#${review.game_id}`}
                            </span>
                            <div className="review-rating">
                              {t('profile.reviewRating')}: {'⭐'.repeat(review.rating)}
                            </div>
                          </div>
                          <p className="review-comment">{review.comment}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="settings-section">
                <h2>{t('profile.settings')}</h2>
                <div className="settings-form">
                  <div className="form-group">
                    <label>{t('profile.login')}</label>
                    <input type="text" value={currentUser.name} disabled className="form-input" />
                  </div>

                  <div className="form-group">
                    <label>{t('profile.currentEmail')}</label>
                    {!showEmailEdit ? (
                      <div className="email-display">
                        <input type="email" value={currentUser.email} disabled className="form-input" />
                        <button onClick={() => setShowEmailEdit(true)} className="btn btn-secondary">
                          {t('profile.changeEmail')}
                        </button>
                      </div>
                    ) : (
                      <div className="email-edit">
                        <input
                          type="email"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          placeholder={t('profile.newEmail')}
                          className="form-input"
                        />
                        <div className="email-actions">
                          <button onClick={handleEmailChange} className="btn btn-primary">
                            {t('common.save')}
                          </button>
                          <button
                            onClick={() => {
                              setShowEmailEdit(false);
                              setNewEmail('');
                            }}
                            className="btn btn-secondary"
                          >
                            {t('common.cancel')}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={notifications}
                        onChange={(e) => setNotifications(e.target.checked)}
                        className="form-checkbox"
                      />
                      <span>{t('profile.notifications')}</span>
                    </label>
                    <p className="settings-note">{t('profile.notificationsDesc')}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};