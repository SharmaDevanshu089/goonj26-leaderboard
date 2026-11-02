import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ThemeProvider } from './context/ThemeContext';
import { LeaderboardProvider } from './context/LeaderboardContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <LeaderboardProvider>
        <App />
      </LeaderboardProvider>
    </ThemeProvider>
  </React.StrictMode>
);
