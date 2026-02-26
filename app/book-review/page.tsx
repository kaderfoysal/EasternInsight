import { Metadata } from 'next';
import NewsCard from '@/components/NewsCard';
import dbConnect from '@/lib/mongodb';
import BookReview from '@/lib/models/BookReview';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'বই পর্যালোচনা | Eastern Insight',
  description: 'সাম্প্রতিক প্রকাশিত বইগুলোর রিভিউ',
};

async function getBookReviews() {
  await dbConnect();
  const reviews = await BookReview.find({ published: true })
    .sort({ createdAt: -1 })
    .limit(24)
    .lean();
  return reviews.map((r: any) => ({
    ...r,
    _id: r._id.toString(),
    createdAt: r.createdAt?.toISOString?.() || r.createdAt,
    updatedAt: r.updatedAt?.toISOString?.() || r.updatedAt,
  }));
}

export default async function BookReviewPage() {
  const reviews = await getBookReviews();

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">বই পর্যালোচনা</h1>
          <p className="text-gray-600 mt-2">সাম্প্রতিক প্রকাশিত বইগুলোর রিভিউ</p>
        </div>

        {reviews && reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review: any) => (
              <NewsCard
                key={review._id}
                article={{
                  _id: review._id,
                  title: review.title,
                  slug: review.slug || review._id,
                  excerpt: review.excerpt,
                  image: review.image,
                  createdAt: review.createdAt,
                  author: { name: review.authorName || 'রিভিউয়ার' },
                  category: { name: 'বই পর্যালোচনা', slug: 'book-review' },
                  views: review.views || 0,
                }}
                linkPrefix="/book-review"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">কোনো বই পর্যালোচনা পাওয়া যায়নি।</div>
        )}
      </div>
    </div>
  );
}
