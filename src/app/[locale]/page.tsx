import { MainPage } from '@/pages/main';

interface HomePageProps {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
  details: React.ReactNode; 
}

export default async function HomePage({ searchParams, details }: HomePageProps) {
  const resolvedParams = await searchParams;
  const currentSearchTerm = resolvedParams.q || '';
  const currentPage = parseInt(resolvedParams.page || '1', 10);

  return (
    <MainPage 
      serverSearchTerm={currentSearchTerm} 
      serverPage={currentPage}
    >
      {details} 
    </MainPage>
  );
}
