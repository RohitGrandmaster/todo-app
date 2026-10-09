import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import createTheme from '../theme';
import {
  getItem,
  setItem,
} from '../storage/storage';

import APP_CONFIG from '../constants/appConfig';

const ThemeContext = createContext(null);

function ThemeProvider({children}) {
  const [mode, setMode] = useState('light');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTheme() {
      const savedMode = await getItem(
        APP_CONFIG.STORAGE_KEYS.THEME,
        'light',
      );

      if (savedMode === 'dark' || savedMode === 'light') {
        setMode(savedMode);
      }

      setLoading(false);
    }

    loadTheme();
  }, []);

  useEffect(() => {
    if (!loading) {
      setItem(
        APP_CONFIG.STORAGE_KEYS.THEME,
        mode,
      );
    }
  }, [mode, loading]);

  const theme = useMemo(
    () => createTheme(mode),
    [mode],
  );

  function toggleTheme() {
    setMode(current =>
      current === 'light' ? 'dark' : 'light',
    );
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        mode,
        toggleTheme,
        loading,
      }}>
      {children}
    </ThemeContext.Provider>
  );
}

function useThemeContext() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      'useThemeContext must be used inside ThemeProvider.',
    );
  }

  return context;
}

export {
  ThemeProvider,
  useThemeContext,
};