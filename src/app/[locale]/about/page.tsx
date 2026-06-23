import { AboutPage } from '@/pages/about'; 
import { setRequestLocale } from 'next-intl/server'; // 

interface AboutProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ru' }];
}

export default async function AboutRoute({ params }: AboutProps) {
  const { locale } = await params;
  
  setRequestLocale(locale);

  return <AboutPage />;
}
