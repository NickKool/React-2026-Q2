import '@/app/styles/index.css'; 
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import Image from 'next/image'; 
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation'; 
import { AppProviders } from '../providers/AppProviders';
import { SelectionPanel } from '@/widgets/selection-panel';
import { LocaleToggle } from '@/features/locale-toggle/LocaleToggle';
import { HeaderControls } from '@/widgets/layout/ui/HeaderControls'; 

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  const t = await getTranslations('Common');

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <AppProviders>
            <div className="w-full min-h-screen flex flex-col pb-20">
              
              <header className="w-full max-w-7xl mx-auto px-8 py-4 flex items-center justify-between border-b border-input-border relative">
                
                <div className="shrink-0">
                  <Link href="/" className="hover:opacity-80 transition-opacity duration-200 block">
                    <Image
                      src="/logo.png"
                      alt="Logo"
                      width={128}
                      height={40}
                      className="h-auto object-contain"
                      priority
                    />
                  </Link>
                </div>

                <nav className="absolute left-1/2 -translate-x-1/2 flex gap-6 items-center">
                  <Link href="/" className="text-sub-text hover:text-main-text transition">
                    {t('home')}
                  </Link>
                  <Link href="/about" className="text-sub-text hover:text-main-text transition">
                    {t('about')}
                  </Link>
                </nav>

                <div className="flex items-center gap-3">
                  <LocaleToggle /> 
                  <HeaderControls /> 
                </div>
              </header>

              <main className="w-full grow">
                {children}
              </main>

            </div>

            <SelectionPanel />
          </AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
