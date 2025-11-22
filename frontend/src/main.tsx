import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './i18n/config';
import './styles/global.css';
import { useThemeStore } from './stores/useThemeStore';

const initTheme = useThemeStore.getState().theme;
document.documentElement.setAttribute('data-theme', initTheme);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
