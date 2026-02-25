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
  }, [initialState, setHydratedState]);

  return <>{children}</>;
}
