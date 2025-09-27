import NewsCard from '@/components/NewsCard';

async function getResults(q: string) {
  if (!q) return { news: [] } as any;
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/news?search=${encodeURIComponent(q)}&limit=24`, { cache: 'no-store' });
  if (!res.ok) return { news: [] } as any;
  return res.json();
}

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = searchParams.q || '';
  const { news } = await getResults(q);
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold mb-4">সার্চ ফলাফল: {q ? `"${q}"` : ''}</h1>
        {news && news.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((article: any) => (
              <NewsCard key={article._id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-gray-600">কোন ফলাফল পাওয়া যায়নি</div>
        )}
      </div>
    </div>
  );
}


