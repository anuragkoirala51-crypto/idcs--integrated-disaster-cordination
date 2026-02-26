'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

export function StoreProvider({
  children,
  initialState
}: {
  children: React.ReactNode;
  initialState: any;
}) {
  const setHydratedState = useAppStore((state) => state.setHydratedState);

  useEffect(() => {
    setHydratedState(initialState || {});

    // Restore persisted theme
    const savedTheme = localStorage.getItem('quantum_theme');
    if (savedTheme === 'light') {
      document.documentElement.classList.add('light-theme');
      useAppStore.setState({ theme: 'light' });
    } else {
      document.documentElement.classList.remove('light-theme');
    }

    // Restore persisted language
    const savedLang = localStorage.getItem('quantum_lang');
    if (savedLang) {
      useAppStore.setState({ language: savedLang as any });
    }

    // Cross-tab Synchronization
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'quantum_theme') {
        const newTheme = e.newValue as 'light' | 'dark';
        useAppStore.setState({ theme: newTheme });
        if (newTheme === 'light') {
          document.documentElement.classList.add('light-theme');
        } else {
          document.documentElement.classList.remove('light-theme');
        }
      }
      if (e.key === 'quantum_lang') {
        useAppStore.setState({ language: e.newValue as any });
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [initialState, setHydratedState]);

  return <>{children}</>;
}
