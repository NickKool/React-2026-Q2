import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';

const intlProxy = createMiddleware({
  locales: ['en', 'ru'],
  defaultLocale: 'ru',
  localePrefix: 'always'
});

export default function proxy(request: NextRequest) {
  return intlProxy(request);
}

export const config = {
  matcher: ['/', '/(en|ru)/:path*', '/((?!_next|_vercel|.*\\..*).*)']
};
