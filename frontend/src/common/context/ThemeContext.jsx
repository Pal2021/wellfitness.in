import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Default to Dark Mode as per user request
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('wellfitness-theme');
    return saved || 'dark';
  });

  useEffect(() => {
    // Persist choice
    localStorage.setItem('wellfitness-theme', theme);
    
    // Apply class to body for global CSS targeting
    const root = window.document.documentElement;
    root.classList.remove('light-theme', 'dark-theme');
    root.classList.add(`${theme}-theme`);
    
    // Also set standard tailwind 'dark' class for standard tools
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
