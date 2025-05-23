
import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { LOCAL_STORAGE_KEYS } from '../constants';
import { Theme } from '../types';


export const useTheme = (): [Theme, () => void] => {
  const [storedTheme, setStoredTheme] = useLocalStorage<Theme>(LOCAL_STORAGE_KEYS.THEME, 
    () => {
      if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
      return 'light';
    }
  );
  
  // Ensure state is initialized correctly on client, even if localStorage is different from prefers-color-scheme
  const [theme, setTheme] = useState<Theme>(storedTheme);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      setStoredTheme(newTheme);
      return newTheme;
    });
  }, [setStoredTheme]);

  useEffect(() => {
    // Update state if storedTheme changes (e.g. from another tab)
    setTheme(storedTheme);
  }, [storedTheme]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return [theme, toggleTheme];
};
