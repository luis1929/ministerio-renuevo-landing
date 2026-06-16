'use client';

import { ReactNode } from 'react';
import InvokeProvider from './InvokeProvider';

export default function PageShell({ children }: { children: ReactNode }) {
  return <InvokeProvider>{children}</InvokeProvider>;
}
