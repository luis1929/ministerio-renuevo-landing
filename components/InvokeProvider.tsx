'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

type InvokeContext = {
  isInvoked: boolean;
  invoke: (sectionId: string) => void;
};

const InvokeCtx = createContext<InvokeContext>({ isInvoked: false, invoke: () => {} });

export function useInvoke() {
  return useContext(InvokeCtx);
}

export default function InvokeProvider({ children }: { children: ReactNode }) {
  const [isInvoked, setIsInvoked] = useState(false);

  useEffect(() => {
    if (!isInvoked) {
      document.body.classList.add('overflow-hidden', 'h-screen');
    } else {
      document.body.classList.remove('overflow-hidden', 'h-screen');
    }
    return () => {
      document.body.classList.remove('overflow-hidden', 'h-screen');
    };
  }, [isInvoked]);

  const invoke = useCallback((sectionId: string) => {
    setIsInvoked(true);
    requestAnimationFrame(() => {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
  }, []);

  return (
    <InvokeCtx.Provider value={{ isInvoked, invoke }}>
      {children}
    </InvokeCtx.Provider>
  );
}
