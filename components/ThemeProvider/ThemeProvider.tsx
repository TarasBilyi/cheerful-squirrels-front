'use client';

import { useLayoutEffect, type ReactNode } from 'react';
import { useThemeStore, type Theme } from '@/lib/store/themeStore';

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  useLayoutEffect(() => {
    const currentAttribute = document.documentElement.dataset.theme;

    if (currentAttribute === 'dark' || currentAttribute === 'light') {
      useThemeStore.setState({ theme: currentAttribute as Theme });
    } else {
      useThemeStore.getState().setTheme('light');
    }
  }, []);

  return children;
};

export default ThemeProvider;
