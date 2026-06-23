'use client';

import { ErrorBoundary } from './ErrorBoundary/ErrorBoundary';
import { ThemeProvider } from '@/shared/model';
import { QueryProvider } from '@/shared/api/QueryProvider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </ThemeProvider>
    </QueryProvider>
  );
}
