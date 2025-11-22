# Game Store Frontend

Modern, responsive frontend for the Game Store application built with React, TypeScript, and Vite.

## Features

- **Modern Tech Stack**: React 18, TypeScript, Vite
- **State Management**: Zustand for cart, user, and theme state
- **Internationalization**: i18next (English/Russian)
- **Animations**: Framer Motion for smooth transitions
- **Theme Support**: Dark/Light mode toggle
- **Responsive Design**: Mobile-first approach
- **API Integration**: Full integration with FastAPI backend

## Architecture

### Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Header/          # Navigation header
│   │   ├── GameCard/        # Game display card
│   │   ├── GameList/        # Game grid/list
│   │   ├── FilterSidebar/   # Filter controls
│   │   └── SearchBar/       # Search input
│   ├── pages/               # Route pages
│   │   ├── Home/            # Landing page
│   │   ├── Catalog/         # Game catalog with filters
│   │   ├── GameDetail/      # Individual game page
│   │   ├── Cart/            # Shopping cart
│   │   └── Profile/         # User profile
│   ├── stores/              # Zustand state stores
│   │   ├── useCartStore.ts  # Cart management
│   │   ├── useUserStore.ts  # User authentication
│   │   └── useThemeStore.ts # Theme preferences
│   ├── services/            # API services
│   │   └── api.ts           # Backend API client
│   ├── types/               # TypeScript types
│   │   └── api.ts           # API type definitions
│   ├── i18n/                # Internationalization
│   │   └── config.ts        # i18n configuration
│   ├── styles/              # Global styles
│   │   └── global.css       # CSS variables & utilities
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Application entry point
├── package.json
├── vite.config.ts
└── tsconfig.json
```

### Component Hierarchy

```
App
├── Header (persistent)
└── Routes
    ├── Home
    │   ├── Hero Section
    │   ├── Featured Games
    │   ├── New Releases (GameList)
    │   └── Recommended (GameList)
    ├── Catalog
    │   ├── SearchBar
    │   ├── FilterSidebar
    │   └── GameList
    ├── GameDetail
    │   ├── Game Hero
    │   ├── Game Info
    │   ├── Reviews
    │   └── Similar Games (GameList)
    ├── Cart
    │   ├── Cart Items
    │   └── Order Summary
    └── Profile
        ├── Profile Header
        └── Tabs (Library/Orders/Settings)
```

### State Management

**Zustand Stores:**

1. **CartStore** - Shopping cart with persistence
   - Items, quantities, totals
   - Add/remove/update operations
   - Local storage persistence

2. **UserStore** - User authentication
   - Current user info
   - Login/logout operations
   - Local storage persistence

3. **ThemeStore** - UI theme preferences
   - Light/dark mode
   - Theme toggle
   - Local storage persistence

### API Integration

The `api.ts` service provides methods for all backend endpoints:

- **Games**: `getGames()`, `getGameById()`, `searchGames()`
- **Genres**: `getGenres()`
- **Platforms**: `getPlatforms()`
- **Users**: `getUsers()`, `getUserById()`, `createUser()`
- **Orders**: `createOrder()`, `getUserOrders()`, `deleteOrder()`
- **Reviews**: `createReview()`, `getGameReviews()`

API requests are proxied through Vite dev server to avoid CORS issues.

## Installation

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running on port 8000

### Setup

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   ```

   Edit `.env`:
   ```
   VITE_API_BASE_URL=http://localhost:8000
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests

## Design System

### Color Tokens

**Light Theme:**
- Background: White, light grays
- Text: Dark grays, black
- Accent: Blue (#0d6efd)

**Dark Theme:**
- Background: Dark blues/grays (#0f1419, #1a1f26)
- Text: Light grays, white
- Accent: Bright blue (#3b82f6)

### Spacing System

8px base unit:
- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `2xl`: 48px
- `3xl`: 64px

### Typography

- **Headings**: 600 weight, 1.2 line-height
- **Body**: 400 weight, 1.5 line-height
- **Font**: System font stack for performance

## Key Features Implementation

### 1. Lazy Loading Images
- Uses native `loading="lazy"` attribute
- Placeholder images via placeholder service
- Intersection Observer API for scroll animations

### 2. Theme Toggle
- Zustand store for theme state
- CSS custom properties for colors
- Persisted to localStorage
- Smooth transitions between themes

### 3. Internationalization
- i18next for translations
- English & Russian languages
- Dynamic language switching
- Persistent language preference

### 4. Animations
- Framer Motion for page transitions
- Hover effects on cards
- Smooth state transitions
- Stagger animations for lists

### 5. Search & Filters
- Real-time search in catalog
- Filter by genre, platform, price
- Multiple sort options
- URL persistence for search queries

### 6. Shopping Cart
- Add/remove items
- Quantity management
- Persistent cart state
- Order summary calculations

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimizations

- Code splitting with React.lazy
- Tree shaking with Vite
- Optimized images
- Lazy loading for non-critical content
- Persistent caching with Zustand

## Future Enhancements

- [ ] User authentication with JWT
- [ ] Payment integration
- [ ] Wishlist functionality
- [ ] Game reviews and ratings
- [ ] Advanced search filters
- [ ] User game library
- [ ] Social sharing
- [ ] Email notifications

## Testing

### Unit Tests (Vitest)
```bash
npm run test
```

### E2E Tests (Playwright)
```bash
npm run test:e2e
```

**Test Coverage:**
- Component rendering
- User interactions
- API calls
- State management
- Routing

## Deployment

### Production Build

```bash
npm run build
```

Builds the app to the `dist` folder, optimized for production.

### Environment Variables

Production `.env`:
```
VITE_API_BASE_URL=https://your-api-domain.com
```

### Hosting Options

- **Vercel**: Zero-config deployment
- **Netlify**: Continuous deployment from Git
- **AWS S3 + CloudFront**: Static hosting
- **Docker**: Use provided Dockerfile

## Contributing

1. Follow TypeScript strict mode
2. Use existing component patterns
3. Add proper TypeScript types
4. Follow CSS naming conventions
5. Write tests for new features
6. Update documentation

## License

MIT
