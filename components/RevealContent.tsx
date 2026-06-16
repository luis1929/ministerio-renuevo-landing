'use client';

import { ReactNode } from 'react';
import { useInvoke } from './InvokeProvider';

export default function RevealContent({ children }: { children: ReactNode }) {
  const { isInvoked } = useInvoke();

  return (
    <div className={`transition-opacity duration-500 ${isInvoked ? 'block opacity-100' : 'hidden opacity-0'}`}>
      {children}
    </div>
  );
}
