import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const toggle = () => setDarkMode(prev => !prev);

  const theme = {
    darkMode,
    toggle,
    bg: darkMode ? '#0f172a' : '#f0f2f5',
    card: darkMode ? '#1e293b' : 'white',
    text: darkMode ? 'white' : '#1a1a1a',
    subtext: darkMode ? '#94a3b8' : '#555',
    border: darkMode ? 'rgba(255,255,255,0.1)' : '#eee',
    nav: darkMode ? '#1e293b' : 'white',
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}