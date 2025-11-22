import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: {
        home: 'Home',
        catalog: 'Catalog',
        cart: 'Cart',
        profile: 'Profile',
      },
      home: {
        hero: 'Discover Amazing Games',
        heroSubtitle: 'Explore thousands of games across all platforms and genres',
        browseCatalog: 'Browse Catalog',
        featured: 'Featured Games',
        newReleases: 'New Releases',
        recommended: 'Recommended for You',
      },
      game: {
        addToCart: 'Add to Cart',
        inCart: 'In Cart',
        buy: 'Buy Now',
        rating: 'Rating',
        price: 'Price',
        releaseDate: 'Release Date',
        developer: 'Developer',
        genre: 'Genre',
        platform: 'Platform',
        description: 'Description',
        reviews: 'Reviews',
        similarGames: 'Similar Games',
      },
      cart: {
      title: 'Shopping Cart',
      empty: 'Your cart is empty',
      summary: 'Order Summary',
      subtotal: 'Subtotal',
      tax: 'Tax',
      total: 'Total',
      checkout: 'Checkout',
      remove: 'Remove',
      quantity: 'Quantity',
      clear: 'Clear Cart'
      },
      filters: {
        search: 'Search games...',
        allGenres: 'All Genres',
        allPlatforms: 'All Platforms',
        priceRange: 'Price Range',
        sortBy: 'Sort By',
        newest: 'Newest',
        oldest: 'Oldest',
        priceAsc: 'Price: Low to High',
        priceDesc: 'Price: High to Low',
        rating: 'Rating',
      },
      profile: {
        title: 'My Profile',
        library: 'My Library',
        orders: 'Order History',
        reviews: 'My Reviews',
        settings: 'Settings',
        logout: 'Logout',
      },
      common: {
        loading: 'Loading...',
        error: 'An error occurred',
        retry: 'Retry',
        cancel: 'Cancel',
        confirm: 'Confirm',
        save: 'Save',
      },
    },
  },
  ru: {
    translation: {
      nav: {
        home: 'Главная',
        catalog: 'Каталог',
        cart: 'Корзина',
        profile: 'Профиль',
      },
      home: {
        hero: 'Откройте Удивительные Игры',
        heroSubtitle: 'Исследуйте тысячи игр на всех платформах и жанрах',
        browseCatalog: 'Перейти в каталог',
        featured: 'Избранные Игры',
        newReleases: 'Новинки',
        recommended: 'Рекомендуем Вам',
      },
      game: {
        addToCart: 'В корзину',
        inCart: 'В корзине',
        buy: 'Купить',
        rating: 'Рейтинг',
        price: 'Цена',
        releaseDate: 'Дата выхода',
        developer: 'Разработчик',
        genre: 'Жанр',
        platform: 'Платформа',
        description: 'Описание',
        reviews: 'Отзывы',
        similarGames: 'Похожие Игры',
      },
      cart: {
      title: 'Корзина',
      empty: 'Ваша корзина пуста',
      summary: 'Детали заказа',
      subtotal: 'Промежуточный итог',
      tax: 'Налог',
      total: 'Итого',
      checkout: 'Оформить заказ',
      remove: 'Удалить',
      quantity: 'Количество',
      clear: 'Очистить корзину'
      },
      filters: {
        search: 'Поиск игр...',
        allGenres: 'Все жанры',
        allPlatforms: 'Все платформы',
        priceRange: 'Диапазон цен',
        sortBy: 'Сортировать',
        newest: 'Новые',
        oldest: 'Старые',
        priceAsc: 'Цена: по возрастанию',
        priceDesc: 'Цена: по убыванию',
        rating: 'Рейтинг',
      },
      profile: {
        title: 'Мой Профиль',
        library: 'Моя Библиотека',
        orders: 'История заказов',
        reviews: 'Мои Отзывы',
        settings: 'Настройки',
        logout: 'Выйти',
      },
      common: {
        loading: 'Загрузка...',
        error: 'Произошла ошибка',
        retry: 'Повторить',
        cancel: 'Отмена',
        confirm: 'Подтвердить',
        save: 'Сохранить',
      },
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
