import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

const THEME_KEY = 'link_saver_theme';

const isChromeExt = typeof chrome !== 'undefined' && !!chrome?.storage?.local;

async function readTheme(): Promise<Theme> {
  if (isChromeExt) {
    return new Promise((resolve) => {
      chrome.storage.local.get(THEME_KEY, (result) => {
        resolve((result[THEME_KEY] as Theme) ?? 'light');
      });
    });
  }
  return (localStorage.getItem(THEME_KEY) as Theme) ?? 'light';
}

async function saveTheme(theme: Theme): Promise<void> {
  if (isChromeExt) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [THEME_KEY]: theme }, resolve);
    });
  }
  localStorage.setItem(THEME_KEY, theme);
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    readTheme().then(setTheme);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    saveTheme(theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  return { theme, toggleTheme };
}
