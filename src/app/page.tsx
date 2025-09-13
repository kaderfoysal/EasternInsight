import Banner from '@/components/home/Banner';
import CategorySection from '@/components/home/CategorySection';
import FeaturedArticles from '@/components/home/FeaturedArticles';
import WriterSection from '@/components/home/WriterSection';

export default function Home() {
  return (
    <main>
      <Banner />
      <FeaturedArticles />
      <CategorySection />
      <WriterSection />
    </main>
  );
}
