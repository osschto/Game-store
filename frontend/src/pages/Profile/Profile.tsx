import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useUserStore } from '@/stores/useUserStore';
import { api } from '@/services/api';
import type { Order } from '@/types/api';
import './Profile.css';

export const Profile = () => {
  const { t } = useTranslation();
  const { currentUser, logout } = useUserStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'library' | 'orders' | 'settings'>('library');

  useEffect(() => {
    if (currentUser) {
      loadOrders();
    }
  }, [currentUser]);

  const loadOrders = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const data = await api.getUserOrders(currentUser.id);
      setOrders(data);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  if (!currentUser) {
    return (
      <div className="profile-empty">
        <div className="container">
          <div className="empty-content">
            <h2>Please login to view your profile</h2>
            <Link to="/login" className="btn btn-primary">
              Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
            <button
              className={`tab ${activeTab === 'library' ? 'active' : ''}`}
              onClick={() => setActiveTab('library')}
            >
              {t('profile.library')}
            </button>
            <button
              className={`tab ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              {t('profile.orders')}
            </button>
            <button
              className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              {t('profile.settings')}
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'library' && (
              <div className="library-section">
                <h2>{t('profile.library')}</h2>
                <p className="placeholder-text">
                  Your game library will appear here after purchasing games.
                </p>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="orders-section">
                <h2>{t('profile.orders')}</h2>
                {loading ? (
                  <div className="loading">{t('common.loading')}</div>
                ) : orders.length === 0 ? (
                  <p className="placeholder-text">No orders yet</p>
                ) : (
                  <div className="orders-list">
                    {orders.map((order) => (
                      <div key={order.id} className="order-card">
                        <div className="order-info">
                          <span className="order-id">Order #{order.id}</span>
                          <span className="order-game">Game ID: {order.game_id}</span>
                        </div>
                        <div className="order-price">${order.game_price.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="settings-section">
                <h2>{t('profile.settings')}</h2>
                <div className="settings-form">
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      value={currentUser.name}
                      disabled
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={currentUser.email}
                      disabled
                      className="form-input"
                    />
                  </div>
                  <p className="settings-note">
                    Contact support to update your profile information.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
